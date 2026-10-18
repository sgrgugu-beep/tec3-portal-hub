import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/avisos")({
  head: () => ({ meta: [{ title: "Administrar avisos — Técnica 3 Avellaneda" }, { name: 'description', content: "Administrar avisos de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:title', content: "Administrar avisos — Técnica 3 Avellaneda" }, { property: 'og:description', content: "Administrar avisos de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' }] }),

  component: AdminAvisos,
});

function AdminAvisos() {
  const sesion = useSesion();
  return (
    <CrudSeccion
      tabla="avisos"
      titulo="Avisos"
      descripcion="Novedades institucionales, para las familias y del centro de estudiantes."
      puedeEditar={sesion.puede("avisos")}
      ordenPor={{ columna: "fecha", asc: false }}
      campos={[
        { nombre: "titulo", etiqueta: "Título" },
        { nombre: "fecha", etiqueta: "Fecha", tipo: "fecha" },
        { nombre: "categoria_slug", etiqueta: "Categoría", defecto: "institucional", categoria: "aviso" },
        { nombre: "destacado", etiqueta: "Destacado", tipo: "booleano" },
        { nombre: 'urgente', etiqueta: 'Urgencia máxima', tipo: 'booleano', ayuda: 'Al publicarlo, aparece en todas las páginas y al entrar se abre completo.' },
        { nombre: "publicado", etiqueta: "Publicado", tipo: "booleano" },
        { nombre: "slug", etiqueta: "Slug (URL)", ocultarEnTabla: true, slugDesde: "titulo" },
        { nombre: "resumen", etiqueta: "Resumen", tipo: "area", ocultarEnTabla: true },
        { nombre: "cuerpo", etiqueta: "Cuerpo", tipo: "area", ocultarEnTabla: true },
        { nombre: "imagen_url", etiqueta: "Imagen", tipo:'imagen', ocultarEnTabla: true },
        { nombre: "imagen_alt", etiqueta: "Texto alternativo", ocultarEnTabla: true },
      ]}
    />
  );
}
