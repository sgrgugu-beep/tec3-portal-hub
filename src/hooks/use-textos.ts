import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";

import { consultaConfig } from "@/lib/consultas";
import { textosPorDefecto } from "@/lib/textos-sitio";

/** Devuelve t(clave): el texto cargado en el panel o su valor por defecto. */
export function useTextos() {
  const inicial = useRouterState({
    select: (s) => (s.matches[0]?.loaderData as { config?: Record<string, string> } | undefined)?.config,
  });
  const { data } = useQuery(consultaConfig);
  const config: Record<string, string> = data ?? inicial ?? {};
  return (clave: string, respaldo?: string) => {
    const valor = config[clave]?.trim();
    if (valor) return valor;
    return respaldo ?? textosPorDefecto[clave] ?? "";
  };
}
