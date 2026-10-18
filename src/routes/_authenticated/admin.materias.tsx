import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/materias")({
  head: () => ({ meta: [{ title: "Administrar materias — Técnica 3 Avellaneda" }, { name: 'description', content: "Administrar materias de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:title', content: "Administrar materias — Técnica 3 Avellaneda" }, { property: 'og:description', content: "Administrar materias de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' }] }),

  component: AdminMaterias,
});

function AdminMaterias() {
  const sesion = useSesion();
  const puede = sesion.puede("materias");
  return (
    <div className="space-y-12">
      <CrudSeccion
        tabla="materias"
        titulo="Materias"
        descripcion="Ciclo básico (1° a 3°) y ciclo superior por especialidad (4° a 7°)."
        puedeEditar={puede}
        ordenPor={{ columna: "anio", asc: true }}
        campos={[
          { nombre: "nombre", etiqueta: "Materia" },
          { nombre: "anio", etiqueta: "Año", tipo: "numero", defecto: 1 },
          {
            nombre: "ciclo",
            etiqueta: "Ciclo",
            tipo: "select",
            defecto: "basico",
            opciones: [
              { valor: "basico", etiqueta: "Ciclo básico" },
              { valor: "superior", etiqueta: "Ciclo superior" },
            ],
          },
          {
            nombre: "especialidad_slug",
            etiqueta: "Especialidad",
            tipo: "select",
            opciones: [
              { valor: "informatica", etiqueta: "Informática (IPP)" },
              { valor: "electronica", etiqueta: "Electrónica" },
              { valor: "alimentos", etiqueta: "Alimentos" },
            ],
          },
          { nombre: "carga_horaria", etiqueta: "Carga horaria" },
          { nombre: "descripcion", etiqueta: "Descripción", tipo: "area", ocultarEnTabla: true },
          { nombre: "orden", etiqueta: "Orden", tipo: "numero", ocultarEnTabla: true },
        ]}
      />
      <CrudSeccion
        tabla="especialidades"
        titulo="Especialidades"
        puedeEditar={puede}
        ordenPor={{ columna: "orden", asc: true }}
        campos={[
          { nombre: "nombre", etiqueta: "Nombre" },
          { nombre: "nombre_corto", etiqueta: "Nombre corto" },
          { nombre: "slug", etiqueta: "Slug", slugDesde: "nombre" },
          { nombre: "orden", etiqueta: "Orden", tipo: "numero" },
          { nombre: "descripcion", etiqueta: "Descripción", tipo: "area", ocultarEnTabla: true },
          {
            nombre: "salida_laboral",
            etiqueta: "Salida laboral",
            tipo: "area",
            ocultarEnTabla: true,
          },
        ]}
      />
    </div>
  );
}
