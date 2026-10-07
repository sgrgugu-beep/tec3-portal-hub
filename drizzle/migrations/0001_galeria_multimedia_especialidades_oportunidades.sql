ALTER TABLE public.fotos ADD COLUMN tipo text NOT NULL DEFAULT 'foto', ADD COLUMN publicado boolean NOT NULL DEFAULT true;
ALTER TABLE public.especialidades ADD COLUMN imagen_url text NOT NULL DEFAULT '', ADD COLUMN imagen_alt text NOT NULL DEFAULT '', ADD COLUMN practicas text NOT NULL DEFAULT '';
ALTER TABLE public.avisos ADD COLUMN urgente boolean NOT NULL DEFAULT false;
CREATE TABLE public.oportunidades (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), titulo text NOT NULL, especialidad_slug text NOT NULL DEFAULT 'informatica', tipo text NOT NULL DEFAULT 'pasantia', organizacion text NOT NULL DEFAULT '', descripcion text NOT NULL DEFAULT '', requisitos text NOT NULL DEFAULT '', enlace text NOT NULL DEFAULT '', fecha_cierre date, publicado boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.oportunidades TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.oportunidades TO authenticated;
GRANT ALL ON public.oportunidades TO service_role;
ALTER TABLE public.oportunidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY oportunidades_public_read ON public.oportunidades FOR SELECT TO anon, authenticated USING (publicado);
CREATE POLICY oportunidades_admin ON public.oportunidades FOR ALL TO authenticated USING (public.puede_editar(auth.uid(), 'materias')) WITH CHECK (public.puede_editar(auth.uid(), 'materias'));
CREATE TRIGGER oportunidades_updated BEFORE UPDATE ON public.oportunidades FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP POLICY fotos_public_read ON public.fotos;
CREATE POLICY fotos_public_read ON public.fotos FOR SELECT TO anon, authenticated USING (publicado AND EXISTS (SELECT 1 FROM public.albumes a WHERE a.id = album_id AND a.publicado));
COMMENT ON COLUMN public.fotos.tipo IS 'foto or video; URLs reference image files or native MP4/WebM video files';
COMMENT ON COLUMN public.avisos.urgente IS 'Published urgent notices appear globally above page content';