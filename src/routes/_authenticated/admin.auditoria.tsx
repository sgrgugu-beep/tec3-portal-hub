import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/auditoria")({
  component: AdminAuditoria,
});

type Registro = {
  id: string;
  user_email: string;
  accion: string;
  entidad: string;
  detalle: string;
  created_at: string;
};

function AdminAuditoria() {
  const sesion = useSesion();
  const [registros, setRegistros] = useState<Registro[]>([]);

  useEffect(() => {
    if (!sesion.puede("usuarios")) return;
    void supabase
      .from("auditoria")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        setRegistros((data ?? []) as Registro[]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesion.rol]);

  if (!sesion.puede("usuarios")) {
    return (
      <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Sólo los super administradores pueden ver la auditoría.
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Auditoría</h1>
        <p className="text-sm text-muted-foreground">
          Registro de los últimos cambios realizados en el panel.
        </p>
      </header>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Administrador</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Sección</TableHead>
              <TableHead>Detalle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>Todavía no hay cambios registrados.</TableCell>
              </TableRow>
            ) : (
              registros.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {new Date(r.created_at).toLocaleString("es-AR")}
                  </TableCell>
                  <TableCell className="text-sm">{r.user_email || "—"}</TableCell>
                  <TableCell className="text-sm">{r.accion}</TableCell>
                  <TableCell className="text-sm">{r.entidad}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {r.detalle}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
