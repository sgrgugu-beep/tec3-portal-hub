import { useEffect } from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSesion } from "@/hooks/use-sesion";
import { supabase } from "@/integrations/supabase/client";
import { reclamarSuperAdmin } from "@/lib/admin.functions";
import logoEscuela from "@/assets/logo-eest3.jpg.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  component: LayoutAdmin,
});

const enlaces = [
  { to: "/admin", etiqueta: "Panel", seccion: null },
  { to: "/admin/avisos", etiqueta: "Avisos", seccion: "avisos" },
  { to: "/admin/calendario", etiqueta: "Calendario", seccion: "calendario" },
  { to: "/admin/materias", etiqueta: "Materias", seccion: "materias" },
  { to: "/admin/capacitaciones", etiqueta: "Capacitaciones", seccion: "capacitaciones" },
  { to: "/admin/centro", etiqueta: "Centro de Estudiantes", seccion: "centro" },
  { to: "/admin/galeria", etiqueta: "Galería", seccion: "galeria" },
  { to: "/admin/institucional", etiqueta: "Institucional", seccion: "institucional" },
  { to: "/admin/categorias", etiqueta: "Categorías", seccion: "configuracion" },
  { to: "/admin/mensajes", etiqueta: "Mensajes", seccion: "contacto" },
  { to: "/admin/configuracion", etiqueta: "Configuración", seccion: "configuracion" },
  { to: "/admin/usuarios", etiqueta: "Administradores", seccion: "usuarios" },
  { to: "/admin/auditoria", etiqueta: "Auditoría", seccion: "usuarios" },
] as const;

function LayoutAdmin() {
  const sesion = useSesion();
  const navigate = useNavigate();

  useEffect(() => {
    if (sesion.cargando || !sesion.user || sesion.rol) return;
    void reclamarSuperAdmin()
      .then((r) => {
        if (r.asignado) void sesion.refrescar();
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesion.cargando, sesion.user, sesion.rol]);

  async function salir() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="contenedor grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={logoEscuela.url}
            alt="Escudo de la escuela"
            className="size-10 rounded-md object-contain"
            width={40}
            height={40}
          />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">Panel de gestión</p>
            <p className="text-xs text-muted-foreground">
              {sesion.nombre || sesion.user?.email}
            </p>
          </div>
        </div>
        <nav aria-label="Secciones del panel">
          <ul className="space-y-1">
            {enlaces
              .filter((e) => !e.seccion || sesion.puede(e.seccion as never))
              .map((e) => (
                <li key={e.to}>
                  <Link
                    to={e.to}
                    activeOptions={{ exact: e.to === "/admin" }}
                    activeProps={{ className: "bg-primary text-primary-foreground" }}
                    className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    {e.etiqueta}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        <Button variant="outline" size="sm" className="w-full" onClick={() => void salir()}>
          <LogOut className="mr-2 size-4" aria-hidden="true" /> Cerrar sesión
        </Button>
      </aside>

      <div className="min-w-0">
        {sesion.cargando ? (
          <p className="text-sm text-muted-foreground">Cargando panel…</p>
        ) : !sesion.rol && sesion.secciones.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6">
            <h1 className="font-display text-xl font-semibold">Cuenta sin permisos</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu cuenta existe pero todavía no tiene un rol asignado. Pedile a un super
              administrador que te envíe una invitación o te asigne permisos.
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
