import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import logoEscuela from "@/assets/logo-eest3.jpg.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso administradores | E.E.S.T. N° 3 Avellaneda" },
      {
        name: "description",
        content:
          "Ingreso al panel de administración del sitio de la Escuela Técnica N° 3 de Avellaneda.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acceso administradores" },
      { property: "og:description", content: "Panel de gestión institucional." },
    ],
  }),
  component: PaginaAuth,
});

function PaginaAuth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function ingresar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setEnviando(false);
    if (error) {
      toast.error("No pudimos iniciar sesión: " + error.message);
      return;
    }
    await navigate({ to: "/admin" });
  }

  async function registrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre },
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    if (error) {
      setEnviando(false);
      toast.error("No pudimos crear la cuenta: " + error.message);
      return;
    }
    const { data } = await supabase.auth.getSession();
    setEnviando(false);
    if (!data.session) {
      toast.success("Cuenta creada. Revisá tu correo para confirmarla y luego ingresá.");
      return;
    }
    if (codigo.trim()) {
      const { canjearInvitacion } = await import("@/lib/admin.functions");
      try {
        await canjearInvitacion({ data: { codigo: codigo.trim() } });
      } catch (err) {
        toast.error((err as Error).message);
      }
    }
    await navigate({ to: "/admin" });
  }

  return (
    <div className="contenedor flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <img
            src={logoEscuela.url}
            alt="Escudo de la E.E.S.T. N° 3 República de México"
            className="size-12 rounded-md object-contain"
            width={48}
            height={48}
          />
          <div>
            <h1 className="font-display text-xl font-semibold">Panel de administración</h1>
            <p className="text-sm text-muted-foreground">Acceso exclusivo para el equipo.</p>
          </div>
        </div>

        <Tabs defaultValue="ingresar">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingresar">Ingresar</TabsTrigger>
            <TabsTrigger value="invitacion">Tengo una invitación</TabsTrigger>
          </TabsList>

          <TabsContent value="ingresar">
            <form className="space-y-4 pt-4" onSubmit={ingresar}>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? "Ingresando…" : "Ingresar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="invitacion">
            <form className="space-y-4 pt-4" onSubmit={registrar}>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre y apellido</Label>
                <Input
                  id="nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-alta">Correo electrónico</Label>
                <Input
                  id="email-alta"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-alta">Contraseña</Label>
                <Input
                  id="password-alta"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo">Código de invitación</Label>
                <Input
                  id="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ej. A1B2C3D4E5F6"
                />
              </div>
              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? "Creando cuenta…" : "Crear cuenta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
