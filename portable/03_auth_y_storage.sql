-- =====================================================================
-- Técnica 3 Avellaneda — AUTENTICACIÓN Y ALMACENAMIENTO
-- Ejecutar DESPUÉS de 01_schema.sql y 02_datos.sql, en un proyecto Supabase.
-- (Requiere los esquemas "auth" y "storage" que trae Supabase.)
-- =====================================================================

-- 1) Crear perfil automáticamente cuando se registra un usuario en Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2) Bucket PRIVADO para fotos y videos (límite 50 MB por archivo)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('galeria', 'galeria', false, 52428800)
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 52428800;

-- 3) Políticas del bucket
DROP POLICY IF EXISTS galeria_published_read ON storage.objects;
CREATE POLICY galeria_published_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'galeria' AND (
      EXISTS (SELECT 1 FROM public.fotos f JOIN public.albumes a ON a.id = f.album_id
              WHERE f.url = 'storage:' || objects.name AND f.publicado AND a.publicado)
      OR EXISTS (SELECT 1 FROM public.especialidades e WHERE e.imagen_url = 'storage:' || objects.name)
      OR EXISTS (SELECT 1 FROM public.avisos av WHERE av.imagen_url = 'storage:' || objects.name AND av.publicado)
    )
  );

DROP POLICY IF EXISTS galeria_admin_select ON storage.objects;
CREATE POLICY galeria_admin_select ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'galeria' AND (
      public.puede_editar(auth.uid(), 'galeria') OR
      public.puede_editar(auth.uid(), 'materias') OR
      public.puede_editar(auth.uid(), 'avisos')
    )
  );

DROP POLICY IF EXISTS galeria_admin_insert ON storage.objects;
CREATE POLICY galeria_admin_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'galeria' AND (
      (name LIKE 'galeria/%' AND public.puede_editar(auth.uid(), 'galeria')) OR
      (name LIKE 'especialidades/%' AND public.puede_editar(auth.uid(), 'materias')) OR
      (name LIKE 'avisos/%' AND public.puede_editar(auth.uid(), 'avisos'))
    )
  );

DROP POLICY IF EXISTS galeria_admin_delete ON storage.objects;
CREATE POLICY galeria_admin_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'galeria' AND (
      (name LIKE 'galeria/%' AND public.puede_editar(auth.uid(), 'galeria')) OR
      (name LIKE 'especialidades/%' AND public.puede_editar(auth.uid(), 'materias')) OR
      (name LIKE 'avisos/%' AND public.puede_editar(auth.uid(), 'avisos'))
    )
  );

-- 4) Promover al primer Super Admin (reemplazar el UUID por el del usuario
--    creado en Authentication → Users). Descomentar y ejecutar:
-- INSERT INTO public.user_roles (user_id, role) VALUES ('<UUID>', 'super_admin');
-- INSERT INTO public.permisos_seccion (user_id, seccion)
--   SELECT '<UUID>', unnest(enum_range(NULL::public.seccion_sitio));
