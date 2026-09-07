import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, CalendarDays, Mail, MoveRight } from "lucide-react";

import heroEscuela from "@/assets/hero-escuela.jpg";
import logoEscuela from "@/assets/logo-eest3.jpg.asset.json";
import { ErrorContenido } from "@/components/site/estado-ruta";
import { Reveal } from "@/components/site/reveal";
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
      <section className="technical-grid relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-y-0 left-[8%] w-px bg-primary-foreground/10" aria-hidden="true" />
        <div className="absolute inset-y-0 right-[8%] w-px bg-primary-foreground/10" aria-hidden="true" />
        <div className="contenedor relative grid min-h-[calc(100svh-4rem)] items-center gap-12 py-16 lg:grid-cols-12 lg:py-20">
          <div className="relative z-10 lg:col-span-7 lg:pb-16">
            <div className="mb-9 flex items-center gap-4">
              <img src={logoEscuela.url} alt="Escudo de la E.E.S.T. N° 3" className="size-14 object-contain" width={56} height={56} />
              <div>
                <p className="technical-label text-accent">Educación técnica pública</p>
                <p className="mt-1 text-sm text-primary-foreground/60">Wilde · Avellaneda</p>
              </div>
            </div>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              Formación técnica<br />
              <span className="text-accent">con proyección real.</span>
            </h1>
            <div className="mt-10 grid max-w-2xl gap-8 border-l border-primary-foreground/20 pl-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="text-base leading-relaxed text-primary-foreground/70">
                {escuela.nombre}. Proyectos reales, talleres equipados y una comunidad que acompaña cada trayectoria.
              </p>
              <Button asChild size="lg" variant="secondary" className="group rounded-none">
                <Link to="/contacto">Inscripciones <ArrowDownRight className="ml-3 size-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" /></Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-[82%] max-w-md lg:col-span-5 lg:w-full">
            <div className="absolute -inset-4 border border-primary-foreground/10" aria-hidden="true" />
            <div className="relative aspect-[3/4] overflow-hidden bg-surface">
              <img src={heroEscuela} alt="Estudiantes trabajando con instrumental electrónico en el taller" width={1600} height={912} className="hero-image-drift size-full object-cover grayscale transition-[filter] duration-700 hover:grayscale-0" />
              <div className="absolute inset-0 bg-primary/20" aria-hidden="true" />
              <div className="scan-line absolute inset-x-0 top-0 h-px bg-accent/80 shadow-[0_0_18px_var(--color-accent)]" aria-hidden="true" />
            </div>
            <div className="absolute -bottom-8 -right-5 grid size-32 place-items-center border border-primary-foreground/15 bg-primary p-4 text-center sm:-right-8">
              <div><p className="font-display text-3xl font-semibold">3</p><p className="technical-label mt-1 text-primary-foreground/55">Especialidades</p></div>
            </div>
          </div>

          <div className="lg:absolute lg:bottom-7 lg:left-5 lg:right-5">
            <ul className="grid grid-cols-2 gap-px border-t border-primary-foreground/15 pt-5 sm:grid-cols-4">
              {numerosInstitucionales.map((n, index) => (
                <li key={n.etiqueta} className="border-primary-foreground/15 py-3 pr-3 sm:border-r">
                  <span className="technical-label text-accent">0{index + 1}</span>
                  <p className="mt-2 font-display text-xl font-semibold">{n.valor}</p>
                  <p className="mt-1 text-xs text-primary-foreground/55">{n.etiqueta}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-background py-24 lg:py-32" aria-labelledby="avisos-destacados">
        <div className="contenedor grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="technical-label text-accent">Actualidad / 01</p>
            <h2 id="avisos-destacados" className="mt-4 font-display text-4xl font-semibold leading-tight">Lo importante,<br />en primer plano.</h2>
            <p className="mt-5 max-w-sm text-muted-foreground">Información para estudiantes, familias y toda la comunidad educativa.</p>
            <Button asChild variant="ghost" className="mt-6 px-0"><Link to="/avisos">Todos los avisos <MoveRight className="ml-3 size-4" /></Link></Button>
          </Reveal>
          <div className="lg:col-span-8 lg:mt-20">
            <ul className="divide-y divide-border border-y border-border">
              {destacados.map((a, index) => (
                <li key={a.slug}>
                  <Reveal delay={index * 100}>
                    <article className="group grid gap-4 py-7 sm:grid-cols-[5rem_1fr_auto] sm:items-center">
                      <span className="technical-label text-muted-foreground">0{index + 1}</span>
                      <div><div className="flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="text-accent">{nombreCategoria(a.categoria)}</span><time dateTime={a.fecha}>{formatearFecha(a.fecha)}</time></div><h3 className="mt-2 font-display text-xl font-semibold transition-colors group-hover:text-primary">{a.titulo}</h3><p className="mt-2 text-sm text-muted-foreground">{a.resumen}</p></div>
                      <ArrowRight className="hidden size-5 transition-transform group-hover:translate-x-2 sm:block" aria-hidden="true" />
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-24" aria-labelledby="proximos-eventos">
        <div className="contenedor">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7"><p className="technical-label text-accent">Agenda / 02</p><h2 id="proximos-eventos" className="mt-4 font-display text-4xl font-semibold sm:text-5xl">La escuela está en movimiento.</h2></div>
            <p className="max-w-md text-muted-foreground lg:col-span-5">Próximos encuentros, actos y actividades para organizar la semana.</p>
          </Reveal>
          <ul className="mt-14 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {eventos.map((e, index) => { const { dia, mes } = formatearFechaCorta(e.fecha); return (
              <li key={e.slug} className="group relative min-h-72 bg-background p-7 transition-colors hover:bg-primary hover:text-primary-foreground">
                <Reveal delay={index * 80} className="flex h-full flex-col">
                  <div className="flex items-start justify-between"><CalendarDays className="size-5 text-accent" /><span className="technical-label text-muted-foreground group-hover:text-primary-foreground/55">0{index + 1}</span></div>
                  <div className="mt-auto"><p className="font-display text-5xl font-semibold">{dia}</p><p className="technical-label mt-1 text-accent">{mes}</p><h3 className="mt-6 font-display text-lg font-semibold">{e.titulo}</h3><p className="mt-2 text-sm text-muted-foreground group-hover:text-primary-foreground/65">{e.horario} · {e.lugar}</p></div>
                </Reveal>
              </li> ); })}
          </ul>
          <Button asChild variant="ghost" className="mt-6 px-0"><Link to="/calendario">Calendario completo <MoveRight className="ml-3 size-4" /></Link></Button>
        </div>
      </section>

      <section className="bg-background py-24 lg:py-32" aria-labelledby="especialidades-inicio">
        <div className="contenedor">
          <Reveal className="ml-auto max-w-3xl lg:pr-[8%]">
            <p className="technical-label text-accent">Trayectorias / 03</p>
            <h2 id="especialidades-inicio" className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Tres maneras de transformar ideas en soluciones.</h2>
            <p className="mt-5 max-w-2xl text-muted-foreground">Del ciclo básico común a una formación técnica especializada que combina teoría, práctica y proyectos.</p>
          </Reveal>
          <ul className="mt-16 space-y-4">
            {especialidades.map((e, index) => (
              <li key={e.slug} className={index === 1 ? "lg:ml-[12%]" : index === 2 ? "lg:ml-[24%]" : ""}>
                <Reveal delay={index * 100}>
                  <Link to="/materias" className="group grid max-w-4xl gap-5 border-l-2 border-primary bg-surface p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent hover:bg-primary hover:text-primary-foreground sm:grid-cols-[4rem_1fr_auto] sm:items-center">
                    <span className="technical-label text-accent">0{index + 1}</span>
                    <div><h3 className="font-display text-xl font-semibold">{e.nombre}</h3><p className="mt-2 text-sm text-muted-foreground group-hover:text-primary-foreground/65">{e.resumen}</p></div>
                    <ArrowDownRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" />
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="technical-grid bg-primary py-20 text-primary-foreground">
        <Reveal className="contenedor grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8"><p className="technical-label text-accent">Próximo paso</p><h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">Conozcan la escuela donde una vocación puede convertirse en oficio y futuro.</h2></div>
          <div className="lg:col-span-4"><p className="mb-6 text-sm leading-relaxed text-primary-foreground/65">Coordinamos entrevistas informativas para familias y futuros estudiantes.</p><Button asChild size="lg" variant="secondary" className="w-full rounded-none"><Link to="/contacto"><Mail className="mr-2 size-4" /> Escribinos</Link></Button></div>
        </Reveal>
      </section>
    </>
  );
}
