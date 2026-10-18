import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/mensajes")({
  head: () => ({ meta: [{ title: "Mensajes recibidos — Técnica 3 Avellaneda" }, { name: 'description', content: "Mensajes recibidos de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:title', content: "Mensajes recibidos — Técnica 3 Avellaneda" }, { property: 'og:description', content: "Mensajes recibidos de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' }] }),

  component: AdminMensajes,
});

function AdminMensajes() {
  const sesion = useSesion();
  return (
    <CrudSeccion
      tabla="mensajes_contacto"
      titulo="Mensajes de contacto"
      descripcion="Consultas enviadas desde el formulario público."
      puedeEditar={sesion.puede("contacto")}
      ordenPor={{ columna: "created_at", asc: false }}
      campos={[
        { nombre: "nombre", etiqueta: "Nombre" },
        { nombre: "email", etiqueta: "Correo" },
        { nombre: "asunto", etiqueta: "Asunto" },
        { nombre: "leido", etiqueta: "Leído", tipo: "booleano" },
        { nombre: "telefono", etiqueta: "Teléfono", ocultarEnTabla: true },
        { nombre: "mensaje", etiqueta: "Mensaje", tipo: "area", ocultarEnTabla: true },
      ]}
    />
  );
}
