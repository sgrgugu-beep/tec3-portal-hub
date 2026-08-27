import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  avisosPublicados,
  categorias,
  formatearFecha,
  nombreCategoria,
} from "@/lib/contenido";

const titulo = "Avisos y novedades — Técnica 3 Avellaneda";
const descripcion =
  "Comunicados institucionales, avisos para las familias y novedades del Centro de Estudiantes de la E.E.S.T. N° 3 de Avellaneda.";

export const Route = createFileRoute("/avisos")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/avisos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/avisos" }],
  }),
  component: Avisos;
});

function Avisos() {
  return null;
}
