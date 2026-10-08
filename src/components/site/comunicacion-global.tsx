import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from '@tanstack/react-router';
import { AlertTriangle, MessageCircle } from 'lucide-react';
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
 {whatsapp&&<Button asChild size="icon" className="fixed bottom-6 left-6 z-40 size-12 rounded-full bg-success text-success-foreground shadow-elevado hover:bg-success/90"><a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Grupo de difusión de WhatsApp" title="Difusión de WhatsApp"><MessageCircle className="size-6"/></a></Button>}
 <Dialog open={abierto&&urgentes.length>0} onOpenChange={v=>{setAbierto(v);if(!v)setLeido(firma)}}><DialogContent className="max-h-[85vh] overflow-y-auto border-destructive"><DialogTitle className="flex items-center gap-3 text-destructive"><AlertTriangle/>Aviso urgente</DialogTitle><DialogDescription>Información importante para la comunidad educativa</DialogDescription>{urgentes.map(a=><article key={a.slug} className="py-3"><h2 className="text-xl font-semibold">{a.titulo}</h2><p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{a.cuerpo||a.resumen}</p></article>)}<Button onClick={()=>{setLeido(firma);setAbierto(false)}}>Ya lo leí</Button><Button asChild variant="link" onClick={()=>{setLeido(firma);setAbierto(false)}}><Link to="/avisos">Todos los avisos</Link></Button></DialogContent></Dialog>
 </>
}