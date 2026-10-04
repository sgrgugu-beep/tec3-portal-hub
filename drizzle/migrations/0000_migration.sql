UPDATE public.avisos SET categoria_slug = 'institucional' WHERE categoria_slug IN ('institucionales','IMPORTANTE');
UPDATE public.avisos SET categoria_slug = 'centro' WHERE categoria_slug = 'centro-estudiantes';
UPDATE public.especialidades SET slug = 'informatica' WHERE slug = 'ipp';
INSERT INTO public.categorias (tipo, slug, nombre, orden) VALUES ('evento','jornada','Jornada',5) ON CONFLICT (tipo, slug) DO NOTHING;
DELETE FROM public.eventos WHERE titulo = 'Prueba evento' AND fecha = '2026-11-10';