import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";

import { consultaConfig } from "@/lib/consultas";
import { escuela } from "@/lib/contenido";

/**
 * Textos institucionales editables desde el panel (tabla configuracion_sitio).
 * Cada valor tiene un respaldo por si la clave aún no está cargada.
 */
export function useConfig() {
  const inicial = useRouterState({
    select: (s) => (s.matches[0]?.loaderData as { config?: Record<string, string> } | undefined)?.config,
  });
  const { data } = useQuery(consultaConfig);
  const config: Record<string, string> = data ?? inicial ?? {};
  const texto = (clave: string, respaldo: string) => {
    const valor = config[clave]?.trim();
    return valor ? valor : respaldo;
  };
  return {
    nombre: texto("nombre_escuela", escuela.nombre),
    nombreCorto: texto("nombre_corto", escuela.nombreCorto),
    lema: texto("lema", escuela.lema),
    direccion: texto("direccion", `${escuela.direccion}, ${escuela.localidad}`),
    telefono: texto("telefono", escuela.telefono),
    email: texto("email", escuela.email),
    emailCentro: texto("email_centro", escuela.emailCentroEstudiantes),
    horarios: texto("horarios", escuela.horarios),
    instagram: texto("instagram", escuela.redes.instagram),
    facebook: texto("facebook", escuela.redes.facebook),
    youtube: texto("youtube", escuela.redes.youtube),
    whatsapp: config["whatsapp_difusion"]?.trim() ?? "",
  };
}
