import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useSesion } from "@/hooks/use-sesion";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: PanelInicio,
});

function PanelInicio() {
  const sesion = useSesion();
  const [resumen, setResumen] = useState({
    avisos: 0,
    eventos: 0,
    capacitaciones: 0,
    admins: 0,
    mensajes: 0,
  });

  useEffect(() => {
    async function cargar() {
      const contar = async (tabla: string) => {
        const { count } = await (supabase as any)
          .from(tabla)
          .select("id", { count: "exact", head: true });
        return count ?? 0;
      };
      setResumen({
        avisos: await contar("avisos"),
        eventos: await contar("eventos"),
        capacitaciones: await contar("capacitaciones"),
        admins: await contar("perfiles"),
        mensajes: await contar("mensajes_contacto"),
      });
    }
    void cargar();
  }, []);

  const tarjetas = [
    { titulo: "Avisos", valor: resumen.avisos },
    { titulo: "Eventos", valor: resumen.eventos },
    { titulo: "Capacitaciones", valor: resumen.capacitaciones },
    { titulo: "Administradores", valor: resumen.admins },
    { titulo: "Mensajes recibidos", valor: resumen.mensajes },
  ];

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">
          Hola{sesion.nombre ? `, ${sesion.nombre}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          {sesion.rol === "super_admin"
            ? "Tenés control total del sitio."
            : `Podés gestionar: ${sesion.secciones.join(", ") || "ninguna sección aún"}.`}
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tarjetas.map((t) => (
          <Card key={t.titulo}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold">{t.valor}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
