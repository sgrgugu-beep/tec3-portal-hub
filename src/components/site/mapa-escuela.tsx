import { escuela } from "@/lib/contenido";

export function MapaEscuela({ titulo = "Ubicación de la escuela en el mapa" }: { titulo?: string }) {
  const consulta = encodeURIComponent(
    `${escuela.direccion}, ${escuela.localidad}, ${escuela.provincia}, ${escuela.pais}`,
  );

  return (
    <div className="tarjeta overflow-hidden">
      <iframe
        title={titulo}
        src={`https://www.google.com/maps?q=${consulta}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[340px] w-full border-0"
      />
    </div>
  );
}
