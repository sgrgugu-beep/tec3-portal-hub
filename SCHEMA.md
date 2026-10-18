# Esquema de base de datos — Técnica 3 Avellaneda

El esquema está aplicado en Lovable Cloud. Las consultas públicas usan funciones
del servidor y políticas de lectura; el panel usa la sesión y los permisos por sección.
El paquete `portable` conserva el esquema inicial para migración a una base propia.
Las ampliaciones posteriores están en `drizzle/migrations` y deben aplicarse también.

## Convenciones

## Galería multimedia y especialidades

- `fotos`: incorpora `tipo` (`foto` o `video`) y `publicado`. El panel acepta JPG, PNG,
  WebP, MP4 y WebM, hasta 50 MB por archivo. Videos usan controles nativos, sin reproducción automática en la cuadrícula.
- `albumes`: el panel elige por nombre; no requiere copiar identificadores. Un álbum
  oculto no expone sus fotos ni sus archivos a visitantes.
- Bucket `galeria`: privado, por política del workspace. `url` guarda `storage:ruta`;
  las lecturas autorizadas generan enlaces firmados. Las fotos proporcionadas por
  chat usan sus referencias CDN. La escritura respeta permisos de `galeria`, `materias`
  o `avisos` según la carpeta correspondiente.
- `especialidades`: agrega `imagen_url`, `imagen_alt` y `practicas`. Las páginas
  `/especialidad/informatica`, `/especialidad/electronica`, `/especialidad/alimentos`
  consumen esos campos sin modificar la estructura curricular.
- `oportunidades`: `id`, `titulo`, `especialidad_slug`, `tipo` (`pasantia`/`empleo`),
  `organizacion`, `descripcion`, `requisitos`, `enlace`, `fecha_cierre`, `publicado`,
  `created_at`, `updated_at`. Lectura pública solo publicada; cierre inclusive.
  Gestión vinculada al permiso `materias`. No se inventan vacantes para rellenar.
- `avisos.urgente`: publicado y urgente muestra una franja global y abre un aviso
  completo al entrar. Tras reconocerlo, la franja permanece visible.
- `configuracion_sitio.whatsapp_difusion`: enlace HTTPS de WhatsApp, vacío por defecto;
  oculta el botón cuando aún no hay enlace real.

- `uuid` como clave primaria (`gen_random_uuid()`, extensión `pgcrypto`, estándar).
- `timestamptz` para auditoría (`creado_en`, `actualizado_en`).
- RLS activada en todas las tablas: lectura pública sólo de filas publicadas,
  escritura restringida por rol.
- Roles en tabla aparte (`admin_roles`), nunca en la tabla de perfiles, y verificados
  mediante función `security definer` para evitar recursión en las políticas.

## Tablas

| Tabla | Propósito | Campos principales |
| --- | --- | --- |
| `perfiles` | Datos del usuario admin (1:1 con `auth.users`) | `id` (FK a usuarios), `nombre`, `activo` |
| `admin_roles` | Rol de cada admin | `user_id`, `rol` (`super_admin` \| `admin_seccion`) |
| `permisos_seccion` | Secciones habilitadas por usuario | `user_id`, `seccion` |
| `categorias` | Categorías configurables | `slug`, `nombre`, `ambito` (`avisos`, `calendario`, `capacitaciones`, `galeria`) |
| `avisos` | Avisos institucionales, familias, centro de estudiantes | `slug`, `titulo`, `resumen`, `cuerpo`, `categoria_id`, `fecha`, `destacado`, `estado`, `imagen_url` |
| `eventos` | Calendario | `slug`, `titulo`, `categoria_id`, `fecha`, `horario`, `lugar`, `descripcion` |
| `especialidades` | Las tres orientaciones del ciclo superior | `slug`, `nombre`, `resumen`, `salida_laboral` |
| `materias` | Estructura curricular | `slug`, `nombre`, `anio`, `ciclo`, `especialidad_id`, `carga_horaria`, `descripcion` |
| `capacitaciones` | Cursos y capacitaciones | `titulo`, `descripcion`, `dicta`, `destinatarios`, `modalidad`, `fecha`, `duracion`, `area`, `estado` |
| `centro_integrantes` | Integrantes del Centro de Estudiantes | `nombre`, `rol`, `curso`, `foto_url`, `orden` |
| `albumes` | Álbumes de la galería | `slug`, `titulo`, `categoria_id`, `descripcion` |
| `fotos` | Fotos de cada álbum | `album_id`, `url`, `miniatura_url`, `alt`, `orden` |
| `autoridades` | Equipo directivo | `nombre`, `cargo`, `orden` |
| `configuracion_sitio` | Datos de contacto, textos institucionales y SEO editables | `clave`, `valor` (jsonb) |
| `mensajes_contacto` | Mensajes del formulario público | `nombre`, `email`, `asunto`, `mensaje`, `ip_hash`, `creado_en` |
| `propuestas_centro` | Propuestas al Centro de Estudiantes | `nombre`, `email`, `curso`, `mensaje`, `creado_en` |
| `invitaciones_admin` | Invitaciones por link/código | `email`, `rol`, `token`, `expira_en`, `usada_en`, `revocada` |
| `auditoria` | Trazabilidad de cambios | `user_id`, `accion`, `tabla`, `registro_id`, `datos` (jsonb), `creado_en` |

## Política de acceso (resumen)

- **Público (`anon`)**: `SELECT` en `avisos`, `eventos`, `materias`, `especialidades`,
  `capacitaciones`, `centro_integrantes`, `albumes`, `fotos`, `autoridades`,
  `categorias` y `configuracion_sitio`, filtrando por `estado = 'publicado'` donde
  corresponda. `INSERT` en `mensajes_contacto` y `propuestas_centro` sólo a través de
  funciones del lado servidor con validación y rate limiting.
- **Admin de sección (`authenticated`)**: `INSERT/UPDATE/DELETE` sobre las tablas de
  las secciones habilitadas en `permisos_seccion`.
- **Super Admin**: acceso total, incluyendo `categorias`, `admin_roles`,
  `permisos_seccion`, `invitaciones_admin`, `configuracion_sitio` y `auditoria`.
- Nunca se expone la clave `service_role` en el frontend; el cliente usa sólo la clave
  pública protegida por RLS.

## Función de verificación de rol (portable)

```sql
create or replace function public.tiene_rol(_user_id uuid, _rol text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_roles where user_id = _user_id and rol = _rol
  );
$$;
```

## Estado actual y próximos pasos

1. Conectar el proyecto de Supabase propio y activar la integración de GitHub.
2. Aplicar el esquema de este documento con `CREATE TABLE` + `GRANT` + `ENABLE ROW
   LEVEL SECURITY` + `CREATE POLICY` (en ese orden) y cargar el contenido de ejemplo.
3. Reemplazar las funciones de `src/lib/contenido.ts` por consultas a la base.
4. Implementar Supabase Auth, panel `/admin`, roles, invitaciones y auditoría.
5. Mover el envío de mails de contacto y propuestas a Edge Functions con la dirección
   de destino guardada como secreto del servidor.
