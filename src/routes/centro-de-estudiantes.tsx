import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Megaphone, Send, Users } from "lucide-react";
import { toast } from "sonner";

import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { avisosPublicados, formatearFecha, integrantesCentro } from "@/lib/contenido";
import { enviarPropuesta } from "@/lib/formularios.functions";

const titulo = "Centro de Estudiantes — Técnica 3 Avellaneda";
const descripcion =
  "Integrantes, anuncios y canal de propuestas del Centro de Estudiantes de la E.E.S.T. N° 3 de Avellaneda.";

export const Route = createFileRoute("/centro-de-estudiantes")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/centro-de-estudiantes" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/centro-de-estudiantes" }],
  }),
  component: CentroDeEstudiantes,
});

function CentroDeEstudiantes() {
  const enviar = useServerFn(enviarPropuesta);
  const [enviando, setEnviando] = useState(false);
  const anuncios = avisosPublicados().filter((a) => a.categoria === "centro-estudiantes");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const datos = Object.fromEntries(new FormData(form).entries());
    setEnviando(true);
    try {
      const res = await enviar({
        data: {
          nombre: String(datos["nombre"] ?? ""),
          email: String(datos["email"] ?? ""),
          curso: String(datos["curso"] ?? ""),
          mensaje: String(datos["mensaje"] ?? ""),
          honeypot: String(datos["sitio"] ?? ""),
        },
      });
      if (res.ok) {
        toast.success(res.mensaje);
        form.reset();
      } else {
        toast.error(res.mensaje);
      }
    } catch {
      toast.error("Revisá los datos del formulario e intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <EncabezadoPagina
        volanta="Participación estudiantil"
        titulo="Centro de Estudiantes"
        descripcion="El Centro de Estudiantes representa la voz de los y las estudiantes de la escuela: organiza actividades, canaliza propuestas y construye comunidad junto al equipo directivo."
      />

      <div className="contenedor grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-12">
          <section>
            <h2 className="titulo-seccion flex items-center gap-2">
              <Users className="size-5 text-accent" aria-hidden="true" /> Integrantes
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Nombres y cargos de ejemplo, editables desde el panel de administración.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {integrantesCentro.map((i) => (
                <li key={`${i.rol}-${i.curso}`} className="tarjeta tarjeta-interactiva p-5">
                  <p className="font-display text-lg font-semibold">{i.nombre}</p>
                  <p className="text-sm text-primary">{i.rol}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{i.curso}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="titulo-seccion flex items-center gap-2">
              <Megaphone className="size-5 text-accent" aria-hidden="true" /> Anuncios del Centro
            </h2>
            <ul className="mt-6 space-y-4">
              {anuncios.map((a) => (
                <li key={a.slug}>
                  <article className="tarjeta p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">Centro de Estudiantes</Badge>
                      <time dateTime={a.fecha} className="text-xs text-muted-foreground">
                        {formatearFecha(a.fecha)}
                      </time>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold">{a.titulo}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{a.cuerpo}</p>
                  </article>
                </li>
              ))}
              {anuncios.length === 0 && (
                <li className="text-muted-foreground">Todavía no hay anuncios publicados.</li>
              )}
            </ul>
          </section>
        </div>

        <section aria-labelledby="titulo-propuestas" className="tarjeta h-fit p-6">
          <h2 id="titulo-propuestas" className="font-display text-xl font-semibold">
            Enviá tu propuesta
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Contanos tu idea para una actividad, un proyecto o una mejora en la escuela. El mensaje
            llega directamente al Centro de Estudiantes.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <Label htmlFor="nombre">Nombre y apellido</Label>
              <Input id="nombre" name="nombre" required minLength={2} maxLength={100} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" required maxLength={255} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="curso">Curso</Label>
              <Input id="curso" name="curso" required maxLength={60} placeholder="Ej.: 5° 2ª" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="mensaje">Propuesta</Label>
              <Textarea id="mensaje" name="mensaje" required minLength={10} maxLength={2000} rows={5} className="mt-1.5" />
            </div>
            <div aria-hidden="true" className="hidden">
              <label htmlFor="sitio">No completar</label>
              <input id="sitio" name="sitio" tabIndex={-1} autoComplete="off" />
            </div>
            <Button type="submit" disabled={enviando} className="w-full gap-2">
              <Send className="size-4" aria-hidden="true" />
              {enviando ? "Enviando…" : "Enviar propuesta"}
            </Button>
          </form>
        </section>
      </div>
    </>
  );
}
