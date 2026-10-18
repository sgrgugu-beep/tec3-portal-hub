import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/calendario")({
  head: () => ({ meta: [{ title: "Administrar calendario — Técnica 3 Avellaneda" }, { name: 'description', content: "Administrar calendario de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:title', content: "Administrar calendario — Técnica 3 Avellaneda" }, { property: 'og:description', content: "Administrar calendario de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' }] }),

  component: AdminCalendario,
});

function AdminCalendario() {
  const sesion = useSesion();
  return (
    <CrudSeccion
      tabla="eventos"
      titulo="Calendario"
      descripcion="Actos, reuniones, exámenes y actividades especiales."
      puedeEditar={sesion.puede("calendario")}
      ordenPor={{ columna: "fecha", asc: true }}
      campos={[
        { nombre: "titulo", etiqueta: "Título" },
        { nombre: "fecha", etiqueta: "Fecha", tipo: "fecha" },
        { nombre: "tipo_slug", etiqueta: "Tipo", defecto: "acto", categoria: "evento" },
        { nombre: "lugar", etiqueta: "Lugar" },
        { nombre: "publicado", etiqueta: "Publicado", tipo: "booleano", defecto: true },
        { nombre: "hora_inicio", etiqueta: "Hora de inicio", ocultarEnTabla: true },
        { nombre: "hora_fin", etiqueta: "Hora de fin", ocultarEnTabla: true },
        { nombre: "descripcion", etiqueta: "Descripción", tipo: "area", ocultarEnTabla: true },
      ]}
    />
  );
}
