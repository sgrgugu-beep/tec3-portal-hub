import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Tema = "claro" | "oscuro";

const CLAVE = "t3-tema";

export function ThemeToggle() {
  const [tema, setTema] = useState<Tema>("claro");
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    const guardado = window.localStorage.getItem(CLAVE) as Tema | null;
    const preferido: Tema =
      guardado ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro");
    setTema(preferido);
    document.documentElement.classList.toggle("dark", preferido === "oscuro");
    setMontado(true);
  }, []);

  const alternar = () => {
    const siguiente: Tema = tema === "oscuro" ? "claro" : "oscuro";
    setTema(siguiente);
    document.documentElement.classList.toggle("dark", siguiente === "oscuro");
    window.localStorage.setItem(CLAVE, siguiente);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={alternar}
      aria-label={
        tema === "oscuro" ? "Activar modo claro" : "Activar modo oscuro"
      }
      title={tema === "oscuro" ? "Modo claro" : "Modo oscuro"}
    >
      {montado && tema === "oscuro" ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </Button>
  );
}
