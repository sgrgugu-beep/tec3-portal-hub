-- ========== ENUMS ==========
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin_seccion');
CREATE TYPE public.seccion_sitio AS ENUM ('avisos','calendario','materias','capacitaciones','centro','galeria','institucional','contacto','configuracion','usuarios');
CREATE TYPE public.tipo_categoria AS ENUM ('aviso','evento','capacitacion','galeria');

-- ========== UTIL ==========
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ========== PERFILES ==========
CREATE TABLE public.perfiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL DEFAULT '',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfiles TO authenticated;
GRANT ALL ON public.perfiles TO service_role;
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.permisos_seccion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  seccion public.seccion_sitio NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, seccion)
);
GRANT SELECT ON public.permisos_seccion TO authenticated;
GRANT ALL ON public.permisos_seccion TO service_role;
ALTER TABLE public.permisos_seccion ENABLE ROW LEVEL SECURITY;

-- ========== FUNCIONES DE SEGURIDAD ==========
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.perfiles p ON p.id = ur.user_id
    WHERE ur.user_id = _user_id AND ur.role = _role AND p.activo
  );
$$;

CREATE OR REPLACE FUNCTION public.puede_editar(_user_id UUID, _seccion public.seccion_sitio)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'super_admin')
    OR EXISTS (
      SELECT 1 FROM public.permisos_seccion ps
      JOIN public.perfiles p ON p.id = ps.user_id
      WHERE ps.user_id = _user_id AND ps.seccion = _seccion AND p.activo
    );
$$;

CREATE OR REPLACE FUNCTION public.es_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles p WHERE p.id = _user_id AND p.activo
      AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id)
  );
$$;

CREATE POLICY "perfiles_select_admin" ON public.perfiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "perfiles_update_propio" ON public.perfiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "perfiles_delete_super" ON public.perfiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "roles_select" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "permisos_select" ON public.permisos_seccion FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_perfiles_updated BEFORE UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- perfil automático al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, nombre)
  VALUES (NEW.id, COALESCE(NEW.email, ''), COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(COALESCE(NEW.email,''), '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== CATEGORIAS ==========
CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo public.tipo_categoria NOT NULL,
  slug TEXT NOT NULL,
  nombre TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'primary',
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tipo, slug)
);
GRANT SELECT ON public.categorias TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categorias TO authenticated;
GRANT ALL ON public.categorias TO service_role;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categorias_public_read" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "categorias_write" ON public.categorias FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'configuracion'))
  WITH CHECK (public.puede_editar(auth.uid(), 'configuracion'));
CREATE TRIGGER trg_categorias_updated BEFORE UPDATE ON public.categorias
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========== AVISOS ==========
CREATE TABLE public.avisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  resumen TEXT NOT NULL DEFAULT '',
  cuerpo TEXT NOT NULL DEFAULT '',
  categoria_slug TEXT NOT NULL DEFAULT 'institucional',
  imagen_url TEXT,
  imagen_alt TEXT,
  destacado BOOLEAN NOT NULL DEFAULT false,
  publicado BOOLEAN NOT NULL DEFAULT false,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.avisos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avisos TO authenticated;
GRANT ALL ON public.avisos TO service_role;
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "avisos_public_read" ON public.avisos FOR SELECT USING (publicado = true);
CREATE POLICY "avisos_admin_read" ON public.avisos FOR SELECT TO authenticated
  USING (public.puede_editar(auth.uid(), 'avisos'));
CREATE POLICY "avisos_write" ON public.avisos FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'avisos'))
  WITH CHECK (public.puede_editar(auth.uid(), 'avisos'));
CREATE TRIGGER trg_avisos_updated BEFORE UPDATE ON public.avisos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========== EVENTOS ==========
CREATE TABLE public.eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  tipo_slug TEXT NOT NULL DEFAULT 'acto',
  fecha DATE NOT NULL,
  hora_inicio TEXT,
  hora_fin TEXT,
  lugar TEXT NOT NULL DEFAULT '',
  publicado BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.eventos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.eventos TO authenticated;
