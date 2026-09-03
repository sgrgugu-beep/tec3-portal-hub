# Migración a tu propio proyecto de Supabase

Todo el backend de este sitio es Supabase estándar (PostgreSQL + Auth + RLS). No hay
nada exclusivo de Lovable en la base de datos: por eso se puede mover entero con estos
dos archivos SQL.

## Contenido

- `01_schema.sql` — esquema completo: tipos enum, tablas, GRANTs, RLS, políticas,
  funciones (`has_role`, `puede_editar`, `es_admin`, `handle_new_user`, `set_updated_at`)
  y triggers.
- `02_datos.sql` — todo el contenido actual (avisos, eventos, materias, capacitaciones,
  integrantes, autoridades, álbumes, fotos, categorías y configuración del sitio).

## Pasos

1. Crear un proyecto nuevo en https://supabase.com (tu cuenta, tu dashboard).
2. En el SQL Editor del proyecto nuevo, ejecutar `01_schema.sql` y después `02_datos.sql`.
3. Crear tu usuario admin en Authentication → Users (email + contraseña, confirmado).
   El trigger `on_auth_user_created` crea el perfil automáticamente.
4. Promoverlo a super admin con su UUID:

   ```sql
   insert into public.user_roles (user_id, role) values ('<UUID>', 'super_admin');
   insert into public.permisos_seccion (user_id, seccion)
   select '<UUID>', unnest(enum_range(null::seccion_sitio));
   ```

5. Apuntar el frontend al proyecto nuevo. Variables de entorno:

   ```
   VITE_SUPABASE_URL=https://<ref>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<anon/publishable key>
   SUPABASE_URL=https://<ref>.supabase.co
   SUPABASE_PUBLISHABLE_KEY=<anon/publishable key>
   SUPABASE_SERVICE_ROLE_KEY=<service role key>   # solo servidor
   ```

   Dentro de Lovable esto se hace conectando tu proyecto en **Connectors → Supabase**.
   Fuera de Lovable (`git clone` del repo + `bun install`) basta con un `.env` con esos valores.

6. Verificar: sitio público, login en `/auth`, y CRUD del panel `/admin`.

## Notas de portabilidad

- Solo SQL estándar de PostgreSQL + extensiones que Supabase trae por defecto.
- El service role key nunca se usa en el cliente; el frontend solo usa la publishable key con RLS.
- La lógica sensible vive en server functions (`src/lib/*.functions.ts`), equivalentes a
  Edge Functions y portables a cualquier runtime Node/Vite.
