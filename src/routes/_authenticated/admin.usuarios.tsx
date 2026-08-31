import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useSesion, type Rol, type Seccion } from "@/hooks/use-sesion";
import {
  actualizarAdmin,
  crearInvitacion,
  eliminarAdmin,
  listarAdmins,
  revocarInvitacion,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/usuarios")({
  component: AdminUsuarios,
});

const TODAS_SECCIONES: { valor: Seccion; etiqueta: string }[] = [
  { valor: "avisos", etiqueta: "Avisos" },
  { valor: "calendario", etiqueta: "Calendario" },
  { valor: "materias", etiqueta: "Materias" },
  { valor: "capacitaciones", etiqueta: "Capacitaciones" },
  { valor: "centro", etiqueta: "Centro de Estudiantes" },
  { valor: "galeria", etiqueta: "Galería" },
  { valor: "institucional", etiqueta: "Institucional" },
  { valor: "contacto", etiqueta: "Contacto / mensajes" },
  { valor: "configuracion", etiqueta: "Configuración" },
  { valor: "usuarios", etiqueta: "Administradores" },
];

type Admin = {
  id: string;
  email: string;
  nombre: string;
  activo: boolean;
  role: Rol | null;
  secciones: Seccion[];
};

type Invitacion = {
  id: string;
  codigo: string;
  email: string;
  role: Rol;
  secciones: Seccion[];
  usada_por: string | null;
  revocada: boolean;
  expira_en: string;
};

function SelectorSecciones({
  valores,
  onCambio,
}: {
  valores: Seccion[];
  onCambio: (v: Seccion[]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TODAS_SECCIONES.map((s) => (
        <label
          key={s.valor}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
        >
          <input
            type="checkbox"
            checked={valores.includes(s.valor)}
            onChange={(e) =>
              onCambio(
                e.target.checked
                  ? [...valores, s.valor]
                  : valores.filter((v) => v !== s.valor),
              )
            }
          />
          {s.etiqueta}
        </label>
      ))}
    </div>
  );
}

