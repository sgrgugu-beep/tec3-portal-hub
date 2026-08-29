import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const seccionEnum = z.enum([
  "avisos",
  "calendario",
  "materias",
  "capacitaciones",
  "centro",
  "galeria",
  "institucional",
  "contacto",
  "configuracion",
  "usuarios",
]);
const rolEnum = z.enum(["super_admin", "admin_seccion"]);

async function exigirSuperAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "super_admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Requiere permisos de super administrador");
}

/** El primer usuario registrado se convierte en super administrador. */
export const reclamarSuperAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    if ((count ?? 0) > 0) return { asignado: false as const };
    const { error: errIns } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "super_admin" });
    if (errIns) throw new Error(errIns.message);
    return { asignado: true as const };
  });

export const listarAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await exigirSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [perfiles, roles, permisos] = await Promise.all([
      supabaseAdmin.from("perfiles").select("id, email, nombre, activo, created_at"),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("permisos_seccion").select("user_id, seccion"),
    ]);
    return (perfiles.data ?? []).map((p) => ({
      ...p,
      role: roles.data?.find((r) => r.user_id === p.id)?.role ?? null,
      secciones: (permisos.data ?? []).filter((s) => s.user_id === p.id).map((s) => s.seccion),
    }));
  });

export const actualizarAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        userId: z.string().uuid(),
        role: rolEnum.nullable(),
        secciones: z.array(seccionEnum),
        activo: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await exigirSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("perfiles").update({ activo: data.activo }).eq("id", data.userId);
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    if (data.role) {
      await supabaseAdmin.from("user_roles").insert({ user_id: data.userId, role: data.role });
    }
    await supabaseAdmin.from("permisos_seccion").delete().eq("user_id", data.userId);
    if (data.secciones.length > 0) {
      await supabaseAdmin
        .from("permisos_seccion")
        .insert(data.secciones.map((seccion) => ({ user_id: data.userId, seccion })));
    }
    await supabaseAdmin.from("auditoria").insert({
      user_id: context.userId,
      accion: "actualizar",
      entidad: "administrador",
      entidad_id: data.userId,
      detalle: `rol=${data.role ?? "ninguno"} secciones=${data.secciones.join(",")} activo=${data.activo}`,
    });
    return { ok: true };
  });

export const eliminarAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await exigirSuperAdmin(context as any);
    if (data.userId === context.userId) throw new Error("No podés eliminar tu propia cuenta");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.auth.admin.deleteUser(data.userId);
    await supabaseAdmin.from("perfiles").delete().eq("id", data.userId);
    await supabaseAdmin.from("auditoria").insert({
      user_id: context.userId,
      accion: "eliminar",
      entidad: "administrador",
      entidad_id: data.userId,
      detalle: "cuenta eliminada",
    });
    return { ok: true };
  });

export const crearInvitacion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        email: z.string().email().max(200),
        role: rolEnum,
        secciones: z.array(seccionEnum),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await exigirSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const codigo = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
    const { error } = await supabaseAdmin.from("invitaciones").insert({
      codigo,
      email: data.email.toLowerCase(),
      role: data.role,
      secciones: data.secciones,
      creada_por: context.userId,
    });
    if (error) throw new Error(error.message);
    return { codigo };
  });

export const revocarInvitacion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await exigirSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("invitaciones").update({ revocada: true }).eq("id", data.id);
    return { ok: true };
  });

/** Canjea una invitación para la cuenta autenticada. */
export const canjearInvitacion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ codigo: z.string().trim().min(6).max(40) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inv } = await supabaseAdmin
      .from("invitaciones")
      .select("*")
      .eq("codigo", data.codigo.toUpperCase())
      .maybeSingle();
    if (!inv || inv.revocada || inv.usada_por || new Date(inv.expira_en) < new Date()) {
      throw new Error("La invitación no es válida o venció");
    }
    const email = (context.claims as { email?: string } | null)?.email?.toLowerCase();
    if (email && inv.email && email !== inv.email) {
      throw new Error("La invitación fue emitida para otro correo");
    }
    await supabaseAdmin.from("user_roles").delete().eq("user_id", context.userId);
    await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: inv.role });
    if (inv.secciones.length > 0) {
      await supabaseAdmin
        .from("permisos_seccion")
        .upsert(
          inv.secciones.map((seccion: string) => ({ user_id: context.userId, seccion })),
          { onConflict: "user_id,seccion" },
        );
    }
    await supabaseAdmin
      .from("invitaciones")
      .update({ usada_por: context.userId, usada_en: new Date().toISOString() })
      .eq("id", inv.id);
    return { ok: true };
  });
