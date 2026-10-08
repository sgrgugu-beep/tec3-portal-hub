import informatica from '@/assets/informatica-proyecto.webp.asset.json';
import electronica from '@/assets/proyecto-electronica.webp.asset.json';
import alimentos from '@/assets/alimentos-laboratorio.webp.asset.json';
import type { EspecialidadSlug } from './contenido';
export const identidadEspecialidades:Record<EspecialidadSlug,{clase:string;imagen:string;etiqueta:string}>= {
 informatica:{clase:'especialidad-informatica',imagen:informatica.url,etiqueta:'Tecnología / Informática'},
 electronica:{clase:'especialidad-electronica',imagen:electronica.url,etiqueta:'Circuitos / Electrónica'},
 alimentos:{clase:'especialidad-alimentos',imagen:alimentos.url,etiqueta:'Ciencia / Alimentos'},
};