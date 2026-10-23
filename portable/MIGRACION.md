# Migración a un proyecto propio de Supabase

Ejecutar en el SQL Editor de un proyecto nuevo, en este orden:

1. `01_schema.sql` — estructura completa (tablas, enums, funciones, triggers, GRANTs, RLS, políticas).
2. `02_datos.sql` — contenido del sitio (sin usuarios ni datos personales).
3. `03_auth_y_storage.sql` — trigger de perfiles, bucket privado `galeria` y sus políticas, y bloque para el primer Super Admin.

La guía completa (variables, archivos, hosting, independencia total) está en el README, secciones 15 a 19.
