import { useQuery } from "@tanstack/react-query";

import { consultaConfig } from "@/lib/consultas";
import { textosPorDefecto } from "@/lib/textos-sitio";

/** Devuelve t(clave): el texto cargado en el panel o su valor por defecto. */
export function useTextos() {
  const { data: config = {} } = useQuery(consultaConfig);
  return (clave: string, respaldo?: string) => {
    const valor = config[clave]?.trim();
    if (valor) return valor;
    return respaldo ?? textosPorDefecto[clave] ?? "";
  };
}
