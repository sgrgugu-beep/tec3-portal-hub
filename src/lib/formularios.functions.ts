import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Validación y anti-spam de los formularios públicos.
 *
 * Nota de arquitectura: la validación vive del lado servidor (nunca solo en el
 * cliente). Cuando se conecte el proyecto propio de Supabase, estos handlers
 * pasan a insertar el mensaje en la tabla `mensajes_contacto` /
 * `propuestas_centro` y a delegar el envío de mail a una Edge Function, sin
 * exponer la dirección de destino en el cliente.
 */

const esquemaBase = {
  nombre: z.string().trim().min(2, "Ingresá tu nombre").max(100),
  email: z.string().trim().email("Ingresá un correo válido").max(255),
  mensaje: z.string().trim().min(10, "Contanos un poco más").max(2000),
  // Campo trampa para bots: debe llegar vacío.
  honeypot: z.string().max(0).optional().default(""),
};

const esquemaContacto = z.object({
  ...esquemaBase,
  asunto: z.string().trim().min(3, "Ingresá un asunto").max(150),
});

const esquemaPropuesta = z.object({
  ...esquemaBase,
  curso: z.string().trim().min(1, "Indicá tu curso").max(60),
});

/** Rate limiting simple por proceso (se reemplaza por control en base al migrar). */
const ventana = 60_000;
const maximo = 3;
const registros = new Map<string, number[]>();

function permitido(clave: string) {
  const ahora = Date.now();
  const previos = (registros.get(clave) ?? []).filter((t) => ahora - t < ventana);
  if (previos.length >= maximo) return false;
  previos.push(ahora);
  registros.set(clave, previos);
  return true;
}

export const enviarContacto = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => esquemaContacto.parse(data))
  .handler(async ({ data }) => {
    if (!permitido(`contacto:${data.email.toLowerCase()}`)) {
      return {
        ok: false as const,
        mensaje: "Recibimos varios mensajes desde esta dirección. Probá nuevamente en unos minutos.",
      };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("mensajes_contacto").insert({
      nombre: data.nombre,
      email: data.email,
      asunto: data.asunto,
      mensaje: data.mensaje,
    });
    if (error) throw new Error("No pudimos registrar tu mensaje. Probá nuevamente.");
    return {
      ok: true as const,
      mensaje:
        "Recibimos tu mensaje. La escuela responde en el horario de atención administrativa.",
    };
  });

export const enviarPropuesta = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => esquemaPropuesta.parse(data))
  .handler(async ({ data }) => {
    if (!permitido(`propuesta:${data.email.toLowerCase()}`)) {
      return {
        ok: false as const,
        mensaje: "Ya enviaste varias propuestas seguidas. Esperá unos minutos antes de reintentar.",
      };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("propuestas_centro").insert({
      nombre: data.nombre,
      email: data.email,
      curso: data.curso,
      propuesta: data.mensaje,
    });
    if (error) throw new Error("No pudimos registrar tu propuesta. Probá nuevamente.");
    return {
      ok: true as const,
      mensaje: "Tu propuesta llegó al Centro de Estudiantes. ¡Gracias por participar!",
    };
  });
