import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, GraduationCap, Mail, Megaphone } from "lucide-react";

import heroEscuela from "@/assets/hero-escuela.jpg";
import logoEscuela from "@/assets/logo-eest3.jpg.asset.json";
import { ErrorContenido } from "@/components/site/estado-ruta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  consultaAvisos,
  consultaCategorias,
  consultaEspecialidades,
  consultaEventos,
} from "@/lib/consultas";
import {
  escuela,
  formatearFecha,
  formatearFechaCorta,
  numerosInstitucionales,
} from "@/lib/contenido";


const titulo = "Técnica 3 Avellaneda — E.E.S.T. N° 3 “República de México”";
const descripcion =
  "Escuela de Educación Secundaria Técnica N° 3 de Avellaneda “República de México”. Especialidades en Informática, Electrónica y Alimentos. Caxaraville 5875, Avellaneda.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: escuela.nombre,
          alternateName: escuela.nombreCorto,
          slogan: escuela.lema,
          telephone: escuela.telefono,
          email: escuela.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: escuela.direccion,
            addressLocality: escuela.localidad,
            addressRegion: escuela.provincia,
            postalCode: escuela.codigoPostal,
            addressCountry: "AR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: escuela.coordenadas.lat,
            longitude: escuela.coordenadas.lng,
          },
          sameAs: [escuela.redes.instagram, escuela.redes.facebook, escuela.redes.youtube],
        }),
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(consultaAvisos),
      context.queryClient.ensureQueryData(consultaEventos),
      context.queryClient.ensureQueryData(consultaEspecialidades),
      context.queryClient.ensureQueryData(consultaCategorias),
    ]);
  },
  errorComponent: ErrorContenido,
  component: Inicio,
});

function Inicio() {
  const { data: avisos } = useSuspenseQuery(consultaAvisos);
  const { data: todosLosEventos } = useSuspenseQuery(consultaEventos);
  const { data: especialidades } = useSuspenseQuery(consultaEspecialidades);
  const { data: categorias } = useSuspenseQuery(consultaCategorias);

  const nombreCategoria = (slug: string) =>
    categorias.find((c) => c.slug === slug)?.nombre ?? slug;
  const destacados = avisos.filter((a) => a.destacado).slice(0, 3);
  const eventos = [...todosLosEventos]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 4);


  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        <img
          src={heroEscuela}
          alt="Estudiantes trabajando con instrumental electrónico en el taller de la escuela"
          width={1600}
          height={912}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="gradiente-institucional absolute inset-0 opacity-95" aria-hidden="true" />
        <div className="contenedor relative py-24 lg:py-32">
          <div className="max-w-2xl text-primary-foreground">
            <img
              src={logoEscuela.url}
              alt="Escudo de la E.E.S.T. N° 3 República de México, Wilde, Avellaneda"
              className="mb-6 size-24 rounded-lg bg-background/90 p-1 shadow-lg"
              width={96}
              height={96}
            />
            <Badge variant="secondary" className="mb-5">
              Educación técnica pública · {escuela.localidad}
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              {escuela.nombre}
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/90">
              {escuela.lema}. Formamos técnicos y técnicas con proyectos reales, talleres equipados y
              el acompañamiento de un equipo docente con trayectoria.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contacto">
                  Consultar por inscripciones <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/institucional">Conocer la escuela</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40 py-10" aria-label="Datos institucionales">
        <ul className="contenedor grid grid-cols-2 gap-6 lg:grid-cols-4">
          {numerosInstitucionales.map((n) => (
            <li key={n.etiqueta} className="text-center">
              <p className="font-display text-3xl font-bold text-primary sm:text-4xl">{n.valor}</p>
              <p className="mt-1 text-sm text-muted-foreground">{n.etiqueta}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="contenedor py-16" aria-labelledby="avisos-destacados">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="avisos-destacados" className="titulo-seccion flex items-center gap-2">
            <Megaphone className="size-5 text-accent" aria-hidden="true" /> Avisos destacados
          </h2>
          <Button asChild variant="ghost">
            <Link to="/avisos">Ver todos los avisos</Link>
          </Button>
        </div>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {destacados.map((a) => (
            <li key={a.slug}>
              <article className="tarjeta tarjeta-interactiva flex h-full flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{nombreCategoria(a.categoria)}</Badge>
                  <time dateTime={a.fecha} className="text-xs text-muted-foreground">
                    {formatearFecha(a.fecha)}
                  </time>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{a.titulo}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.resumen}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-muted/40 py-16" aria-labelledby="proximos-eventos">
        <div className="contenedor">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="proximos-eventos" className="titulo-seccion flex items-center gap-2">
              <CalendarDays className="size-5 text-accent" aria-hidden="true" /> Próximas actividades
            </h2>
            <Button asChild variant="ghost">
              <Link to="/calendario">Ver el calendario completo</Link>
            </Button>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {eventos.map((e) => {
              const { dia, mes } = formatearFechaCorta(e.fecha);
              return (
                <li key={e.slug} className="tarjeta flex items-start gap-4 p-5">
                  <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="font-display text-xl font-bold leading-none">{dia}</span>
                    <span className="text-xs uppercase">{mes}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">{e.titulo}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {e.horario} · {e.lugar}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="contenedor py-16" aria-labelledby="especialidades-inicio">
        <h2 id="especialidades-inicio" className="titulo-seccion flex items-center gap-2">
          <GraduationCap className="size-5 text-accent" aria-hidden="true" /> Nuestras especialidades
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Después de un ciclo básico común de 1° a 3° año, cada estudiante elige una de las tres
          orientaciones técnicas que se cursan hasta 7° año.
        </p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {especialidades.map((e) => (
            <li key={e.slug}>
              <article className="tarjeta tarjeta-interactiva flex h-full flex-col p-6">
                <h3 className="font-display text-lg font-semibold">{e.nombre}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{e.resumen}</p>
                <Link
                  to="/materias"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Ver materias <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-primary py-16 text-primary-foreground">
        <div className="contenedor flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              ¿Están evaluando una escuela técnica para el año que viene?
            </h2>
            <p className="mt-3 text-primary-foreground/90">
              Coordinamos entrevistas informativas con las familias para contarles cómo se organiza
              el ciclo básico, cómo se elige la especialidad y qué acompañamiento reciben los y las
              estudiantes.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="shrink-0">
            <Link to="/contacto">
              <Mail className="mr-2 size-4" aria-hidden="true" /> Escribinos
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
