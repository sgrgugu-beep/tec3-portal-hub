import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { subirMedio, vistaMedio } from '@/lib/upload-media';

export function CampoImagen({id,valor,onChange,carpeta}:{id:string;valor:string;onChange:(v:string)=>void;carpeta:'avisos'|'especialidades'}) {
  const [ocupado,setOcupado]=useState(false);
  const [preview,setPreview]=useState('');
  useEffect(()=>{let activo=true;void vistaMedio(valor).then(url=>{if(activo)setPreview(url)}).catch(()=>setPreview(''));return()=>{activo=false}},[valor]);
  return <div className="space-y-3">
    {preview && <img src={preview} alt="Vista previa" className="h-36 w-full rounded-lg object-contain bg-muted" />}
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-surface p-4 text-sm">
      <Upload className="size-5 shrink-0 text-accent" />{ocupado?'Subiendo…':'Subir una foto'}
      <input id={id} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={ocupado} onChange={async e=>{const file=e.target.files?.[0];if(!file)return;setOcupado(true);try{const resultado=await subirMedio(file,carpeta,true);onChange(resultado.valor)}catch(err){toast.error(err instanceof Error?err.message:'No se pudo subir la imagen')}finally{setOcupado(false);e.target.value=''}}}/>
    </label>
    <Input aria-label="Enlace de imagen" value={valor} placeholder="O pegar el enlace de una imagen" onChange={e=>onChange(e.target.value)} />
  </div>
}