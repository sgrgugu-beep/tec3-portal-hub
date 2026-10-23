import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, CalendarDays, Mail, MoveRight } from "lucide-react";

import aulaInformatica from "@/assets/aula-informatica.webp.asset.json";
import actividadAjedrez from "@/assets/actividad-ajedrez.webp.asset.json";
import comunidadEstudiantil from "@/assets/comunidad-estudiantil.webp.asset.json";
import laboratorioAlimentos from "@/assets/laboratorio-alimentos.webp.asset.json";
import { PortadaViva } from "@/components/site/portada-viva";
import proyectoElectronica from "@/assets/proyecto-electronica.webp.asset.json";
import { ErrorContenido } from "@/components/site/estado-ruta";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { identidadEspecialidades } from '@/lib/identidad-especialidades';
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
      <PortadaViva />

      <section className="overflow-hidden bg-background py-16 lg:py-20" aria-labelledby="avisos-destacados">
        <div className="contenedor grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="technical-label text-editorial-coral">Actualidad / 01</p>
            <h2 id="avisos-destacados" className="mt-4 font-display text-4xl font-semibold leading-tight">Lo importante,<br />en primer plano.</h2>
            <p className="mt-5 max-w-sm text-muted-foreground">Información para estudiantes, familias y toda la comunidad educativa.</p>
            <Button asChild variant="ghost" className="mt-6 px-0"><Link to="/avisos">Todos los avisos <MoveRight className="ml-3 size-4" /></Link></Button>
            <div className="foto-editorial mt-7 max-w-sm"><img src={actividadAjedrez.url} alt="Estudiantes participando de una actividad de ajedrez" loading="lazy" className="aspect-[16/9] w-full object-cover" /></div>
          </Reveal>
          <div className="lg:col-span-8 lg:mt-10">
            <ul className="grid gap-4">
              {destacados.map((a, index) => (
                <li key={a.slug}>
                  <Reveal delay={index * 100}>
                    <article className="group grid gap-4 rounded-lg bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-card hover:shadow-institucional sm:grid-cols-[4rem_1fr_auto] sm:items-center">
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

      <section className="bg-editorial-surface py-16 lg:py-20" aria-labelledby="proximos-eventos">
        <div className="contenedor">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7"><p className="technical-label text-accent">Agenda / 02</p><h2 id="proximos-eventos" className="mt-4 font-display text-4xl font-semibold sm:text-5xl">La escuela está en movimiento.</h2></div>
            <p className="max-w-md text-muted-foreground lg:col-span-5">Próximos encuentros, actos y actividades para organizar la semana.</p>
          </Reveal>
          <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {eventos.map((e, index) => { const { dia, mes } = formatearFechaCorta(e.fecha); return (
              <li key={e.slug} className="agenda-viva group relative min-h-72 overflow-hidden rounded-lg bg-background p-7 shadow-institucional transition-all duration-300 hover:-translate-y-1 hover:bg-institutional hover:text-institutional-foreground hover:shadow-elevado">
                <Reveal delay={index * 80} className="flex h-full flex-col">
                  <div className="flex items-start justify-between"><CalendarDays className="agenda-color size-5" /><span className="technical-label text-muted-foreground group-hover:text-institutional-foreground/55">0{index + 1}</span></div>
                  <div className="mt-auto"><p className="font-display text-5xl font-semibold">{dia}</p><p className="agenda-color technical-label mt-1">{mes}</p><h3 className="mt-6 font-display text-lg font-semibold">{e.titulo}</h3><p className="mt-2 text-sm text-muted-foreground group-hover:text-institutional-foreground/65">{e.horario} · {e.lugar}</p></div>
                </Reveal>
              </li> ); })}
          </ul>
          <Button asChild variant="ghost" className="mt-6 px-0"><Link to="/calendario">Calendario completo <MoveRight className="ml-3 size-4" /></Link></Button>
        </div>
      </section>

      <section className="overflow-hidden bg-background py-20 lg:py-28" aria-labelledby="especialidades-inicio">
        <div className="contenedor">
          <Reveal className="max-w-3xl">
            <p className="technical-label text-editorial-violet">Trayectorias / 03</p>
            <h2 id="especialidades-inicio" className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Tres maneras de transformar ideas en soluciones.</h2>
            <p className="mt-5 max-w-2xl text-muted-foreground">Del ciclo básico común a una formación técnica especializada que combina teoría, práctica y proyectos.</p>
          </Reveal>
          <ul className="mt-12 grid items-start gap-8 md:grid-cols-3 lg:mt-16">
            {especialidades.map((e, index) => {
              const foto = fotosEspecialidades[e.slug] ?? fotosEspecialidades["informatica"];
              return <li key={e.slug}>
                <Reveal delay={index * 100}>
                  <Link to="/especialidad/$slug" params={{slug:e.slug}} className={`tarjeta-especialidad group block min-w-0 ${index === 1 ? "tarjeta-especialidad-desfasada" : ""} ${identidadEspecialidades[e.slug]?.clase??''}`}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                      <img src={e.imagen||foto?.src} alt={e.imagenAlt||foto?.alt||e.nombre} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className={`absolute left-4 top-4 size-3 rounded-full ${foto?.color ?? "bg-accent"}`} aria-hidden="true" />
                    </div>
                    <div className="py-6">
                      <div className="flex items-center justify-between gap-4"><span className="technical-label text-specialty">0{index + 1}</span><ArrowDownRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" /></div>
                      <h3 className="mt-5 font-display text-2xl font-semibold">{e.nombre}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.resumen}</p>
                    </div>
                  </Link>
                </Reveal>
              </li>;
            })}
          </ul>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-institutional py-16 text-institutional-foreground lg:py-20">
        <img src={comunidadEstudiantil.url} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" /><div className="absolute inset-0 -z-10 bg-institutional/90" aria-hidden="true" />
        <Reveal className="contenedor grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8"><p className="technical-label text-institutional-accent">Próximo paso</p><h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">Conozcan la escuela donde una vocación puede convertirse en oficio y futuro.</h2></div>
          <div className="lg:col-span-4"><p className="mb-6 text-sm leading-relaxed text-institutional-foreground/65">Coordinamos entrevistas informativas para familias y futuros estudiantes.</p><Button asChild size="lg" variant="secondary" className="w-full rounded-none"><Link to="/contacto"><Mail className="mr-2 size-4" /> Escribinos</Link></Button></div>
        </Reveal>
      </section>
    </>
  );
}
