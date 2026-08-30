import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/capacitaciones")({
  component: AdminCapacitaciones,
});

function AdminCapacitaciones() {
  const sesion = useSesion();
  return (
    <CrudSeccion
      tabla="capacitaciones"
      titulo="Capacitaciones"
      descripcion="Cursos y talleres para la comunidad educativa."
      puedeEditar={sesion.puede("capacitaciones")}
      ordenPor={{ columna: "fecha_inicio", asc: false }}
      campos={[
        { nombre: "titulo", etiqueta: "Título" },
        {
          nombre: "estado",
          etiqueta: "Estado",
          tipo: "select",
          defecto: "proxima",
          opciones: [
            { valor: "proxima", etiqueta: "Próxima" },
            { valor: "en_curso", etiqueta: "En curso" },
            { valor: "finalizada", etiqueta: "Finalizada" },
          ],
        },
        { nombre: "area_slug", etiqueta: "Área (slug)", defecto: "general" },
        { nombre: "fecha_inicio", etiqueta: "Fecha de inicio", tipo: "fecha" },
        { nombre: "publicado", etiqueta: "Publicado", tipo: "booleano", defecto: true },
        { nombre: "dictada_por", etiqueta: "Dictada por", ocultarEnTabla: true },
        { nombre: "destinatarios", etiqueta: "Destinatarios", ocultarEnTabla: true },
        { nombre: "modalidad", etiqueta: "Modalidad", defecto: "Presencial", ocultarEnTabla: true },
        { nombre: "duracion", etiqueta: "Duración", ocultarEnTabla: true },
        { nombre: "descripcion", etiqueta: "Descripción", tipo: "area", ocultarEnTabla: true },
      ]}
    />
  );
}
