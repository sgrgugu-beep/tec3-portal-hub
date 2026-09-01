import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import { formatearFecha } from "@/lib/contenido";
import type {
  Album,
  Autoridad,
  Aviso,
  Capacitacion,
  Categoria,
  Especialidad,
  EspecialidadSlug,
  EventoCalendario,
  IntegranteCentro,
  Materia,
  ResultadoBusqueda,
} from "@/lib/contenido";

/**
 * Acceso de lectura pública a la base (rol anónimo, protegido por RLS).
 * Las políticas `TO anon` sólo exponen filas publicadas.
 */
export function clientePublico(): SupabaseClient<Database> {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const ambitoPorTipo = {
  aviso: "avisos",
  evento: "calendario",
  capacitacion: "capacitaciones",
  galeria: "galeria",
} as const;

export async function obtenerCategorias(): Promise<Categoria[]> {
  const { data, error } = await clientePublico()
    .from("categorias")
    .select("slug, nombre, tipo")
    .order("orden", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((c) => ({
    slug: c.slug,
    nombre: c.nombre,
    ambito: ambitoPorTipo[c.tipo],
  }));
}

export async function obtenerAvisos(): Promise<Aviso[]> {
  const { data, error } = await clientePublico()
    .from("avisos")
    .select("*")
    .eq("publicado", true)
    .order("destacado", { ascending: false })
    .order("fecha", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((a) => ({
    slug: a.slug,
    titulo: a.titulo,
    resumen: a.resumen,
    cuerpo: a.cuerpo,
    categoria: a.categoria_slug,
    fecha: a.fecha,
    destacado: a.destacado,
    estado: "publicado",
    imagen: a.imagen_url ?? undefined,
  }));
}

export async function obtenerEventos(): Promise<EventoCalendario[]> {
  const { data, error } = await clientePublico()
    .from("eventos")
    .select("*")
    .eq("publicado", true)
    .order("fecha", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((e) => ({
    slug: e.id,
    titulo: e.titulo,
    tipo: e.tipo_slug,
    fecha: e.fecha,
    horario: e.hora_inicio
      ? e.hora_fin
        ? `${e.hora_inicio} a ${e.hora_fin}`
        : e.hora_inicio
      : "Horario a confirmar",
    lugar: e.lugar,
    descripcion: e.descripcion,
  }));
}

export async function obtenerEspecialidades(): Promise<Especialidad[]> {
  const { data, error } = await clientePublico()
    .from("especialidades")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((e) => ({
    slug: e.slug as EspecialidadSlug,
    nombre: e.nombre,
    nombreCorto: e.nombre_corto,
    resumen: e.descripcion,
    salidaLaboral: e.salida_laboral,
  }));
}

export async function obtenerMaterias(): Promise<Materia[]> {
  const { data, error } = await clientePublico()
    .from("materias")
    .select("*")
    .order("anio", { ascending: true })
    .order("orden", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((m) => ({
    slug: m.id,
    nombre: m.nombre,
    anio: m.anio,
    ciclo: m.ciclo as Materia["ciclo"],
    especialidad: (m.especialidad_slug ?? undefined) as EspecialidadSlug | undefined,
    cargaHoraria: m.carga_horaria ?? "",
    descripcion: m.descripcion,
  }));
}

export async function obtenerCapacitaciones(): Promise<Capacitacion[]> {
  const { data, error } = await clientePublico()
    .from("capacitaciones")
    .select("*")
    .eq("publicado", true)
    .order("fecha_inicio", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((c) => ({
    slug: c.id,
    titulo: c.titulo,
    descripcion: c.descripcion,
    dicta: c.dictada_por,
    destinatarios: c.destinatarios,
    modalidad: c.modalidad as Capacitacion["modalidad"],
    fecha: c.fecha_inicio ?? "",
    duracion: c.duracion ?? "",
    area: c.area_slug,
    estado: c.estado as Capacitacion["estado"],
  }));
}

export async function obtenerIntegrantes(): Promise<IntegranteCentro[]> {
  const { data, error } = await clientePublico()
    .from("integrantes_centro")
    .select("nombre, cargo, curso")
    .order("orden", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((i) => ({
    nombre: i.nombre,
    rol: i.cargo,
    curso: i.curso ?? "",
  }));
}

export async function obtenerAutoridades(): Promise<Autoridad[]> {
  const { data, error } = await clientePublico()
    .from("autoridades")
    .select("nombre, cargo")
    .order("orden", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((a) => ({ nombre: a.nombre, cargo: a.cargo }));
}

export async function obtenerAlbumes(): Promise<Album[]> {
  const cliente = clientePublico();
  const [{ data: albumes, error: errorAlbumes }, { data: fotos, error: errorFotos }] =
    await Promise.all([
      cliente
        .from("albumes")
        .select("*")
        .eq("publicado", true)
        .order("fecha", { ascending: false }),
      cliente.from("fotos").select("*").order("orden", { ascending: true }),
    ]);
  if (errorAlbumes) throw new Error(errorAlbumes.message);
  if (errorFotos) throw new Error(errorFotos.message);
  return (albumes ?? []).map((a) => ({
    slug: a.slug,
    titulo: a.titulo,
    categoria: a.categoria_slug,
    descripcion: a.descripcion,
    fotos: (fotos ?? [])
      .filter((f) => f.album_id === a.id)
      .map((f) => ({ src: f.url, alt: f.alt })),
  }));
}

export async function obtenerConfiguracion(): Promise<Record<string, string>> {
  const { data, error } = await clientePublico()
    .from("configuracion_sitio")
    .select("clave, valor");
  if (error) throw new Error(error.message);
  return Object.fromEntries((data ?? []).map((c) => [c.clave, c.valor]));
}

export async function buscarTodo(consulta: string): Promise<ResultadoBusqueda[]> {
  const q = consulta.trim().toLowerCase();
  if (q.length < 2) return [];
  const [avisos, materias, capacitaciones, eventos, categorias, especialidades] =
    await Promise.all([
      obtenerAvisos(),
      obtenerMaterias(),
      obtenerCapacitaciones(),
      obtenerEventos(),
      obtenerCategorias(),
      obtenerEspecialidades(),
    ]);
  const nombreCategoria = (slug: string) =>
    categorias.find((c) => c.slug === slug)?.nombre ?? slug;
  const coincide = (...campos: string[]) => campos.join(" ").toLowerCase().includes(q);

  return [
    ...avisos
      .filter((a) => coincide(a.titulo, a.resumen, a.cuerpo, nombreCategoria(a.categoria)))
      .map<ResultadoBusqueda>((a) => ({
        tipo: "Avisos",
        titulo: a.titulo,
        detalle: `${nombreCategoria(a.categoria)} · ${formatearFecha(a.fecha)}`,
        ruta: "/avisos",
      })),
    ...materias
      .filter((m) => coincide(m.nombre, m.descripcion))
      .map<ResultadoBusqueda>((m) => ({
        tipo: "Materias",
        titulo: m.nombre,
        detalle: `${m.anio}° año · ${m.especialidad ? (especialidades.find((e) => e.slug === m.especialidad)?.nombreCorto ?? "") : "Ciclo Básico"}`,
        ruta: "/materias",
      })),
    ...capacitaciones
      .filter((c) => coincide(c.titulo, c.descripcion, c.area, c.dicta))
      .map<ResultadoBusqueda>((c) => ({
        tipo: "Capacitaciones",
        titulo: c.titulo,
        detalle: `${c.area} · ${c.estado}`,
        ruta: "/capacitaciones",
      })),
    ...eventos
      .filter((e) => coincide(e.titulo, e.descripcion, e.lugar, nombreCategoria(e.tipo)))
      .map<ResultadoBusqueda>((e) => ({
        tipo: "Calendario",
        titulo: e.titulo,
        detalle: `${formatearFecha(e.fecha)} · ${e.lugar}`,
        ruta: "/calendario",
      })),
  ];
}
