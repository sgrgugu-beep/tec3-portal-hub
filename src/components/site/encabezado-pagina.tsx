import { Link } from "@tanstack/react-router";
import { ArrowDownRight } from "lucide-react";
import comunidad from "@/assets/comunidad-acto.webp.asset.json";
import estudiantes from "@/assets/comunidad-estudiantil.webp.asset.json";
import clase from "@/assets/informatica-clase.webp.asset.json";
import taller from "@/assets/taller-perforacion.webp.asset.json";
import ajedrez from "@/assets/actividad-ajedrez.webp.asset.json";
import informatica from "@/assets/informatica-equipo.webp.asset.json";

const escenas = {
  institucional: { imagen: comunidad.url, alt: "Comunidad de Técnica 3 en un encuentro escolar", tipo: "panoramica" },
  avisos: { imagen: ajedrez.url, alt: "Estudiantes compartiendo una actividad de ajedrez", tipo: "editorial" },
  calendario: { imagen: comunidad.url, alt: "Encuentro de la comunidad educativa", tipo: "editorial" },
  materias: { imagen: clase.url, alt: "Clase de informática en Técnica 3", tipo: "editorial" },
  capacitaciones: { imagen: taller.url, alt: "Equipamiento del taller de la escuela", tipo: "panoramica" },
  centro: { imagen: estudiantes.url, alt: "Estudiantes de Técnica 3 reunidos en el aula", tipo: "comunidad" },
  galeria: { imagen: estudiantes.url, alt: "La comunidad estudiantil de Técnica 3", tipo: "panoramica" },
  contacto: { imagen: comunidad.url, alt: "La comunidad de la escuela en una jornada escolar", tipo: "editorial" },
  especialidades: { imagen: informatica.url, alt: "Equipos y proyectos de informática de la escuela", tipo: "editorial" },
};

interface Props {
  titulo: string;
  descripcion: string;
  volanta?: string;
  identidad?: keyof typeof escenas;
}

export function EncabezadoPagina({ titulo, descripcion, volanta, identidad = "institucional" }: Props) {
  const escena = escenas[identidad];
  return (
    <section className={`cabecera-editorial cabecera-${escena.tipo} identidad-${identidad}`}>
      <div className="cabecera-imagen" aria-hidden="true">
        <img src={escena.imagen} alt="" fetchPriority="high" decoding="async" />
      </div>
      <div className="cabecera-velo" aria-hidden="true" />
      <div className="contenedor cabecera-contenido">
        <nav aria-label="Ruta de navegación" className="cabecera-ruta">
          <Link to="/">Inicio</Link><span aria-hidden="true">/</span><span>{volanta || titulo}</span>
        </nav>
        {volanta && (
          <p className="cabecera-volanta technical-label">
            {volanta}
          </p>
        )}
        <h1 className="cabecera-titulo font-display font-semibold">
          {titulo}
        </h1>
        <p className="cabecera-descripcion">
          {descripcion}
        </p>
        <ArrowDownRight className="cabecera-flecha" aria-hidden="true" />
      </div>
    </section>
  );
}
