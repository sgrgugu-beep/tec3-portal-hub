export const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const videoTypes = ['video/mp4', 'video/webm'];

export function validarMedio(file: { size: number; type: string }, soloFoto = false) {
  if (file.size > MAX_MEDIA_BYTES) return 'El archivo supera los 50 MB.';
  if (!imageTypes.includes(file.type) && (soloFoto || !videoTypes.includes(file.type))) {
    return soloFoto ? 'Elegí una imagen JPG, PNG o WebP.' : 'Elegí fotos JPG, PNG o WebP, o videos MP4 o WebM.';
  }
  return null;
}

export function enlaceSeguro(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch { return null; }
}

export function enlaceWhatsapp(value: string) {
  const safe = enlaceSeguro(value);
  if (!safe) return null;
  const host = new URL(safe).hostname;
  return ['chat.whatsapp.com', 'whatsapp.com', 'www.whatsapp.com', 'wa.me'].includes(host) ? safe : null;
}

export function avisosUrgentes<T extends { urgente?: boolean; estado: string }>(avisos: T[]) {
  return avisos.filter((a) => a.urgente && a.estado === 'publicado');
}

export function oportunidadVigente(fecha: string | null, hoy: string) {
  return !fecha || fecha >= hoy;
}