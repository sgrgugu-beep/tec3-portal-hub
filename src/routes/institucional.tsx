import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, Compass, MapPin } from "lucide-react";

import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { MapaEscuela } from "@/components/site/mapa-escuela";
import { Button } from "@/components/ui/button";
import { autoridades, escuela, especialidades } from "@/lib/contenido";

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
  component: Institucional,
});

function Institucional() {
  return (
    <>
      <EncabezadoPagina
        volanta="Nuestra escuela"
        titulo="Una comunidad educativa que forma técnicos y técnicas"
        descripcion="Somos una escuela pública de educación secundaria técnica de Avellaneda. Acompañamos las trayectorias de cada estudiante desde el ciclo básico hasta el título técnico, articulando aula, taller y prácticas profesionalizantes."
      />

      <div className="contenedor grid gap-14 py-14 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-12">
          <article>
            <h2 className="titulo-seccion">Quiénes somos</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              La escuela reúne a estudiantes, familias, docentes, preceptores y personal auxiliar en
              torno a un proyecto común: una formación técnica rigurosa, inclusiva y conectada con el
              mundo del trabajo y con la continuidad de estudios superiores. El trabajo en los
              talleres y laboratorios es el corazón de la propuesta: allí se aprende a resolver
              problemas reales, a documentar procesos y a trabajar en equipo.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Nuestro enfoque combina el acompañamiento cercano de las trayectorias escolares con
              exigencia académica. Cada estudiante cuenta con espacios de apoyo, tutorías y
              orientación para elegir su especialidad con información y confianza.
            </p>
          </article>

          <article>
            <h2 className="titulo-seccion">Historia</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Con más de cinco décadas de trayectoria en el distrito, la escuela creció junto al
              barrio y a su entramado productivo. De las primeras especialidades industriales a la
              incorporación de la informática y de las industrias de procesos, la institución
              actualizó sus talleres y sus contenidos sin perder su identidad: escuela pública,
              técnica y de puertas abiertas a la comunidad.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Texto de ejemplo, editable desde el panel de administración con la reseña histórica
              oficial de la institución.
            </p>
          </article>

          <article>
            <h2 className="titulo-seccion">Nuestras tres orientaciones</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A partir de 4° año, cada estudiante continúa su formación en una de las tres
              especialidades técnicas que ofrece la escuela.
            </p>
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
            <h2 className="titulo-seccion">Equipo directivo</h2>
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
          <h2 className="titulo-seccion">Cómo llegar</h2>
          <MapaEscuela />
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                {escuela.direccion}, {escuela.localidad}, {escuela.provincia}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Bus className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-muted-foreground">
                Llegan varias líneas de colectivo del distrito. Consultá el detalle actualizado en
                Contacto o por teléfono a secretaría.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Compass className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-muted-foreground">
                Referencias del entorno y accesos: información editable desde el panel.
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}
