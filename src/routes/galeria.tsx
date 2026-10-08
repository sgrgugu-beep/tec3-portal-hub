import { useEffect, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Images, Play, Search } from "lucide-react";
import { EncabezadoPagina } from "@/components/site/encabezado-pagina";
import { ErrorContenido } from "@/components/site/estado-ruta";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { consultaAlbumes } from "@/lib/consultas";

const titulo="Galería de fotos y videos — Técnica 3 Avellaneda";
const descripcion="La vida de Técnica 3 Avellaneda: proyectos, prácticas, encuentros y talleres en fotos y videos.";
export const Route=createFileRoute('/galeria')({
 head:()=>({meta:[{title:titulo},{name:'description',content:descripcion},{property:'og:title',content:titulo},{property:'og:description',content:descripcion},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 loader:({context})=>context.queryClient.ensureQueryData(consultaAlbumes),errorComponent:ErrorContenido,component:Galeria,
});
function Galeria(){
 const {data:albumes}=useSuspenseQuery(consultaAlbumes);
 const [album,setAlbum]=useState('todos');const [tipo,setTipo]=useState('todos');const [busqueda,setBusqueda]=useState('');const [indice,setIndice]=useState<number|null>(null);
 const medios=useMemo(()=>albumes.flatMap(a=>a.fotos.map((f,i)=>({...f,id:`${a.slug}-${i}`,album:a.titulo,slug:a.slug}))).filter(f=>(album==='todos'||f.slug===album)&&(tipo==='todos'||(f.tipo??'foto')===tipo)&&`${f.alt} ${f.album}`.toLowerCase().includes(busqueda.toLowerCase())),[albumes,album,tipo,busqueda]);
 const actual=indice===null?null:medios[indice];
 const mover=(delta:number)=>setIndice(i=>i===null||medios.length===0?null:(i+delta+medios.length)%medios.length);
 useEffect(()=>{if(indice===null)return;const tecla=(e:KeyboardEvent)=>{if(e.key==='ArrowRight'){e.preventDefault();mover(1)}if(e.key==='ArrowLeft'){e.preventDefault();mover(-1)}};window.addEventListener('keydown',tecla);return()=>window.removeEventListener('keydown',tecla)},[indice,medios.length]);
 return <>
 <EncabezadoPagina volanta="Nuestra escuela en imágenes" titulo="Galería" descripcion="Un recorrido por los proyectos de los talleres, los actos institucionales y las jornadas que compartimos con la comunidad educativa."/>
 <div className="contenedor py-10 sm:py-14">
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
   <fieldset className="min-w-0"><legend className="text-sm font-semibold">Álbumes</legend><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant={album==='todos'?'default':'outline'} aria-pressed={album==='todos'} onClick={()=>setAlbum('todos')}>Todos</Button>{albumes.filter(a=>a.fotos.length>0).map(a=><Button key={a.slug} size="sm" variant={album===a.slug?'default':'outline'} aria-pressed={album===a.slug} onClick={()=>setAlbum(a.slug)}>{a.titulo}</Button>)}</div></fieldset>
   <div className="relative min-w-0"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input aria-label="Buscar en la galería" placeholder="Buscar fotos o videos" className="pl-9" value={busqueda} onChange={e=>setBusqueda(e.target.value)}/></div>
  </div>
  <div className="mt-7 flex flex-wrap items-center justify-between gap-4"><div className="flex gap-1 rounded-lg bg-muted p-1">{[{valor:'todos',nombre:'Todo'},{valor:'foto',nombre:'Fotos'},{valor:'video',nombre:'Videos'}].map(t=><Button key={t.valor} size="sm" variant={tipo===t.valor?'default':'ghost'} aria-pressed={tipo===t.valor} onClick={()=>setTipo(t.valor)}>{t.nombre}</Button>)}</div><p className="text-sm text-muted-foreground" role="status">{medios.length} {medios.length===1?'archivo':'archivos'}</p></div>
  <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">{medios.map((f,i)=><div key={f.id} className="mb-5 break-inside-avoid"><Reveal delay={(i%3)*70} className="media-reveal"><Button variant="ghost" className="group block h-auto w-full overflow-hidden rounded-lg border border-border bg-card p-0 text-left shadow-institucional hover:bg-card" aria-label={`Abrir ${f.tipo==='video'?'video':'foto'}: ${f.alt}`} onClick={()=>setIndice(i)}><div className="relative overflow-hidden">{f.tipo==='video'?<><video src={f.src} poster={f.miniatura||undefined} muted preload="metadata" className="aspect-video w-full object-cover"/><span className="absolute inset-0 grid place-items-center"><span className="grid size-12 place-items-center rounded-full bg-institutional text-institutional-foreground"><Play className="size-5"/></span></span></>:<img src={f.src} alt={f.alt} loading="lazy" decoding="async" className="h-auto max-h-[36rem] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"/>}</div><div className="whitespace-normal p-4"><p className="technical-label text-accent">{f.album}</p><p className="mt-2 text-sm font-medium leading-relaxed">{f.alt||'Nuestra escuela en imágenes'}</p></div></Button></Reveal></div>)}</div>
  {medios.length===0&&<div className="py-20 text-center"><Images className="mx-auto size-10 text-accent"/><h2 className="mt-4 text-xl font-semibold">Todavía no hay archivos para esta selección</h2><Button variant="link" onClick={()=>{setAlbum('todos');setTipo('todos');setBusqueda('')}}>Ver toda la galería</Button></div>}
 </div>
 <Dialog open={actual!=null} onOpenChange={v=>{if(!v)setIndice(null)}}><DialogContent className="max-h-[95vh] overflow-y-auto p-3 sm:max-w-5xl"><DialogTitle className="pr-8 text-base">{actual?.alt||'Galería'}</DialogTitle><DialogDescription>{actual?.album}</DialogDescription>{actual&&(actual.tipo==='video'?<video key={actual.src} src={actual.src} controls playsInline autoPlay poster={actual.miniatura||undefined} className="max-h-[65vh] w-full bg-institutional"/>:<img src={actual.src} alt={actual.alt} className="max-h-[65vh] w-full object-contain"/>)}<div className="flex items-center justify-between"><Button variant="outline" size="icon" aria-label="Archivo anterior" onClick={()=>mover(-1)} disabled={medios.length<2}><ArrowLeft/></Button><p aria-live="polite" className="text-sm text-muted-foreground">{indice===null?0:indice+1} / {medios.length}</p><Button variant="outline" size="icon" aria-label="Archivo siguiente" onClick={()=>mover(1)} disabled={medios.length<2}><ArrowRight/></Button></div></DialogContent></Dialog>
 </>;
}
