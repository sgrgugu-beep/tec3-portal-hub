import { createFileRoute } from "@tanstack/react-router";

import { CrudSeccion } from "@/components/admin/crud-seccion";
import { useSesion } from "@/hooks/use-sesion";
import { ConfiguracionDifusion } from '@/components/admin/configuracion-difusion';

export const Route = createFileRoute("/_authenticated/admin/configuracion")({
  head: () => ({ meta: [{ title: "Configuración del sitio — Técnica 3 Avellaneda" }, { name: 'description', content: "Configuración del sitio de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:title', content: "Configuración del sitio — Técnica 3 Avellaneda" }, { property: 'og:description', content: "Configuración del sitio de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' }] }),

  component: AdminConfiguracion,
});

function AdminConfiguracion() {
  const sesion = useSesion();
  return (
    <div className="space-y-10"><h1 className="text-3xl font-semibold">Configuración del sitio</h1><ConfiguracionDifusion puede={sesion.puede('configuracion')}/>
    <CrudSeccion
      tabla="configuracion_sitio"
      clavePrimaria="clave"
      titulo="Configuración del sitio"
      descripcion="Datos de contacto, textos institucionales y redes sociales."
      puedeEditar={sesion.puede("configuracion")}
      ordenPor={{ columna: "grupo", asc: true }}
      campos={[
        { nombre: "clave", etiqueta: "Clave" },
        { nombre: "valor", etiqueta: "Valor", tipo: "area" },
        { nombre: "grupo", etiqueta: "Grupo", defecto: "general" },
        { nombre: "descripcion", etiqueta: "Descripción", ocultarEnTabla: true },
      ]}
    />
    </div>
  );
}
