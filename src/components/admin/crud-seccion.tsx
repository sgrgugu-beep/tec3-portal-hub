import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

export type Campo = {
  nombre: string;
  etiqueta: string;
  tipo?: "texto" | "area" | "numero" | "booleano" | "fecha" | "select";
  opciones?: { valor: string; etiqueta: string }[];
  defecto?: unknown;
  ayuda?: string;
  ocultarEnTabla?: boolean;
};

type Fila = Record<string, any>;

interface Props {
  tabla: string;
  titulo: string;
  descripcion?: string;
  campos: Campo[];
  ordenPor?: { columna: string; asc?: boolean };
  puedeEditar: boolean;
}

export function CrudSeccion({
  tabla,
  titulo,
  descripcion,
  campos,
  ordenPor,
  puedeEditar,
}: Props) {
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<Fila | null>(null);
  const [valores, setValores] = useState<Fila>({});
  const [guardando, setGuardando] = useState(false);

  const columnas = useMemo(
    () => campos.filter((c) => !c.ocultarEnTabla).slice(0, 5),
    [campos],
  );

  async function cargar() {
    setCargando(true);
    let consulta = (supabase as any).from(tabla).select("*");
    if (ordenPor) {
      consulta = consulta.order(ordenPor.columna, { ascending: ordenPor.asc ?? true });
    }
    const { data, error } = await consulta;
    if (error) toast.error(error.message);
    setFilas(data ?? []);
    setCargando(false);
  }

  useEffect(() => {
    void cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabla]);

  function abrirNuevo() {
    const base: Fila = {};
    for (const campo of campos) {
      base[campo.nombre] =
        campo.defecto ?? (campo.tipo === "booleano" ? false : campo.tipo === "numero" ? 0 : "");
    }
    setEditando(null);
    setValores(base);
    setAbierto(true);
  }

  function abrirEdicion(fila: Fila) {
    const base: Fila = {};
    for (const campo of campos) base[campo.nombre] = fila[campo.nombre] ?? "";
    setEditando(fila);
    setValores(base);
    setAbierto(true);
  }

  async function guardar() {
    setGuardando(true);
    const payload: Fila = {};
    for (const campo of campos) {
      let valor = valores[campo.nombre];
      if (campo.tipo === "numero") valor = Number(valor) || 0;
      if (valor === "" && campo.tipo === "fecha") valor = null;
      payload[campo.nombre] = valor;
    }
    const consulta = editando
      ? (supabase as any).from(tabla).update(payload).eq("id", editando.id)
      : (supabase as any).from(tabla).insert(payload);
    const { error } = await consulta;
    setGuardando(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data: sesion } = await supabase.auth.getUser();
    await (supabase as any).from("auditoria").insert({
      user_id: sesion.user?.id ?? null,
      user_email: sesion.user?.email ?? "",
      accion: editando ? "editar" : "crear",
      entidad: tabla,
      entidad_id: editando?.id ?? null,
      detalle: String(payload[campos[0]!.nombre] ?? ""),
    });
    toast.success(editando ? "Cambios guardados" : "Registro creado");
    setAbierto(false);
    void cargar();
  }

  async function eliminar(fila: Fila) {
    if (!window.confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) return;
    const { error } = await (supabase as any).from(tabla).delete().eq("id", fila.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data: sesion } = await supabase.auth.getUser();
    await (supabase as any).from("auditoria").insert({
      user_id: sesion.user?.id ?? null,
      user_email: sesion.user?.email ?? "",
      accion: "eliminar",
      entidad: tabla,
      entidad_id: fila.id,
      detalle: String(fila[campos[0]!.nombre] ?? ""),
    });
    toast.success("Registro eliminado");
    void cargar();
  }

  if (!puedeEditar) {
    return (
      <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        No tenés permisos para gestionar esta sección. Pedile acceso a un super administrador.
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{titulo}</h1>
          {descripcion ? (
            <p className="text-sm text-muted-foreground">{descripcion}</p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void cargar()}>
            <RefreshCw className="mr-2 size-4" aria-hidden="true" /> Actualizar
          </Button>
          <Button size="sm" onClick={abrirNuevo}>
            <Plus className="mr-2 size-4" aria-hidden="true" /> Nuevo
          </Button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columnas.map((c) => (
                <TableHead key={c.nombre}>{c.etiqueta}</TableHead>
              ))}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell colSpan={columnas.length + 1}>Cargando…</TableCell>
              </TableRow>
            ) : filas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnas.length + 1}>
                  Todavía no hay registros cargados.
                </TableCell>
              </TableRow>
            ) : (
              filas.map((fila) => (
                <TableRow key={fila.id}>
                  {columnas.map((c) => (
                    <TableCell key={c.nombre} className="max-w-xs truncate">
                      {typeof fila[c.nombre] === "boolean"
                        ? fila[c.nombre]
                          ? "Sí"
                          : "No"
                        : String(fila[c.nombre] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Editar"
                      onClick={() => abrirEdicion(fila)}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Eliminar"
                      onClick={() => void eliminar(fila)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar registro" : "Nuevo registro"}</DialogTitle>
            <DialogDescription>{titulo}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {campos.map((campo) => {
              const id = `campo-${campo.nombre}`;
              const valor = valores[campo.nombre];
              return (
                <div key={campo.nombre} className="space-y-2">
                  <Label htmlFor={id}>{campo.etiqueta}</Label>
                  {campo.tipo === "area" ? (
                    <Textarea
                      id={id}
                      rows={5}
                      value={String(valor ?? "")}
                      onChange={(e) =>
                        setValores((v) => ({ ...v, [campo.nombre]: e.target.value }))
                      }
                    />
                  ) : campo.tipo === "booleano" ? (
                    <div className="flex items-center gap-3">
                      <Switch
                        id={id}
                        checked={Boolean(valor)}
                        onCheckedChange={(check) =>
                          setValores((v) => ({ ...v, [campo.nombre]: check }))
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {valor ? "Sí" : "No"}
                      </span>
                    </div>
                  ) : campo.tipo === "select" ? (
                    <select
                      id={id}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={String(valor ?? "")}
                      onChange={(e) =>
                        setValores((v) => ({ ...v, [campo.nombre]: e.target.value }))
                      }
                    >
                      <option value="">Sin definir</option>
                      {campo.opciones?.map((o) => (
                        <option key={o.valor} value={o.valor}>
                          {o.etiqueta}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={id}
                      type={
                        campo.tipo === "numero"
                          ? "number"
                          : campo.tipo === "fecha"
                            ? "date"
                            : "text"
                      }
                      value={String(valor ?? "")}
                      onChange={(e) =>
                        setValores((v) => ({ ...v, [campo.nombre]: e.target.value }))
                      }
                    />
                  )}
                  {campo.ayuda ? (
                    <p className="text-xs text-muted-foreground">{campo.ayuda}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void guardar()} disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
