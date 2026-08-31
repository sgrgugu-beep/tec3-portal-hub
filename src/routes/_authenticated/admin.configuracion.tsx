import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/configuracion")({
  component: AdminConfiguracion,
});

function AdminConfiguracion() {
  const sesion = useSesion();
  return (
    <CrudSeccion
      tabla="configuracion_sitio"
      titulo="Configuración del sitio"
      descripcion="Datos de contacto, textos institucionales y redes sociales."
      puedeEditar={sesion.puede("configuracion")}
      ordenPor={{ columna: "grupo", asc: true }}
      campos={[
        { nombre: "clave", etiqueta: "Clave" },
        { nombre: "valor", etiqueta: "Valor", tipo: "area" },
        { nombre: "grupo", etiqueta: "Grupo", defecto: "general" },
        { nombre: "descripcion", etiqueta: "Descripción", ocultarEnTabla: true },
      ]}
    />
  );
}
