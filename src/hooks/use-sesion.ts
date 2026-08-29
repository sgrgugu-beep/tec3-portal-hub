import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Seccion = Database["public"]["Enums"]["seccion_sitio"];
export type Rol = Database["public"]["Enums"]["app_role"];

export interface EstadoSesion {
  cargando: boolean;
  user: User | null;
  nombre: string;
  activo: boolean;
  rol: Rol | null;
  secciones: Seccion[];
  puede: (seccion: Seccion) => boolean;
  refrescar: () => Promise<void>;
}

export function useSesion(): EstadoSesion {
  const [cargando, setCargando] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [nombre, setNombre] = useState("");
  const [activo, setActivo] = useState(true);
  const [rol, setRol] = useState<Rol | null>(null);
  const [secciones, setSecciones] = useState<Seccion[]>([]);

  async function cargar() {
    const { data } = await supabase.auth.getUser();
    const actual = data.user ?? null;
    setUser(actual);
    if (!actual) {
      setRol(null);
      setSecciones([]);
      setCargando(false);
      return;
    }
    const [perfil, roles, permisos] = await Promise.all([
      supabase.from("perfiles").select("nombre, activo").eq("id", actual.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", actual.id),
      supabase.from("permisos_seccion").select("seccion").eq("user_id", actual.id),
    ]);
    setNombre(perfil.data?.nombre ?? actual.email ?? "");
    setActivo(perfil.data?.activo ?? true);
    setRol((roles.data?.[0]?.role as Rol | undefined) ?? null);
    setSecciones((permisos.data ?? []).map((p) => p.seccion as Seccion));
    setCargando(false);
  }

  useEffect(() => {
    void cargar();
    const { data: sub } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === "SIGNED_IN" || evento === "SIGNED_OUT" || evento === "USER_UPDATED") {
        void cargar();
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const puede = (seccion: Seccion) =>
    activo && (rol === "super_admin" || secciones.includes(seccion));

  return { cargando, user, nombre, activo, rol, secciones, puede, refrescar: cargar };
}
