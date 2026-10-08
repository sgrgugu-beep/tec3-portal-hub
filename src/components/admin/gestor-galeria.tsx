import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Images, Upload, Pencil, Trash2, Eye, EyeOff, Film } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { subirMedio, vistaMedio } from '@/lib/upload-media';
import { enlaceSeguro, validarMedio } from '@/lib/media';
import { CrudSeccion } from './crud-seccion';

type Foto=Database['public']['Tables']['fotos']['Row'] & {preview:string};
type Album=Database['public']['Tables']['albumes']['Row'];
export function GestorGaleria({puede}:{puede:boolean}) {
 const query=useQueryClient();const archivo=useRef<HTMLInputElement>(null);
 const [albumes,setAlbumes]=useState<Album[]>([]);const [fotos,setFotos]=useState<Foto[]>([]);const [album,setAlbum]=useState('');const [cargando,setCargando]=useState(true);const [subiendo,setSubiendo]=useState(false);const [progreso,setProgreso]=useState('');const [editando,setEditando]=useState<Foto|null>(null);const [error,setError]=useState('');
 const [enlace,setEnlace]=useState('');const [tipo,setTipo]=useState('foto');const [alt,setAlt]=useState('');const [guardando,setGuardando]=useState(false);
 async function cargar(){
  setCargando(true);setError('');
  try{
   const [a,f]=await Promise.all([supabase.from('albumes').select('*').order('fecha',{ascending:false}),supabase.from('fotos').select('*').order('orden')]);
   if(a.error)throw a.error;if(f.error)throw f.error;
   setAlbumes(a.data);setAlbum(v=>a.data.some(x=>x.id===v)?v:a.data[0]?.id??'');
   setFotos(await Promise.all(f.data.map(async x=>({...x,preview:await vistaMedio(x.url)}))));
  }catch(e){setError(e instanceof Error?e.message:'No se pudo cargar la galería.')}finally{setCargando(false)}
 }
 useEffect(()=>{if(puede)void cargar()},[puede]);
 async function auditoria(accion:string,id:string,detalle:string){const {data}=await supabase.auth.getSession();const {error}=await supabase.from('auditoria').insert({user_id:data.session?.user.id,user_email:data.session?.user.email??'',accion,entidad:'fotos',entidad_id:id,detalle});if(error)toast.error('El cambio se guardó, pero no se pudo registrar en auditoría.')}
 async function actualizar(){await query.invalidateQueries();await cargar()}
 async function subir(files:File[]){
  if(!album||subiendo)return;
  for(const file of files){const error=validarMedio(file);if(error){toast.error(`${file.name}: ${error}`);return}}
  setSubiendo(true);let exitos=0;const fallos:string[]=[];
  try{for(const [i,file] of files.entries()){
   setProgreso(`${i+1} de ${files.length}: ${file.name}`);
   try{const medio=await subirMedio(file,'galeria');const texto=file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');const {data,error}=await supabase.from('fotos').insert({album_id:album,url:medio.valor,tipo:medio.tipo,alt:texto,orden:fotos.filter(f=>f.album_id===album).length+i,publicado:true}).select('id').single();
    if(error){await supabase.storage.from('galeria').remove([medio.path]);throw error}await auditoria('crear',data.id,texto);exitos++;
   }catch(e){fallos.push(`${file.name}: ${e instanceof Error?e.message:'Error al guardar'}`)}
  }}finally{setSubiendo(false);setProgreso('');if(archivo.current)archivo.current.value='';await actualizar()}
  if(exitos)toast.success(`${exitos} ${exitos===1?'archivo guardado':'archivos guardados'}`);if(fallos.length)toast.error(fallos.join('\n'));
 }
 async function cambiar(f:Foto){const {error}=await supabase.from('fotos').update({publicado:!f.publicado}).eq('id',f.id);if(error){toast.error(error.message);return}await auditoria('editar',f.id,!f.publicado?'Publicado':'Oculto');await actualizar()}
 async function eliminar(f:Foto){if(!window.confirm('¿Eliminar este archivo de la galería?'))return;const {error}=await supabase.from('fotos').delete().eq('id',f.id);if(error){toast.error(error.message);return}if(f.url.startsWith('storage:')){const r=await supabase.storage.from('galeria').remove([f.url.slice(8)]);if(r.error)toast.error('Se quitó de la galería, pero el archivo sigue en almacenamiento.')}await auditoria('eliminar',f.id,f.alt);toast.success('Archivo eliminado');await actualizar()}
 async function guardar(){if(!editando)return;if(!editando.alt.trim()){toast.error('Agregá una descripción del archivo.');return}setGuardando(true);try{const {error}=await supabase.from('fotos').update({alt:editando.alt,album_id:editando.album_id,orden:editando.orden,publicado:editando.publicado}).eq('id',editando.id);if(error)throw error;await auditoria('editar',editando.id,editando.alt);setEditando(null);toast.success('Cambios guardados');await actualizar()}catch(e){toast.error(e instanceof Error?e.message:'No se pudo guardar')}finally{setGuardando(false)}}
 async function agregarEnlace(){const safe=enlaceSeguro(enlace);if(!safe||!album||!alt.trim()){toast.error('Elegí un álbum, una descripción y un enlace HTTPS válido.');return}if(tipo==='video'&&!/\.(mp4|webm)(\?|$)/i.test(safe)){toast.error('El enlace debe apuntar a un archivo MP4 o WebM.');return}setGuardando(true);try{const {data,error}=await supabase.from('fotos').insert({album_id:album,url:safe,alt,tipo,orden:fotos.length,publicado:true}).select('id').single();if(error)throw error;await auditoria('crear',data.id,alt);setEnlace('');setAlt('');toast.success('Archivo agregado');await actualizar()}catch(e){toast.error(e instanceof Error?e.message:'No se pudo guardar')}finally{setGuardando(false)}}
 if(!puede)return <p>No tenés permisos para gestionar la galería.</p>;
 const listado=fotos.filter(f=>f.album_id===album);
 return <div className="space-y-12">
  <header><p className="technical-label text-accent">Comunidad / Imágenes</p><h1 className="mt-2 font-display text-3xl font-semibold">Galería</h1><p className="mt-2 text-muted-foreground">Fotos, videos y álbumes de la escuela.</p></header>
  <section className="space-y-5">
   <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><div><Label htmlFor="album-destino">Álbum</Label><select id="album-destino" className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={album} onChange={e=>setAlbum(e.target.value)}><option value="">Elegí un álbum</option>{albumes.map(a=><option key={a.id} value={a.id}>{a.titulo}{!a.publicado?' · Borrador':''}</option>)}</select></div><Button onClick={()=>archivo.current?.click()} disabled={!album||subiendo}><Upload/>{subiendo?'Subiendo…':'Subir fotos o videos'}</Button></div>
   <input ref={archivo} aria-label="Subir fotos o videos" className="sr-only" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" disabled={subiendo} onChange={e=>void subir(Array.from(e.target.files??[]))}/>
   <div className="rounded-lg border border-dashed border-border bg-surface p-6 text-center" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();void subir(Array.from(e.dataTransfer.files))}}><Images className="mx-auto size-7 text-accent"/><p className="mt-3 text-sm">{progreso||'Arrastrá archivos acá o seleccioná desde tu dispositivo'}</p><p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP · MP4, WebM · hasta 50 MB por archivo</p>{!albumes.length&&!cargando&&<p className="mt-3 text-sm">Primero creá un álbum.</p>}</div>
   {error&&<div role="alert"><p>{error}</p><Button variant="outline" onClick={()=>void cargar()}>Reintentar</Button></div>}
   {cargando?<p role="status">Cargando archivos…</p>:<><p className="text-sm text-muted-foreground">{listado.length} archivos en este álbum</p><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{listado.map(f=><article key={f.id} className="overflow-hidden rounded-lg border border-border bg-card">{f.tipo==='video'?<video src={f.preview} controls preload="metadata" className="aspect-[4/3] w-full bg-muted object-contain"/>:<img src={f.preview} alt={f.alt} loading="lazy" className="aspect-[4/3] w-full object-cover"/>}<div className="p-4"><p className="min-h-10 text-sm font-medium">{f.alt}</p><div className="mt-3 flex items-center justify-between"><span className="text-xs text-muted-foreground">{f.publicado?'Publicado':'Oculto'} · {f.tipo==='video'?'Video':'Foto'}</span><div className="flex"><Button variant="ghost" size="icon" aria-label={`Editar ${f.alt}`} onClick={()=>setEditando(f)}><Pencil/></Button><Button variant="ghost" size="icon" aria-label={`${f.publicado?'Ocultar':'Publicar'} ${f.alt}`} onClick={()=>void cambiar(f)}>{f.publicado?<Eye/>:<EyeOff/>}</Button><Button variant="ghost" size="icon" aria-label={`Eliminar ${f.alt}`} onClick={()=>void eliminar(f)}><Trash2/></Button></div></div></div></article>)}</div></>}
   <details className="border-b border-border py-4"><summary className="cursor-pointer text-sm font-semibold">Agregar desde un enlace</summary><div className="mt-4 grid gap-3"><Input aria-label="Descripción del archivo" placeholder="Descripción del archivo" value={alt} onChange={e=>setAlt(e.target.value)}/><Input aria-label="Enlace del archivo" placeholder="https://…" value={enlace} onChange={e=>setEnlace(e.target.value)}/><select aria-label="Tipo de archivo" className="h-10 rounded-md border border-input bg-background px-3" value={tipo} onChange={e=>setTipo(e.target.value)}><option value="foto">Foto</option><option value="video">Video MP4 / WebM</option></select><Button disabled={guardando||!album} onClick={()=>void agregarEnlace()}><Film/>Agregar archivo</Button></div></details>
  </section>
  <div onClick={e=>{if((e.target as HTMLElement).textContent==='Actualizar')void cargar()}}><CrudSeccion tabla="albumes" titulo="Álbumes" puedeEditar={puede} ordenPor={{columna:'fecha',asc:false}} campos={[{nombre:'titulo',etiqueta:'Título'},{nombre:'slug',etiqueta:'Identificador',slugDesde:'titulo',ocultarEnTabla:true},{nombre:'categoria_slug',etiqueta:'Categoría',categoria:'galeria',valorNombre:true,defecto:'Proyectos'},{nombre:'fecha',etiqueta:'Fecha',tipo:'fecha'},{nombre:'publicado',etiqueta:'Publicado',tipo:'booleano',defecto:true},{nombre:'descripcion',etiqueta:'Descripción',tipo:'area',ocultarEnTabla:true}]}/><Button variant="link" onClick={()=>void cargar()}>Actualizar lista de álbumes</Button></div>
  <Dialog open={!!editando} onOpenChange={v=>{if(!v)setEditando(null)}}><DialogContent><DialogHeader><DialogTitle>Editar archivo</DialogTitle><DialogDescription>Descripción, álbum y publicación</DialogDescription></DialogHeader>{editando&&<div className="space-y-4"><div><Label htmlFor="media-alt">Descripción / texto alternativo</Label><Input id="media-alt" value={editando.alt} onChange={e=>setEditando({...editando,alt:e.target.value})}/></div><div><Label htmlFor="media-album">Álbum</Label><select id="media-album" className="h-10 w-full rounded-md border border-input bg-background px-3" value={editando.album_id} onChange={e=>setEditando({...editando,album_id:e.target.value})}>{albumes.map(a=><option key={a.id} value={a.id}>{a.titulo}</option>)}</select></div><div><Label htmlFor="media-orden">Orden</Label><Input id="media-orden" type="number" value={editando.orden} onChange={e=>setEditando({...editando,orden:Number(e.target.value)})}/></div><div className="flex items-center gap-3"><Switch id="media-publicado" checked={editando.publicado} onCheckedChange={v=>setEditando({...editando,publicado:v})}/><Label htmlFor="media-publicado">Publicado</Label></div><Button disabled={guardando} onClick={()=>void guardar()}>{guardando?'Guardando…':'Guardar cambios'}</Button></div>}</DialogContent></Dialog>
 </div>
}