import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/galeria")({
  component: AdminGaleria,
});

function AdminGaleria() {
  const sesion = useSesion();
  const puede = sesion.puede("galeria");
  return (
    <div className="space-y-12">
      <CrudSeccion
        tabla="albumes"
        titulo="Álbumes"
        descripcion="Agrupan las fotos por proyecto, evento o jornada."
        puedeEditar={puede}
        ordenPor={{ columna: "fecha", asc: false }}
        campos={[
          { nombre: "titulo", etiqueta: "Título" },
          { nombre: "slug", etiqueta: "Slug" },
          { nombre: "categoria_slug", etiqueta: "Categoría (slug)", defecto: "proyectos" },
          { nombre: "fecha", etiqueta: "Fecha", tipo: "fecha" },
          { nombre: "publicado", etiqueta: "Publicado", tipo: "booleano", defecto: true },
          { nombre: "descripcion", etiqueta: "Descripción", tipo: "area", ocultarEnTabla: true },
        ]}
      />
      <CrudSeccion
        tabla="fotos"
        titulo="Fotos"
        descripcion="Pegá el ID del álbum al que pertenece cada foto."
        puedeEditar={puede}
        ordenPor={{ columna: "orden", asc: true }}
        campos={[
          { nombre: "alt", etiqueta: "Texto alternativo" },
          { nombre: "url", etiqueta: "URL de la imagen" },
          { nombre: "album_id", etiqueta: "ID del álbum" },
          { nombre: "orden", etiqueta: "Orden", tipo: "numero" },
          { nombre: "miniatura_url", etiqueta: "URL miniatura", ocultarEnTabla: true },
        ]}
      />
    </div>
  );
}
