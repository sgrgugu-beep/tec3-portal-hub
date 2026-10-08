import { supabase } from '@/integrations/supabase/client';
import { validarMedio } from './media';

export async function subirMedio(file: File, carpeta: 'galeria' | 'especialidades' | 'avisos', soloFoto = false) {
  const errorValidacion = validarMedio(file, soloFoto);
  if (errorValidacion) throw new Error(errorValidacion);
  const extensiones: Record<string,string> = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'};
  const path = `${carpeta}/${crypto.randomUUID()}.${extensiones[file.type]}`;
  const {error} = await supabase.storage.from('galeria').upload(path,file,{contentType:file.type,upsert:false});
  if (error) throw new Error(`No se pudo subir ${file.name}: ${error.message}`);
  return {path, valor:`storage:${path}`, tipo:file.type.startsWith('video/') ? 'video' as const : 'foto' as const};
}

export async function vistaMedio(valor: string) {
  if (!valor.startsWith('storage:')) return valor;
  const {data,error} = await supabase.storage.from('galeria').createSignedUrl(valor.slice(8),3600);
  if(error) throw error;
  return data.signedUrl;
}