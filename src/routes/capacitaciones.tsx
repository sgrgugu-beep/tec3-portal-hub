import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock, GraduationCap, Users } from "lucide-react";

import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { capacitaciones, formatearFecha } from "@/lib/contenido";

const titulo = "Capacitaciones — Técnica 3 Avellaneda";
const descripcion =
  "Cursos y capacitaciones para estudiantes, egresados, familias y docentes en informática, electrónica, alimentos y formación docente.";

export const Route = createFileRoute("/capacitaciones")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/capacitaciones" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/capacitaciones" }],
  }),
  component: Capacitaciones,
});

const estados = ["proxima", "en curso", "finalizada"] as const;
const areas = Array.from(new Set(capacitaciones.map((c) => c.area)));

function Capacitaciones() {
  const [estado, setEstado] = useState<string>("todos");
  const [area, setArea] = useState<string>("todas");

  const listado = capacitaciones.filter(
    (c) => (estado === "todos" || c.estado === estado) && (area === "todas" || c.area === area),
  );

  return (
    <>
      <EncabezadoPagina
        volanta="Formación continua"
        titulo="Capacitaciones abiertas a la comunidad"
        descripcion="La escuela dicta capacitaciones para estudiantes, egresados, familias y docentes, aprovechando los talleres, laboratorios y la experiencia de sus departamentos técnicos."
      />

      <div className="contenedor py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <fieldset>
            <legend className="text-sm font-medium">Estado</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={estado === "todos" ? "default" : "outline"}
                onClick={() => setEstado("todos")}
                aria-pressed={estado === "todos"}
              >
                Todas
              </Button>
              {estados.map((e) => (
                <Button
                  key={e}
                  size="sm"
                  variant={estado === e ? "default" : "outline"}
                  onClick={() => setEstado(e)}
                  aria-pressed={estado === e}
                  className="capitalize"
                >
                  {e === "proxima" ? "Próximas" : e === "en curso" ? "En curso" : "Finalizadas"}
                </Button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="filtro-area" className="text-sm font-medium">
              Área
            </label>
            <select
              id="filtro-area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="mt-3 block h-9 w-full rounded-md border border-input bg-background px-3 text-sm md:w-56"
            >
              <option value="todas">Todas las áreas</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {listado.map((c) => (
            <li key={c.slug}>
              <article className="tarjeta tarjeta-interactiva flex h-full flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={c.estado === "finalizada" ? "outline" : "default"}
                    className="capitalize"
                  >
                    {c.estado === "proxima" ? "Próxima" : c.estado}
                  </Badge>
                  <Badge variant="secondary">{c.area}</Badge>
                  <Badge variant="outline">{c.modalidad}</Badge>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold">{c.titulo}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{c.descripcion}</p>
                <dl className="mt-5 grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-accent" aria-hidden="true" />
                    <dt className="sr-only">Dicta</dt>
                    <dd>{c.dicta}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-accent" aria-hidden="true" />
                    <dt className="sr-only">Destinatarios</dt>
                    <dd>{c.destinatarios}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-accent" aria-hidden="true" />
                    <dt className="sr-only">Inicio</dt>
                    <dd>
                      <time dateTime={c.fecha}>{formatearFecha(c.fecha)}</time>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-accent" aria-hidden="true" />
                    <dt className="sr-only">Duración</dt>
                    <dd>{c.duracion}</dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>

        {listado.length === 0 && (
          <p className="mt-6 text-muted-foreground">
            No hay capacitaciones que coincidan con los filtros seleccionados.
          </p>
        )}
      </div>
    </>
  );
}
