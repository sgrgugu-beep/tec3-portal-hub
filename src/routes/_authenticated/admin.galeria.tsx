import { createFileRoute } from '@tanstack/react-router';
import { GestorGaleria } from '@/components/admin/gestor-galeria';
import { useSesion } from '@/hooks/use-sesion';
export const Route=createFileRoute('/_authenticated/admin/galeria')({component:()=>{const sesion=useSesion();return <GestorGaleria puede={sesion.puede('galeria')}/>}});
