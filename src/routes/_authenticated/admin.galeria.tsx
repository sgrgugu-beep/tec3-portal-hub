import { createFileRoute } from '@tanstack/react-router';
import { GestorGaleria } from '@/components/admin/gestor-galeria';
import { useSesion } from '@/hooks/use-sesion';
export const Route=createFileRoute('/_authenticated/admin/galeria')({
  head: () => ({ meta: [{ title: "Administrar galería — Técnica 3 Avellaneda" }, { name: 'description', content: "Administrar galería de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:title', content: "Administrar galería — Técnica 3 Avellaneda" }, { property: 'og:description', content: "Administrar galería de Técnica 3 Avellaneda. Acceso exclusivo para administradores autorizados." }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' }] }),
component:()=>{const sesion=useSesion();return <GestorGaleria puede={sesion.puede('galeria')}/>}});