GRANT ALL ON public.eventos TO service_role;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eventos_public_read" ON public.eventos FOR SELECT USING (publicado = true);
CREATE POLICY "eventos_admin_read" ON public.eventos FOR SELECT TO authenticated
  USING (public.puede_editar(auth.uid(), 'calendario'));
CREATE POLICY "eventos_write" ON public.eventos FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'calendario'))
  WITH CHECK (public.puede_editar(auth.uid(), 'calendario'));
CREATE TRIGGER trg_eventos_updated BEFORE UPDATE ON public.eventos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========== ESPECIALIDADES Y MATERIAS ==========
CREATE TABLE public.especialidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  nombre_corto TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  salida_laboral TEXT NOT NULL DEFAULT '',
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.especialidades TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.especialidades TO authenticated;
GRANT ALL ON public.especialidades TO service_role;
ALTER TABLE public.especialidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "especialidades_public_read" ON public.especialidades FOR SELECT USING (true);
CREATE POLICY "especialidades_write" ON public.especialidades FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'materias'))
  WITH CHECK (public.puede_editar(auth.uid(), 'materias'));
CREATE TRIGGER trg_especialidades_updated BEFORE UPDATE ON public.especialidades
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.materias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  anio INTEGER NOT NULL,
  ciclo TEXT NOT NULL DEFAULT 'basico',
  especialidad_slug TEXT,
  descripcion TEXT NOT NULL DEFAULT '',
  carga_horaria TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.materias TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.materias TO authenticated;
GRANT ALL ON public.materias TO service_role;
ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "materias_public_read" ON public.materias FOR SELECT USING (true);
CREATE POLICY "materias_write" ON public.materias FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'materias'))
  WITH CHECK (public.puede_editar(auth.uid(), 'materias'));
CREATE TRIGGER trg_materias_updated BEFORE UPDATE ON public.materias
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========== CAPACITACIONES ==========
CREATE TABLE public.capacitaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  dictada_por TEXT NOT NULL DEFAULT '',
  destinatarios TEXT NOT NULL DEFAULT '',
  modalidad TEXT NOT NULL DEFAULT 'Presencial',
  area_slug TEXT NOT NULL DEFAULT 'general',
  estado TEXT NOT NULL DEFAULT 'proxima',
  fecha_inicio DATE,
  duracion TEXT,
  publicado BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.capacitaciones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.capacitaciones TO authenticated;
GRANT ALL ON public.capacitaciones TO service_role;
ALTER TABLE public.capacitaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "capacitaciones_public_read" ON public.capacitaciones FOR SELECT USING (publicado = true);
CREATE POLICY "capacitaciones_admin_read" ON public.capacitaciones FOR SELECT TO authenticated
  USING (public.puede_editar(auth.uid(), 'capacitaciones'));
CREATE POLICY "capacitaciones_write" ON public.capacitaciones FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'capacitaciones'))
  WITH CHECK (public.puede_editar(auth.uid(), 'capacitaciones'));
CREATE TRIGGER trg_capacitaciones_updated BEFORE UPDATE ON public.capacitaciones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========== CENTRO DE ESTUDIANTES / AUTORIDADES ==========
CREATE TABLE public.integrantes_centro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT '',
  curso TEXT,
  foto_url TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.integrantes_centro TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integrantes_centro TO authenticated;
GRANT ALL ON public.integrantes_centro TO service_role;
ALTER TABLE public.integrantes_centro ENABLE ROW LEVEL SECURITY;
CREATE POLICY "integrantes_public_read" ON public.integrantes_centro FOR SELECT USING (true);
CREATE POLICY "integrantes_write" ON public.integrantes_centro FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'centro'))
  WITH CHECK (public.puede_editar(auth.uid(), 'centro'));
CREATE TRIGGER trg_integrantes_updated BEFORE UPDATE ON public.integrantes_centro
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.autoridades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT '',
  foto_url TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.autoridades TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.autoridades TO authenticated;
