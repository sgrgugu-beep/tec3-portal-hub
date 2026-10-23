import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from '@tanstack/react-router';
import { AlertTriangle } from 'lucide-react';

function LogoWhatsapp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
import { consultaAvisos, consultaConfig } from '@/lib/consultas';
import { avisosUrgentes, enlaceWhatsapp } from '@/lib/media';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function ComunicacionGlobal(){
 const {data:avisos=[]}=useQuery(consultaAvisos);const {data:config={}}=useQuery(consultaConfig);
 const path=useLocation({select:l=>l.pathname});const admin=path.startsWith('/admin')||path==='/auth';
 const urgentes=avisosUrgentes(avisos);const firma=urgentes.map(a=>a.slug+a.titulo+a.cuerpo).join('|');
 const [abierto,setAbierto]=useState(false);const [leido,setLeido]=useState('');
 useEffect(()=>{if(firma&&firma!==leido&&!admin)setAbierto(true)},[firma,leido,admin]);
 const whatsapp=enlaceWhatsapp(config['whatsapp_difusion']??'');
 if(admin)return null;
 return <>
 {urgentes.length>0&&<aside role="alert" className="bg-destructive text-destructive-foreground"><div className="contenedor grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-4"><AlertTriangle className="size-6 shrink-0"/><div className="min-w-0"><p className="technical-label">Aviso urgente</p><p className="mt-1 text-sm font-semibold">{urgentes.map(a=>a.titulo).join(' · ')}</p></div><Button variant="ghost" className="shrink-0 text-destructive-foreground hover:bg-destructive-foreground/10 hover:text-destructive-foreground" onClick={()=>setAbierto(true)}>Ver aviso</Button></div></aside>}
 {whatsapp&&<Button asChild className="fixed bottom-6 left-6 z-40 h-14 gap-2.5 rounded-full bg-success px-5 text-base font-semibold text-success-foreground shadow-elevado transition-transform hover:scale-105 hover:bg-success/90"><a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Grupo de difusión de WhatsApp" title="Difusión de WhatsApp"><LogoWhatsapp className="size-7"/><span className="hidden sm:inline">Difusión WhatsApp</span></a></Button>}
 <Dialog open={abierto&&urgentes.length>0} onOpenChange={v=>{setAbierto(v);if(!v)setLeido(firma)}}><DialogContent className="max-h-[85vh] overflow-y-auto border-destructive"><DialogTitle className="flex items-center gap-3 text-destructive"><AlertTriangle/>Aviso urgente</DialogTitle><DialogDescription>Información importante para la comunidad educativa</DialogDescription>{urgentes.map(a=><article key={a.slug} className="py-3"><h2 className="text-xl font-semibold">{a.titulo}</h2><p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{a.cuerpo||a.resumen}</p></article>)}<Button onClick={()=>{setLeido(firma);setAbierto(false)}}>Ya lo leí</Button><Button asChild variant="link" onClick={()=>{setLeido(firma);setAbierto(false)}}><Link to="/avisos">Todos los avisos</Link></Button></DialogContent></Dialog>
 </>
}