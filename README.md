# Tecnica 3 Avellaneda

1. CONTEXTO Y OBJETIVO

Quiero que construyas el sitio web oficial de una escuela técnica secundaria llamada Tecnica 3 Avellaneda ¨Republica de Mexico¨, ubicada en Caxaraville 5875. Es una página institucional y oficial, no un sitio de marketing genérico: debe transmitir seriedad, confianza y prestigio académico, pero con un diseño moderno, limpio y actual (nada de plantillas anticuadas ni "clipart" genérico).

El sitio debe cumplir estándares de nivel profesional en:

SEO (posicionamiento en buscadores)

Seguridad (autenticación, permisos, protección de datos)

Compatibilidad (responsive, cross-browser, accesibilidad)

Portabilidad (poder migrar el proyecto fuera de Lovable con el mínimo esfuerzo posible)

Construí todo pensando en que la web va a ser mantenida a largo plazo por personal de la escuela sin conocimientos técnicos avanzados, a través de un panel de administración.

2. REQUISITOS TÉCNICOS NO FUNCIONALES

Base de datos y portabilidad

Conectá un proyecto de Supabase propio (self-managed), no el backend administrado automático de Lovable Cloud: andá a Settings → Connectors → Connect Supabase y vinculá el proyecto de Supabase que yo voy a crear/conectar. Esto es importante porque me da acceso completo al dashboard de Supabase, a los datos y a la base en cualquier momento, sin depender de Lovable.

Usá SQL estándar de PostgreSQL, sin funciones o extensiones propietarias que no sean portables.

Documentá el esquema de la base (tablas, relaciones, políticas RLS) en un archivo SCHEMA.md dentro del repo para poder reconstruirlo en otro proveedor si hiciera falta.

Todo el código debe quedar sincronizado con un repositorio de GitHub (activá la integración de GitHub de Lovable) para tener el código fuente exportable en todo momento, sin lock-in.

Evitá dependencias o componentes exclusivos del ecosistema Lovable que no funcionen si el proyecto se exporta y se corre como una app React/Vite + Supabase estándar.

SEO

HTML semántico (header, nav, main, section, article, footer).

Meta tags únicos por página/sección (title, description, Open Graph, Twitter Cards).

Datos estructurados Schema.org tipo EducationalOrganization (nombre, dirección, teléfono, redes sociales).

sitemap.xml y robots.txt generados.

URLs limpias y descriptivas (ej: /institucional, /materias/informatica).

Imágenes con alt descriptivo, lazy loading y formatos optimizados (WebP).

Buena performance / Core Web Vitals (evitar JS innecesario, optimizar carga).

Seguridad

Autenticación mediante Supabase Auth, exclusivamente para el panel de administración (el sitio público no requiere login).

Row Level Security (RLS) activado en todas las tablas: lectura pública solo de lo que corresponde ser público, escritura restringida por rol.

Lógica sensible (envío de mails, validaciones críticas, gestión de invitaciones de admin) resuelta en Edge Functions del lado servidor, nunca en el cliente.

Sanitización y validación de todos los formularios (contacto, propuestas al centro de estudiantes) para evitar inyección de datos maliciosos.

Rate limiting en formularios públicos para evitar spam/abuso.

Nunca exponer claves secretas (service_role) en el frontend; solo la anon key protegida por RLS.

Compatibilidad y accesibilidad

Diseño mobile-first, totalmente responsive (celular, tablet, escritorio).

Compatible con los navegadores modernos principales.

Accesibilidad WCAG AA: buen contraste de color, aria-labels, navegación por teclado, tamaños de fuente legibles.

3. DISEÑO VISUAL

Estilo: moderno, serio e institucional. Nada infantil ni "startupero"; pensalo como la web de una institución educativa de prestigio.

Paleta de colores: predominancia de azules y blancos, sumando un tercer color frío de apoyo (por ejemplo un gris azulado o un verde azulado/teal) para acentos y estados (destacados, alertas, botones secundarios).