function AdminUsuarios() {
  const sesion = useSesion();
  const esSuper = sesion.puede("usuarios");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [editando, setEditando] = useState<Admin | null>(null);
  const [rol, setRol] = useState<Rol | "ninguno">("ninguno");
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [activo, setActivo] = useState(true);
  const [dialogoInvitacion, setDialogoInvitacion] = useState(false);
  const [emailInvitacion, setEmailInvitacion] = useState("");
  const [rolInvitacion, setRolInvitacion] = useState<Rol>("admin_seccion");
  const [seccionesInvitacion, setSeccionesInvitacion] = useState<Seccion[]>([]);
  const [codigoCreado, setCodigoCreado] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setAdmins((await listarAdmins()) as Admin[]);
      const { data } = await supabase
        .from("invitaciones")
        .select("*")
        .order("created_at", { ascending: false });
      setInvitaciones((data ?? []) as Invitacion[]);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }, []);

  useEffect(() => {
    if (esSuper) void cargar();
  }, [esSuper, cargar]);

  if (!esSuper) {
    return (
      <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Sólo los super administradores pueden gestionar cuentas e invitaciones.
      </p>
    );
  }

  function abrirEdicion(admin: Admin) {
    setEditando(admin);
    setRol(admin.role ?? "ninguno");
    setSecciones(admin.secciones);
    setActivo(admin.activo);
  }

  async function guardarAdmin() {
    if (!editando) return;
    try {
      await actualizarAdmin({
        data: {
          userId: editando.id,
          role: rol === "ninguno" ? null : rol,
          secciones,
          activo,
        },
      });
      toast.success("Permisos actualizados");
      setEditando(null);
      void cargar();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function quitarAdmin(admin: Admin) {
    if (!window.confirm(`¿Eliminar la cuenta de ${admin.email}?`)) return;
    try {
      await eliminarAdmin({ data: { userId: admin.id } });
      toast.success("Cuenta eliminada");
      void cargar();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function generarInvitacion() {
    try {
      const { codigo } = await crearInvitacion({
        data: {
          email: emailInvitacion.trim().toLowerCase(),
          role: rolInvitacion,
          secciones: seccionesInvitacion,
        },
      });
      setCodigoCreado(codigo);
      void cargar();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">Administradores</h1>
            <p className="text-sm text-muted-foreground">
              Gestioná quiénes pueden editar el sitio y en qué secciones.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setDialogoInvitacion(true);
              setCodigoCreado(null);
            }}
          >
            <UserPlus className="mr-2 size-4" aria-hidden="true" /> Nueva invitación
          </Button>
        </header>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Administrador</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Secciones</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>Sin administradores registrados.</TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <p className="font-medium">{admin.nombre || "Sin nombre"}</p>
                      <p className="text-xs text-muted-foreground">{admin.email}</p>
                    </TableCell>
                    <TableCell>
                      {admin.role === "super_admin" ? (
                        <Badge>Super admin</Badge>
                      ) : admin.role === "admin_seccion" ? (
                        <Badge variant="secondary">Admin de sección</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin rol</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-56 text-sm text-muted-foreground">
                      {admin.role === "super_admin"
                        ? "Todas"
                        : admin.secciones.join(", ") || "—"}
                    </TableCell>
                    <TableCell>
                      {admin.activo ? (
                        <Badge variant="outline">Activo</Badge>
                      ) : (
                        <Badge variant="destructive">Inactivo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar ${admin.email}`}
                        onClick={() => abrirEdicion(admin)}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar ${admin.email}`}
                        onClick={() => void quitarAdmin(admin)}
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
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Invitaciones</h2>
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>Todavía no generaste invitaciones.</TableCell>
                </TableRow>
              ) : (
                invitaciones.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-sm">{inv.codigo}</TableCell>
                    <TableCell>{inv.email}</TableCell>
                    <TableCell>
                      {inv.role === "super_admin" ? "Super admin" : "Admin de sección"}
                    </TableCell>
                    <TableCell>
                      {inv.usada_por ? (
                        <Badge variant="secondary">Usada</Badge>
                      ) : inv.revocada ? (
                        <Badge variant="destructive">Revocada</Badge>
                      ) : new Date(inv.expira_en) < new Date() ? (
                        <Badge variant="outline">Vencida</Badge>
                      ) : (
                        <Badge>Vigente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!inv.usada_por && !inv.revocada && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            void revocarInvitacion({ data: { id: inv.id } })
                              .then(() => {
                                toast.success("Invitación revocada");
                                void cargar();
                              })
                              .catch((err) => toast.error((err as Error).message));
                          }}
                        >
                          Revocar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <Dialog open={!!editando} onOpenChange={(open) => !open && setEditando(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar administrador</DialogTitle>
            <DialogDescription>{editando?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={rol} onValueChange={(v) => setRol(v as Rol | "ninguno")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super administrador</SelectItem>
                  <SelectItem value="admin_seccion">Admin de sección</SelectItem>
                  <SelectItem value="ninguno">Sin rol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {rol === "admin_seccion" && (
              <div className="space-y-2">
                <Label>Secciones que puede gestionar</Label>
                <SelectorSecciones valores={secciones} onCambio={setSecciones} />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Switch id="activo" checked={activo} onCheckedChange={setActivo} />
              <Label htmlFor="activo">Cuenta activa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditando(null)}>
              Cancelar
            </Button>
            <Button onClick={() => void guardarAdmin()}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogoInvitacion} onOpenChange={setDialogoInvitacion}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva invitación</DialogTitle>
            <DialogDescription>
              Generá un código para que otra persona se registre con permisos.
            </DialogDescription>
          </DialogHeader>
          {codigoCreado ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Compartí este código. Vale por 14 días y un solo uso:
              </p>
              <p className="rounded-md bg-muted p-4 text-center font-mono text-2xl tracking-widest">
                {codigoCreado}
              </p>
              <p className="text-sm text-muted-foreground">
                La persona lo ingresa en la pestaña “Tengo una invitación” de la página de
                acceso.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-inv">Correo de la persona invitada</Label>
                <Input
                  id="email-inv"
                  type="email"
                  required
                  value={emailInvitacion}
                  onChange={(e) => setEmailInvitacion(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select
                  value={rolInvitacion}
                  onValueChange={(v) => setRolInvitacion(v as Rol)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin_seccion">Admin de sección</SelectItem>
                    <SelectItem value="super_admin">Super administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {rolInvitacion === "admin_seccion" && (
                <div className="space-y-2">
                  <Label>Secciones</Label>
                  <SelectorSecciones
                    valores={seccionesInvitacion}
                    onCambio={setSeccionesInvitacion}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {codigoCreado ? (
              <Button onClick={() => setDialogoInvitacion(false)}>Listo</Button>
            ) : (
              <Button
                disabled={!emailInvitacion.includes("@")}
                onClick={() => void generarInvitacion()}
              >
                Generar código
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
