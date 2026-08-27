import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, List, MapPin } from "lucide-react";

import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categorias, eventos, formatearFecha, nombreCategoria } from "@/lib/contenido";

const titulo = "Calendario de actividades — Técnica 3 Avellaneda";
const descripcion =
  "Actos, reuniones de familias, exámenes, jornadas y clases especiales de la E.E.S.T. N° 3 de Avellaneda, en vista de calendario y de lista.";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/calendario" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/calendario" }],
  }),
  component: Calendario,
});

const tiposCalendario = categorias.filter((c) => c.ambito === "calendario");
const DIAS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

function Calendario() {
  const [vista, setVista] = useState<"lista" | "calendario">("lista");
  const [tipo, setTipo] = useState("todos");
  const primerEvento = [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
  const [mes, setMes] = useState(() => {
    const base = primerEvento ? new Date(`${primerEvento.fecha}T12:00:00`) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const filtrados = useMemo(
    () =>
      [...eventos]
        .filter((e) => tipo === "todos" || e.tipo === tipo)
        .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    [tipo],
  );

  const celdas = useMemo(() => {
    const inicio = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const finMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    const offset = (inicio.getDay() + 6) % 7;
    const items: { dia: number | null; iso?: string }[] = Array.from({ length: offset }, () => ({
      dia: null,
    }));
    for (let d = 1; d <= finMes; d++) {
      const iso = `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      items.push({ dia: d, iso });
    }
    return items;
  }, [mes]);

  return (
    <>
      <EncabezadoPagina
        volanta="Agenda escolar"
        titulo="Calendario de actividades"
        descripcion="Consultá las próximas actividades de la escuela: actos, reuniones con las familias, mesas de examen, jornadas y clases especiales."
      />

      <div className="contenedor py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <fieldset>
            <legend className="text-sm font-medium">Filtrar por tipo de actividad</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={tipo === "todos" ? "default" : "outline"}
                onClick={() => setTipo("todos")}
                aria-pressed={tipo === "todos"}
              >
                Todas
              </Button>
              {tiposCalendario.map((c) => (
                <Button
                  key={c.slug}
                  size="sm"
                  variant={tipo === c.slug ? "default" : "outline"}
                  onClick={() => setTipo(c.slug)}
                  aria-pressed={tipo === c.slug}
                >
                  {c.nombre}
                </Button>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-2" role="group" aria-label="Cambiar vista">
            <Button
              size="sm"
              variant={vista === "lista" ? "default" : "outline"}
              onClick={() => setVista("lista")}
              aria-pressed={vista === "lista"}
              className="gap-2"
            >
              <List className="size-4" aria-hidden="true" /> Lista
            </Button>
            <Button
              size="sm"
              variant={vista === "calendario" ? "default" : "outline"}
              onClick={() => setVista("calendario")}
              aria-pressed={vista === "calendario"}
              className="gap-2"
            >
              <CalendarDays className="size-4" aria-hidden="true" /> Calendario
            </Button>
          </div>
        </div>

        {vista === "lista" ? (
          <ul className="mt-10 grid gap-4">
            {filtrados.map((e) => (
              <li key={e.slug}>
                <article className="tarjeta tarjeta-interactiva flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  <div className="flex w-16 shrink-0 flex-col items-center rounded-md bg-secondary p-2 text-secondary-foreground">
                    <span className="font-display text-2xl font-semibold">
                      {e.fecha.slice(8, 10)}
                    </span>
                    <span className="text-xs uppercase">
                      {new Date(`${e.fecha}T12:00:00`)
                        .toLocaleDateString("es-AR", { month: "short" })
                        .replace(".", "")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <Badge variant="secondary">{nombreCategoria(e.tipo)}</Badge>
                    <h2 className="mt-2 font-display text-xl font-semibold">{e.titulo}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{e.descripcion}</p>
                    <p className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-4 text-accent" aria-hidden="true" /> {e.horario}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-4 text-accent" aria-hidden="true" /> {e.lugar}
                      </span>
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="tarjeta mt-10 p-5">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                aria-label="Mes anterior"
                onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </Button>
              <h2 className="font-display text-lg font-semibold capitalize">
                {mes.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
              </h2>
              <Button
                variant="outline"
                size="icon"
                aria-label="Mes siguiente"
                onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {DIAS.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {celdas.map((celda, i) => {
                const delDia = celda.iso ? filtrados.filter((e) => e.fecha === celda.iso) : [];
                return (
                  <div
                    key={celda.iso ?? `vacio-${i}`}
                    className={`min-h-20 rounded-md border p-1.5 text-left ${
                      celda.dia ? "border-border bg-background" : "border-transparent"
                    }`}
                  >
                    {celda.dia && (
                      <>
                        <span className="text-xs text-muted-foreground">{celda.dia}</span>
                        {delDia.map((e) => (
                          <p
                            key={e.slug}
                            className="mt-1 rounded bg-primary px-1.5 py-1 text-[11px] leading-tight text-primary-foreground"
                          >
                            {e.titulo}
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <h3 className="mt-8 font-display text-base font-semibold">Actividades del período</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {filtrados.map((e) => (
                <li key={e.slug}>
                  <time dateTime={e.fecha}>{formatearFecha(e.fecha)}</time> — {e.titulo}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
