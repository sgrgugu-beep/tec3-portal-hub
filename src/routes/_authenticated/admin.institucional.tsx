import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/institucional")({
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
