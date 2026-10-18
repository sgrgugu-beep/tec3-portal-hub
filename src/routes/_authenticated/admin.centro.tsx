import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/centro")({
  head: () => ({ meta: [{ title: "Administrar centro de estudiantes — Técnica 3 Avellaneda" }, { name: 'description', content: "Administrar centro de estudiantes de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:title', content: "Administrar centro de estudiantes — Técnica 3 Avellaneda" }, { property: 'og:description', content: "Administrar centro de estudiantes de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' }] }),

  component: AdminCentro,
});

function AdminCentro() {
  const sesion = useSesion();
  const puede = sesion.puede("centro");
  return (
    <div className="space-y-12">
      <CrudSeccion
        tabla="integrantes_centro"
        titulo="Centro de Estudiantes"
        descripcion="Integrantes y cargos."
        puedeEditar={puede}
        ordenPor={{ columna: "orden", asc: true }}
        campos={[
          { nombre: "nombre", etiqueta: "Nombre" },
          { nombre: "cargo", etiqueta: "Cargo" },
          { nombre: "curso", etiqueta: "Curso" },
          { nombre: "orden", etiqueta: "Orden", tipo: "numero" },
          { nombre: "foto_url", etiqueta: "Foto (URL)", ocultarEnTabla: true },
        ]}
      />
      <CrudSeccion
        tabla="propuestas_centro"
        titulo="Propuestas recibidas"
        descripcion="Mensajes enviados por estudiantes desde el sitio."
        puedeEditar={puede}
        ordenPor={{ columna: "created_at", asc: false }}
        campos={[
          { nombre: "nombre", etiqueta: "Nombre" },
          { nombre: "curso", etiqueta: "Curso" },
          { nombre: "email", etiqueta: "Correo" },
          { nombre: "leido", etiqueta: "Leído", tipo: "booleano" },
          { nombre: "propuesta", etiqueta: "Propuesta", tipo: "area", ocultarEnTabla: true },
        ]}
      />
    </div>
  );
}
