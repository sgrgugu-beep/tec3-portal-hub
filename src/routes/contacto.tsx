import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";

import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { MapaEscuela } from "@/components/site/mapa-escuela";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { escuela } from "@/lib/contenido";
import { enviarContacto } from "@/lib/formularios.functions";

const titulo = "Contacto — Técnica 3 Avellaneda";
const descripcion =
  "Dirección, teléfono, correo, horarios de atención y formulario de contacto de la E.E.S.T. N° 3 de Avellaneda, en Caxaraville 5875.";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contacto" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contacto" }],
  }),
  component: Contacto,
});

function Contacto() {
  const enviar = useServerFn(enviarContacto);
  const [enviando, setEnviando] = useState(false);

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
          asunto: String(datos["asunto"] ?? ""),
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
        volanta="Estamos para ayudarte"
        titulo="Contacto"
        descripcion="Escribinos por consultas de inscripción, documentación, trayectorias escolares o propuestas de articulación con instituciones y empresas."
      />

      <div className="contenedor grid gap-12 py-12 lg:grid-cols-2">
        <section aria-labelledby="datos-contacto">
          <h2 id="datos-contacto" className="titulo-seccion">
            Datos de la escuela
          </h2>
          <ul className="mt-6 space-y-5">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-medium">Dirección</p>
                <p className="text-sm text-muted-foreground">
                  {escuela.direccion}, {escuela.localidad}, {escuela.provincia}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-medium">Teléfono</p>
                <a
                  href={`tel:${escuela.telefono.replace(/\s/g, "")}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {escuela.telefono}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-medium">Correo electrónico</p>
                <a
                  href={`mailto:${escuela.email}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {escuela.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-medium">Horarios de atención</p>
                <p className="text-sm text-muted-foreground">{escuela.horarios}</p>
              </div>
            </li>
          </ul>

          <div className="mt-8">
            <MapaEscuela titulo="Mapa con la ubicación de la escuela" />
          </div>
        </section>

        <section aria-labelledby="formulario-contacto" className="tarjeta h-fit p-6">
          <h2 id="formulario-contacto" className="font-display text-xl font-semibold">
            Envianos un mensaje
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Completá el formulario y te responderemos a la brevedad durante el horario de atención.
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
              <Label htmlFor="asunto">Asunto</Label>
              <Input id="asunto" name="asunto" required minLength={3} maxLength={150} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea id="mensaje" name="mensaje" required minLength={10} maxLength={2000} rows={6} className="mt-1.5" />
            </div>
            <div aria-hidden="true" className="hidden">
              <label htmlFor="sitio">No completar</label>
              <input id="sitio" name="sitio" tabIndex={-1} autoComplete="off" />
            </div>
            <Button type="submit" disabled={enviando} className="w-full gap-2">
              <Send className="size-4" aria-hidden="true" />
              {enviando ? "Enviando…" : "Enviar mensaje"}
            </Button>
          </form>
        </section>
      </div>
    </>
  );
}
