import { queryOptions } from "@tanstack/react-query";

import {
  buscarSitio,
  listarAlbumes,
  listarAutoridades,
  listarAvisos,
  listarCapacitaciones,
  listarCategorias,
  listarEspecialidades,
  listarEventos,
  listarIntegrantes,
  listarMaterias,
} from "@/lib/datos.functions";

/**
 * Opciones de consulta del sitio público.
 * Toda la información proviene de la base de datos (ver SCHEMA.md).
 */
export const consultaAvisos = queryOptions({
  queryKey: ["avisos"],
  queryFn: () => listarAvisos(),
});

export const consultaEventos = queryOptions({
  queryKey: ["eventos"],
  queryFn: () => listarEventos(),
});

export const consultaMaterias = queryOptions({
  queryKey: ["materias"],
  queryFn: () => listarMaterias(),
});

export const consultaEspecialidades = queryOptions({
  queryKey: ["especialidades"],
  queryFn: () => listarEspecialidades(),
});

export const consultaCapacitaciones = queryOptions({
  queryKey: ["capacitaciones"],
  queryFn: () => listarCapacitaciones(),
});

export const consultaIntegrantes = queryOptions({
  queryKey: ["integrantes"],
  queryFn: () => listarIntegrantes(),
});

export const consultaAutoridades = queryOptions({
  queryKey: ["autoridades"],
  queryFn: () => listarAutoridades(),
});

export const consultaAlbumes = queryOptions({
  queryKey: ["albumes"],
  queryFn: () => listarAlbumes(),
});

export const consultaCategorias = queryOptions({
  queryKey: ["categorias"],
  queryFn: () => listarCategorias(),
});

export const consultaBusqueda = (consulta: string) =>
  queryOptions({
    queryKey: ["busqueda", consulta],
    queryFn: () => buscarSitio({ data: { consulta } }),
    enabled: consulta.trim().length >= 2,
    staleTime: 30_000,
  });
