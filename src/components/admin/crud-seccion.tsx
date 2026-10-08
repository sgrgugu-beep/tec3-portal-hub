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
import { useQueryClient } from '@tanstack/react-query';
import { CampoImagen } from './campo-imagen';

export type Campo = {
  nombre: string;
  etiqueta: string;
  tipo?: "texto" | "area" | "numero" | "booleano" | "fecha" | "select" | 'imagen';
  opcional?: boolean;
  opciones?: { valor: string; etiqueta: string }[];
  defecto?: unknown;
  ayuda?: string;
  ocultarEnTabla?: boolean;
  /** Carga las opciones desde la tabla de categorías. */
  categoria?: "aviso" | "evento" | "capacitacion" | "galeria";
  /** Usa el nombre de la categoría como valor (en vez del slug). */
  valorNombre?: boolean;
  /** Genera el valor automáticamente desde otro campo si queda vacío. */
  slugDesde?: string;
};

function aSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Fila = { id?: string } & Record<string, any>;

interface Props {
  tabla: string;
  titulo: string;
  descripcion?: string;
  campos: Campo[];
  ordenPor?: { columna: string; asc?: boolean };
  puedeEditar: boolean;
  clavePrimaria?: string;
  onSaved?: () => void;
}

export function CrudSeccion({
  tabla,
  titulo,
  descripcion,
  campos,
  ordenPor,
  puedeEditar,
  clavePrimaria = 'id',
  onSaved,
}: Props) {
  const queryClient = useQueryClient();
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<Fila | null>(null);
  const [valores, setValores] = useState<Fila>({});
  const [guardando, setGuardando] = useState(false);

  const [opcionesCat, setOpcionesCat] = useState<Record<string, { valor: string; etiqueta: string }[]>>({});

  useEffect(() => {
    const tipos = campos.filter((c) => c.categoria);
    if (tipos.length === 0) return;
    void supabase
      .from("categorias")
      .select("tipo, slug, nombre")
      .order("orden", { ascending: true })
      .then(({ data }) => {
        const mapa: Record<string, { valor: string; etiqueta: string }[]> = {};
        for (const c of tipos) {
          mapa[c.nombre] = (data ?? [])
            .filter((d) => d.tipo === c.categoria)
            .map((d) => ({ valor: c.valorNombre ? d.nombre : d.slug, etiqueta: d.nombre }));
        }
        setOpcionesCat(mapa);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabla]);

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
      if (valor === "" && campo.tipo === "fecha") valor = campo.opcional ? null : new Date().toISOString().slice(0, 10);
      if (typeof valor === "string") valor = valor.trim();
      if (campo.slugDesde && !valor) {
        const base = aSlug(String(valores[campo.slugDesde] ?? ""));
        valor = editando ? base : `${base}-${Date.now().toString(36).slice(-4)}`;
      }
      payload[campo.nombre] = valor;
    }
    const primero = campos[0];
    if (primero && primero.tipo !== "numero" && !payload[primero.nombre]) {
      setGuardando(false);
      toast.error(`Completá el campo "${primero.etiqueta}".`);
      return;
    }
    const consulta = editando
      ? (supabase as any).from(tabla).update(payload).eq(clavePrimaria, editando[clavePrimaria])
      : (supabase as any).from(tabla).insert(payload);
    const { error } = await consulta;
    setGuardando(false);
    if (error) {
      toast.error(
        error.code === "23505"
          ? "Ya existe un registro con ese identificador (slug). Cambialo o dejalo vacío."
          : `No se pudo guardar: ${error.message}`,
      );
      return;
    }
    const { data: sesion } = await supabase.auth.getSession();
    await (supabase as any).from("auditoria").insert({
      user_id: sesion.session?.user.id ?? null,
      user_email: sesion.session?.user.email ?? "",
      accion: editando ? "editar" : "crear",
      entidad: tabla,
      entidad_id: editando?.id ?? null,
      detalle: primero ? String(payload[primero.nombre] ?? "") : '',
    });
    toast.success(editando ? "Cambios guardados" : "Registro creado");
    void queryClient.invalidateQueries();
    setAbierto(false);
    onSaved?.();
    void cargar();
  }

  async function eliminar(fila: Fila) {
    if (!window.confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) return;
    const { error } = await (supabase as any).from(tabla).delete().eq(clavePrimaria, fila[clavePrimaria]);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data: sesion } = await supabase.auth.getSession();
    await (supabase as any).from("auditoria").insert({
      user_id: sesion.session?.user.id ?? null,
      user_email: sesion.session?.user.email ?? "",
      accion: "eliminar",
      entidad: tabla,
      entidad_id: fila.id,
      detalle: campos[0] ? String(fila[campos[0].nombre] ?? "") : '',
    });
    toast.success("Registro eliminado");
    void queryClient.invalidateQueries();
    onSaved?.();
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
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold">{titulo}</h2>
          {descripcion ? (
            <p className="text-sm text-muted-foreground">{descripcion}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-2">
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
                <TableRow key={String(fila[clavePrimaria])}>
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
                  {campo.tipo === 'imagen' ? <CampoImagen id={id} valor={String(valor??'')} carpeta={tabla==='avisos'?'avisos':'especialidades'} onChange={value=>setValores(v=>({...v,[campo.nombre]:value}))} /> : campo.tipo === "area" ? (
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
                  ) : campo.tipo === "select" || campo.categoria ? (
                    <select
                      id={id}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={String(valor ?? "")}
                      onChange={(e) =>
                        setValores((v) => ({ ...v, [campo.nombre]: e.target.value }))
                      }
                    >
                      <option value="">Sin definir</option>
                      {(campo.categoria ? (opcionesCat[campo.nombre] ?? []) : (campo.opciones ?? [])).map((o) => (
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
                  {campo.slugDesde ? (
                    <p className="text-xs text-muted-foreground">Dejalo vacío para generarlo automáticamente.</p>
                  ) : null}
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