Tipografía: una combinación seria pero contemporánea (una sans-serif moderna para texto, y opcionalmente una fuente con más carácter para títulos).

Modo oscuro: botón visible en el header para alternar claro/oscuro, con una paleta oscura coherente (azules oscuros/grises, no negro puro) que mantenga buen contraste.

Header fijo con navegación clara a todas las secciones y buscador.

Footer institucional completo (datos de contacto, redes sociales, enlaces rápidos, logo).

Micro-interacciones sutiles (hover, transiciones) que refuercen la sensación de calidad sin distraer.

4. ARQUITECTURA Y NAVEGACIÓN

Secciones principales (navbar): Inicio · Institucional · Avisos · Calendario · Materias · Capacitaciones · Centro de Estudiantes · Galería · Contacto

Incluí una barra de búsqueda global (accesible desde el header) que busque entre avisos, materias, capacitaciones y eventos del calendario, mostrando resultados agrupados por tipo.

Todo el contenido dinámico (avisos, calendario, materias, capacitaciones, galería, integrantes del centro de estudiantes) debe salir de la base de datos, no estar hardcodeado, para poder gestionarse desde el panel de admin.

5. DETALLE DE CADA SECCIÓN

5.1 Inicio

Hero principal con imagen/video institucional, nombre de la escuela y una frase que transmita identidad y prestigio (algo como "Formación técnica con proyección real" — ajustalo vos a un mensaje que combine calidez para las familias y seriedad académica).

Bloque de avisos destacados (los marcados como destacados desde el panel).

Bloque de próximos eventos del calendario (los 3-4 más cercanos).

Números institucionales relevantes (años de trayectoria, especialidades, egresados, etc. — placeholder editable).

Accesos rápidos a las secciones clave (Institucional, Materias, Contacto).

Llamado a la acción claro para familias que están evaluando inscribir a un/a hijo/a.

5.2 Institucional

"Quiénes somos" y propuesta educativa.

Historia de la escuela.

Autoridades / equipo directivo (opcional, editable desde admin).

Mapa interactivo embebido de Google Maps con la ubicación, más indicaciones de cómo llegar (colectivos, referencias).

Información de las tres orientaciones que ofrece la escuela, a nivel general (con link a la sección Materias para el detalle).

5.3 Avisos

Listado de avisos conectado a la base de datos, con categorías: institucionales, para las familias, del centro de estudiantes (y dejá la categoría extensible desde el admin para agregar nuevas a futuro).

Posibilidad de marcar avisos como destacados (se muestran primero y/o en Inicio).

Filtro por categoría y por fecha.

Cada aviso con título, cuerpo, categoría, fecha de publicación, imagen opcional y estado (publicado/borrador).

5.4 Calendario

Vista de calendario con las actividades próximas.

Cada evento con: tipo de actividad (clase especial, acto, reunión de padres, examen, etc. — categorías configurables), fecha, horario, lugar y descripción.

Vista de lista además de la vista calendario, para verlo fácil desde el celular.

Filtro por tipo de actividad.

5.5 Materias

Estructura curricular: Ciclo Básico Común (1° a 3° año, materias comunes a todos) y Ciclo Superior (4° a 7° año, dividido en las tres especialidades: Informática Personal y Profesional (IPP), Técnico en Electrónica y Técnico en Alimentos).

Selector interactivo por año/especialidad que muestre las materias correspondientes.

Ficha por materia con información orientativa (qué se estudia, carga horaria si aplica). Marcá este contenido como de ejemplo/orientativo, editable, ya que la info específica curricular se puede completar/ajustar después con fuentes oficiales.

5.6 Capacitaciones

Listado de capacitaciones que se dictan, cada una con: título, descripción, quién la dicta, destinatarios, modalidad, fecha/duración y estado (próxima, en curso, finalizada).

Filtro por estado y por área.

5.7 Centro de Estudiantes

Presentación del centro de estudiantes y sus integrantes (nombre, rol/cargo, foto opcional).

