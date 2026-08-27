interface Props {
  titulo: string;
  descripcion: string;
  volanta?: string;
}

export function EncabezadoPagina({ titulo, descripcion, volanta }: Props) {
  return (
    <section className="gradiente-institucional text-primary-foreground">
      <div className="contenedor py-14 md:py-20">
        {volanta && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
            {volanta}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight md:text-5xl">
          {titulo}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
          {descripcion}
        </p>
      </div>
    </section>
  );
}