GRANT ALL ON public.autoridades TO service_role;
ALTER TABLE public.autoridades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "autoridades_public_read" ON public.autoridades FOR SELECT USING (true);
CREATE POLICY "autoridades_write" ON public.autoridades FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'institucional'))
  WITH CHECK (public.puede_editar(auth.uid(), 'institucional'));
CREATE TRIGGER trg_autoridades_updated BEFORE UPDATE ON public.autoridades
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========== GALERIA ==========
CREATE TABLE public.albumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  categoria_slug TEXT NOT NULL DEFAULT 'proyectos',
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  publicado BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.albumes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.albumes TO authenticated;
GRANT ALL ON public.albumes TO service_role;
ALTER TABLE public.albumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "albumes_public_read" ON public.albumes FOR SELECT USING (publicado = true);
CREATE POLICY "albumes_admin_read" ON public.albumes FOR SELECT TO authenticated
  USING (public.puede_editar(auth.uid(), 'galeria'));
CREATE POLICY "albumes_write" ON public.albumes FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'galeria'))
  WITH CHECK (public.puede_editar(auth.uid(), 'galeria'));
CREATE TRIGGER trg_albumes_updated BEFORE UPDATE ON public.albumes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES public.albumes(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  miniatura_url TEXT,
  alt TEXT NOT NULL DEFAULT '',
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.fotos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotos TO authenticated;
GRANT ALL ON public.fotos TO service_role;
ALTER TABLE public.fotos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fotos_public_read" ON public.fotos FOR SELECT USING (true);
CREATE POLICY "fotos_write" ON public.fotos FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'galeria'))
  WITH CHECK (public.puede_editar(auth.uid(), 'galeria'));