Anuncios propios del centro de estudiantes (pueden reutilizar la misma tabla de "avisos" con la categoría correspondiente).

Formulario para enviar propuestas que llegue por mail al centro de estudiantes (vía Edge Function, sin exponer la dirección de mail directamente en el cliente si es posible).

5.8 Galería

Galería de fotos organizada por álbumes/categorías: proyectos, eventos, jornadas especiales.

Vista tipo grid con lightbox al hacer click.

Carga optimizada de imágenes (miniaturas + versión completa).

5.9 Contacto

Toda la información de contacto de la escuela: dirección, teléfono, mail, horarios de atención, redes sociales.

Mapa (puede reutilizar el mismo componente de Google Maps de Institucional).

Formulario de contacto que envíe el mensaje por mail (vía Edge Function), con validación y protección anti-spam.

6. COPYWRITING Y TONO

Redactá todos los textos de ejemplo pensando en dos públicos a la vez: familias que están evaluando inscribir a sus hijos y estudiantes actuales. Usá un tono cálido pero serio, que transmita:

Confianza institucional y trayectoria.

Oportunidades concretas (salida laboral, proyectos reales, especialidades técnicas).

Comunidad y pertenencia (centro de estudiantes, actividades, capacitaciones).

Evitá lenguaje genérico de "landing page de venta". Priorizá palabras como formación, comunidad educativa, especialidades técnicas, proyectos reales, trayectoria, acompañamiento, por sobre frases publicitarias vacías.

7. PANEL DE ADMINISTRACIÓN

Este es el corazón funcional del sitio, prestale especial atención:

Login exclusivo para administradores (no hay registro público de usuarios; el sitio público no requiere cuenta).

Sistema de roles y permisos:

Super Admin: control total del sitio. Puede gestionar absolutamente todo: contenido de todas las secciones, categorías, usuarios admin, permisos, invitaciones, configuración general del sitio (SEO, textos institucionales, datos de contacto, colores/branding si es posible).

Admins de sección: roles con permisos acotados a secciones específicas (por ejemplo, un admin que solo pueda gestionar Avisos y Calendario, otro que solo gestione Galería, etc.). Definí estos roles de forma flexible/configurable desde el propio panel, no hardcodeados.

Gestión de categorías: el Super Admin debe poder crear, editar y eliminar las categorías usadas en Avisos, Calendario, Capacitaciones, Galería, etc., desde el panel (no deben quedar fijas en el código).

Sistema de invitaciones: el Super Admin puede generar invitaciones (por link o código) para que nuevas personas se registren como administradores con un rol predefinido, y puede ver, revocar o reenviar esas invitaciones.

Gestión completa de usuarios admin: ver lista de administradores, su rol, desactivarlos, cambiarles el rol o eliminarlos.

CRUD completo desde el panel para: Avisos, Calendario, Materias (contenido de cada una), Capacitaciones, Centro de Estudiantes (integrantes y anuncios), Galería (álbumes y fotos), datos de Contacto e Institucional.

Dashboard inicial del panel con un resumen general (últimos avisos, próximos eventos, cantidad de administradores, etc.).

Registro de auditoría básico (qué admin hizo qué cambio y cuándo), para trazabilidad.

8. INSTRUCCIÓN FINAL

Construí el proyecto completo en esta primera iteración: estructura de páginas, diseño con la paleta y modo oscuro descriptos, esquema de base de datos en Supabase con RLS, autenticación y panel de administración con roles y permisos. Priorizá dejar todo funcional de punta a punta (aunque el contenido real todavía no esté cargado, usá contenido de ejemplo claramente editable desde el panel) antes que pulir detalles visuales menores. Explicame brevemente, al terminar, qué tablas creaste en la base de datos y qué pasos me faltan a mí (por ejemplo, cargar contenido real o conectar el mail de destino de los formularios).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tec3-portal-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/da8de0d1-db04-408f-8566-f47731d2a1ba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
