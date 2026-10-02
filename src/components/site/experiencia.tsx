import { useLocation } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

/** Barra de progreso de scroll + botón "volver arriba". */
export function ExperienciaScroll() {
  const [progreso, setProgreso] = useState(0);
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgreso(max > 0 ? window.scrollY / max : 0);
      setMostrar(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5" aria-hidden="true">
        <div
          className="h-full origin-left bg-accent transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progreso})` }}
        />
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Volver arriba"
        className={`fixed bottom-6 right-6 z-50 grid size-11 place-items-center rounded-full border border-border bg-card text-foreground shadow-elevado transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent ${
          mostrar ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
    </>
  );
}

/** Transición suave entre páginas y vuelta al tope al navegar. */
export function TransicionPagina({ children }: { children: ReactNode }) {
  const pathname = useLocation({ select: (l) => l.pathname });
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return (
    <div key={pathname} className="transicion-pagina">
      {children}
    </div>
  );
}
