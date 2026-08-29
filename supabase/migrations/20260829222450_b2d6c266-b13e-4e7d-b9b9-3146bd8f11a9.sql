REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.puede_editar(uuid, public.seccion_sitio) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.es_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.puede_editar(uuid, public.seccion_sitio) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.es_admin(uuid) TO authenticated, service_role;