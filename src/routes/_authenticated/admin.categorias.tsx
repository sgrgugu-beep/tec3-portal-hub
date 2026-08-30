import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/categorias")({
  component: AdminCategorias,
});

function AdminCategorias() {
  const sesion = useSesion();
  return (
    <CrudSeccion
      tabla="categorias"
      titulo="Categorías"
      descripcion="Categorías usadas en avisos, calendario, capacitaciones y galería."
      puedeEditar={sesion.puede("configuracion")}
      ordenPor={{ columna: "orden", asc: true }}
      campos={[
        { nombre: "nombre", etiqueta: "Nombre" },
        {
          nombre: "tipo",
          etiqueta: "Se usa en",
          tipo: "select",
          defecto: "aviso",
          opciones: [
            { valor: "aviso", etiqueta: "Avisos" },
            { valor: "evento", etiqueta: "Calendario" },
            { valor: "capacitacion", etiqueta: "Capacitaciones" },
            { valor: "galeria", etiqueta: "Galería" },
          ],
        },
        { nombre: "slug", etiqueta: "Slug" },
        { nombre: "orden", etiqueta: "Orden", tipo: "numero" },
        { nombre: "color", etiqueta: "Color", defecto: "primary", ocultarEnTabla: true },
      ]}
    />
  );
}
