import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  buscarTodo,
  obtenerAlbumes,
  obtenerAutoridades,
  obtenerAvisos,
  obtenerCapacitaciones,
  obtenerCategorias,
  obtenerConfiguracion,
  obtenerEspecialidades,
  obtenerEventos,
  obtenerIntegrantes,
  obtenerMaterias,
} from "@/lib/datos.server";

export const listarAvisos = createServerFn({ method: "GET" }).handler(() => obtenerAvisos());

export const listarEventos = createServerFn({ method: "GET" }).handler(() => obtenerEventos());

export const listarMaterias = createServerFn({ method: "GET" }).handler(() => obtenerMaterias());

export const listarEspecialidades = createServerFn({ method: "GET" }).handler(() =>
  obtenerEspecialidades(),
);

export const listarCapacitaciones = createServerFn({ method: "GET" }).handler(() =>
  obtenerCapacitaciones(),
);

export const listarIntegrantes = createServerFn({ method: "GET" }).handler(() =>
  obtenerIntegrantes(),
);

export const listarAutoridades = createServerFn({ method: "GET" }).handler(() =>
  obtenerAutoridades(),
);

export const listarAlbumes = createServerFn({ method: "GET" }).handler(() => obtenerAlbumes());

export const listarCategorias = createServerFn({ method: "GET" }).handler(() =>
  obtenerCategorias(),
);

export const obtenerConfig = createServerFn({ method: "GET" }).handler(() =>
  obtenerConfiguracion(),
);

export const buscarSitio = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ consulta: z.string().max(120) }).parse(data))
  .handler(({ data }) => buscarTodo(data.consulta));
