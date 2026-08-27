import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Info } from "lucide-react";

import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { especialidades, materias, type EspecialidadSlug } from "@/lib/contenido";

const titulo = "Materias y estructura curricular — Técnica 3 Avellaneda";
const descripcion =
  "Ciclo Básico (1° a 3° año) y Ciclo Superior en Informática Personal y Profesional, Electrónica y Alimentos de la E.E.S.T. N° 3 de Avellaneda.";

export const Route = createFileRoute("/materias")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/materias" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/materias" }],
  }),
  component: Materias,
});

function Materias() {
  const [ciclo, setCiclo] = useState<"basico" | "superior">("basico");
  const [anio, setAnio] = useState(1);
  const [especialidad, setEspecialidad] = useState<EspecialidadSlug>("informatica");

  const aniosDisponibles = ciclo === "basico" ? [1, 2, 3] : [4, 5, 6, 7];
  const anioActual = aniosDisponibles.includes(anio) ? anio : aniosDisponibles[0];

  const listado = materias.filter(
    (m) =>
      m.ciclo === ciclo &&
      m.anio === anioActual &&
      (ciclo === "basico" || m.especialidad === especialidad),
  );

  return (
    <>
      <EncabezadoPagina
        volanta="Propuesta curricular"
        titulo="Materias por año y especialidad"
        descripcion="La formación se organiza en un Ciclo Básico común de 1° a 3° año y un Ciclo Superior de 4° a 7° año en el que cada estudiante cursa una de las tres especialidades técnicas."
      />

      <div className="contenedor py-12">
        <div className="tarjeta flex items-start gap-3 border-accent/40 p-4 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-muted-foreground">
            Contenido orientativo y de ejemplo, editable desde el panel de administración. La
            información curricular oficial y las cargas horarias definitivas se completan con la
            documentación de la Dirección General de Cultura y Educación.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Seleccionar ciclo">
          <Button
            variant={ciclo === "basico" ? "default" : "outline"}
            onClick={() => {
              setCiclo("basico");
              setAnio(1);
            }}
            aria-pressed={ciclo === "basico"}
          >
            Ciclo Básico (1° a 3°)
          </Button>
          <Button
            variant={ciclo === "superior" ? "default" : "outline"}
            onClick={() => {
              setCiclo("superior");
              setAnio(4);
            }}
            aria-pressed={ciclo === "superior"}
          >
            Ciclo Superior (4° a 7°)
          </Button>
        </div>

        {ciclo === "superior" && (
          <fieldset className="mt-6">
            <legend className="text-sm font-medium">Especialidad</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {especialidades.map((e) => (
                <Button
                  key={e.slug}
                  size="sm"
                  variant={especialidad === e.slug ? "default" : "outline"}
                  onClick={() => setEspecialidad(e.slug)}
                  aria-pressed={especialidad === e.slug}
                >
                  {e.nombreCorto}
                </Button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className="mt-6">
          <legend className="text-sm font-medium">Año</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {aniosDisponibles.map((a) => (
              <Button
                key={a}
                size="sm"
                variant={anioActual === a ? "default" : "outline"}
                onClick={() => setAnio(a)}
                aria-pressed={anioActual === a}
              >
                {a}° año
              </Button>
            ))}
          </div>
        </fieldset>

        {ciclo === "superior" && (
          <section className="tarjeta mt-8 p-6">
            {especialidades
              .filter((e) => e.slug === especialidad)
              .map((e) => (
                <div key={e.slug}>
                  <h2 className="font-display text-xl font-semibold">{e.nombre}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{e.resumen}</p>
                  <p className="mt-3 text-sm">
                    <span className="font-medium">Salida laboral: </span>
                    <span className="text-muted-foreground">{e.salidaLaboral}</span>
                  </p>
                </div>
              ))}
          </section>
        )}

        <h2 className="titulo-seccion mt-12">
          Materias de {anioActual}° año
          {ciclo === "superior"
            ? ` — ${especialidades.find((e) => e.slug === especialidad)?.nombreCorto}`
            : " — Ciclo Básico"}
        </h2>

        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listado.map((m) => (
            <li key={m.slug}>
              <article className="tarjeta tarjeta-interactiva h-full p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold">{m.nombre}</h3>
                  <Badge variant="secondary">{m.anio}°</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{m.descripcion}</p>
                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5 text-accent" aria-hidden="true" /> {m.cargaHoraria}
                </p>
              </article>
            </li>
          ))}
        </ul>

        {listado.length === 0 && (
          <p className="mt-6 text-muted-foreground">
            Todavía no se cargaron materias para esta selección.
          </p>
        )}
      </div>
    </>
  );
}
