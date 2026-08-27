import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { buscar, type ResultadoBusqueda } from "@/lib/contenido";

const ORDEN: ResultadoBusqueda["tipo"][] = [
  "Avisos",
  "Calendario",
  "Materias",
  "Capacitaciones",
];

export function BuscadorGlobal() {
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const atajo = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setAbierto((v) => !v);
      }
    };
    window.addEventListener("keydown", atajo);
    return () => window.removeEventListener("keydown", atajo);
  }, []);

  const agrupados = useMemo(() => {
    const resultados = buscar(consulta);
    return ORDEN.map((tipo) => ({
      tipo,
      items: resultados.filter((r) => r.tipo === tipo).slice(0, 5),
    })).filter((g) => g.items.length > 0);
  }, [consulta]);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setAbierto(true)}
        className="gap-2 text-muted-foreground"
        aria-label="Abrir buscador del sitio"
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden lg:inline">Buscar en el sitio</span>
      </Button>

      <CommandDialog open={abierto} onOpenChange={setAbierto}>
        <CommandInput
          value={consulta}
          onValueChange={setConsulta}
          placeholder="Buscar avisos, materias, capacitaciones, eventos…"
        />
        <CommandList>
          <CommandEmpty>
            {consulta.trim().length < 2
              ? "Escribí al menos dos caracteres para buscar."
              : "No encontramos resultados para esa búsqueda."}
          </CommandEmpty>
          {agrupados.map((grupo) => (
            <CommandGroup key={grupo.tipo} heading={grupo.tipo}>
              {grupo.items.map((item) => (
                <CommandItem
                  key={`${grupo.tipo}-${item.titulo}-${item.detalle}`}
                  value={`${grupo.tipo} ${item.titulo} ${item.detalle}`}
                  onSelect={() => {
                    setAbierto(false);
                    setConsulta("");
                    navigate({ to: item.ruta });
                  }}
                  className="flex flex-col items-start gap-0.5"
                >
                  <span className="font-medium">{item.titulo}</span>
                  <span className="text-xs text-muted-foreground">{item.detalle}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