CREATE TRIGGER trg_fotos_updated BEFORE UPDATE ON public.fotos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========== CONFIGURACION ==========
CREATE TABLE public.configuracion_sitio (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  grupo TEXT NOT NULL DEFAULT 'general',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.configuracion_sitio TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.configuracion_sitio TO authenticated;
GRANT ALL ON public.configuracion_sitio TO service_role;
ALTER TABLE public.configuracion_sitio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_public_read" ON public.configuracion_sitio FOR SELECT USING (true);
CREATE POLICY "config_write" ON public.configuracion_sitio FOR ALL TO authenticated
  USING (public.puede_editar(auth.uid(), 'configuracion'))
  WITH CHECK (public.puede_editar(auth.uid(), 'configuracion'));
CREATE TRIGGER trg_config_updated BEFORE UPDATE ON public.configuracion_sitio
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========== FORMULARIOS ==========
CREATE TABLE public.mensajes_contacto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  asunto TEXT NOT NULL DEFAULT '',
  mensaje TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.mensajes_contacto TO authenticated;
GRANT ALL ON public.mensajes_contacto TO service_role;
ALTER TABLE public.mensajes_contacto ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mensajes_read" ON public.mensajes_contacto FOR SELECT TO authenticated
  USING (public.puede_editar(auth.uid(), 'contacto'));
CREATE POLICY "mensajes_manage" ON public.mensajes_contacto FOR UPDATE TO authenticated
  USING (public.puede_editar(auth.uid(), 'contacto'))
  WITH CHECK (public.puede_editar(auth.uid(), 'contacto'));
CREATE POLICY "mensajes_delete" ON public.mensajes_contacto FOR DELETE TO authenticated
  USING (public.puede_editar(auth.uid(), 'contacto'));

CREATE TABLE public.propuestas_centro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  curso TEXT,
  email TEXT NOT NULL,
  propuesta TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.propuestas_centro TO authenticated;
GRANT ALL ON public.propuestas_centro TO service_role;
ALTER TABLE public.propuestas_centro ENABLE ROW LEVEL SECURITY;
CREATE POLICY "propuestas_read" ON public.propuestas_centro FOR SELECT TO authenticated
  USING (public.puede_editar(auth.uid(), 'centro'));
CREATE POLICY "propuestas_manage" ON public.propuestas_centro FOR UPDATE TO authenticated
  USING (public.puede_editar(auth.uid(), 'centro'))
  WITH CHECK (public.puede_editar(auth.uid(), 'centro'));
CREATE POLICY "propuestas_delete" ON public.propuestas_centro FOR DELETE TO authenticated
  USING (public.puede_editar(auth.uid(), 'centro'));

-- ========== INVITACIONES ==========
CREATE TABLE public.invitaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role public.app_role NOT NULL DEFAULT 'admin_seccion',
  secciones public.seccion_sitio[] NOT NULL DEFAULT '{}',
  creada_por UUID,
  usada_por UUID,
  usada_en TIMESTAMPTZ,
  revocada BOOLEAN NOT NULL DEFAULT false,
  expira_en TIMESTAMPTZ NOT NULL DEFAULT now() + interval '14 days',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitaciones TO authenticated;
GRANT ALL ON public.invitaciones TO service_role;
ALTER TABLE public.invitaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invitaciones_super" ON public.invitaciones FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- ========== AUDITORIA ==========
CREATE TABLE public.auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT NOT NULL DEFAULT '',
  accion TEXT NOT NULL,
  entidad TEXT NOT NULL,
  entidad_id TEXT,
  detalle TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.auditoria TO authenticated;
GRANT ALL ON public.auditoria TO service_role;
ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auditoria_read_super" ON public.auditoria FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "auditoria_insert" ON public.auditoria FOR INSERT TO authenticated
  WITH CHECK (public.es_admin(auth.uid()));

-- ========== DATOS INICIALES ==========
INSERT INTO public.categorias (tipo, slug, nombre, color, orden) VALUES
  ('aviso','institucional','Institucionales','primary',1),
  ('aviso','familias','Para las familias','accent',2),
  ('aviso','centro','Centro de Estudiantes','secondary',3),
  ('evento','acto','Acto','primary',1),
  ('evento','reunion','Reunión de familias','accent',2),
  ('evento','examen','Examen','destructive',3),
  ('evento','clase-especial','Clase especial','secondary',4),
  ('capacitacion','general','General','primary',1),
  ('capacitacion','informatica','Informática','accent',2),
  ('capacitacion','electronica','Electrónica','secondary',3),
  ('capacitacion','alimentos','Alimentos','primary',4),
  ('galeria','proyectos','Proyectos','primary',1),
  ('galeria','eventos','Eventos','accent',2),
  ('galeria','jornadas','Jornadas especiales','secondary',3);

INSERT INTO public.especialidades (slug, nombre, nombre_corto, descripcion, salida_laboral, orden) VALUES
  ('ipp','Informática Personal y Profesional','IPP','Formación en desarrollo de software, redes, hardware y soporte técnico.','Soporte técnico, desarrollo web, administración de redes.',1),
  ('electronica','Técnico en Electrónica','Electrónica','Diseño, montaje y mantenimiento de sistemas electrónicos y de control.','Mantenimiento industrial, automatización, electrónica aplicada.',2),
  ('alimentos','Técnico en Alimentos','Alimentos','Procesos, calidad e higiene en la industria alimentaria.','Control de calidad, producción y laboratorio de alimentos.',3);

INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo) VALUES
  ('nombre_escuela','E.E.S.T. N° 3 "República de México"','Nombre oficial','general'),
  ('lema','Formación técnica con proyección real','Lema institucional','general'),
  ('direccion','Caxaraville 5875, Wilde, Avellaneda','Dirección','contacto'),
  ('telefono','','Teléfono de contacto','contacto'),
  ('email','','Correo institucional','contacto'),
  ('email_centro','','Correo del centro de estudiantes','contacto'),
  ('horarios','Lunes a viernes de 8 a 17 h','Horarios de atención','contacto'),
  ('instagram','','Instagram','redes'),
  ('facebook','','Facebook','redes'),
  ('youtube','','YouTube','redes');