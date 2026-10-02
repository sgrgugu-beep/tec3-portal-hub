import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const secciones = [
  { to: "/avisos", label: "Avisos" },
  { to: "/calendario", label: "Calendario" },
  { to: "/materias", label: "Materias" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function NoEncontrado() {
  return (
    <section className="contenedor grid min-h-[70vh] items-center gap-12 py-20 lg:grid-cols-2">
      <div>
        <p className="technical-label text-accent">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Este circuito no tiene salida.
        </h1>
        <p className="mt-5 max-w-md text-muted-foreground">
          La página que buscás no existe o fue movida. Probá con alguna de las secciones principales.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/"><ArrowLeft className="mr-2 size-4" aria-hidden="true" /> Volver al inicio</Link>
          </Button>
          {secciones.map((s) => (
            <Button key={s.to} asChild size="lg" variant="outline">
              <Link to={s.to}>{s.label}</Link>
            </Button>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 320 200" className="w-full max-w-md text-primary" role="img" aria-label="Ilustración de un cable desconectado">
        <path d="M10 100 H120 q20 0 20 -20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <rect x="132" y="56" width="22" height="30" rx="4" className="fill-accent" />
        <path d="M310 100 H210 q-20 0 -20 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <rect x="178" y="114" width="22" height="30" rx="4" className="fill-accent" />
        <g className="text-accent" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M165 92 l8 -8" /><path d="M162 104 l12 0" /><path d="M165 116 l8 8" />
        </g>
        <circle cx="10" cy="100" r="6" fill="currentColor" />
        <circle cx="310" cy="100" r="6" fill="currentColor" />
      </svg>
    </section>
  );
}
