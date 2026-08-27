import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { avisosPublicados, categorias, formatearFecha, nombreCategoria } from "@/lib/contenido";

const titulo = "Avisos y novedades — Técnica 3 Avellaneda";
const descripcion =
  "Comunicados institucionales, avisos para las familias y novedades del Centro de Estudiantes de la E.E.S.T. N° 3 de Avellaneda.";

export const Route = createFileRoute("/avisos")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/avisos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/avisos" }],
  }),
  component: Avisos,
});

const categoriasAvisos = categorias.filter((c) => c.ambito === "avisos");

function Avisos() {
  const [categoria, setCategoria] = useState<string>("todas");
  const [anio, setAnio] = useState<string>("todos");
  const todos = avisosPublicados();

  const anios = useMemo(
    () => Array.from(new Set(todos.map((a) => a.fecha.slice(0, 4)))).sort().reverse(),
    [todos],
  );

  const listado = todos.filter(
    (a) =>
      (categoria === "todas" || a.categoria === categoria) &&
      (anio === "todos" || a.fecha.startsWith(anio)),
  );

  return (
    <>
      <EncabezadoPagina
        volanta="Comunicación institucional"
        titulo="Avisos y novedades"
        descripcion="Toda la información oficial de la escuela en un solo lugar: comunicados de la dirección, avisos para las familias y novedades del Centro de Estudiantes."
      />

      <div className="contenedor py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <fieldset>
            <legend className="text-sm font-medium">Filtrar por categoría</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={categoria === "todas" ? "default" : "outline"}
                onClick={() => setCategoria("todas")}
                aria-pressed={categoria === "todas"}
              >
                Todas
              </Button>
              {categoriasAvisos.map((c) => (
                <Button
                  key={c.slug}
                  size="sm"
                  variant={categoria === c.slug ? "default" : "outline"}
                  onClick={() => setCategoria(c.slug)}
                  aria-pressed={categoria === c.slug}
                >
                  {c.nombre}
                </Button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="filtro-anio" className="text-sm font-medium">
              Año
            </label>
            <select
              id="filtro-anio"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className="mt-3 block h-9 w-full rounded-md border border-input bg-background px-3 text-sm md:w-40"
            >
              <option value="todos">Todos los años</option>
              {anios.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground" role="status">
          {listado.length} {listado.length === 1 ? "aviso" : "avisos"} publicados
        </p>

        <ul className="mt-4 grid gap-5 md:grid-cols-2">
          {listado.map((aviso) => (
            <li key={aviso.slug}>
              <article className="tarjeta tarjeta-interactiva flex h-full flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{nombreCategoria(aviso.categoria)}</Badge>
                  {aviso.destacado && (
                    <Badge className="gap-1">
                      <Star className="size-3" aria-hidden="true" /> Destacado
                    </Badge>
                  )}
                  <time dateTime={aviso.fecha} className="text-xs text-muted-foreground">
                    {formatearFecha(aviso.fecha)}
                  </time>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold">{aviso.titulo}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{aviso.resumen}</p>
                <p className="mt-4 text-sm leading-relaxed">{aviso.cuerpo}</p>
              </article>
            </li>
          ))}
        </ul>

        {listado.length === 0 && (
          <p className="mt-6 text-muted-foreground">
            No hay avisos publicados para los filtros seleccionados.
          </p>
        )}
      </div>
    </>
  );
}
