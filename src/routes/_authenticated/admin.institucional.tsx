import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/institucional")({
  head: () => ({ meta: [{ title: "Administrar información institucional — Técnica 3 Avellaneda" }, { name: 'description', content: "Administrar información institucional de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:title', content: "Administrar información institucional — Técnica 3 Avellaneda" }, { property: 'og:description', content: "Administrar información institucional de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' }] }),

  component: AdminInstitucional,
});

function AdminInstitucional() {
  const sesion = useSesion();
  return (
    <CrudSeccion
      tabla="autoridades"
      titulo="Autoridades"
      descripcion="Equipo directivo que se muestra en la sección Institucional."
      puedeEditar={sesion.puede("institucional")}
      ordenPor={{ columna: "orden", asc: true }}
      campos={[
        { nombre: "nombre", etiqueta: "Nombre" },
        { nombre: "cargo", etiqueta: "Cargo" },
        { nombre: "orden", etiqueta: "Orden", tipo: "numero" },
        { nombre: "foto_url", etiqueta: "Foto (URL)", ocultarEnTabla: true },
      ]}
    />
  );
}
