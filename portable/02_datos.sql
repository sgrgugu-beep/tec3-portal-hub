-- =====================================================================
-- Técnica 3 Avellaneda — CONTENIDO DEL SITIO
-- Ejecutar DESPUÉS de 01_schema.sql.
-- Incluye avisos, eventos, materias, especialidades, oportunidades,
-- capacitaciones, integrantes, autoridades, categorías, álbumes, fotos
-- y configuración/textos del sitio.
-- NO incluye (a propósito): usuarios, roles, permisos, invitaciones,
-- auditoría ni mensajes recibidos (datos personales / ligados a cuentas).
-- Los archivos subidos (fotos/videos) se copian aparte: ver README.
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
-- Data for Name: albumes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.albumes (id, slug, titulo, descripcion, categoria_slug, fecha, publicado, created_at, updated_at) VALUES ('d90a19f3-c195-4e39-9be9-ae328a6822e4', 'proyectos-tecnicos', 'Proyectos técnicos', 'Prototipos y trabajos finales desarrollados en los talleres de las tres especialidades.', 'Proyectos', '2026-09-01', true, '2026-09-01 00:10:10.271749+00', '2026-09-01 00:10:10.271749+00');
INSERT INTO public.albumes (id, slug, titulo, descripcion, categoria_slug, fecha, publicado, created_at, updated_at) VALUES ('cd61e094-af5e-4f4d-a110-c7f597510ac3', 'eventos-institucionales', 'Eventos institucionales', 'Actos, aniversarios y encuentros con la comunidad educativa.', 'Eventos', '2026-09-01', true, '2026-09-01 00:10:10.426128+00', '2026-09-01 00:10:10.426128+00');
INSERT INTO public.albumes (id, slug, titulo, descripcion, categoria_slug, fecha, publicado, created_at, updated_at) VALUES ('dbb1d3a7-d833-4ade-8e24-2ee64bb1f234', 'jornadas-especiales', 'Jornadas especiales', 'Puertas abiertas, olimpíadas y visitas de escuelas primarias.', 'Jornadas', '2026-09-01', true, '2026-09-01 00:10:10.576937+00', '2026-09-01 00:10:10.576937+00');
INSERT INTO public.albumes (id, slug, titulo, descripcion, categoria_slug, fecha, publicado, created_at, updated_at) VALUES ('f209952e-cff6-4cde-b0d5-4ccc0ba37d5b', 'informatica', 'Informática en práctica', 'Equipos, prácticas de hardware y proyectos compartidos en Informática Personal y Profesional.', 'informatica', '2026-10-18', true, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00');
INSERT INTO public.albumes (id, slug, titulo, descripcion, categoria_slug, fecha, publicado, created_at, updated_at) VALUES ('aceecbcd-3dde-4195-889b-28b9fb89e8c0', 'electronica', 'Taller de Electrónica', 'Instrumentos, mediciones y aprendizajes del taller de Electrónica.', 'electronica', '2026-10-18', true, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00');
INSERT INTO public.albumes (id, slug, titulo, descripcion, categoria_slug, fecha, publicado, created_at, updated_at) VALUES ('daa5fd54-2930-4d55-8f20-aa73efa3f585', 'alimentos', 'Laboratorio de Alimentos', 'Prácticas y experiencias en el laboratorio de Alimentos.', 'alimentos', '2026-10-18', true, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00');
INSERT INTO public.albumes (id, slug, titulo, descripcion, categoria_slug, fecha, publicado, created_at, updated_at) VALUES ('f994c15f-b9ff-4ed2-9eb7-d7cceda27bb7', 'vida-escolar', 'Nuestra comunidad', 'Encuentros y actividades que compartimos en la escuela.', 'Eventos', '2026-10-18', true, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00');


--
-- Data for Name: auditoria; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: autoridades; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.autoridades (id, nombre, cargo, foto_url, orden, created_at, updated_at) VALUES ('386fbca9-b05c-4ceb-b67e-3b78e9664777', 'Nombre de ejemplo', 'Dirección', NULL, 0, '2026-09-01 00:10:09.513417+00', '2026-09-01 00:10:09.513417+00');
INSERT INTO public.autoridades (id, nombre, cargo, foto_url, orden, created_at, updated_at) VALUES ('e6447375-7e2c-4da2-af4a-5c5c8d422939', 'Nombre de ejemplo', 'Vicedirección — Ciclo Básico', NULL, 1, '2026-09-01 00:10:09.666054+00', '2026-09-01 00:10:09.666054+00');
INSERT INTO public.autoridades (id, nombre, cargo, foto_url, orden, created_at, updated_at) VALUES ('bc38594c-7b9b-44fd-9680-024fdd1bfd83', 'Nombre de ejemplo', 'Vicedirección — Ciclo Superior', NULL, 2, '2026-09-01 00:10:09.816823+00', '2026-09-01 00:10:09.816823+00');
INSERT INTO public.autoridades (id, nombre, cargo, foto_url, orden, created_at, updated_at) VALUES ('f34357f3-5197-444e-ba81-41072c7c23bf', 'Nombre de ejemplo', 'Jefatura de Área Técnica', NULL, 3, '2026-09-01 00:10:09.970052+00', '2026-09-01 00:10:09.970052+00');
INSERT INTO public.autoridades (id, nombre, cargo, foto_url, orden, created_at, updated_at) VALUES ('c8b14af5-b1ce-4e3f-bcb3-8b2e6e1ef3da', 'Nombre de ejemplo', 'Secretaría', NULL, 4, '2026-09-01 00:10:10.120575+00', '2026-09-01 00:10:10.120575+00');


--
-- Data for Name: avisos; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: capacitaciones; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.capacitaciones (id, titulo, descripcion, dictada_por, destinatarios, modalidad, area_slug, estado, fecha_inicio, duracion, publicado, created_at, updated_at) VALUES ('372b1a26-2515-4b37-8c38-de3321fd0f9d', 'Redes y soporte técnico para la comunidad', 'Curso práctico de armado de redes domésticas, diagnóstico de equipos y resguardo de información.', 'Departamento de Informática', 'Estudiantes del ciclo superior y egresados', 'Presencial', 'Informática', 'proxima', '2026-09-08', '8 encuentros de 2 h', true, '2026-09-01 00:10:08.000143+00', '2026-09-01 00:10:08.000143+00');
INSERT INTO public.capacitaciones (id, titulo, descripcion, dictada_por, destinatarios, modalidad, area_slug, estado, fecha_inicio, duracion, publicado, created_at, updated_at) VALUES ('02e4ad4c-ddf7-4fcd-aff4-4f6f0d0532d8', 'Automatización con microcontroladores', 'Programación de placas de desarrollo, sensores y actuadores aplicados a proyectos escolares.', 'Departamento de Electrónica', 'Estudiantes de 5° a 7° año', 'Mixta', 'Electrónica', 'en curso', '2026-08-20', '10 encuentros de 2 h', true, '2026-09-01 00:10:08.152191+00', '2026-09-01 00:10:08.152191+00');
INSERT INTO public.capacitaciones (id, titulo, descripcion, dictada_por, destinatarios, modalidad, area_slug, estado, fecha_inicio, duracion, publicado, created_at, updated_at) VALUES ('aa7c7eca-c79a-4132-a06d-1d14097ce9c9', 'Manipulación segura de alimentos', 'Buenas prácticas de manufactura, higiene y trazabilidad, con certificación institucional.', 'Departamento de Alimentos', 'Estudiantes, familias y personal de la escuela', 'Presencial', 'Alimentos', 'finalizada', '2026-06-10', '4 encuentros de 3 h', true, '2026-09-01 00:10:08.303782+00', '2026-09-01 00:10:08.303782+00');


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('ca1017ab-c6ec-43ae-8465-f82cd7c04f7e', 'aviso', 'institucional', 'Institucionales', 'primary', 1, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('c50fbf80-b795-4e12-a0dd-85029fee1e50', 'aviso', 'familias', 'Para las familias', 'accent', 2, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('bfe7e636-9b4a-446c-93bb-29c1248254d1', 'aviso', 'centro', 'Centro de Estudiantes', 'secondary', 3, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('3783a957-15b5-4003-80ea-0547fe8168a4', 'evento', 'acto', 'Acto', 'primary', 1, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('672aa8e1-6a9c-4e45-a94c-bd50ff7e8e06', 'evento', 'reunion', 'Reunión de familias', 'accent', 2, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('db859df3-5ed8-4eef-8423-d96546b89e56', 'evento', 'examen', 'Examen', 'destructive', 3, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('67cfe42c-e905-4f5c-a5a1-ab974a2d4bef', 'evento', 'clase-especial', 'Clase especial', 'secondary', 4, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('c3082f9c-2ec6-40c1-88da-f651fe71a7f5', 'capacitacion', 'general', 'General', 'primary', 1, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('93003d2c-9549-42d0-b2fe-cdb94bd8aa5a', 'capacitacion', 'informatica', 'Informática', 'accent', 2, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('5b44a502-9ad8-4593-b7c8-efad60c01f80', 'capacitacion', 'electronica', 'Electrónica', 'secondary', 3, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('c551f293-9c51-4944-91e9-3c278e5b1d12', 'capacitacion', 'alimentos', 'Alimentos', 'primary', 4, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('d0dadfd6-12ee-4803-abd9-aef869c2047f', 'galeria', 'proyectos', 'Proyectos', 'primary', 1, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('dc0e247a-490a-44f8-80cb-2ad3d6dff6d1', 'galeria', 'eventos', 'Eventos', 'accent', 2, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('802ec3f3-8950-441b-89db-e330d9f42751', 'galeria', 'jornadas', 'Jornadas especiales', 'secondary', 3, '2026-08-29 22:24:26.617325+00', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('f41d8bfc-29d2-4914-a513-f00501788d35', 'evento', 'jornada', 'Jornada', 'primary', 5, '2026-10-04 22:31:19.31821+00', '2026-10-04 22:31:19.31821+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('573f1e24-c0b5-4df6-ba0e-ec1a20e655c7', 'galeria', 'informatica', 'Informática', 'primary', 10, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('c91bb602-bf22-4817-a4b2-91bfbb2dc8a9', 'galeria', 'electronica', 'Electrónica', 'accent', 11, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00');
INSERT INTO public.categorias (id, tipo, slug, nombre, color, orden, created_at, updated_at) VALUES ('ac5a35a5-d7b3-4c85-8a72-0a93ca11fe42', 'galeria', 'alimentos', 'Alimentos', 'success', 12, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00');


--
-- Data for Name: configuracion_sitio; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('nombre_escuela', 'E.E.S.T. N° 3 "República de México"', 'Nombre oficial', 'general', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('lema', 'Formación técnica con proyección real', 'Lema institucional', 'general', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('direccion', 'Caxaraville 5875, Wilde, Avellaneda', 'Dirección', 'contacto', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('telefono', '', 'Teléfono de contacto', 'contacto', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('email', '', 'Correo institucional', 'contacto', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('email_centro', '', 'Correo del centro de estudiantes', 'contacto', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('horarios', 'Lunes a viernes de 8 a 17 h', 'Horarios de atención', 'contacto', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('instagram', '', 'Instagram', 'redes', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('facebook', '', 'Facebook', 'redes', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('youtube', '', 'YouTube', 'redes', '2026-08-29 22:24:26.617325+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('whatsapp_difusion', 'https://whatsapp.com/channel/0029VatZ2btGpLHTVhLfio0W', 'Grupo o canal de difusión WhatsApp', 'redes', '2026-10-23 19:36:59.619321+00');
INSERT INTO public.configuracion_sitio (clave, valor, descripcion, grupo, updated_at) VALUES ('nombre_corto', 'Técnica 3 Avellaneda', 'Nombre corto visible en el encabezado y pie', 'general', '2026-10-23 19:41:40.51827+00');


--
-- Data for Name: especialidades; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.especialidades (id, slug, nombre, nombre_corto, descripcion, salida_laboral, orden, created_at, updated_at, imagen_url, imagen_alt, practicas) VALUES ('1c2de689-8b2f-46a5-a62e-93aad5de99cf', 'informatica', 'Informática Personal y Profesional', 'IPP', 'Formación en desarrollo de software, redes, hardware y soporte técnico.', 'Soporte técnico, desarrollo web, administración de redes.', 1, '2026-08-29 22:24:26.617325+00', '2026-10-18 14:33:14.501276+00', '/__l5e/assets-v1/c9c04f5f-d27c-4ce8-88e7-b314e6a4b0c3/informatica-proyecto.webp', 'Estudiantes de Informática presentando un proyecto con equipo de audio y una computadora', 'Armamos y diagnosticamos computadoras, seleccionamos componentes y probamos fuentes de alimentación en banco. También trabajamos con redes y programación: aprender a resolver problemas es parte de cada proyecto.');
INSERT INTO public.especialidades (id, slug, nombre, nombre_corto, descripcion, salida_laboral, orden, created_at, updated_at, imagen_url, imagen_alt, practicas) VALUES ('25868ddc-8fe9-4ff1-8cc2-834b3bfd3947', 'electronica', 'Técnico en Electrónica', 'Electrónica', 'Diseño, montaje y mantenimiento de sistemas electrónicos y de control.', 'Mantenimiento industrial, automatización, electrónica aplicada.', 2, '2026-08-29 22:24:26.617325+00', '2026-10-18 14:33:14.501276+00', '/__l5e/assets-v1/d561cdf5-d728-4db0-a766-117fd2d46d4a/proyecto-electronica.webp', 'Estudiantes presentando un proyecto de Electrónica', 'Diseñamos y montamos circuitos, realizamos mediciones e interpretamos señales con instrumentos de laboratorio. Del prototipo a la puesta en funcionamiento, combinamos precisión, trabajo en equipo y resolución de problemas.');
INSERT INTO public.especialidades (id, slug, nombre, nombre_corto, descripcion, salida_laboral, orden, created_at, updated_at, imagen_url, imagen_alt, practicas) VALUES ('3964060b-2439-43f1-a9b9-23f8b1c2075d', 'alimentos', 'Técnico en Alimentos', 'Alimentos', 'Procesos, calidad e higiene en la industria alimentaria.', 'Control de calidad, producción y laboratorio de alimentos.', 3, '2026-08-29 22:24:26.617325+00', '2026-10-18 14:33:14.501276+00', '/__l5e/assets-v1/b7700f8e-d7e0-46ab-ab8b-e950fccdabad/alimentos-laboratorio.webp', 'Práctica con muestras y vasos de laboratorio de Alimentos', 'Exploramos procesos de elaboración, analizamos muestras y trabajamos con higiene y control de calidad. Las experiencias de laboratorio nos permiten relacionar la ciencia con la producción y la seguridad de los alimentos.');


--
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.eventos (id, titulo, descripcion, tipo_slug, fecha, hora_inicio, hora_fin, lugar, publicado, created_at, updated_at) VALUES ('a345b7fb-e5e8-49fc-a896-b8fc3dab9c82', 'Reunión informativa para familias de 1° año', 'Presentación del equipo directivo, organización del ciclo básico y funcionamiento de los talleres.', 'reunion', '2026-09-04', '18:00 a 19:30 h', NULL, 'Salón de actos', true, '2026-09-01 00:10:01.342053+00', '2026-09-01 00:10:01.342053+00');
INSERT INTO public.eventos (id, titulo, descripcion, tipo_slug, fecha, hora_inicio, hora_fin, lugar, publicado, created_at, updated_at) VALUES ('db38c1d4-af85-4633-9afd-8a125b7a1397', 'Jornada de puertas abiertas', 'Recorrido guiado por las tres especialidades, con demostraciones a cargo de estudiantes del ciclo superior.', 'jornada', '2026-09-12', '9:00 a 13:00 h', NULL, 'Talleres y laboratorios', true, '2026-09-01 00:10:01.494774+00', '2026-09-01 00:10:01.494774+00');
INSERT INTO public.eventos (id, titulo, descripcion, tipo_slug, fecha, hora_inicio, hora_fin, lugar, publicado, created_at, updated_at) VALUES ('f0d08638-2e89-4ca5-bd42-86191588a9ac', 'Acto por el aniversario de la escuela', 'Acto institucional con participación de estudiantes, familias y egresados.', 'acto', '2026-09-25', '10:00 h', NULL, 'Patio central', true, '2026-09-01 00:10:01.645598+00', '2026-09-01 00:10:01.645598+00');
INSERT INTO public.eventos (id, titulo, descripcion, tipo_slug, fecha, hora_inicio, hora_fin, lugar, publicado, created_at, updated_at) VALUES ('91ca4af7-b5be-4c4a-997f-b39e8e661a54', 'Mesas de examen — período complementario', 'Consultar el cronograma por materia en cartelera y en preceptoría.', 'examen', '2026-10-06', '8:00 a 12:00 h', NULL, 'Aulas del primer piso', true, '2026-09-01 00:10:01.797495+00', '2026-09-01 00:10:01.797495+00');
INSERT INTO public.eventos (id, titulo, descripcion, tipo_slug, fecha, hora_inicio, hora_fin, lugar, publicado, created_at, updated_at) VALUES ('44d6aa08-c182-46cc-916c-61aa0ee74d9d', 'Clase especial de robótica educativa', 'Actividad abierta a estudiantes de 2° y 3° año junto a escuelas primarias invitadas.', 'clase-especial', '2026-10-17', '14:00 a 16:00 h', NULL, 'Laboratorio de Informática', true, '2026-09-01 00:10:01.954125+00', '2026-09-01 00:10:01.954125+00');
INSERT INTO public.eventos (id, titulo, descripcion, tipo_slug, fecha, hora_inicio, hora_fin, lugar, publicado, created_at, updated_at) VALUES ('3280acf6-1caa-4718-a7c8-15075923f990', 'hola', '', 'acto', '2026-10-05', '', '', 'escuela', true, '2026-10-02 22:48:57.91048+00', '2026-10-02 22:48:57.91048+00');


--
-- Data for Name: fotos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('dba9ffa8-c86a-49dd-a4e9-9c60ff56b1f7', 'd90a19f3-c195-4e39-9be9-ae328a6822e4', '/galeria/proyectos-1.svg', NULL, 'Estudiantes ensamblando un prototipo electrónico en el taller', 0, '2026-09-01 00:10:10.727632+00', '2026-10-18 14:33:14.501276+00', 'foto', false);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('0ed90bd3-70b3-41ed-892c-cb76f1968ae3', 'd90a19f3-c195-4e39-9be9-ae328a6822e4', '/galeria/proyectos-2.svg', NULL, 'Placa de circuito impreso terminada sobre la mesa de trabajo', 1, '2026-09-01 00:10:10.884957+00', '2026-10-18 14:33:14.501276+00', 'foto', false);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('d6e884ae-c0e3-4938-816d-12d2ad8fe6c1', 'd90a19f3-c195-4e39-9be9-ae328a6822e4', '/galeria/proyectos-3.svg', NULL, 'Grupo de estudiantes presentando un proyecto de informática', 2, '2026-09-01 00:10:11.035564+00', '2026-10-18 14:33:14.501276+00', 'foto', false);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('0fab50be-57e7-4b29-adad-5763a8e0c37e', 'cd61e094-af5e-4f4d-a110-c7f597510ac3', '/galeria/eventos-1.svg', NULL, 'Acto institucional en el patio de la escuela', 0, '2026-09-01 00:10:11.186506+00', '2026-10-18 14:33:14.501276+00', 'foto', false);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('70b1f679-e401-4d56-8fb1-d66fe0d80d6b', 'cd61e094-af5e-4f4d-a110-c7f597510ac3', '/galeria/eventos-2.svg', NULL, 'Familias participando de una reunión en el salón de actos', 1, '2026-09-01 00:10:11.340201+00', '2026-10-18 14:33:14.501276+00', 'foto', false);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('cb8d70bc-eb9f-4b74-a049-57d4443968f7', 'dbb1d3a7-d833-4ade-8e24-2ee64bb1f234', '/galeria/jornadas-1.svg', NULL, 'Visita guiada por el laboratorio de alimentos', 0, '2026-09-01 00:10:11.490835+00', '2026-10-18 14:33:14.501276+00', 'foto', false);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('26dae58d-51ce-4300-861e-557f6c9ee2d2', 'dbb1d3a7-d833-4ade-8e24-2ee64bb1f234', '/galeria/jornadas-2.svg', NULL, 'Demostración de robótica durante la jornada de puertas abiertas', 1, '2026-09-01 00:10:11.64244+00', '2026-10-18 14:33:14.501276+00', 'foto', false);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('5522e46e-b2b3-4dec-8b96-d50de4cb4f07', 'dbb1d3a7-d833-4ade-8e24-2ee64bb1f234', '/galeria/jornadas-3.svg', NULL, 'Estudiantes de primaria recorriendo el taller de electrónica', 2, '2026-09-01 00:10:11.793207+00', '2026-10-18 14:33:14.501276+00', 'foto', false);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('629a2dea-8233-46fe-baef-956e594389fe', 'daa5fd54-2930-4d55-8f20-aa73efa3f585', '/__l5e/assets-v1/b7700f8e-d7e0-46ab-ab8b-e950fccdabad/alimentos-laboratorio.webp', NULL, 'Estudiantes realizando una práctica con muestras y vasos de laboratorio', 0, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00', 'foto', true);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('cedff3d4-9801-4600-a4a0-2d04f244e72c', 'f209952e-cff6-4cde-b0d5-4ccc0ba37d5b', '/__l5e/assets-v1/d39202a4-675b-411b-9364-3c20cc83f675/informatica-equipo.webp', NULL, 'Estudiantes y docente junto a equipos portátiles en el aula de Informática', 3, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00', 'foto', true);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('575a71d7-df21-419a-a05c-e81df1c00c08', 'f209952e-cff6-4cde-b0d5-4ccc0ba37d5b', '/__l5e/assets-v1/2a085fdb-ef43-4e7c-befb-ab66f45bb3ee/informatica-clase.webp', NULL, 'Clase de Informática con estudiantes y docente frente a una pizarra interactiva', 2, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00', 'foto', true);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('f9701779-6ea6-4c2b-b278-71035fe62bfa', 'f209952e-cff6-4cde-b0d5-4ccc0ba37d5b', '/__l5e/assets-v1/c9c04f5f-d27c-4ce8-88e7-b314e6a4b0c3/informatica-proyecto.webp', NULL, 'Estudiantes presentando un proyecto con equipo de audio y una computadora', 0, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00', 'foto', true);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('43f75750-a861-4c73-83bc-28eeccc16768', 'aceecbcd-3dde-4195-889b-28b9fb89e8c0', '/__l5e/assets-v1/243118fc-00cc-4a14-84b0-1c70694237d2/electronica-osciloscopio.webp', NULL, 'Osciloscopio del taller mostrando la medición de una señal', 0, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00', 'foto', true);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('517f8d98-7c08-49f3-a583-2e85dcc022e2', 'f994c15f-b9ff-4ed2-9eb7-d7cceda27bb7', '/__l5e/assets-v1/f80b3c5e-990d-4ed8-a095-12a10506524a/taller-perforacion.webp', NULL, 'Estudiante realizando una práctica con un taladro de banco en el taller', 1, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00', 'foto', true);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('ccc7e59a-8f68-42f2-905d-3c32c9776c63', 'f209952e-cff6-4cde-b0d5-4ccc0ba37d5b', '/__l5e/assets-v1/43dbf4a9-6e7b-4dd6-9c9d-3d7954089158/informatica-practicas.webp', NULL, 'Prácticas de 4° 3° Informática: selección de fuentes y pruebas en banco', 1, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00', 'foto', true);
INSERT INTO public.fotos (id, album_id, url, miniatura_url, alt, orden, created_at, updated_at, tipo, publicado) VALUES ('2e59bc07-e873-4ac0-adb4-7283e4815a68', 'f994c15f-b9ff-4ed2-9eb7-d7cceda27bb7', '/__l5e/assets-v1/5cb3a724-aa32-4f12-a31c-a2e6e857cd69/comunidad-acto.webp', NULL, 'La comunidad educativa reunida en un encuentro escolar', 0, '2026-10-18 14:33:14.501276+00', '2026-10-18 14:33:14.501276+00', 'foto', true);


--
-- Data for Name: integrantes_centro; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.integrantes_centro (id, nombre, cargo, curso, foto_url, orden, created_at, updated_at) VALUES ('b541de3f-98d5-4399-84a9-27c40dee2c90', 'Nombre de ejemplo', 'Vicepresidencia', '5° año — Electrónica', NULL, 1, '2026-09-01 00:10:08.760265+00', '2026-09-01 00:10:08.760265+00');
INSERT INTO public.integrantes_centro (id, nombre, cargo, curso, foto_url, orden, created_at, updated_at) VALUES ('3390e465-bd3d-46ad-9b59-e006c3c4e69a', 'Nombre de ejemplo', 'Secretaría general', '6° año — Alimentos', NULL, 2, '2026-09-01 00:10:08.91069+00', '2026-09-01 00:10:08.91069+00');
INSERT INTO public.integrantes_centro (id, nombre, cargo, curso, foto_url, orden, created_at, updated_at) VALUES ('382ccde8-6983-4376-8764-7bfc0130d71c', 'Nombre de ejemplo', 'Tesorería', '4° año — Informática', NULL, 3, '2026-09-01 00:10:09.061471+00', '2026-09-01 00:10:09.061471+00');
INSERT INTO public.integrantes_centro (id, nombre, cargo, curso, foto_url, orden, created_at, updated_at) VALUES ('53136f94-fb73-4e49-805b-c638d1c08c45', 'Nombre de ejemplo', 'Prensa y comunicación', '5° año — Informática', NULL, 4, '2026-09-01 00:10:09.212087+00', '2026-09-01 00:10:09.212087+00');
INSERT INTO public.integrantes_centro (id, nombre, cargo, curso, foto_url, orden, created_at, updated_at) VALUES ('f1587147-7db0-440f-970b-f4afae561d1b', 'Nombre de ejemplo', 'Deportes y cultura', '4° año — Electrónica', NULL, 5, '2026-09-01 00:10:09.362902+00', '2026-09-01 00:10:09.362902+00');
INSERT INTO public.integrantes_centro (id, nombre, cargo, curso, foto_url, orden, created_at, updated_at) VALUES ('ea6642f2-a0dd-430b-9d1c-58e34d9521e4', 'Marco Ianuzzi', 'Presidencia', '6° año — Informática', '', 0, '2026-09-01 00:10:08.607523+00', '2026-10-02 22:43:55.64072+00');


--
-- Data for Name: invitaciones; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: materias; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('7b45b0f8-0d10-480d-a3b8-66d29f4a67cd', 'Prácticas del Lenguaje', 1, 'basico', NULL, 'Lectura, escritura y oralidad con énfasis en textos de estudio.', '5 h semanales', 0, '2026-09-01 00:10:02.104801+00', '2026-09-01 00:10:02.104801+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('2e5db4ce-5b88-4e4c-be1f-4b260192e43f', 'Matemática', 1, 'basico', NULL, 'Números racionales, proporcionalidad y primeras nociones de álgebra.', '5 h semanales', 1, '2026-09-01 00:10:02.257172+00', '2026-09-01 00:10:02.257172+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('606d6e7e-48b4-4273-90a0-884697dfa926', 'Ciencias Naturales', 1, 'basico', NULL, 'Introducción a fenómenos físicos, químicos y biológicos.', '4 h semanales', 2, '2026-09-01 00:10:02.407787+00', '2026-09-01 00:10:02.407787+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('12df79ed-905c-4a0e-b592-21e61194077c', 'Ciencias Sociales', 1, 'basico', NULL, 'Espacio geográfico, organización social y procesos históricos.', '4 h semanales', 3, '2026-09-01 00:10:02.560529+00', '2026-09-01 00:10:02.560529+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('3edeaf59-b3cc-4cc8-9cbb-650be9fd663f', 'Educación Tecnológica', 1, 'basico', NULL, 'Procesos técnicos, materiales y análisis de productos.', '4 h semanales', 4, '2026-09-01 00:10:02.711601+00', '2026-09-01 00:10:02.711601+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('6939b578-3bef-4930-b9a2-c39fb577c4f4', 'Taller (Ciclo Básico)', 1, 'basico', NULL, 'Rotación por los talleres de las tres especialidades de la escuela.', '6 h semanales', 5, '2026-09-01 00:10:02.865531+00', '2026-09-01 00:10:02.865531+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('5c000d51-2099-4e60-985f-d10ae266a945', 'Prácticas del Lenguaje', 2, 'basico', NULL, 'Producción escrita, argumentación y literatura.', '5 h semanales', 6, '2026-09-01 00:10:03.017002+00', '2026-09-01 00:10:03.017002+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('c62814a0-c72f-4b90-9923-07360415dd7f', 'Matemática', 2, 'basico', NULL, 'Funciones, ecuaciones y geometría analítica inicial.', '5 h semanales', 7, '2026-09-01 00:10:03.167509+00', '2026-09-01 00:10:03.167509+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('7e969151-0edf-4d14-8902-995e0ae14890', 'Físico Química', 2, 'basico', NULL, 'Materia, energía, reacciones y magnitudes.', '4 h semanales', 8, '2026-09-01 00:10:03.319932+00', '2026-09-01 00:10:03.319932+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('64f4ce2e-f55c-4e08-a017-107e380fed7e', 'Biología', 2, 'basico', NULL, 'Células, organismos y salud.', '3 h semanales', 9, '2026-09-01 00:10:03.470659+00', '2026-09-01 00:10:03.470659+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('9e2374a7-b4b2-4a28-abff-f5cbca10b3f6', 'Sistemas Tecnológicos', 2, 'basico', NULL, 'Sistemas, control y representación técnica.', '4 h semanales', 10, '2026-09-01 00:10:03.621397+00', '2026-09-01 00:10:03.621397+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('5c991590-b049-4993-959b-6064f41b3186', 'Taller (Ciclo Básico)', 2, 'basico', NULL, 'Prácticas de medición, herramientas y seguridad e higiene.', '6 h semanales', 11, '2026-09-01 00:10:03.772009+00', '2026-09-01 00:10:03.772009+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('9688be8a-14e4-428c-b6e4-aee27a0162a2', 'Literatura', 3, 'basico', NULL, 'Géneros literarios y análisis crítico de textos.', '4 h semanales', 12, '2026-09-01 00:10:03.922973+00', '2026-09-01 00:10:03.922973+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('ed0dc9f0-5521-4ebf-a55e-c16a2f34973f', 'Matemática', 3, 'basico', NULL, 'Funciones cuadráticas, trigonometría y estadística.', '5 h semanales', 13, '2026-09-01 00:10:04.073578+00', '2026-09-01 00:10:04.073578+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('0e66b392-ea0f-4ef2-998b-1b97e0638751', 'Física', 3, 'basico', NULL, 'Cinemática, dinámica y energía.', '3 h semanales', 14, '2026-09-01 00:10:04.22631+00', '2026-09-01 00:10:04.22631+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('5c86d656-6366-479e-a75f-1e9441ab4e2b', 'Química', 3, 'basico', NULL, 'Estructura atómica, enlaces y estequiometría.', '3 h semanales', 15, '2026-09-01 00:10:04.377035+00', '2026-09-01 00:10:04.377035+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('a641176c-521a-40fd-bae2-77fb52e036a3', 'Lenguajes Tecnológicos', 3, 'basico', NULL, 'Dibujo técnico y representación asistida por computadora.', '4 h semanales', 16, '2026-09-01 00:10:04.527772+00', '2026-09-01 00:10:04.527772+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('c8bc3e12-00cd-453d-adc0-be26a1085dec', 'Taller (Ciclo Básico)', 3, 'basico', NULL, 'Proyecto técnico integrador previo a la elección de especialidad.', '6 h semanales', 17, '2026-09-01 00:10:04.679734+00', '2026-09-01 00:10:04.679734+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('b39f8dfa-89ac-4abf-aef4-e4a550a6f5ec', 'Instalación y Mantenimiento de Equipos', 4, 'superior', 'informatica', 'Armado, diagnóstico y mantenimiento de equipos informáticos.', '8 h semanales', 18, '2026-09-01 00:10:04.830578+00', '2026-09-01 00:10:04.830578+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('fc728230-5b42-46e6-b1c8-9808e999b42c', 'Programación I', 4, 'superior', 'informatica', 'Lógica de programación, estructuras de control y algoritmos.', '4 h semanales', 19, '2026-09-01 00:10:04.981162+00', '2026-09-01 00:10:04.981162+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('10608a47-343f-456a-88d7-46b8c25ba350', 'Redes de Datos I', 5, 'superior', 'informatica', 'Cableado estructurado, direccionamiento IP y servicios de red.', '6 h semanales', 20, '2026-09-01 00:10:05.132293+00', '2026-09-01 00:10:05.132293+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('94dd530a-fd9e-4dc8-b738-92b625fe7e80', 'Programación II', 5, 'superior', 'informatica', 'Programación orientada a objetos y bases de datos.', '6 h semanales', 21, '2026-09-01 00:10:05.282965+00', '2026-09-01 00:10:05.282965+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('b08d38c9-03d0-4fd6-8f84-4837b38c58e5', 'Desarrollo de Sistemas', 6, 'superior', 'informatica', 'Análisis, diseño y desarrollo de aplicaciones con bases de datos.', '8 h semanales', 22, '2026-09-01 00:10:05.433354+00', '2026-09-01 00:10:05.433354+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('390125c9-a0f4-4470-8671-57f61e238ba9', 'Seguridad Informática', 6, 'superior', 'informatica', 'Buenas prácticas, resguardo de datos y gestión de usuarios.', '4 h semanales', 23, '2026-09-01 00:10:05.584138+00', '2026-09-01 00:10:05.584138+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('925cbce2-bdd0-42ec-b7a6-1a90c4a7c177', 'Prácticas Profesionalizantes', 7, 'superior', 'informatica', 'Proyecto final y prácticas en organizaciones del distrito.', '10 h semanales', 24, '2026-09-01 00:10:05.734578+00', '2026-09-01 00:10:05.734578+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('0ce1ca36-66c2-487a-91f7-6c5d5f0b7a8b', 'Circuitos Analógicos', 4, 'superior', 'electronica', 'Componentes, mediciones y análisis de circuitos.', '8 h semanales', 25, '2026-09-01 00:10:05.885507+00', '2026-09-01 00:10:05.885507+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('3bb16f18-02f1-4931-8b18-183d22acea5e', 'Electrotecnia', 4, 'superior', 'electronica', 'Magnitudes eléctricas, leyes fundamentales y ensayos.', '4 h semanales', 26, '2026-09-01 00:10:06.036441+00', '2026-09-01 00:10:06.036441+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('2f5553a6-3ea3-47fb-873d-36c3e739fc5e', 'Electrónica Digital', 5, 'superior', 'electronica', 'Lógica combinacional y secuencial, sistemas numéricos.', '6 h semanales', 27, '2026-09-01 00:10:06.190313+00', '2026-09-01 00:10:06.190313+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('e2646ae0-0a1f-43bd-862a-9cd8c224b5cc', 'Instrumentos y Mediciones', 5, 'superior', 'electronica', 'Instrumental de laboratorio y análisis de señales.', '4 h semanales', 28, '2026-09-01 00:10:06.340909+00', '2026-09-01 00:10:06.340909+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('a1e8bdfa-f51a-42ea-ab34-79adaa3f9fb4', 'Sistemas de Control', 6, 'superior', 'electronica', 'Sensores, actuadores, automatización y microcontroladores.', '6 h semanales', 29, '2026-09-01 00:10:06.491936+00', '2026-09-01 00:10:06.491936+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('8841c633-d631-41ae-b622-ac7f4c565e67', 'Diseño de Proyectos Electrónicos', 6, 'superior', 'electronica', 'Documentación, prototipado y puesta en marcha.', '6 h semanales', 30, '2026-09-01 00:10:06.642584+00', '2026-09-01 00:10:06.642584+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('8cb619e2-601c-4749-90cc-5ed5799b985c', 'Prácticas Profesionalizantes', 7, 'superior', 'electronica', 'Proyecto final y prácticas en entornos productivos.', '10 h semanales', 31, '2026-09-01 00:10:06.794076+00', '2026-09-01 00:10:06.794076+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('d4d9c56c-d950-4f30-9b97-9e6f9c861071', 'Química Analítica', 4, 'superior', 'alimentos', 'Técnicas de análisis cuantitativo y cualitativo.', '6 h semanales', 32, '2026-09-01 00:10:06.944644+00', '2026-09-01 00:10:06.944644+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('b11cc6b9-6b41-4a98-b2ad-681b503133e2', 'Operaciones Unitarias I', 4, 'superior', 'alimentos', 'Transferencia de calor y materia en procesos alimentarios.', '6 h semanales', 33, '2026-09-01 00:10:07.09578+00', '2026-09-01 00:10:07.09578+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('b54fc060-8e14-490f-8be9-0eb0d6b1f8fa', 'Microbiología de los Alimentos', 5, 'superior', 'alimentos', 'Microorganismos, conservación e inocuidad.', '6 h semanales', 34, '2026-09-01 00:10:07.246569+00', '2026-09-01 00:10:07.246569+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('8c84b541-46e0-47b4-9835-33935dea07f5', 'Bromatología', 5, 'superior', 'alimentos', 'Composición, rotulado y normativa alimentaria.', '4 h semanales', 35, '2026-09-01 00:10:07.397164+00', '2026-09-01 00:10:07.397164+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('8ff36c9c-04e8-40dd-bcf5-33610f926b6a', 'Control de Calidad', 6, 'superior', 'alimentos', 'Buenas prácticas de manufactura, HACCP y trazabilidad.', '6 h semanales', 36, '2026-09-01 00:10:07.547711+00', '2026-09-01 00:10:07.547711+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('18bc8afe-6895-41ad-9857-3ec3e9cdd5b7', 'Tecnología de los Alimentos', 6, 'superior', 'alimentos', 'Líneas de elaboración y desarrollo de productos.', '6 h semanales', 37, '2026-09-01 00:10:07.69843+00', '2026-09-01 00:10:07.69843+00');
INSERT INTO public.materias (id, nombre, anio, ciclo, especialidad_slug, descripcion, carga_horaria, orden, created_at, updated_at) VALUES ('93813262-1728-4af6-a8ab-ab3a7b05b0b7', 'Prácticas Profesionalizantes', 7, 'superior', 'alimentos', 'Proyecto final y prácticas en plantas y laboratorios.', '10 h semanales', 38, '2026-09-01 00:10:07.84901+00', '2026-09-01 00:10:07.84901+00');


--
-- Data for Name: mensajes_contacto; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: oportunidades; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: perfiles; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: permisos_seccion; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: propuestas_centro; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- PostgreSQL database dump complete
--


