import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { enlaceWhatsapp } from '@/lib/media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export function ConfiguracionDifusion({puede}:{puede:boolean}){
 const [valor,setValor]=useState('');const [guardando,setGuardando]=useState(false);const query=useQueryClient();
 useEffect(()=>{if(!puede)return;void supabase.from('configuracion_sitio').select('valor').eq('clave','whatsapp_difusion').maybeSingle().then(({data,error})=>{if(error)toast.error('No se pudo cargar la configuración de difusión.');else setValor(data?.valor??'')})},[puede]);
 async function guardar(){if(valor&&!enlaceWhatsapp(valor)){toast.error('Pegá un enlace HTTPS de un grupo o canal de WhatsApp.');return}setGuardando(true);try{const {error}=await supabase.from('configuracion_sitio').upsert({clave:'whatsapp_difusion',valor:valor.trim(),grupo:'redes',descripcion:'Grupo o canal de difusión WhatsApp'});if(error)throw error;await query.invalidateQueries({queryKey:['configuracion']});toast.success('Difusión actualizada')}catch(e){toast.error(e instanceof Error?e.message:'No se pudo guardar')}finally{setGuardando(false)}}
 if(!puede)return null;
 return <section className="border-b border-border pb-8"><div className="flex items-center gap-3"><MessageCircle className="size-6 text-success"/><h2 className="text-xl font-semibold">Difusión por WhatsApp</h2></div><div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><div><Label htmlFor="whatsapp-difusion">Enlace del grupo o canal</Label><Input id="whatsapp-difusion" type="url" placeholder="https://chat.whatsapp.com/…" value={valor} onChange={e=>setValor(e.target.value)} className="mt-2"/></div><Button disabled={guardando} onClick={()=>void guardar()}><Save/>Guardar difusión</Button></div><p className="mt-3 text-sm text-muted-foreground">Si queda vacío, el acceso no aparece en el sitio.</p></section>
}