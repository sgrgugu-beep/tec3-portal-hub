import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSesion } from "@/hooks/use-sesion";
import { supabase } from "@/integrations/supabase/client";
import { paginasTextos } from "@/lib/textos-sitio";

export const Route = createFileRoute("/_authenticated/admin/informacion")({
  head: () => ({ meta: [{ title: "Información del sitio — Técnica 3 Avellaneda" }, { name: "description", content: "Edición de los textos de todas las páginas de Técnica 3 Avellaneda." }, { property: "og:title", content: "Información del sitio — Técnica 3 Avellaneda" }, { property: "og:description", content: "Edición de los textos de todas las páginas de Técnica 3 Avellaneda." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminInformacion,
});

function AdminInformacion() {
  const sesion = useSesion();
  const puede = sesion.puede("configuracion");
  const query = useQueryClient();
  const [valores, setValores] = useState<Record<string, string>>({});
  const [cargado, setCargado] = useState(false);
  const [guardando, setGuardando] = useState<string | null>(null);

  useEffect(() => {
    void supabase.from("configuracion_sitio").select("clave, valor").like("clave", "texto.%").then(({ data, error }) => {
      if (error) { toast.error("No se pudieron cargar los textos."); return; }
      const guardados = Object.fromEntries((data ?? []).map((f) => [f.clave, f.valor]));
      const iniciales: Record<string, string> = {};
      for (const p of paginasTextos) for (const c of p.campos) iniciales[c.clave] = guardados[c.clave] ?? c.defecto;
      setValores(iniciales);
      setCargado(true);
    });
  }, []);

  async function guardar(paginaId: string) {
    const pagina = paginasTextos.find((p) => p.id === paginaId);
    if (!pagina) return;
    setGuardando(paginaId);
    try {
      const filas = pagina.campos.map((c) => ({ clave: c.clave, valor: (valores[c.clave] ?? "").trim(), grupo: "textos", descripcion: `${pagina.nombre} · ${c.etiqueta}` }));
      const { error } = await supabase.from("configuracion_sitio").upsert(filas);
      if (error) throw error;
      await query.invalidateQueries({ queryKey: ["configuracion"] });
      toast.success(`Textos de ${pagina.nombre} guardados`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setGuardando(null);
    }
  }

  if (!puede) return <p className="text-sm text-muted-foreground">No tenés permiso para editar la información del sitio.</p>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Información del sitio</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Elegí una página y modificá cualquiera de sus textos. Para separar párrafos, dejá una línea en blanco. Si dejás un campo vacío, se muestra el texto original.</p>
      </header>
      {!cargado ? <p className="text-sm text-muted-foreground">Cargando textos…</p> : (
        <Tabs defaultValue="inicio">
          <TabsList className="h-auto flex-wrap justify-start">
            {paginasTextos.map((p) => <TabsTrigger key={p.id} value={p.id}>{p.nombre}</TabsTrigger>)}
          </TabsList>
          {paginasTextos.map((p) => (
            <TabsContent key={p.id} value={p.id} className="mt-6">
              <div className="space-y-5 rounded-lg border border-border bg-card p-5 sm:p-6">
                {p.campos.map((c) => (
                  <div key={c.clave}>
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor={c.clave}>{c.etiqueta}</Label>
                      {c.defecto && valores[c.clave] !== c.defecto && (
                        <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setValores((v) => ({ ...v, [c.clave]: c.defecto }))}><RotateCcw className="size-3" />Original</Button>
                      )}
                    </div>
                    {c.largo
                      ? <Textarea id={c.clave} rows={Math.min(10, Math.max(3, Math.ceil((valores[c.clave]?.length ?? 0) / 90)))} className="mt-1.5" value={valores[c.clave] ?? ""} onChange={(e) => setValores((v) => ({ ...v, [c.clave]: e.target.value }))} />
                      : <Input id={c.clave} className="mt-1.5" value={valores[c.clave] ?? ""} onChange={(e) => setValores((v) => ({ ...v, [c.clave]: e.target.value }))} />}
                  </div>
                ))}
                <Button disabled={guardando === p.id} onClick={() => void guardar(p.id)}><Save />{guardando === p.id ? "Guardando…" : `Guardar textos de ${p.nombre}`}</Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
