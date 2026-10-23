import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, Compass, MapPin } from "lucide-react";

import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { ErrorContenido } from "@/components/site/estado-ruta";
import { MapaEscuela } from "@/components/site/mapa-escuela";
import { Button } from "@/components/ui/button";
import { consultaAutoridades, consultaEspecialidades } from "@/lib/consultas";
import { useConfig } from "@/hooks/use-config";
import { useTextos } from "@/hooks/use-textos";
import { parrafos } from "@/lib/textos-sitio";

const titulo = "Institucional — Técnica 3 Avellaneda";
const descripcion =
  "Propuesta educativa, historia y equipo directivo de la E.E.S.T. N° 3 de Avellaneda. Cómo llegar y ubicación en Caxaraville 5875.";

export const Route = createFileRoute("/institucional")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/institucional" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/institucional" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(consultaAutoridades),
      context.queryClient.ensureQueryData(consultaEspecialidades),
    ]);
  },
  errorComponent: ErrorContenido,
  component: Institucional,
});

function Institucional() {
  const { data: autoridades } = useSuspenseQuery(consultaAutoridades);
  const { data: especialidades } = useSuspenseQuery(consultaEspecialidades);
  const t = useTextos();
  const config = useConfig();


  return (
    <div className="pagina-editorial identidad-institucional">
      <EncabezadoPagina identidad="institucional"
        volanta="Nuestra escuela"
        titulo="Una comunidad educativa que forma técnicos y técnicas"
        descripcion="Somos una escuela pública de educación secundaria técnica de Avellaneda. Acompañamos las trayectorias de cada estudiante desde el ciclo básico hasta el título técnico, articulando aula, taller y prácticas profesionalizantes."
      />

      <div className="contenedor grid gap-14 py-14 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-12">
          <article>
            <h2 className="titulo-seccion">{t("texto.institucional.quienes_titulo")}</h2>
            {parrafos(t("texto.institucional.quienes_texto")).map((p, i) => <p key={i} className="mt-4 leading-relaxed text-muted-foreground">{p}</p>)}
          </article>

          <article>
            <h2 className="titulo-seccion">{t("texto.institucional.historia_titulo")}</h2>
            {parrafos(t("texto.institucional.historia_texto")).map((p, i) => <p key={i} className="mt-4 leading-relaxed text-muted-foreground">{p}</p>)}
          </article>

          <article>
            <h2 className="titulo-seccion">{t("texto.institucional.orientaciones_titulo")}</h2>
            {parrafos(t("texto.institucional.orientaciones_texto")).map((p, i) => <p key={i} className="mt-4 leading-relaxed text-muted-foreground">{p}</p>)}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {especialidades.map((e) => (
                <div key={e.slug} className="tarjeta tarjeta-interactiva p-5">
                  <h3 className="font-display text-lg font-semibold">{e.nombreCorto}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{e.resumen}</p>
                </div>
              ))}
            </div>
            <Button asChild className="mt-6">
              <Link to="/materias">Ver el detalle curricular</Link>
            </Button>
          </article>

          <article>
            <h2 className="titulo-seccion">{t("texto.institucional.directivo_titulo")}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {autoridades.map((a) => (
                <li key={a.cargo} className="tarjeta p-4">
                  <p className="font-medium">{a.nombre}</p>
                  <p className="text-sm text-muted-foreground">{a.cargo}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="space-y-6">
          <h2 className="titulo-seccion">{t("texto.institucional.llegar_titulo")}</h2>
          <MapaEscuela />
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                {config.direccion}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Bus className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-muted-foreground">{t("texto.institucional.llegar_transporte")}</span>
            </li>
            {t("texto.institucional.llegar_referencias") && (
              <li className="flex items-start gap-3">
                <Compass className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span className="text-muted-foreground">{t("texto.institucional.llegar_referencias")}</span>
              </li>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}
