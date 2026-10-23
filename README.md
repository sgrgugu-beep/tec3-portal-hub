# Técnica 3 Avellaneda — Sitio web oficial

**E.E.S.T. N° 3 "República de México"** · Caxaraville 5875, Wilde, Avellaneda, Buenos Aires.

Este documento es el **manual completo** del sitio. Está pensado para que cualquier persona, sin contactar a quien lo desarrolló, pueda:

- entender cómo funciona el sitio de punta a punta;
- cargar y cambiar contenido desde el panel de administración, sin saber programar;
- modificar el diseño, agregar páginas o funciones (si sabe programar);
- instalarlo en su computadora, publicarlo en otro servidor y mudar la base de datos a una cuenta propia.

> Si no sabés programar, leé las secciones **1 a 5**. Con eso podés manejar todo el contenido del sitio.
> Si sos desarrollador/a, el resto del documento detalla toda la arquitectura.

---

## Índice

1. [Qué es este sitio](#1-qué-es-este-sitio)
2. [Páginas públicas](#2-páginas-públicas)
3. [Panel de administración (uso diario)](#3-panel-de-administración-uso-diario)
4. [Usuarios, roles, permisos e invitaciones](#4-usuarios-roles-permisos-e-invitaciones)
5. [Tareas frecuentes paso a paso](#5-tareas-frecuentes-paso-a-paso)
6. [Tecnologías utilizadas](#6-tecnologías-utilizadas)
7. [Estructura de carpetas y archivos](#7-estructura-de-carpetas-y-archivos)
8. [Cómo funciona por dentro (arquitectura)](#8-cómo-funciona-por-dentro-arquitectura)
9. [Base de datos](#9-base-de-datos)
10. [Seguridad](#10-seguridad)
11. [Archivos: fotos y videos](#11-archivos-fotos-y-videos)
12. [Diseño visual: colores, tipografías, modo oscuro](#12-diseño-visual-colores-tipografías-modo-oscuro)
13. [SEO, accesibilidad y rendimiento](#13-seo-accesibilidad-y-rendimiento)
14. [Instalación local (desarrollo)](#14-instalación-local-desarrollo)
15. [Variables de entorno](#15-variables-de-entorno)
16. [Cómo modificar el código (recetas)](#16-cómo-modificar-el-código-recetas)
17. [Publicar el sitio (hosting)](#17-publicar-el-sitio-hosting)
18. [Migrar la base de datos a un proyecto propio](#18-migrar-la-base-de-datos-a-un-proyecto-propio)
19. [Recomendación: seguir editando con Lovable o independizarse](#19-recomendación-seguir-editando-con-lovable-o-independizarse)
20. [Pruebas y control de calidad](#20-pruebas-y-control-de-calidad)
21. [Solución de problemas](#21-solución-de-problemas)
22. [Pendientes conocidos y mejoras sugeridas](#22-pendientes-conocidos-y-mejoras-sugeridas)
23. [Glosario](#23-glosario)

---

## 1. Qué es este sitio

Es el sitio institucional de la escuela. Tiene dos partes:

| Parte | Quién la usa | Dirección |
|---|---|---|
| **Sitio público** | Familias, estudiantes, comunidad. No requiere cuenta. | `/`, `/institucional`, `/avisos`, etc. |
| **Panel de administración** | Personal autorizado de la escuela. Requiere iniciar sesión. | `/admin` (se ingresa desde `/auth` o el botón **Acceso** del encabezado) |

**Todo el contenido** (avisos, eventos, materias, especialidades, capacitaciones, integrantes, autoridades, galería, datos de contacto, redes, y los **textos de todas las páginas**) se guarda en una base de datos y se edita desde el panel. No hace falta tocar código para mantener el sitio al día.

Características principales:

- Diseño moderno con azul institucional, blanco y acentos fríos; fotos protagonistas; animaciones suaves.
- **Modo oscuro** con botón en el encabezado.
- **Buscador global** en el encabezado (busca en avisos, materias, capacitaciones, eventos y especialidades).
- **Aviso urgente** de máxima prioridad: aparece en todas las páginas y se abre solo al entrar.
- **Botón de WhatsApp** flotante hacia el canal/grupo de difusión.
- Galería de **fotos y videos** con álbumes, filtros y visor con teclado.
- Páginas propias para cada especialidad, con **bolsa de trabajo y pasantías**.
- Formularios de **contacto** y **propuestas al Centro de Estudiantes** con protección anti‑spam.
- Panel con **roles**, **permisos por sección**, **invitaciones** y **auditoría** (registro de quién cambió qué).

---

## 2. Páginas públicas

| Dirección | Página | Contenido (de dónde sale) |
|---|---|---|
| `/` | Inicio | Portada con fotos interactivas, cifras institucionales, avisos destacados, próximos eventos, especialidades, llamado a inscripción. Textos: *Información del sitio → Inicio*. |
| `/institucional` | Institucional | Quiénes somos, Historia, orientaciones, equipo directivo (tabla `autoridades`), mapa y cómo llegar. |
| `/avisos` | Avisos | Lista de avisos publicados, filtros por categoría y fecha, destacados arriba. |
| `/calendario` | Calendario | Vista mensual y lista; filtro por tipo de actividad. |
| `/materias` | Materias | Selector por año y especialidad. Ciclo Básico (1° a 3°) y Superior (4° a 7°). |
| `/especialidades` | Especialidades | Listado de las tres especialidades (Informática/IPP primero). |
| `/especialidad/informatica`, `/especialidad/electronica`, `/especialidad/alimentos` | Página de cada especialidad | Presentación, qué se hace, salida laboral, fotos, oportunidades de trabajo/pasantías vigentes. Colores propios. |
| `/capacitaciones` | Capacitaciones | Cursos con quién los dicta, destinatarios, modalidad, estado; filtros. |
| `/centro-de-estudiantes` | Centro de Estudiantes | Integrantes, anuncios (avisos de categoría *centro-estudiantes*) y formulario de propuestas. |
| `/galeria` | Galería | Álbumes de fotos y videos, búsqueda, filtros, visor (flechas, teclado, Esc). |
| `/contacto` | Contacto | Datos de contacto, mapa y formulario. |
| `/auth` | Acceso | Inicio de sesión del personal y canje de invitaciones. |
| cualquier otra | 404 | Página "Se desconectó un cable" con buscador y botones. |

Elementos comunes a todas las páginas: encabezado fijo con buscador y modo oscuro, barra de progreso de lectura, botón "volver arriba", pie de página con datos de contacto y redes, botón de WhatsApp y aviso urgente (si hay).

---

## 3. Panel de administración (uso diario)

### 3.1 Cómo entrar

1. Ir a `https://<dominio>/auth` (o tocar **Acceso** arriba a la derecha).
2. Ingresar correo y contraseña.
3. Se abre `/admin`. A la izquierda está el menú; cada persona ve **solo las secciones que tiene permitidas**.

No existe registro público: solo pueden entrar cuentas creadas por un Super Admin (por invitación) o desde la base de datos.

### 3.2 Menú del panel

**Gestión del sitio**

| Opción | Qué se edita | Permiso necesario |
|---|---|---|
| Panel | Resumen: cantidad de avisos, eventos, capacitaciones, admins, mensajes. | cualquiera |
| Avisos | Título, fecha, categoría, destacado, **urgencia máxima**, publicado, resumen, cuerpo, imagen. | `avisos` |
| Calendario | Eventos: título, fecha, tipo, lugar, horario, descripción, publicado. | `calendario` |
| Materias | Materias por año, ciclo y especialidad; carga horaria; descripción. | `materias` |
| Especialidades y oportunidades | Textos y foto de cada especialidad; ofertas de **trabajo y pasantías** (con fecha de cierre opcional). | `materias` |
| Capacitaciones | Título, estado (próxima / en curso / finalizada), quién la dicta, destinatarios, modalidad, área, fecha, duración. | `capacitaciones` |
| Centro de Estudiantes | Integrantes (nombre, cargo, curso, foto) y propuestas recibidas. | `centro` |
| Galería | Álbumes, subida múltiple de fotos/videos desde la compu o el celular, orden, publicación. | `galeria` |
| Institucional | Autoridades / equipo directivo. | `institucional` |
| Categorías | Categorías de avisos, calendario, capacitaciones y galería (nombre, color, orden). | `configuracion` |
| Mensajes | Mensajes del formulario de contacto; marcar como leído. | `contacto` |
| Configuración | Enlace de WhatsApp, nombre de la escuela, lema, dirección, teléfono, correos, horarios, redes sociales. | `configuracion` |
| Administradores | Usuarios, roles, permisos, invitaciones. | `usuarios` (Super Admin) |
| Auditoría | Registro de cambios (quién, qué, cuándo). | `usuarios` |

**Información del sitio**

| Opción | Qué se edita |
|---|---|
| Textos de todas las páginas | Pestañas por página (Inicio, Institucional, Avisos, Calendario, Materias, Especialidades, Capacitaciones, Centro de Estudiantes, Galería, Contacto). Títulos, bajadas, párrafos, botones, cifras de la portada, Historia, Quiénes somos, Cómo llegar, etc. |

Reglas del editor de textos:

- Cada pestaña tiene su botón **Guardar**. El cambio se ve en el sitio al instante.
- Para separar párrafos, dejar **una línea en blanco**.
- Si un campo queda **vacío**, el sitio muestra el **texto original** (nunca queda una página en blanco).
- El botón **Original** junto a cada campo restaura el texto de fábrica.
- Algunos campos opcionales (por ejemplo "referencias del entorno") vienen vacíos: si se completan, aparecen; si no, se ocultan.

### 3.3 Datos generales (Configuración)

Se guardan en la tabla `configuracion_sitio`. Claves usadas por el sitio:

| Clave | Uso |
|---|---|
| `nombre_escuela` | Nombre oficial (encabezado, pie, portada). |
| `nombre_corto` | Nombre corto del encabezado (opcional; si no existe usa "Técnica 3 Avellaneda"). |
| `lema` | Lema institucional (pie de página). |
| `direccion` | Dirección (contacto, institucional, pie). |
| `telefono`, `email`, `email_centro` | Contacto. Si están vacíos no se muestran. |
| `horarios` | Horario de atención. |
| `instagram`, `facebook`, `youtube` | Redes (solo aparecen las que tienen enlace). |
| `whatsapp_difusion` | Enlace del canal/grupo. Debe empezar con `https://` y ser de `whatsapp.com`, `chat.whatsapp.com` o `wa.me`. Si está vacío, el botón no aparece. |
| `texto.*` | Textos de páginas (se manejan desde *Información del sitio*, no hace falta tocarlos a mano). |

---

## 4. Usuarios, roles, permisos e invitaciones

### Roles

| Rol | Qué puede hacer |
|---|---|
| **Super Admin** (`super_admin`) | Todo: todas las secciones, usuarios, invitaciones, permisos, configuración, auditoría. |
| **Admin de sección** (`admin_seccion`) | Solo las secciones que se le habilitan (por ejemplo, solo Avisos y Calendario). |

Secciones posibles (permisos): `avisos`, `calendario`, `materias`, `capacitaciones`, `centro`, `galeria`, `institucional`, `contacto`, `configuracion`, `usuarios`.

Los permisos **no se controlan solo en la pantalla**: la base de datos rechaza cualquier cambio que la persona no tenga permitido (ver [Seguridad](#10-seguridad)).

### Invitar a una persona

1. Panel → **Administradores** → crear invitación.
2. Elegir correo (opcional, restringe a quién la puede usar), rol y secciones.
3. Se genera un **código** / enlace con vencimiento. Enviárselo a la persona.
4. La persona entra a `/auth`, crea su cuenta / inicia sesión e ingresa el código. Queda con el rol y permisos de la invitación.
5. Las invitaciones se pueden **revocar** antes de usarse.

### Primer administrador

Si la base de datos no tiene ningún rol cargado, **el primer usuario que inicia sesión queda automáticamente como Super Admin** (función `reclamarSuperAdmin`). Después de eso, las demás cuentas solo obtienen permisos por invitación.

### Cambiar o desactivar a alguien

Panel → Administradores: cambiar rol, secciones, desactivar o eliminar.

### Recuperar acceso si nadie puede entrar

Con acceso a la base de datos (SQL), ejecutar:

```sql
-- buscar el id del usuario
select id, email from auth.users;
-- hacerlo super admin
insert into public.user_roles (user_id, role) values ('<UUID>', 'super_admin');
insert into public.permisos_seccion (user_id, seccion)
select '<UUID>', unnest(enum_range(null::public.seccion_sitio))
on conflict do nothing;
```

---

## 5. Tareas frecuentes paso a paso

**Publicar un aviso:** Panel → Avisos → Nuevo → completar título, categoría, resumen y cuerpo → marcar *Publicado* → Guardar. El "slug" (dirección del aviso) se genera solo.

**Aviso urgente que todos vean sí o sí:** al crear/editar el aviso marcar *Urgencia máxima* y *Publicado*. Aparece una franja roja en todas las páginas y una ventana que se abre al entrar. Para quitarlo, desmarcar *Urgencia máxima*.

**Destacar un aviso en Inicio:** marcar *Destacado* (Inicio muestra los 3 destacados más recientes).

**Agregar un evento:** Panel → Calendario → Nuevo → fecha, tipo, lugar, horarios.

**Subir fotos o videos:** Panel → Galería → elegir/crear álbum → subir (se pueden elegir varios archivos a la vez, también desde el celular). Máximo 50 MB por archivo. Marcar álbum y archivos como publicados.

**Cambiar la historia o cualquier texto de una página:** Panel → Información del sitio → Textos de todas las páginas → pestaña de la página → editar → Guardar.

**Cambiar las cifras de la portada (+50 años, etc.):** Información del sitio → Inicio → "Cifra 1..4".

**Cargar el enlace de WhatsApp:** Panel → Configuración → Difusión por WhatsApp → pegar enlace → Guardar.

**Publicar una pasantía o empleo:** Panel → Especialidades y oportunidades → Trabajo y pasantías → Nuevo → especialidad, tipo, organización, descripción, requisitos, enlace, fecha de cierre (opcional) → Publicado. Pasada la fecha de cierre deja de mostrarse sola.

**Agregar una categoría nueva (por ejemplo "Deportes" en avisos):** Panel → Categorías → Nuevo → nombre, "Se usa en", color.

**Ver qué cambió alguien:** Panel → Auditoría.

---

## 6. Tecnologías utilizadas

Todo es software libre y estándar; no hay dependencias propietarias en tiempo de ejecución.

| Capa | Tecnología | Para qué |
|---|---|---|
| Lenguaje | **TypeScript** 5 | Todo el código. |
| Interfaz | **React 19** | Componentes de la interfaz. |
| Framework | **TanStack Start v1** (`@tanstack/react-start`) | Renderizado en el servidor (SSR), funciones de servidor, rutas por archivos. |
| Rutas | **TanStack Router** (`@tanstack/react-router`) | Navegación; cada archivo en `src/routes` es una página. |
| Datos | **TanStack Query** (`@tanstack/react-query`) | Carga y caché de datos. |
| Compilador | **Vite** | Servidor de desarrollo y build. |
| Servidor de producción | **Nitro** | Empaqueta el servidor; por defecto apunta a *Cloudflare Workers*, pero puede generar Node, Vercel, Netlify, etc. |
| Estilos | **Tailwind CSS v4** (configurado en `src/styles.css`, sin `tailwind.config.js`) | Estilos y tokens de diseño. |
| Componentes base | **shadcn/ui** sobre **Radix UI** (`src/components/ui`) | Botones, diálogos, pestañas, selects, etc. accesibles. |
| Íconos | **lucide-react** | Íconos. |
| Notificaciones | **sonner** | Mensajes emergentes ("Guardado", errores). |
| Validación | **zod** | Validar formularios y datos en el servidor. |
| Backend | **Supabase** (PostgreSQL + Auth + Storage + API REST) | Base de datos, usuarios, archivos. |
| Cliente de base | `@supabase/supabase-js` | Comunicación con Supabase. |
| Calidad | ESLint + Prettier | Estilo de código. |

Tipografías: **Sora** (títulos) y **Manrope** (texto), cargadas desde Google Fonts en `src/routes/__root.tsx` con `display=swap`.

---

## 7. Estructura de carpetas y archivos

```text
.
├── README.md                 ← este manual
├── AGENTS.md                 ← reglas de arquitectura (breve)
├── SCHEMA.md                 ← resumen histórico del esquema (la referencia exacta es portable/01_schema.sql)
├── package.json              ← dependencias y scripts
├── vite.config.ts            ← configuración del compilador
├── tsconfig.json             ← TypeScript (alias "@/..." = src/...)
├── components.json           ← configuración de shadcn/ui
├── eslint.config.js, .prettierrc
├── public/                   ← archivos servidos tal cual: favicon, robots.txt, sitemap.xml, imágenes de ejemplo
├── portable/                 ← PAQUETE DE MIGRACIÓN DE LA BASE
│   ├── 01_schema.sql         ← estructura completa (tablas, funciones, RLS, permisos)
│   ├── 02_datos.sql          ← contenido actual del sitio
│   ├── 03_auth_y_storage.sql ← trigger de usuarios, bucket de archivos y sus políticas
│   └── MIGRACION.md          ← guía corta
├── supabase/
│   ├── config.toml           ← configuración del proyecto Supabase
│   └── migrations/           ← migraciones históricas
└── src/
    ├── router.tsx            ← crea el router y el QueryClient
    ├── start.ts              ← middlewares globales (errores, CSRF, token de sesión)
    ├── server.ts             ← punto de entrada del servidor (página de error amigable)
    ├── styles.css            ← TODO el diseño: tokens de color, tipografía, animaciones, estilos por página
    ├── routeTree.gen.ts      ← GENERADO AUTOMÁTICAMENTE, no editar
    ├── assets/               ← fotos del sitio (algunas como *.asset.json, ver §11)
    ├── routes/               ← PÁGINAS (una por archivo)
    │   ├── __root.tsx        ← esqueleto común: <head>, encabezado, pie, fuentes, precarga de configuración
    │   ├── index.tsx         ← Inicio
    │   ├── institucional.tsx, avisos.tsx, calendario.tsx, materias.tsx,
    │   ├── especialidades.tsx, especialidad.$slug.tsx, capacitaciones.tsx,
    │   ├── centro-de-estudiantes.tsx, galeria.tsx, contacto.tsx, auth.tsx
    │   └── _authenticated/   ← todo lo que exige sesión
    │       ├── route.tsx     ← "portero": si no hay sesión, manda a /auth
    │       ├── admin.tsx     ← marco del panel (menú lateral)
    │       └── admin.*.tsx   ← cada pantalla del panel
    ├── components/
    │   ├── ui/               ← componentes base (shadcn/ui)
    │   ├── site/             ← piezas del sitio público
    │   │   ├── header.tsx, footer.tsx, buscador-global.tsx, theme-toggle.tsx
    │   │   ├── portada-viva.tsx        ← portada interactiva de Inicio
    │   │   ├── encabezado-pagina.tsx   ← cabecera fotográfica de cada página interna
    │   │   ├── comunicacion-global.tsx ← aviso urgente + botón WhatsApp
    │   │   ├── experiencia.tsx         ← barra de progreso, volver arriba, transiciones
    │   │   ├── reveal.tsx              ← animación de aparición al hacer scroll
    │   │   ├── mapa-escuela.tsx, estado-ruta.tsx (errores/carga), no-encontrado.tsx (404)
    │   └── admin/
    │       ├── crud-seccion.tsx        ← tabla + formulario genérico usado por casi todo el panel
    │       ├── gestor-galeria.tsx      ← gestor de álbumes y subida de archivos
    │       ├── campo-imagen.tsx        ← campo para subir/elegir imagen
    │       └── configuracion-difusion.tsx ← enlace de WhatsApp
    ├── hooks/
    │   ├── use-sesion.ts     ← usuario actual, rol, permisos (puede("avisos"))
    │   ├── use-config.ts     ← datos generales (nombre, contacto, redes, WhatsApp)
    │   ├── use-textos.ts     ← textos editables de páginas: t("texto.inicio.portada_titulo")
    │   └── use-mobile.tsx
    ├── lib/
    │   ├── consultas.ts          ← "queryOptions" de cada lista pública (avisos, eventos, ...)
    │   ├── datos.functions.ts    ← funciones de servidor PÚBLICAS de lectura
    │   ├── datos.server.ts       ← consultas reales a la base (solo servidor)
    │   ├── formularios.functions.ts ← contacto y propuestas (validación + anti‑spam)
    │   ├── admin.functions.ts    ← usuarios, roles, invitaciones (requiere sesión)
    │   ├── textos-sitio.ts       ← CATÁLOGO de todos los textos editables y sus valores originales
    │   ├── contenido.ts          ← datos de respaldo (nombre, dirección...) y utilidades de fechas
    │   ├── identidad-especialidades.ts ← colores/fotos/clases por especialidad
    │   ├── media.ts, upload-media.ts   ← validación de archivos, subida y enlaces firmados
    │   ├── utils.ts, error-*.ts, lovable-error-reporting.ts
    │   └── *.test.ts             ← pruebas
    └── integrations/supabase/
        ├── client.ts         ← cliente del navegador (clave pública)
        ├── client.server.ts  ← cliente con privilegios (solo servidor)
        ├── auth-middleware.ts← verifica el token en funciones protegidas
        ├── auth-attacher.ts  ← adjunta el token de sesión a cada llamada
        ├── previewAuthStorage.ts ← guardado de sesión (ver §19)
        └── types.ts          ← tipos de la base (generados)
```

---

## 8. Cómo funciona por dentro (arquitectura)

```text
Navegador ──► Servidor (TanStack Start / Nitro)
   │              │  1. arma la página HTML (SSR) para SEO y velocidad
   │              │  2. ejecuta "loaders" que llaman a funciones de servidor
   │              ▼
   │          Funciones de servidor (createServerFn)
   │              │  - lecturas públicas con la clave pública (RLS aplica)
   │              │  - formularios: validan con zod, anti‑spam, insertan con privilegios
   │              │  - admin: verifican token y rol antes de actuar
   │              ▼
   └────────► Supabase (PostgreSQL + Auth + Storage)
                  - Row Level Security decide qué puede leer/escribir cada uno
```

### 8.1 Rutas por archivos
Cada archivo de `src/routes` es una dirección. `especialidad.$slug.tsx` = `/especialidad/:slug`. Los archivos dentro de `_authenticated/` exigen sesión (sin cambiar la URL). `routeTree.gen.ts` se regenera solo al guardar.

### 8.2 Carga de datos
Patrón usado en todas las páginas:

```ts
// src/lib/consultas.ts
export const consultaAvisos = queryOptions({ queryKey: ["avisos"], queryFn: () => listarAvisos() });

// en la ruta
loader: ({ context }) => context.queryClient.ensureQueryData(consultaAvisos),
// en el componente
const { data } = useSuspenseQuery(consultaAvisos);
```

`listarAvisos` es una función de servidor (`datos.functions.ts`) que llama a `datos.server.ts`, donde se consulta Supabase con la **clave pública** (las políticas RLS solo devuelven contenido publicado).

### 8.3 Textos editables
- `src/lib/textos-sitio.ts` contiene el **catálogo**: cada página, cada campo, su etiqueta y su texto original.
- Se guardan en `configuracion_sitio` con claves `texto.<pagina>.<campo>` y grupo `textos`.
- `__root.tsx` precarga toda la configuración en el servidor (loader raíz), para que la página llegue ya con los textos correctos (sin parpadeo).
- `useTextos()` devuelve `t(clave)`: valor guardado o, si está vacío, el original.
- `EncabezadoPagina` lee automáticamente `texto.<identidad>.volanta|titulo|descripcion`.
- La pantalla `admin.informacion.tsx` genera las pestañas y campos **a partir del catálogo**: agregar un campo al catálogo lo hace aparecer solo en el panel.

### 8.4 Sesión y panel
- El inicio de sesión usa **Supabase Auth** (correo + contraseña) desde `/auth`.
- `_authenticated/route.tsx` corre solo en el navegador y, si no hay usuario, redirige a `/auth`.
- `use-sesion.ts` obtiene el rol (`user_roles`) y las secciones (`permisos_seccion`) y expone `puede(seccion)` para mostrar/ocultar menús.
- Las pantallas del panel escriben **directo en la base con la sesión del usuario**; RLS valida el permiso en cada operación.
- Las operaciones sensibles (crear invitaciones, cambiar roles, listar usuarios) pasan por `admin.functions.ts`, que verifica el token (`requireSupabaseAuth`) y que la persona sea Super Admin antes de usar el cliente privilegiado.

### 8.5 Panel genérico (`crud-seccion.tsx`)
Casi todas las pantallas del panel son una configuración de `<CrudSeccion>`:

```tsx
<CrudSeccion
  tabla="eventos"
  titulo="Calendario"
  puedeEditar={sesion.puede("calendario")}
  ordenPor={{ columna: "fecha", asc: true }}
  campos={[
    { nombre: "titulo", etiqueta: "Título" },
    { nombre: "fecha", etiqueta: "Fecha", tipo: "fecha" },
    { nombre: "tipo_slug", etiqueta: "Tipo", categoria: "evento" },   // select con categorías
    { nombre: "publicado", etiqueta: "Publicado", tipo: "booleano", defecto: true },
    { nombre: "descripcion", etiqueta: "Descripción", tipo: "area", ocultarEnTabla: true },
  ]}
/>
```

Tipos de campo: texto (por defecto), `area`, `numero`, `fecha`, `booleano`, `select` (con `opciones`), `imagen`, `categoria` (lista desde la tabla `categorias`), `slugDesde` (genera la URL desde otro campo), `opcional`, `ayuda`, `defecto`. Registra cada alta/edición/baja en `auditoria`.

### 8.6 Formularios públicos
`formularios.functions.ts`: valida con zod (largos, formato de email), campo trampa oculto (*honeypot*) contra bots, límite de envíos por correo en una ventana de 60 s, e inserta con el cliente privilegiado en `mensajes_contacto` / `propuestas_centro`. **Hoy los mensajes se leen en el panel; no se envían por mail** (ver §22).

### 8.7 Middlewares (`src/start.ts`)
- `errorMiddleware`: si algo falla en el servidor, muestra una página de error en español con "Reintentar".
- `csrfMiddleware`: protege las funciones de servidor contra solicitudes de otros sitios.
- `attachSupabaseAuth`: agrega el token de la sesión a las llamadas a funciones protegidas.

---

## 9. Base de datos

PostgreSQL estándar (Supabase). La definición exacta y actualizada está en **`portable/01_schema.sql`**.

### Tablas

| Tabla | Contenido | Lectura pública |
|---|---|---|
| `avisos` | titulo, slug, resumen, cuerpo, categoria_slug, imagen_url/alt, destacado, **urgente**, publicado, fecha | solo publicados |
| `eventos` | titulo, descripcion, tipo_slug, fecha, hora_inicio/fin, lugar, publicado | solo publicados |
| `materias` | nombre, anio, ciclo (basico/superior), especialidad_slug, descripcion, carga_horaria, orden | sí |
| `especialidades` | slug, nombre, nombre_corto, descripcion, practicas, salida_laboral, imagen_url/alt, orden | sí |
| `oportunidades` | titulo, especialidad_slug, tipo (pasantia/empleo), organizacion, descripcion, requisitos, enlace, fecha_cierre, publicado | solo publicadas |
| `capacitaciones` | titulo, descripcion, dictada_por, destinatarios, modalidad, area_slug, estado, fecha_inicio, duracion, publicado | solo publicadas |
| `integrantes_centro` | nombre, cargo, curso, foto_url, orden | sí |
| `autoridades` | nombre, cargo, foto_url, orden | sí |
| `categorias` | tipo (aviso/evento/capacitacion/galeria), slug, nombre, color, orden | sí |
| `albumes` | slug, titulo, descripcion, categoria_slug, fecha, publicado | solo publicados |
| `fotos` | album_id → albumes, url (`storage:ruta` o URL), miniatura_url, alt, **tipo (foto/video)**, orden, publicado | publicadas de álbumes publicados |
| `configuracion_sitio` | clave (PK), valor, descripcion, grupo | sí |
| `mensajes_contacto` | nombre, email, telefono, asunto, mensaje, leido | no (solo permiso `contacto`) |
| `propuestas_centro` | nombre, curso, email, propuesta, leido | no (solo permiso `centro`) |
| `perfiles` | id (= usuario de Auth), email, nombre, activo | no |
| `user_roles` | user_id, role (`super_admin`/`admin_seccion`) | no |
| `permisos_seccion` | user_id, seccion | no |
| `invitaciones` | codigo, email, role, secciones[], expira_en, usada_por/en, revocada | no |
| `auditoria` | user_email, accion, entidad, entidad_id, detalle, fecha | no (no se puede editar ni borrar) |

### Tipos enumerados
- `app_role`: `super_admin`, `admin_seccion`
- `seccion_sitio`: `avisos`, `calendario`, `materias`, `capacitaciones`, `centro`, `galeria`, `institucional`, `contacto`, `configuracion`, `usuarios`
- `tipo_categoria`: `aviso`, `evento`, `capacitacion`, `galeria`

### Funciones
- `has_role(user, rol)` → ¿tiene ese rol?
- `es_admin(user)` → ¿tiene algún rol?
- `puede_editar(user, seccion)` → Super Admin, o admin con esa sección habilitada. **Es la base de todas las políticas de escritura.**
- `handle_new_user()` → crea el perfil al registrarse (trigger `on_auth_user_created` en `auth.users`).
- `set_updated_at()` → actualiza `updated_at` en cada modificación.

Todas las funciones de seguridad son `SECURITY DEFINER` con `search_path` fijo.

### Agregar una tabla nueva (receta)
Siempre en este orden, en la misma migración:

```sql
create table public.mi_tabla (
  id uuid primary key default gen_random_uuid(),
  titulo text not null default '',
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.mi_tabla to anon;                         -- solo si habrá lectura pública
grant select, insert, update, delete on public.mi_tabla to authenticated;
grant all on public.mi_tabla to service_role;
alter table public.mi_tabla enable row level security;
create policy "lectura publica" on public.mi_tabla for select using (publicado);
create policy "admin" on public.mi_tabla for all to authenticated
  using (public.puede_editar(auth.uid(), 'avisos'))
  with check (public.puede_editar(auth.uid(), 'avisos'));
create trigger trg_mi_tabla_updated before update on public.mi_tabla
  for each row execute function public.set_updated_at();
```

> Sin los `GRANT` la API responde "permission denied" aunque las políticas estén bien.
> Después de cambiar la base, regenerar los tipos: `npx supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts`.

---

## 10. Seguridad

- **Row Level Security activado en todas las tablas.** El público solo lee lo publicado; las escrituras exigen `puede_editar(...)` para la sección correspondiente.
- El navegador usa únicamente la **clave pública** (publishable/anon). La clave privilegiada (`SUPABASE_SERVICE_ROLE_KEY`) se usa solo dentro de funciones de servidor y se importa dentro del handler (`await import(...client.server)`), por lo que nunca llega al navegador.
- Funciones de administración verifican token y rol **en el servidor** antes de usar privilegios.
- Formularios: validación zod, honeypot, límite de frecuencia, largos máximos. Los mensajes no son legibles públicamente.
- Protección CSRF en funciones de servidor.
- Sin registro público: las cuentas sin rol no ven nada del panel ("Cuenta sin permisos").
- Archivos en un **bucket privado**: solo se entregan mediante enlaces firmados temporales (1 h) y únicamente si el archivo pertenece a contenido publicado.
- Auditoría inmutable (sin políticas de UPDATE/DELETE).
- Enlace de WhatsApp validado (solo `https` y dominios oficiales de WhatsApp).

Notas:
- El límite de frecuencia de los formularios se guarda en memoria del servidor; en plataformas "sin estado" (workers) es aproximado. Para un control estricto, guardarlo en una tabla o usar un CAPTCHA (Cloudflare Turnstile / hCaptcha).
- Recomendado activar en Supabase Auth: confirmación de correo, contraseñas robustas y protección contra contraseñas filtradas.

---

## 11. Archivos: fotos y videos

- **Subidos desde el panel** → bucket privado `galeria` de Supabase Storage, en carpetas `galeria/`, `especialidades/`, `avisos/`. En la base se guarda `storage:<ruta>`; al mostrarlos, `upload-media.ts` pide un **enlace firmado**. Límite: 50 MB por archivo.
- **También se aceptan URLs externas** (`https://...`) en los campos de imagen.
- **Fotos fijas del diseño** (portada, cabeceras) están en `src/assets/`. Algunas son archivos normales (`hero-escuela.jpg`) y otras son referencias `*.asset.json`, que contienen `{ "url": "https://..." }` apuntando a un almacenamiento externo de imágenes optimizadas (WebP). **Para independizarse por completo**, descargar cada URL de esos `.json`, guardar la imagen en `src/assets/` y cambiar el import, por ejemplo:

```ts
// antes
import aula from "@/assets/aula-informatica.webp.asset.json";  // uso: aula.url
// después
import aulaUrl from "@/assets/aula-informatica.webp";         // uso: aulaUrl
```

Comando útil para descargarlas todas:

```sh
for f in src/assets/*.asset.json; do
  url=$(node -e "console.log(require('./$f').url)"); out="${f%.asset.json}";
  curl -L "$url" -o "$out"; done
```

- Imágenes de ejemplo de la galería: `public/galeria/*.svg`.

---

## 12. Diseño visual: colores, tipografías, modo oscuro

Todo está en **`src/styles.css`**:

- **Tokens de color** (variables CSS) en `:root` (modo claro) y `.dark` (modo oscuro), en formato `oklch`: `--background`, `--foreground`, `--primary` (azul institucional), `--accent`, `--institutional`, `--success`, `--destructive`, `--editorial-coral`, `--editorial-lime`, `--editorial-violet`, `--chart-1..5`, etc. Luego `@theme` los expone a Tailwind como `bg-primary`, `text-accent`, etc.
- **Regla:** no usar colores fijos (`text-white`, `#123456`) en componentes; usar siempre tokens para que el modo oscuro funcione.
- **Cambiar el azul institucional:** editar `--primary` (y `--institutional`) en `:root` y `.dark`.
- **Colores por especialidad:** clases `.especialidad-informatica|electronica|alimentos` que definen `--specialty`, usadas con `text-specialty`, `bg-specialty`. Mapeo en `src/lib/identidad-especialidades.ts`.
- **Identidad por página:** `.pagina-editorial.identidad-<pagina>` y la cabecera fotográfica (`encabezado-pagina.tsx`, mapa `escenas`: foto y estilo de cada página).
- **Tipografías:** Sora (`--font-display`) y Manrope (`--font-sans`). Se cargan con `<link>` en `__root.tsx`. Para cambiarlas: cambiar el link de Google Fonts y las variables.
- **Contenedor único:** clase `.contenedor` (ancho máximo + márgenes laterales adaptables).
- **Modo oscuro:** `theme-toggle.tsx` agrega/quita la clase `dark` en `<html>` y lo recuerda en `localStorage`.
- **Animaciones:** `reveal.tsx` (aparecer al hacer scroll), `portada-viva.tsx` (portada con movimiento según el mouse), transiciones CSS. Todas se desactivan con `prefers-reduced-motion`.
- Preferencias de diseño a respetar: azul + blanco + acentos fríos; sin rayas ni cuadrículas decorativas; fotos protagonistas.

---

## 13. SEO, accesibilidad y rendimiento

- Cada página define en `head()` su `title`, `description`, Open Graph y Twitter Card, y `canonical`.
- Datos estructurados **Schema.org `EducationalOrganization`** en `src/routes/index.tsx`.
- `public/robots.txt` y `public/sitemap.xml`. **Al cambiar de dominio, actualizar ambos** (contienen la URL completa).
- Renderizado en servidor (los buscadores ven el contenido completo).
- Un solo `h1` por página, HTML semántico, textos alternativos, foco visible, navegación por teclado, contraste AA en ambos modos.
- Imágenes WebP con carga diferida (`loading="lazy"`), fuentes con `display=swap`.
- Panel con `noindex, nofollow`.

---

## 14. Instalación local (desarrollo)

Requisitos: **Node.js 20+** (o **Bun**), Git.

```sh
git clone <url-del-repositorio>
cd <carpeta>
npm install          # o: bun install
cp .env.example .env # si no existe, crear .env (ver §15)
npm run dev          # abre http://localhost:8080 (o el puerto que indique)
```

Scripts:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática. |
| `npm run build` | Compila para producción (carpeta `.output/` o `dist/` según destino). |
| `npm run preview` | Sirve localmente el build. |
| `npm run lint` | Revisa el código. |
| `npm run format` | Formatea el código. |
| `npx tsc --noEmit` | Verifica tipos. |
| `bun test src/lib` | Corre las pruebas. |

---

## 15. Variables de entorno

Archivo `.env` en la raíz (nunca subir la clave privilegiada al repositorio público):

```env
# Navegador (públicas)
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<clave pública / anon>
VITE_SUPABASE_PROJECT_ID=<ref>

# Servidor
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<clave pública / anon>
SUPABASE_PROJECT_ID=<ref>
SUPABASE_SERVICE_ROLE_KEY=<clave service_role>   # SOLO servidor; nunca con prefijo VITE_
```

Dónde se obtienen: en el panel de Supabase → *Project Settings → API*. En el hosting se cargan como variables de entorno del proyecto.

---

## 16. Cómo modificar el código (recetas)

**Agregar un texto editable nuevo**
1. En `src/lib/textos-sitio.ts`, agregar `{ clave: "texto.contacto.nota", etiqueta: "Nota al pie", defecto: "..." , largo: true }` en la página correspondiente.
2. En el componente: `const t = useTextos();` y `{t("texto.contacto.nota")}`.
3. Listo: aparece solo en *Información del sitio*.

**Agregar una página pública nueva** (por ejemplo `/inscripciones`)
1. Crear `src/routes/inscripciones.tsx`:
```tsx
import { createFileRoute } from "@tanstack/react-router";
import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
export const Route = createFileRoute("/inscripciones")({
  head: () => ({ meta: [
    { title: "Inscripciones — Técnica 3 Avellaneda" },
    { name: "description", content: "Cómo inscribirse..." },
    { property: "og:title", content: "Inscripciones — Técnica 3 Avellaneda" },
    { property: "og:description", content: "Cómo inscribirse..." },
  ]}),
  component: () => (
    <div className="pagina-editorial identidad-institucional">
      <EncabezadoPagina identidad="institucional" titulo="Inscripciones" descripcion="..." />
      <div className="contenedor py-12">...</div>
    </div>
  ),
});
```
2. Agregar el enlace en `src/components/site/header.tsx` y `footer.tsx`, y la URL en `public/sitemap.xml`.

**Agregar una sección al panel**
1. Crear la tabla (§9).
2. Crear `src/routes/_authenticated/admin.mi-seccion.tsx` con un `<CrudSeccion tabla="mi_tabla" ... />`.
3. Agregar el enlace en el arreglo `enlaces` de `src/routes/_authenticated/admin.tsx`.
4. Para mostrarlo en el sitio: función en `datos.server.ts` → `createServerFn` en `datos.functions.ts` → `queryOptions` en `consultas.ts` → `loader` + `useSuspenseQuery` en la página.

**Agregar una nueva sección de permisos:** `alter type public.seccion_sitio add value 'nueva';` y agregarla al `seccionEnum` de `admin.functions.ts` y a la pantalla de Administradores.

**Agregar una cuarta especialidad:** fila en `especialidades`, entrada en `src/lib/identidad-especialidades.ts` (color, foto, clase), clase CSS `.especialidad-<slug>` en `styles.css`, y opción en los `select` de `admin.especialidades.tsx`/`admin.materias.tsx`.

**Componentes de interfaz:** están en `src/components/ui` (shadcn/ui). Para agregar uno nuevo: `npx shadcn@latest add <componente>`.

**Convenciones:** alias `@/` = `src/`; nombres en español; colores solo con tokens; no editar `routeTree.gen.ts` ni `integrations/supabase/types.ts` a mano.

---

## 17. Publicar el sitio (hosting)

El build usa **Nitro**, que puede generar el servidor para distintos destinos. Por defecto: **Cloudflare Workers**.

- **Cloudflare Workers/Pages:** `npm run build` y desplegar `.output/` con `npx wrangler deploy` (o conectar el repo en Cloudflare). Cargar las variables de §15.
- **Node (VPS propio, Render, Railway):** construir con destino node: `NITRO_PRESET=node-server npm run build` y ejecutar `node .output/server/index.mjs` (puerto con `PORT`).
- **Vercel / Netlify:** `NITRO_PRESET=vercel` o `NITRO_PRESET=netlify` al construir (o conectar el repositorio; ambos detectan Nitro).

Después de publicar en un dominio nuevo:
1. Actualizar `public/sitemap.xml` y `public/robots.txt`.
2. En Supabase → *Authentication → URL Configuration*: poner el dominio como *Site URL* y en *Redirect URLs*.
3. Revisar que `og:url`/canonical sean correctos.

> Importante: es un sitio con servidor (SSR + funciones de servidor). No alcanza con subir archivos estáticos.

---

## 18. Migrar la base de datos a un proyecto propio

Todo el backend es Supabase estándar. El paquete `portable/` contiene todo lo necesario.

1. Crear una cuenta y un proyecto en https://supabase.com.
2. En **SQL Editor**, ejecutar en orden:
   1. `portable/01_schema.sql` — estructura, funciones, permisos y políticas.
   2. `portable/02_datos.sql` — contenido del sitio.
   3. `portable/03_auth_y_storage.sql` — trigger de perfiles, bucket `galeria` privado y sus políticas.
3. **Crear el usuario admin:** *Authentication → Users → Add user* (correo + contraseña, marcado como confirmado). Luego ejecutar el bloque comentado al final de `03_auth_y_storage.sql` con su UUID (o simplemente iniciar sesión primero: el primer usuario sin roles en la base se convierte en Super Admin).
4. **Copiar archivos subidos** (fotos/videos del bucket `galeria`): descargarlos del proyecto anterior y subirlos al nuevo bucket con **las mismas rutas** (por ejemplo con la CLI de Supabase `supabase storage cp` o con un script que use `supabase.storage.from('galeria').download/upload`). Las filas de la base ya apuntan a `storage:<ruta>`.
5. Configurar las variables de entorno (§15) con los datos del proyecto nuevo y volver a publicar.
6. Regenerar tipos si cambió algo: `npx supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts`.
7. Verificar: el sitio muestra contenido, login en `/auth`, alta/edición en el panel, subida de una foto, formulario de contacto.

> Las contraseñas de usuarios no se pueden exportar: cada administrador se vuelve a crear (o se invita) en el proyecto nuevo.
> Los datos personales (mensajes, propuestas, auditoría, usuarios) no están incluidos en `02_datos.sql` a propósito. Si se necesitan, exportarlos aparte con `pg_dump --data-only -t public.mensajes_contacto ...`.

Exportar la base actual completa en cualquier momento (con la cadena de conexión de Postgres):

```sh
pg_dump --schema-only --schema=public --no-owner "$DATABASE_URL" > 01_schema.sql
pg_dump --data-only --schema=public --inserts --column-inserts --no-owner "$DATABASE_URL" > 02_datos.sql
```

---

## 19. Recomendación: seguir editando con Lovable o independizarse

### Opción A — Seguir modificándolo con Lovable (lo más fácil sin programar)

Lovable (https://lovable.dev) es un editor con asistente de IA que permite modificar este proyecto pidiendo los cambios en lenguaje natural ("agregá una página de inscripciones", "cambiá el color de los botones") y ver el resultado al instante.

1. Ingresar a Lovable con la cuenta que tiene acceso al proyecto (o pedir que te inviten como colaborador/a).
2. Abrir el proyecto, escribir el pedido en el chat y revisar la vista previa.
3. **Publish → Publish changes** para que los cambios de código salgan al sitio publicado. (Los cambios de contenido hechos desde el panel `/admin` no necesitan publicar: son inmediatos.)
4. Si el repositorio está conectado a GitHub, cada cambio queda guardado ahí también, y lo que se suba a GitHub vuelve a Lovable.
5. Si el proyecto usa la base gestionada por Lovable (Lovable Cloud), los datos se administran desde el propio editor (sección Cloud/Base de datos).

Consejos: pedir cambios de a uno y concretos; adjuntar capturas; decirle qué **no** debe tocar (login, permisos, formularios).

### Opción B — Sacarlo del ecosistema Lovable (100 % independiente)

Se revisó el código: **el sitio no depende de Lovable para funcionar**. Todo es React + TanStack Start + Vite + Supabase estándar. Solo hay piezas de conveniencia que conviene reemplazar:

| Pieza | Qué es | Qué hacer |
|---|---|---|
| `@lovable.dev/vite-tanstack-config` (en `devDependencies` y `vite.config.ts`) | Atajo que arma la configuración de Vite (TanStack Start, React, Tailwind, alias `@`, Nitro). | Reemplazar `vite.config.ts` por la configuración estándar de abajo y desinstalar el paquete. |
| `src/integrations/supabase/previewAuthStorage.ts` | Guarda la sesión de forma especial **solo** cuando se ve dentro del editor de Lovable; en cualquier otro dominio usa `localStorage` normal. | Opcional. Para limpiarlo: en `client.ts` cambiar `storage: brokeredPreviewStorage()` por `storage: typeof window !== "undefined" ? window.localStorage : undefined` y borrar el import y el archivo. |
| `src/lib/lovable-error-reporting.ts` (usado en `__root.tsx`) | Envía errores al editor si existe; fuera de Lovable no hace nada. | Opcional. Borrar el import y la llamada `reportLovableError(...)` en `__root.tsx`, o reemplazar por Sentry u otro servicio. |
| Archivos `src/assets/*.asset.json` | Fotos alojadas en un almacenamiento externo. | Descargarlas y usarlas como archivos locales (ver §11). |
| Base de datos en Lovable Cloud | Es un proyecto Supabase administrado. | Migrar a un Supabase propio con §18. |
| `.lovable/`, `AGENTS.md`, `roadmap.md` | Notas internas del editor. | Se pueden borrar sin efecto. |
| Mención en `supabase/client*.ts` ("Connect Supabase in Lovable Cloud") | Solo un texto de error. | Se puede cambiar el mensaje. |

**`vite.config.ts` estándar** (reemplazo):

```ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: { port: 8080 },
  plugins: [
    tsConfigPaths(),
    tanstackStart({ server: { entry: "server" } }),
    nitro(),            // destino: variable NITRO_PRESET (node-server, cloudflare-module, vercel, netlify...)
    viteReact(),
    tailwindcss(),
  ],
});
```

Luego:

```sh
npm uninstall @lovable.dev/vite-tanstack-config
npm install
npm run build   # verificar que compila
npm run dev     # verificar navegación, login y panel
```

(Si alguna versión futura de los paquetes cambia nombres de import, consultar la documentación oficial de TanStack Start → "Hosting" y de Nitro.)

**Pasos completos para independizarse:**
1. Tener el código: conectar GitHub desde Lovable (Settings → GitHub) o descargar el código; clonar el repositorio.
2. Migrar la base a un Supabase propio (§18) y copiar los archivos del bucket.
3. Descargar las imágenes `*.asset.json` (§11).
4. Reemplazar `vite.config.ts` y limpiar las piezas opcionales de la tabla.
5. Cargar las variables de entorno (§15) en el hosting elegido y publicar (§17).
6. Configurar el dominio y las URL de Auth en Supabase; actualizar sitemap y robots.

---

## 20. Pruebas y control de calidad

- Pruebas unitarias en `src/lib/*.test.ts` (validación de archivos y enlaces de WhatsApp, avisos urgentes, vigencia de oportunidades, catálogo de textos). Ejecutar: `bun test src/lib` (o `node --test` con un cargador de TypeScript).
- Antes de publicar cambios grandes, revisar manualmente: tamaños de 360, 768, 1024 y 1440 px, modo claro y oscuro, login, una edición en el panel, subir una foto, enviar el formulario de contacto, el buscador y el calendario.

---

## 21. Solución de problemas

| Problema | Causa probable / solución |
|---|---|
| "permission denied for table ..." | Falta un `GRANT` en la tabla (§9). |
| Se guarda en el panel pero da error "new row violates row-level security" | La cuenta no tiene permiso para esa sección: revisar Administradores. |
| Puedo entrar pero veo "Cuenta sin permisos" | La cuenta no tiene rol: invitarla o asignar rol por SQL (§4). |
| No aparece el botón de WhatsApp | El enlace está vacío o no es de WhatsApp/https. |
| Las fotos de la galería no cargan | El álbum o la foto no están *Publicados*, o falta el archivo en el bucket (tras migrar). |
| Cambié un texto y no se ve | Verificar que se tocó **Guardar** en esa pestaña; recargar la página. Si el campo quedó vacío se muestra el original. |
| `Missing Supabase environment variable(s)` | Faltan variables de §15. |
| `Expected 3 parts in JWT` | Se creó un cliente propio con clave nueva `sb_...`: usar los clientes de `src/integrations/supabase`, que ya la manejan. |
| Error de tipos con `FileRoutesByPath` | Se enlaza a una ruta que no existe: crear el archivo en `src/routes`. |
| No llegan mails | Hoy no se envían mails: los mensajes se ven en Panel → Mensajes / Centro (§22). |
| Login redirige siempre a /auth en otro dominio | Configurar Site URL y Redirect URLs en Supabase Auth. |

---

## 22. Pendientes conocidos y mejoras sugeridas

- **Contenido real:** reemplazar los datos de ejemplo (teléfono, correos, redes, autoridades, integrantes, fotos, historia oficial).
- **Envío de mails** de contacto/propuestas: agregar un servicio (Resend, SendGrid, SMTP) en `formularios.functions.ts` después del `insert`, con la clave como variable de entorno del servidor.
- **Anti‑spam más fuerte:** CAPTCHA (Turnstile/hCaptcha) y límite de frecuencia persistente en base.
- **Dominio propio** y actualización de sitemap/robots.
- **Atajo Ctrl+K** en el buscador, contadores animados en las cifras y esqueletos de carga en más listas.
- Ideas: página de inscripciones con requisitos y fechas, preguntas frecuentes, descargas (formularios, calendario escolar en PDF), calendario suscribible (iCal), accesos a plataformas educativas, política de privacidad.

---

## 23. Glosario

- **Panel / admin:** zona privada para editar contenido (`/admin`).
- **Publicado / borrador:** solo lo publicado se ve en el sitio.
- **Slug:** parte de la dirección web de un elemento (`/especialidad/informatica`).
- **RLS (Row Level Security):** reglas de la base que deciden quién puede leer o modificar cada fila.
- **SSR:** el servidor arma la página antes de enviarla (mejor para buscadores y velocidad).
- **Función de servidor:** código que corre solo en el servidor (seguro para claves).
- **Bucket:** "carpeta" de archivos en Supabase Storage.
- **Token / sesión:** prueba de que iniciaste sesión, que se envía en cada operación protegida.
- **Clave pública vs. service_role:** la pública puede estar en el navegador (RLS la limita); la service_role salta todas las reglas y solo debe usarse en el servidor.
