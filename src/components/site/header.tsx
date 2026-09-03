import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn, Menu, X } from "lucide-react";
import logoEscuela from "@/assets/logo-eest3.jpg.asset.json";

import { Button } from "@/components/ui/button";
import { BuscadorGlobal } from "@/components/site/buscador-global";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { escuela } from "@/lib/contenido";

export const navegacion = [
  { to: "/", label: "Inicio" },
  { to: "/institucional", label: "Institucional" },
  { to: "/avisos", label: "Avisos" },
  { to: "/calendario", label: "Calendario" },
  { to: "/materias", label: "Materias" },
  { to: "/capacitaciones", label: "Capacitaciones" },
  { to: "/centro-de-estudiantes", label: "Centro de Estudiantes" },
  { to: "/galeria", label: "Galería" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Ir al contenido principal
      </a>
      <div className="contenedor flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" aria-label={`Inicio — ${escuela.nombreCorto}`}>
          <img
            src={logoEscuela.url}
            alt="Escudo de la E.E.S.T. N° 3 República de México, Wilde, Avellaneda"
            className="size-10 shrink-0 rounded-md object-contain"
            width={40}
            height={40}
          />
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold">Técnica 3 Avellaneda</span>
            <span className="block text-xs text-muted-foreground">E.E.S.T. N° 3 "República de México"</span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navegacion.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "!text-primary bg-secondary" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <BuscadorGlobal />
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/admin" aria-label="Acceso al panel de administración">
              <LogIn className="mr-2 size-4" aria-hidden="true" /> Acceso
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {abierto && (
        <nav id="menu-movil" aria-label="Navegación móvil" className="border-t border-border bg-background xl:hidden">
          <ul className="contenedor grid gap-1 py-3">
            {navegacion.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  onClick={() => setAbierto(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "!text-primary bg-secondary" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/admin"
                onClick={() => setAbierto(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-secondary"
              >
                Acceso administradores
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
