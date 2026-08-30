import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/avisos")({
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
        { nombre: "categoria_slug", etiqueta: "Categoría (slug)", defecto: "institucional" },
        { nombre: "destacado", etiqueta: "Destacado", tipo: "booleano" },
        { nombre: "publicado", etiqueta: "Publicado", tipo: "booleano" },
        { nombre: "slug", etiqueta: "Slug (URL)", ocultarEnTabla: true },
        { nombre: "resumen", etiqueta: "Resumen", tipo: "area", ocultarEnTabla: true },
        { nombre: "cuerpo", etiqueta: "Cuerpo", tipo: "area", ocultarEnTabla: true },
        { nombre: "imagen_url", etiqueta: "Imagen (URL)", ocultarEnTabla: true },
        { nombre: "imagen_alt", etiqueta: "Texto alternativo", ocultarEnTabla: true },
      ]}
    />
  );
}
