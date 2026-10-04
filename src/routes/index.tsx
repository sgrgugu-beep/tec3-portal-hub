import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, CalendarDays, Mail, MoveRight } from "lucide-react";

import aulaInformatica from "@/assets/aula-informatica.webp.asset.json";
import actividadAjedrez from "@/assets/actividad-ajedrez.webp.asset.json";
import comunidadEstudiantil from "@/assets/comunidad-estudiantil.webp.asset.json";
import laboratorioAlimentos from "@/assets/laboratorio-alimentos.webp.asset.json";
import logoEscuela from "@/assets/logo-eest3.jpg.asset.json";
import proyectoElectronica from "@/assets/proyecto-electronica.webp.asset.json";
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

  const fotosEspecialidades: Record<string, { src: string; alt: string; color: string }> = {
    informatica: {
      src: aulaInformatica.url,
      alt: "Estudiantes trabajando en el aula de informática",
      color: "bg-chart-1",
    },
    electronica: {
      src: proyectoElectronica.url,
      alt: "Estudiantes presentando un proyecto de electrónica",
      color: "bg-chart-2",
    },
    alimentos: {
      src: laboratorioAlimentos.url,
      alt: "Estudiantes y docentes en el laboratorio de alimentos",
      color: "bg-chart-4",
    },
  };


  return (
    <>
      <section className="relative isolate overflow-hidden bg-institutional text-institutional-foreground">
        <div className="contenedor relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-12 lg:gap-14 lg:pb-36 lg:pt-16">
          <div className="relative z-10 min-w-0 lg:col-span-7">
            <div className="mb-7 flex items-center gap-4 lg:mb-9">
              <img src={logoEscuela.url} alt="Escudo de la E.E.S.T. N° 3" className="size-14 object-contain" width={56} height={56} />
              <div>
                <p className="technical-label text-institutional-accent">Educación técnica pública</p>
                <p className="mt-1 text-sm text-institutional-foreground/60">Wilde · Avellaneda</p>
              </div>
            </div>
            <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Formación técnica<br />
              <span className="text-institutional-accent">con proyección real.</span>
            </h1>
            <div className="mt-7 max-w-2xl lg:mt-10">
              <p className="text-base leading-relaxed text-institutional-foreground/70">
                {escuela.nombre}. Proyectos reales, talleres equipados y una comunidad que acompaña cada trayectoria.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="group shadow-elevado">
                  <Link to="/contacto">Inscripciones <ArrowDownRight className="ml-3 size-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" /></Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-institutional-foreground hover:bg-institutional-foreground/10 hover:text-institutional-foreground">
                  <Link to="/institucional">Conocer la escuela <ArrowRight className="ml-3 size-4" aria-hidden="true" /></Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface shadow-elevado sm:aspect-[3/2] lg:aspect-[4/5]">
              <img src={comunidadEstudiantil.url} alt="Comunidad estudiantil de la E.E.S.T. N° 3" width={809} height={626} fetchPriority="high" className="hero-image-drift size-full object-cover" />
              <div className="absolute inset-0 bg-institutional/10" aria-hidden="true" />
              <div className="absolute bottom-4 right-4 grid size-24 place-items-center rounded-xl bg-institutional/95 p-3 text-center shadow-elevado sm:size-28">
                <div><p className="font-display text-3xl font-semibold">3</p><p className="technical-label mt-1 text-institutional-foreground/55">Áreas técnicas</p></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-40 overflow-hidden rounded-xl bg-surface p-2 shadow-elevado sm:block lg:-left-10">
              <img src={actividadAjedrez.url} alt="Actividad de ajedrez entre estudiantes" width={809} height={626} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
            </div>
          </div>

          <div className="lg:absolute lg:bottom-7 lg:left-5 lg:right-5">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {numerosInstitucionales.map((n, index) => (
                <li key={n.etiqueta} className="rounded-lg bg-institutional-foreground/7 px-4 py-3 backdrop-blur-sm">
                  <span className="technical-label text-institutional-accent">0{index + 1}</span>
                  <p className="mt-2 font-display text-xl font-semibold">{n.valor}</p>
                  <p className="mt-1 text-xs text-institutional-foreground/55">{n.etiqueta}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-background py-20 lg:py-28" aria-labelledby="avisos-destacados">
        <div className="contenedor grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="technical-label text-accent">Actualidad / 01</p>
            <h2 id="avisos-destacados" className="mt-4 font-display text-4xl font-semibold leading-tight">Lo importante,<br />en primer plano.</h2>
            <p className="mt-5 max-w-sm text-muted-foreground">Información para estudiantes, familias y toda la comunidad educativa.</p>
            <Button asChild variant="ghost" className="mt-6 px-0"><Link to="/avisos">Todos los avisos <MoveRight className="ml-3 size-4" /></Link></Button>
          </Reveal>
          <div className="lg:col-span-8 lg:mt-20">
            <ul className="grid gap-4">
              {destacados.map((a, index) => (
                <li key={a.slug}>
                  <Reveal delay={index * 100}>
                    <article className="group grid gap-4 rounded-xl bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-card hover:shadow-institucional sm:grid-cols-[4rem_1fr_auto] sm:items-center">
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

      <section className="bg-surface py-20 lg:py-24" aria-labelledby="proximos-eventos">
        <div className="contenedor">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7"><p className="technical-label text-accent">Agenda / 02</p><h2 id="proximos-eventos" className="mt-4 font-display text-4xl font-semibold sm:text-5xl">La escuela está en movimiento.</h2></div>
            <p className="max-w-md text-muted-foreground lg:col-span-5">Próximos encuentros, actos y actividades para organizar la semana.</p>
          </Reveal>
          <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {eventos.map((e, index) => { const { dia, mes } = formatearFechaCorta(e.fecha); return (
              <li key={e.slug} className="group relative min-h-72 overflow-hidden rounded-xl bg-background p-7 shadow-institucional transition-all duration-300 hover:-translate-y-1 hover:bg-institutional hover:text-institutional-foreground hover:shadow-elevado">
                <Reveal delay={index * 80} className="flex h-full flex-col">
                  <div className="flex items-start justify-between"><CalendarDays className="size-5 text-accent" /><span className="technical-label text-muted-foreground group-hover:text-institutional-foreground/55">0{index + 1}</span></div>
                  <div className="mt-auto"><p className="font-display text-5xl font-semibold">{dia}</p><p className="technical-label mt-1 text-accent">{mes}</p><h3 className="mt-6 font-display text-lg font-semibold">{e.titulo}</h3><p className="mt-2 text-sm text-muted-foreground group-hover:text-institutional-foreground/65">{e.horario} · {e.lugar}</p></div>
                </Reveal>
              </li> ); })}
          </ul>
          <Button asChild variant="ghost" className="mt-6 px-0"><Link to="/calendario">Calendario completo <MoveRight className="ml-3 size-4" /></Link></Button>
        </div>
      </section>

      <section className="overflow-hidden bg-background py-20 lg:py-28" aria-labelledby="especialidades-inicio">
        <div className="contenedor">
          <Reveal className="ml-auto max-w-3xl">
            <p className="technical-label text-accent">Trayectorias / 03</p>
            <h2 id="especialidades-inicio" className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Tres maneras de transformar ideas en soluciones.</h2>
            <p className="mt-5 max-w-2xl text-muted-foreground">Del ciclo básico común a una formación técnica especializada que combina teoría, práctica y proyectos.</p>
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16">
            {especialidades.map((e, index) => {
              const foto = fotosEspecialidades[e.slug] ?? fotosEspecialidades["informatica"];
              return <li key={e.slug}>
                <Reveal delay={index * 100}>
                  <Link to="/materias" className="group block min-w-0 overflow-hidden rounded-2xl bg-card shadow-institucional transition-all duration-500 hover:-translate-y-2 hover:shadow-elevado">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={foto?.src} alt={foto?.alt ?? e.nombre} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className={`absolute left-4 top-4 size-3 rounded-full ${foto?.color ?? "bg-accent"}`} aria-hidden="true" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-4"><span className="technical-label text-accent">0{index + 1}</span><ArrowDownRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" /></div>
                      <h3 className="mt-5 font-display text-xl font-semibold">{e.nombre}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.resumen}</p>
                    </div>
                  </Link>
                </Reveal>
              </li>;
            })}
          </ul>
        </div>
      </section>

      <section className="bg-institutional py-16 text-institutional-foreground lg:py-20">
        <Reveal className="contenedor grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8"><p className="technical-label text-institutional-accent">Próximo paso</p><h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">Conozcan la escuela donde una vocación puede convertirse en oficio y futuro.</h2></div>
          <div className="lg:col-span-4"><p className="mb-6 text-sm leading-relaxed text-institutional-foreground/65">Coordinamos entrevistas informativas para familias y futuros estudiantes.</p><Button asChild size="lg" variant="secondary" className="w-full rounded-none"><Link to="/contacto"><Mail className="mr-2 size-4" /> Escribinos</Link></Button></div>
        </Reveal>
      </section>
    </>
  );
}
