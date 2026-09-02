import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

/** Estado de error para rutas con carga de datos. */
export function ErrorContenido() {
  return (
    <div className="contenedor py-24 text-center">
      <h1 className="titulo-seccion">No pudimos cargar el contenido</h1>
      <p className="mt-3 text-muted-foreground">
        Hubo un problema al conectar con el servidor. Volvé a intentar en unos minutos o
        comunicate con la escuela.
      </p>
      <Button asChild className="mt-6">
        <Link to="/contacto">Ir a Contacto</Link>
      </Button>
    </div>
  );
}

/** Estado de contenido inexistente. */
export function ContenidoNoEncontrado() {
  return (
    <div className="contenedor py-24 text-center">
      <h1 className="titulo-seccion">No encontramos esta página</h1>
      <p className="mt-3 text-muted-foreground">
        Puede que el contenido haya cambiado de dirección.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
