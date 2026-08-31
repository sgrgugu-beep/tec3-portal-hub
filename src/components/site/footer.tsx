import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import logoEscuela from "@/assets/logo-eest3.jpg.asset.json";

import { escuela } from "@/lib/contenido";

const enlacesRapidos = [
  { to: "/institucional", label: "Institucional" },
  { to: "/materias", label: "Materias" },
  { to: "/avisos", label: "Avisos" },
  { to: "/calendario", label: "Calendario" },
  { to: "/capacitaciones", label: "Capacitaciones" },
  { to: "/centro-de-estudiantes", label: "Centro de Estudiantes" },
  { to: "/galeria", label: "Galería" },
  { to: "/contacto", label: "Contacto" },
  { to: "/admin", label: "Acceso administradores" },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface text-surface-foreground">
      <div className="contenedor grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logoEscuela.url}
              alt="Escudo de la E.E.S.T. N° 3 República de México, Wilde, Avellaneda"
              className="size-10 rounded-md object-contain"
              width={40}
              height={40}
              loading="lazy"
            />
            <span className="font-display text-lg font-semibold">Técnica 3 Avellaneda</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {escuela.nombre}. Escuela pública de educación secundaria técnica con tres
            especialidades y más de cinco décadas de trayectoria en la comunidad de Avellaneda.
          </p>
        </div>

        <nav aria-label="Enlaces rápidos">
          <h2 className="font-display text-base font-semibold">Enlaces rápidos</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {enlacesRapidos.map((e) => (
              <li key={e.to}>
                <Link to={e.to} className="text-muted-foreground transition-colors hover:text-primary">
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-base font-semibold">Contacto</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                {escuela.direccion}, {escuela.localidad}, {escuela.provincia}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`tel:${escuela.telefono.replace(/\s/g, "")}`} className="hover:text-primary">
                {escuela.telefono}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`mailto:${escuela.email}`} className="hover:text-primary">
                {escuela.email}
              </a>
            </li>
            <li>{escuela.horarios}</li>
          </ul>
          <ul className="mt-5 flex items-center gap-2">
            <li>
              <a
                href={escuela.redes.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram de la escuela"
                className="flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <Instagram className="size-4" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={escuela.redes.facebook}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook de la escuela"
                className="flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <Facebook className="size-4" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={escuela.redes.youtube}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Canal de YouTube de la escuela"
                className="flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <Youtube className="size-4" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="contenedor flex flex-col items-start justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {escuela.nombre}. Todos los derechos reservados.
          </p>
          <p>Sitio institucional — contenido gestionado por el equipo de la escuela.</p>
        </div>
      </div>
    </footer>
  );
}
