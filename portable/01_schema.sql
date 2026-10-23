-- =====================================================================
-- Técnica 3 Avellaneda — ESQUEMA COMPLETO (PostgreSQL / Supabase)
-- Exportado automáticamente desde la base en producción.
-- Ejecutar PRIMERO en una base vacía (SQL Editor de Supabase o psql).
-- Incluye: tipos enum, tablas, índices, funciones, triggers, GRANTs,
-- Row Level Security y políticas.
-- Después ejecutar 02_datos.sql y 03_auth_y_storage.sql.
-- =====================================================================

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'super_admin',
    'admin_seccion'
);


--
-- Name: seccion_sitio; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.seccion_sitio AS ENUM (
    'avisos',
    'calendario',
    'materias',
    'capacitaciones',
    'centro',
    'galeria',
    'institucional',
    'contacto',
    'configuracion',
    'usuarios'
);


--
-- Name: tipo_categoria; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tipo_categoria AS ENUM (
    'aviso',
    'evento',
    'capacitacion',
    'galeria'
);


--
-- Name: es_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.es_admin(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles p WHERE p.id = _user_id AND p.activo
      AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id)
  );
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, nombre)
  VALUES (NEW.id, COALESCE(NEW.email, ''), COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(COALESCE(NEW.email,''), '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.perfiles p ON p.id = ur.user_id
    WHERE ur.user_id = _user_id AND ur.role = _role AND p.activo
  );
$$;


--
-- Name: puede_editar(uuid, public.seccion_sitio); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.puede_editar(_user_id uuid, _seccion public.seccion_sitio) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT public.has_role(_user_id, 'super_admin')
    OR EXISTS (
      SELECT 1 FROM public.permisos_seccion ps
      JOIN public.perfiles p ON p.id = ps.user_id
      WHERE ps.user_id = _user_id AND ps.seccion = _seccion AND p.activo
    );
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: albumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.albumes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    titulo text NOT NULL,
    descripcion text DEFAULT ''::text NOT NULL,
    categoria_slug text DEFAULT 'proyectos'::text NOT NULL,
    fecha date DEFAULT CURRENT_DATE NOT NULL,
    publicado boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: auditoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auditoria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    user_email text DEFAULT ''::text NOT NULL,
    accion text NOT NULL,
    entidad text NOT NULL,
    entidad_id text,
    detalle text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: autoridades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.autoridades (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    cargo text DEFAULT ''::text NOT NULL,
    foto_url text,
    orden integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: avisos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.avisos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    slug text NOT NULL,
    resumen text DEFAULT ''::text NOT NULL,
    cuerpo text DEFAULT ''::text NOT NULL,
    categoria_slug text DEFAULT 'institucional'::text NOT NULL,
    imagen_url text,
    imagen_alt text,
    destacado boolean DEFAULT false NOT NULL,
    publicado boolean DEFAULT false NOT NULL,
    fecha date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    urgente boolean DEFAULT false NOT NULL
);


--
-- Name: COLUMN avisos.urgente; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.avisos.urgente IS 'Published urgent notices appear globally above page content';


--
-- Name: capacitaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.capacitaciones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    descripcion text DEFAULT ''::text NOT NULL,
    dictada_por text DEFAULT ''::text NOT NULL,
    destinatarios text DEFAULT ''::text NOT NULL,
    modalidad text DEFAULT 'Presencial'::text NOT NULL,
    area_slug text DEFAULT 'general'::text NOT NULL,
    estado text DEFAULT 'proxima'::text NOT NULL,
    fecha_inicio date,
    duracion text,
    publicado boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categorias (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tipo public.tipo_categoria NOT NULL,
    slug text NOT NULL,
    nombre text NOT NULL,
    color text DEFAULT 'primary'::text NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: configuracion_sitio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuracion_sitio (
    clave text NOT NULL,
    valor text DEFAULT ''::text NOT NULL,
    descripcion text DEFAULT ''::text NOT NULL,
    grupo text DEFAULT 'general'::text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: especialidades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.especialidades (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    nombre text NOT NULL,
    nombre_corto text DEFAULT ''::text NOT NULL,
    descripcion text DEFAULT ''::text NOT NULL,
    salida_laboral text DEFAULT ''::text NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    imagen_url text DEFAULT ''::text NOT NULL,
    imagen_alt text DEFAULT ''::text NOT NULL,
    practicas text DEFAULT ''::text NOT NULL
);


--
-- Name: eventos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.eventos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    descripcion text DEFAULT ''::text NOT NULL,
    tipo_slug text DEFAULT 'acto'::text NOT NULL,
    fecha date NOT NULL,
    hora_inicio text,
    hora_fin text,
    lugar text DEFAULT ''::text NOT NULL,
    publicado boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fotos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fotos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    album_id uuid NOT NULL,
    url text NOT NULL,
    miniatura_url text,
    alt text DEFAULT ''::text NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    tipo text DEFAULT 'foto'::text NOT NULL,
    publicado boolean DEFAULT true NOT NULL,
    CONSTRAINT fotos_tipo_valid CHECK ((tipo = ANY (ARRAY['foto'::text, 'video'::text])))
);


--
-- Name: COLUMN fotos.tipo; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.fotos.tipo IS 'foto or video; URLs reference image files or native MP4/WebM video files';


--
-- Name: integrantes_centro; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.integrantes_centro (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    cargo text DEFAULT ''::text NOT NULL,
    curso text,
    foto_url text,
    orden integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: invitaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invitaciones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo text NOT NULL,
    email text NOT NULL,
    role public.app_role DEFAULT 'admin_seccion'::public.app_role NOT NULL,
    secciones public.seccion_sitio[] DEFAULT '{}'::public.seccion_sitio[] NOT NULL,
    creada_por uuid,
    usada_por uuid,
    usada_en timestamp with time zone,
    revocada boolean DEFAULT false NOT NULL,
    expira_en timestamp with time zone DEFAULT (now() + '14 days'::interval) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: materias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materias (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    anio integer NOT NULL,
    ciclo text DEFAULT 'basico'::text NOT NULL,
    especialidad_slug text,
    descripcion text DEFAULT ''::text NOT NULL,
    carga_horaria text,
    orden integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: mensajes_contacto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mensajes_contacto (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    email text NOT NULL,
    telefono text,
    asunto text DEFAULT ''::text NOT NULL,
    mensaje text NOT NULL,
    leido boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: oportunidades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oportunidades (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    especialidad_slug text DEFAULT 'informatica'::text NOT NULL,
    tipo text DEFAULT 'pasantia'::text NOT NULL,
    organizacion text DEFAULT ''::text NOT NULL,
    descripcion text DEFAULT ''::text NOT NULL,
    requisitos text DEFAULT ''::text NOT NULL,
    enlace text DEFAULT ''::text NOT NULL,
    fecha_cierre date,
    publicado boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT oportunidades_tipo_valid CHECK ((tipo = ANY (ARRAY['pasantia'::text, 'empleo'::text])))
);


--
-- Name: perfiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.perfiles (
    id uuid NOT NULL,
    email text NOT NULL,
    nombre text DEFAULT ''::text NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: permisos_seccion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permisos_seccion (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    seccion public.seccion_sitio NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: propuestas_centro; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.propuestas_centro (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    curso text,
    email text NOT NULL,
    propuesta text NOT NULL,
    leido boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: albumes albumes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.albumes
    ADD CONSTRAINT albumes_pkey PRIMARY KEY (id);


--
-- Name: albumes albumes_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.albumes
    ADD CONSTRAINT albumes_slug_key UNIQUE (slug);


--
-- Name: auditoria auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_pkey PRIMARY KEY (id);


--
-- Name: autoridades autoridades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.autoridades
    ADD CONSTRAINT autoridades_pkey PRIMARY KEY (id);


--
-- Name: avisos avisos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avisos
    ADD CONSTRAINT avisos_pkey PRIMARY KEY (id);


--
-- Name: avisos avisos_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avisos
    ADD CONSTRAINT avisos_slug_key UNIQUE (slug);


--
-- Name: capacitaciones capacitaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capacitaciones
    ADD CONSTRAINT capacitaciones_pkey PRIMARY KEY (id);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: categorias categorias_tipo_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_tipo_slug_key UNIQUE (tipo, slug);


--
-- Name: configuracion_sitio configuracion_sitio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion_sitio
    ADD CONSTRAINT configuracion_sitio_pkey PRIMARY KEY (clave);


--
-- Name: especialidades especialidades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.especialidades
    ADD CONSTRAINT especialidades_pkey PRIMARY KEY (id);


--
-- Name: especialidades especialidades_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.especialidades
    ADD CONSTRAINT especialidades_slug_key UNIQUE (slug);


--
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);


--
-- Name: fotos fotos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fotos
    ADD CONSTRAINT fotos_pkey PRIMARY KEY (id);


--
-- Name: integrantes_centro integrantes_centro_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integrantes_centro
    ADD CONSTRAINT integrantes_centro_pkey PRIMARY KEY (id);


--
-- Name: invitaciones invitaciones_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitaciones
    ADD CONSTRAINT invitaciones_codigo_key UNIQUE (codigo);


--
-- Name: invitaciones invitaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitaciones
    ADD CONSTRAINT invitaciones_pkey PRIMARY KEY (id);


--
-- Name: materias materias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_pkey PRIMARY KEY (id);


--
-- Name: mensajes_contacto mensajes_contacto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensajes_contacto
    ADD CONSTRAINT mensajes_contacto_pkey PRIMARY KEY (id);


--
-- Name: oportunidades oportunidades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oportunidades
    ADD CONSTRAINT oportunidades_pkey PRIMARY KEY (id);


--
-- Name: perfiles perfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_pkey PRIMARY KEY (id);


--
-- Name: permisos_seccion permisos_seccion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permisos_seccion
    ADD CONSTRAINT permisos_seccion_pkey PRIMARY KEY (id);


--
-- Name: permisos_seccion permisos_seccion_user_id_seccion_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permisos_seccion
    ADD CONSTRAINT permisos_seccion_user_id_seccion_key UNIQUE (user_id, seccion);


--
-- Name: propuestas_centro propuestas_centro_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.propuestas_centro
    ADD CONSTRAINT propuestas_centro_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: oportunidades oportunidades_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER oportunidades_updated BEFORE UPDATE ON public.oportunidades FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: albumes trg_albumes_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_albumes_updated BEFORE UPDATE ON public.albumes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: autoridades trg_autoridades_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_autoridades_updated BEFORE UPDATE ON public.autoridades FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: avisos trg_avisos_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_avisos_updated BEFORE UPDATE ON public.avisos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: capacitaciones trg_capacitaciones_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_capacitaciones_updated BEFORE UPDATE ON public.capacitaciones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: categorias trg_categorias_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_categorias_updated BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: configuracion_sitio trg_config_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_config_updated BEFORE UPDATE ON public.configuracion_sitio FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: especialidades trg_especialidades_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_especialidades_updated BEFORE UPDATE ON public.especialidades FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: eventos trg_eventos_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_eventos_updated BEFORE UPDATE ON public.eventos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: fotos trg_fotos_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_fotos_updated BEFORE UPDATE ON public.fotos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: integrantes_centro trg_integrantes_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_integrantes_updated BEFORE UPDATE ON public.integrantes_centro FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: materias trg_materias_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_materias_updated BEFORE UPDATE ON public.materias FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: perfiles trg_perfiles_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_perfiles_updated BEFORE UPDATE ON public.perfiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: fotos fotos_album_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fotos
    ADD CONSTRAINT fotos_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albumes(id) ON DELETE CASCADE;


--
-- Name: albumes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.albumes ENABLE ROW LEVEL SECURITY;

--
-- Name: albumes albumes_admin_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY albumes_admin_read ON public.albumes FOR SELECT TO authenticated USING (public.puede_editar(auth.uid(), 'galeria'::public.seccion_sitio));


--
-- Name: albumes albumes_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY albumes_public_read ON public.albumes FOR SELECT USING ((publicado = true));


--
-- Name: albumes albumes_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY albumes_write ON public.albumes TO authenticated USING (public.puede_editar(auth.uid(), 'galeria'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'galeria'::public.seccion_sitio));


--
-- Name: auditoria; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;

--
-- Name: auditoria auditoria_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY auditoria_insert ON public.auditoria FOR INSERT TO authenticated WITH CHECK (public.es_admin(auth.uid()));


--
-- Name: auditoria auditoria_read_super; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY auditoria_read_super ON public.auditoria FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));


--
-- Name: autoridades; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.autoridades ENABLE ROW LEVEL SECURITY;

--
-- Name: autoridades autoridades_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY autoridades_public_read ON public.autoridades FOR SELECT USING (true);


--
-- Name: autoridades autoridades_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY autoridades_write ON public.autoridades TO authenticated USING (public.puede_editar(auth.uid(), 'institucional'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'institucional'::public.seccion_sitio));


--
-- Name: avisos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;

--
-- Name: avisos avisos_admin_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY avisos_admin_read ON public.avisos FOR SELECT TO authenticated USING (public.puede_editar(auth.uid(), 'avisos'::public.seccion_sitio));


--
-- Name: avisos avisos_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY avisos_public_read ON public.avisos FOR SELECT USING ((publicado = true));


--
-- Name: avisos avisos_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY avisos_write ON public.avisos TO authenticated USING (public.puede_editar(auth.uid(), 'avisos'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'avisos'::public.seccion_sitio));


--
-- Name: capacitaciones; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.capacitaciones ENABLE ROW LEVEL SECURITY;

--
-- Name: capacitaciones capacitaciones_admin_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY capacitaciones_admin_read ON public.capacitaciones FOR SELECT TO authenticated USING (public.puede_editar(auth.uid(), 'capacitaciones'::public.seccion_sitio));


--
-- Name: capacitaciones capacitaciones_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY capacitaciones_public_read ON public.capacitaciones FOR SELECT USING ((publicado = true));


--
-- Name: capacitaciones capacitaciones_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY capacitaciones_write ON public.capacitaciones TO authenticated USING (public.puede_editar(auth.uid(), 'capacitaciones'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'capacitaciones'::public.seccion_sitio));


--
-- Name: categorias; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

--
-- Name: categorias categorias_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY categorias_public_read ON public.categorias FOR SELECT USING (true);


--
-- Name: categorias categorias_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY categorias_write ON public.categorias TO authenticated USING (public.puede_editar(auth.uid(), 'configuracion'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'configuracion'::public.seccion_sitio));


--
-- Name: configuracion_sitio config_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY config_public_read ON public.configuracion_sitio FOR SELECT USING (true);


--
-- Name: configuracion_sitio config_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY config_write ON public.configuracion_sitio TO authenticated USING (public.puede_editar(auth.uid(), 'configuracion'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'configuracion'::public.seccion_sitio));


--
-- Name: configuracion_sitio; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.configuracion_sitio ENABLE ROW LEVEL SECURITY;

--
-- Name: especialidades; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.especialidades ENABLE ROW LEVEL SECURITY;

--
-- Name: especialidades especialidades_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY especialidades_public_read ON public.especialidades FOR SELECT USING (true);


--
-- Name: especialidades especialidades_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY especialidades_write ON public.especialidades TO authenticated USING (public.puede_editar(auth.uid(), 'materias'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'materias'::public.seccion_sitio));


--
-- Name: eventos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

--
-- Name: eventos eventos_admin_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY eventos_admin_read ON public.eventos FOR SELECT TO authenticated USING (public.puede_editar(auth.uid(), 'calendario'::public.seccion_sitio));


--
-- Name: eventos eventos_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY eventos_public_read ON public.eventos FOR SELECT USING ((publicado = true));


--
-- Name: eventos eventos_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY eventos_write ON public.eventos TO authenticated USING (public.puede_editar(auth.uid(), 'calendario'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'calendario'::public.seccion_sitio));


--
-- Name: fotos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fotos ENABLE ROW LEVEL SECURITY;

--
-- Name: fotos fotos_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY fotos_public_read ON public.fotos FOR SELECT TO authenticated, anon USING ((publicado AND (EXISTS ( SELECT 1
   FROM public.albumes a
  WHERE ((a.id = fotos.album_id) AND a.publicado)))));


--
-- Name: fotos fotos_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY fotos_write ON public.fotos TO authenticated USING (public.puede_editar(auth.uid(), 'galeria'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'galeria'::public.seccion_sitio));


--
-- Name: integrantes_centro; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.integrantes_centro ENABLE ROW LEVEL SECURITY;

--
-- Name: integrantes_centro integrantes_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY integrantes_public_read ON public.integrantes_centro FOR SELECT USING (true);


--
-- Name: integrantes_centro integrantes_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY integrantes_write ON public.integrantes_centro TO authenticated USING (public.puede_editar(auth.uid(), 'centro'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'centro'::public.seccion_sitio));


--
-- Name: invitaciones; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.invitaciones ENABLE ROW LEVEL SECURITY;

--
-- Name: invitaciones invitaciones_super; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY invitaciones_super ON public.invitaciones TO authenticated USING (public.has_role(auth.uid(), 'super_admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'super_admin'::public.app_role));


--
-- Name: materias; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;

--
-- Name: materias materias_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY materias_public_read ON public.materias FOR SELECT USING (true);


--
-- Name: materias materias_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY materias_write ON public.materias TO authenticated USING (public.puede_editar(auth.uid(), 'materias'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'materias'::public.seccion_sitio));


--
-- Name: mensajes_contacto; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.mensajes_contacto ENABLE ROW LEVEL SECURITY;

--
-- Name: mensajes_contacto mensajes_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY mensajes_delete ON public.mensajes_contacto FOR DELETE TO authenticated USING (public.puede_editar(auth.uid(), 'contacto'::public.seccion_sitio));


--
-- Name: mensajes_contacto mensajes_manage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY mensajes_manage ON public.mensajes_contacto FOR UPDATE TO authenticated USING (public.puede_editar(auth.uid(), 'contacto'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'contacto'::public.seccion_sitio));


--
-- Name: mensajes_contacto mensajes_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY mensajes_read ON public.mensajes_contacto FOR SELECT TO authenticated USING (public.puede_editar(auth.uid(), 'contacto'::public.seccion_sitio));


--
-- Name: oportunidades; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.oportunidades ENABLE ROW LEVEL SECURITY;

--
-- Name: oportunidades oportunidades_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY oportunidades_admin ON public.oportunidades TO authenticated USING (public.puede_editar(auth.uid(), 'materias'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'materias'::public.seccion_sitio));


--
-- Name: oportunidades oportunidades_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY oportunidades_public_read ON public.oportunidades FOR SELECT TO authenticated, anon USING (publicado);


--
-- Name: perfiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

--
-- Name: perfiles perfiles_delete_super; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY perfiles_delete_super ON public.perfiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));


--
-- Name: perfiles perfiles_select_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY perfiles_select_admin ON public.perfiles FOR SELECT TO authenticated USING (((id = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'::public.app_role)));


--
-- Name: perfiles perfiles_update_propio; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY perfiles_update_propio ON public.perfiles FOR UPDATE TO authenticated USING (((id = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'::public.app_role))) WITH CHECK (((id = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'::public.app_role)));


--
-- Name: permisos_seccion; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.permisos_seccion ENABLE ROW LEVEL SECURITY;

--
-- Name: permisos_seccion permisos_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY permisos_select ON public.permisos_seccion FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'::public.app_role)));


--
-- Name: propuestas_centro; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.propuestas_centro ENABLE ROW LEVEL SECURITY;

--
-- Name: propuestas_centro propuestas_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY propuestas_delete ON public.propuestas_centro FOR DELETE TO authenticated USING (public.puede_editar(auth.uid(), 'centro'::public.seccion_sitio));


--
-- Name: propuestas_centro propuestas_manage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY propuestas_manage ON public.propuestas_centro FOR UPDATE TO authenticated USING (public.puede_editar(auth.uid(), 'centro'::public.seccion_sitio)) WITH CHECK (public.puede_editar(auth.uid(), 'centro'::public.seccion_sitio));


--
-- Name: propuestas_centro propuestas_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY propuestas_read ON public.propuestas_centro FOR SELECT TO authenticated USING (public.puede_editar(auth.uid(), 'centro'::public.seccion_sitio));


--
-- Name: user_roles roles_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY roles_select ON public.user_roles FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'::public.app_role)));


--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO sandbox_exec;


--
-- Name: FUNCTION es_admin(_user_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.es_admin(_user_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.es_admin(_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.es_admin(_user_id uuid) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION has_role(_user_id uuid, _role public.app_role); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.has_role(_user_id uuid, _role public.app_role) FROM PUBLIC;
GRANT ALL ON FUNCTION public.has_role(_user_id uuid, _role public.app_role) TO authenticated;
GRANT ALL ON FUNCTION public.has_role(_user_id uuid, _role public.app_role) TO service_role;


--
-- Name: FUNCTION puede_editar(_user_id uuid, _seccion public.seccion_sitio); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.puede_editar(_user_id uuid, _seccion public.seccion_sitio) FROM PUBLIC;
GRANT ALL ON FUNCTION public.puede_editar(_user_id uuid, _seccion public.seccion_sitio) TO authenticated;
GRANT ALL ON FUNCTION public.puede_editar(_user_id uuid, _seccion public.seccion_sitio) TO service_role;


--
-- Name: FUNCTION set_updated_at(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC;
GRANT ALL ON FUNCTION public.set_updated_at() TO service_role;


--
-- Name: TABLE albumes; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.albumes TO anon;
GRANT ALL ON TABLE public.albumes TO authenticated;
GRANT ALL ON TABLE public.albumes TO service_role;
GRANT SELECT,INSERT ON TABLE public.albumes TO sandbox_exec;


--
-- Name: TABLE auditoria; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.auditoria TO anon;
GRANT ALL ON TABLE public.auditoria TO authenticated;
GRANT ALL ON TABLE public.auditoria TO service_role;
GRANT SELECT,INSERT ON TABLE public.auditoria TO sandbox_exec;


--
-- Name: TABLE autoridades; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.autoridades TO anon;
GRANT ALL ON TABLE public.autoridades TO authenticated;
GRANT ALL ON TABLE public.autoridades TO service_role;
GRANT SELECT,INSERT ON TABLE public.autoridades TO sandbox_exec;


--
-- Name: TABLE avisos; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.avisos TO anon;
GRANT ALL ON TABLE public.avisos TO authenticated;
GRANT ALL ON TABLE public.avisos TO service_role;
GRANT SELECT,INSERT ON TABLE public.avisos TO sandbox_exec;


--
-- Name: TABLE capacitaciones; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.capacitaciones TO anon;
GRANT ALL ON TABLE public.capacitaciones TO authenticated;
GRANT ALL ON TABLE public.capacitaciones TO service_role;
GRANT SELECT,INSERT ON TABLE public.capacitaciones TO sandbox_exec;


--
-- Name: TABLE categorias; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.categorias TO anon;
GRANT ALL ON TABLE public.categorias TO authenticated;
GRANT ALL ON TABLE public.categorias TO service_role;
GRANT SELECT,INSERT ON TABLE public.categorias TO sandbox_exec;


--
-- Name: TABLE configuracion_sitio; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.configuracion_sitio TO anon;
GRANT ALL ON TABLE public.configuracion_sitio TO authenticated;
GRANT ALL ON TABLE public.configuracion_sitio TO service_role;
GRANT SELECT,INSERT ON TABLE public.configuracion_sitio TO sandbox_exec;


--
-- Name: TABLE especialidades; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.especialidades TO anon;
GRANT ALL ON TABLE public.especialidades TO authenticated;
GRANT ALL ON TABLE public.especialidades TO service_role;
GRANT SELECT,INSERT ON TABLE public.especialidades TO sandbox_exec;


--
-- Name: TABLE eventos; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.eventos TO anon;
GRANT ALL ON TABLE public.eventos TO authenticated;
GRANT ALL ON TABLE public.eventos TO service_role;
GRANT SELECT,INSERT ON TABLE public.eventos TO sandbox_exec;


--
-- Name: TABLE fotos; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.fotos TO anon;
GRANT ALL ON TABLE public.fotos TO authenticated;
GRANT ALL ON TABLE public.fotos TO service_role;
GRANT SELECT,INSERT ON TABLE public.fotos TO sandbox_exec;


--
-- Name: TABLE integrantes_centro; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.integrantes_centro TO anon;
GRANT ALL ON TABLE public.integrantes_centro TO authenticated;
GRANT ALL ON TABLE public.integrantes_centro TO service_role;
GRANT SELECT,INSERT ON TABLE public.integrantes_centro TO sandbox_exec;


--
-- Name: TABLE invitaciones; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.invitaciones TO anon;
GRANT ALL ON TABLE public.invitaciones TO authenticated;
GRANT ALL ON TABLE public.invitaciones TO service_role;
GRANT SELECT,INSERT ON TABLE public.invitaciones TO sandbox_exec;


--
-- Name: TABLE materias; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.materias TO anon;
GRANT ALL ON TABLE public.materias TO authenticated;
GRANT ALL ON TABLE public.materias TO service_role;
GRANT SELECT,INSERT ON TABLE public.materias TO sandbox_exec;


--
-- Name: TABLE mensajes_contacto; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.mensajes_contacto TO anon;
GRANT ALL ON TABLE public.mensajes_contacto TO authenticated;
GRANT ALL ON TABLE public.mensajes_contacto TO service_role;
GRANT SELECT,INSERT ON TABLE public.mensajes_contacto TO sandbox_exec;


--
-- Name: TABLE oportunidades; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.oportunidades TO anon;
GRANT ALL ON TABLE public.oportunidades TO authenticated;
GRANT ALL ON TABLE public.oportunidades TO service_role;
GRANT SELECT,INSERT ON TABLE public.oportunidades TO sandbox_exec;


--
-- Name: TABLE perfiles; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.perfiles TO anon;
GRANT ALL ON TABLE public.perfiles TO authenticated;
GRANT ALL ON TABLE public.perfiles TO service_role;
GRANT SELECT,INSERT ON TABLE public.perfiles TO sandbox_exec;


--
-- Name: TABLE permisos_seccion; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.permisos_seccion TO anon;
GRANT ALL ON TABLE public.permisos_seccion TO authenticated;
GRANT ALL ON TABLE public.permisos_seccion TO service_role;
GRANT SELECT,INSERT ON TABLE public.permisos_seccion TO sandbox_exec;


--
-- Name: TABLE propuestas_centro; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.propuestas_centro TO anon;
GRANT ALL ON TABLE public.propuestas_centro TO authenticated;
GRANT ALL ON TABLE public.propuestas_centro TO service_role;
GRANT SELECT,INSERT ON TABLE public.propuestas_centro TO sandbox_exec;


--
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.user_roles TO anon;
GRANT ALL ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;
GRANT SELECT,INSERT ON TABLE public.user_roles TO sandbox_exec;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES TO sandbox_exec;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT ON TABLES TO sandbox_exec;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--


