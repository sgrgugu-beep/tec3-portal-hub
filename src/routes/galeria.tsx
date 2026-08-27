import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";

import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { albumes } from "@/lib/contenido";

const titulo = "Galería de fotos — Técnica 3 Avellaneda";
const descripcion =
  "Proyectos técnicos, eventos institucionales y jornadas especiales de la E.E.S.T. N° 3 de Avellaneda en imágenes.";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/galeria" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/galeria" }],
  }),
  component: Galeria,
});

const categoriasGaleria = Array.from(new Set(albumes.map((a) => a.categoria)));

function Galeria() {
  const [categoria, setCategoria] = useState("todas");
  const [foto, setFoto] = useState<{ src: string; alt: string } | null>(null);

  const listado = albumes.filter((a) => categoria === "todas" || a.categoria === categoria);

  return (
    <>
      <EncabezadoPagina
        volanta="Nuestra escuela en imágenes"
        titulo="Galería"
        descripcion="Un recorrido por los proyectos de los talleres, los actos institucionales y las jornadas que compartimos con la comunidad educativa."
      />

      <div className="contenedor py-12">
        <fieldset>
          <legend className="text-sm font-medium">Filtrar por álbum</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={categoria === "todas" ? "default" : "outline"}
              onClick={() => setCategoria("todas")}
              aria-pressed={categoria === "todas"}
            >
              Todos
            </Button>
            {categoriasGaleria.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={categoria === c ? "default" : "outline"}
                onClick={() => setCategoria(c)}
                aria-pressed={categoria === c}
              >
                {c}
              </Button>
            ))}
          </div>
        </fieldset>

        <div className="mt-10 space-y-12">
          {listado.map((album) => (
            <section key={album.slug} aria-labelledby={`album-${album.slug}`}>
              <h2 id={`album-${album.slug}`} className="titulo-seccion">
                {album.titulo}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{album.descripcion}</p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {album.fotos.map((f) => (
                  <li key={f.src}>
                    <button
                      type="button"
                      onClick={() => setFoto(f)}
                      className="tarjeta tarjeta-interactiva group block w-full overflow-hidden"
                      aria-label={`Ampliar imagen: ${f.alt}`}
                    >
                      <img
                        src={f.src}
                        alt={f.alt}
                        loading="lazy"
                        decoding="async"
                        width={800}
                        height={600}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <Dialog open={foto !== null} onOpenChange={(abierto) => !abierto && setFoto(null)}>
        <DialogContent className="max-w-4xl p-2">
          <DialogTitle className="sr-only">{foto?.alt ?? "Imagen ampliada"}</DialogTitle>
          {foto && (
            <figure className="m-0">
              <img src={foto.src} alt={foto.alt} className="max-h-[75vh] w-full object-contain" />
              <figcaption className="px-2 pb-1 pt-3 text-sm text-muted-foreground">
                {foto.alt}
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
