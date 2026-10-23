import { useRef, useState, type PointerEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowDownRight, ArrowRight, Cpu, FlaskConical, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { numerosInstitucionales } from '@/lib/contenido';
import { useConfig } from '@/hooks/use-config';
import informatica from '@/assets/informatica-proyecto.webp.asset.json';
import electronica from '@/assets/electronica-osciloscopio.webp.asset.json';
import alimentos from '@/assets/alimentos-laboratorio.webp.asset.json';

const escenas = [
  { nombre: 'Informática', imagen: informatica.url, alt: 'Estudiantes trabajando con una computadora y equipos de audio', icono: Monitor, clase: 'escena-informatica' },
  { nombre: 'Electrónica', imagen: electronica.url, alt: 'Prácticas de electrónica con un osciloscopio en el taller', icono: Cpu, clase: 'escena-electronica' },
  { nombre: 'Alimentos', imagen: alimentos.url, alt: 'Estudiantes realizando prácticas en el laboratorio de alimentos', icono: FlaskConical, clase: 'escena-alimentos' },
];

export function PortadaViva() {
  const [activa, setActiva] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const escena = escenas[activa] ?? escenas[0];
  const mover = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    ref.current?.style.setProperty('--foto-x', `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`);
    ref.current?.style.setProperty('--foto-y', `${((event.clientY - rect.top) / rect.height - 0.5) * 8}px`);
  };
  if (!escena) return null;
  return (
    <section ref={ref} className={`portada-viva ${escena.clase}`} onPointerMove={mover} onPointerLeave={() => { ref.current?.style.setProperty('--foto-x', '0px'); ref.current?.style.setProperty('--foto-y', '0px'); }} aria-label="Técnica 3 Avellaneda">
      <div className="portada-fotografias">
        {escenas.map((foto, i) => <img key={foto.nombre} src={foto.imagen} alt={foto.alt} aria-hidden={i !== activa} className={`portada-foto ${i === activa ? 'portada-foto-activa' : ''}`} fetchPriority={i === 0 ? 'high' : 'auto'} />)}
      </div>
      <div className="portada-velo" aria-hidden="true" />
      <div className="contenedor relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="technical-label flex items-center gap-3 text-institutional-foreground"><span className="indicador-vivo" aria-hidden="true" />Educación técnica pública · Wilde</p>
          <h1 className="mt-7 font-display text-5xl font-semibold leading-[1.08] sm:text-7xl lg:text-8xl">Técnica 3<span className="block text-institutional-accent">Avellaneda.</span></h1>
          <p className="mt-5 font-display text-lg text-institutional-foreground/90 sm:text-xl">“República de México”</p>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-institutional-foreground/85">{escuela.nombre}. Proyectos reales, talleres equipados y una comunidad que acompaña cada trayectoria.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary" className="group"><Link to="/contacto">Inscripciones <ArrowDownRight className="ml-3 size-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></Link></Button>
            <Button asChild size="lg" variant="ghost" className="text-institutional-foreground hover:bg-institutional-foreground/15 hover:text-institutional-foreground"><Link to="/institucional">Conocer la escuela <ArrowRight className="ml-3 size-4" /></Link></Button>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap gap-2 lg:mt-14" role="group" aria-label="Fotografías de las especialidades">
          {escenas.map((foto, i) => <Button key={foto.nombre} variant="ghost" aria-pressed={activa === i} onClick={() => setActiva(i)} className={`selector-escena ${activa === i ? 'selector-escena-activo' : ''}`}><foto.icono className="size-4" />{foto.nombre}</Button>)}
        </div>
      </div>
      <div className="portada-cifras relative z-10">
        <ul className="contenedor grid grid-cols-2 gap-x-6 gap-y-6 py-6 sm:grid-cols-4 sm:py-8">
          {numerosInstitucionales.map((n, i) => <li key={n.etiqueta} className="cifra-institucional"><p className="font-display text-2xl font-semibold sm:text-3xl">{n.valor}<span className="ml-2 text-xs text-institutional-accent" aria-hidden="true">/ 0{i + 1}</span></p><p className="mt-2 text-xs text-institutional-foreground/75">{n.etiqueta}</p></li>)}
        </ul>
      </div>
    </section>
  );
}