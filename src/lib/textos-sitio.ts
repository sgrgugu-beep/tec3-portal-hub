/**
 * Catálogo de textos editables desde "Información del sitio" en el panel.
 * Cada texto se guarda en configuracion_sitio (grupo "textos") y, si está vacío,
 * el sitio muestra el valor por defecto definido acá.
 */
export interface CampoTexto {
  clave: string;
  etiqueta: string;
  defecto: string;
  largo?: boolean;
}
export interface PaginaTextos {
  id: string;
  nombre: string;
  campos: CampoTexto[];
}

const encabezado = (id: string, volanta: string, titulo: string, descripcion: string): CampoTexto[] => [
  { clave: `texto.${id}.volanta`, etiqueta: "Encabezado · volanta (texto chico superior)", defecto: volanta },
  { clave: `texto.${id}.titulo`, etiqueta: "Encabezado · título principal", defecto: titulo },
  { clave: `texto.${id}.descripcion`, etiqueta: "Encabezado · descripción", defecto: descripcion, largo: true },
];

export const paginasTextos: PaginaTextos[] = [
  {
    id: "inicio",
    nombre: "Inicio",
    campos: [
      { clave: "texto.inicio.portada_volanta", etiqueta: "Portada · texto superior", defecto: "Educación técnica pública · Wilde" },
      { clave: "texto.inicio.portada_titulo", etiqueta: "Portada · título (primera línea)", defecto: "Técnica 3" },
      { clave: "texto.inicio.portada_titulo_acento", etiqueta: "Portada · título (línea destacada)", defecto: "Avellaneda." },
      { clave: "texto.inicio.portada_subtitulo", etiqueta: "Portada · subtítulo", defecto: "“República de México”" },
      { clave: "texto.inicio.portada_descripcion", etiqueta: "Portada · descripción", defecto: "Proyectos reales, talleres equipados y una comunidad que acompaña cada trayectoria.", largo: true },
      { clave: "texto.inicio.boton_principal", etiqueta: "Portada · botón principal", defecto: "Inscripciones" },
      { clave: "texto.inicio.boton_secundario", etiqueta: "Portada · botón secundario", defecto: "Conocer la escuela" },
      { clave: "texto.inicio.cifra1_valor", etiqueta: "Cifra 1 · número", defecto: "+50" },
      { clave: "texto.inicio.cifra1_etiqueta", etiqueta: "Cifra 1 · texto", defecto: "años de trayectoria" },
      { clave: "texto.inicio.cifra2_valor", etiqueta: "Cifra 2 · número", defecto: "3" },
      { clave: "texto.inicio.cifra2_etiqueta", etiqueta: "Cifra 2 · texto", defecto: "especialidades técnicas" },
      { clave: "texto.inicio.cifra3_valor", etiqueta: "Cifra 3 · número", defecto: "+900" },
      { clave: "texto.inicio.cifra3_etiqueta", etiqueta: "Cifra 3 · texto", defecto: "estudiantes" },
      { clave: "texto.inicio.cifra4_valor", etiqueta: "Cifra 4 · número", defecto: "+3.000" },
      { clave: "texto.inicio.cifra4_etiqueta", etiqueta: "Cifra 4 · texto", defecto: "técnicos egresados" },
      { clave: "texto.inicio.avisos_volanta", etiqueta: "Bloque avisos · volanta", defecto: "Actualidad / 01" },
      { clave: "texto.inicio.avisos_titulo", etiqueta: "Bloque avisos · título", defecto: "Lo importante, en primer plano." },
      { clave: "texto.inicio.avisos_descripcion", etiqueta: "Bloque avisos · descripción", defecto: "Información para estudiantes, familias y toda la comunidad educativa.", largo: true },
      { clave: "texto.inicio.agenda_volanta", etiqueta: "Bloque agenda · volanta", defecto: "Agenda / 02" },
      { clave: "texto.inicio.agenda_titulo", etiqueta: "Bloque agenda · título", defecto: "La escuela está en movimiento." },
      { clave: "texto.inicio.agenda_descripcion", etiqueta: "Bloque agenda · descripción", defecto: "Próximos encuentros, actos y actividades para organizar la semana.", largo: true },
      { clave: "texto.inicio.especialidades_volanta", etiqueta: "Bloque especialidades · volanta", defecto: "Trayectorias / 03" },
      { clave: "texto.inicio.especialidades_titulo", etiqueta: "Bloque especialidades · título", defecto: "Tres maneras de transformar ideas en soluciones." },
      { clave: "texto.inicio.especialidades_descripcion", etiqueta: "Bloque especialidades · descripción", defecto: "Del ciclo básico común a una formación técnica especializada que combina teoría, práctica y proyectos.", largo: true },
      { clave: "texto.inicio.cierre_volanta", etiqueta: "Bloque final · volanta", defecto: "Próximo paso" },
      { clave: "texto.inicio.cierre_titulo", etiqueta: "Bloque final · título", defecto: "Conozcan la escuela donde una vocación puede convertirse en oficio y futuro.", largo: true },
      { clave: "texto.inicio.cierre_descripcion", etiqueta: "Bloque final · descripción", defecto: "Coordinamos entrevistas informativas para familias y futuros estudiantes.", largo: true },
      { clave: "texto.inicio.cierre_boton", etiqueta: "Bloque final · botón", defecto: "Escribinos" },
    ],
  },
  {
    id: "institucional",
    nombre: "Institucional",
    campos: [
      ...encabezado("institucional", "Nuestra escuela", "Una comunidad educativa que forma técnicos y técnicas", "Somos una escuela pública de educación secundaria técnica de Avellaneda. Acompañamos las trayectorias de cada estudiante desde el ciclo básico hasta el título técnico, articulando aula, taller y prácticas profesionalizantes."),
      { clave: "texto.institucional.quienes_titulo", etiqueta: "Quiénes somos · título", defecto: "Quiénes somos" },
      { clave: "texto.institucional.quienes_texto", etiqueta: "Quiénes somos · texto (dejá una línea en blanco entre párrafos)", largo: true, defecto: "La escuela reúne a estudiantes, familias, docentes, preceptores y personal auxiliar en torno a un proyecto común: una formación técnica rigurosa, inclusiva y conectada con el mundo del trabajo y con la continuidad de estudios superiores. El trabajo en los talleres y laboratorios es el corazón de la propuesta: allí se aprende a resolver problemas reales, a documentar procesos y a trabajar en equipo.\n\nNuestro enfoque combina el acompañamiento cercano de las trayectorias escolares con exigencia académica. Cada estudiante cuenta con espacios de apoyo, tutorías y orientación para elegir su especialidad con información y confianza." },
      { clave: "texto.institucional.historia_titulo", etiqueta: "Historia · título", defecto: "Historia" },
      { clave: "texto.institucional.historia_texto", etiqueta: "Historia · texto (dejá una línea en blanco entre párrafos)", largo: true, defecto: "Con más de cinco décadas de trayectoria en el distrito, la escuela creció junto al barrio y a su entramado productivo. De las primeras especialidades industriales a la incorporación de la informática y de las industrias de procesos, la institución actualizó sus talleres y sus contenidos sin perder su identidad: escuela pública, técnica y de puertas abiertas a la comunidad." },
      { clave: "texto.institucional.orientaciones_titulo", etiqueta: "Orientaciones · título", defecto: "Nuestras tres orientaciones" },
      { clave: "texto.institucional.orientaciones_texto", etiqueta: "Orientaciones · texto", largo: true, defecto: "A partir de 4° año, cada estudiante continúa su formación en una de las tres especialidades técnicas que ofrece la escuela." },
      { clave: "texto.institucional.directivo_titulo", etiqueta: "Equipo directivo · título", defecto: "Equipo directivo" },
      { clave: "texto.institucional.llegar_titulo", etiqueta: "Cómo llegar · título", defecto: "Cómo llegar" },
      { clave: "texto.institucional.llegar_transporte", etiqueta: "Cómo llegar · transporte", largo: true, defecto: "Llegan varias líneas de colectivo del distrito. Consultá el detalle actualizado en Contacto o por teléfono a secretaría." },
      { clave: "texto.institucional.llegar_referencias", etiqueta: "Cómo llegar · referencias del entorno", largo: true, defecto: "" },
    ],
  },
  { id: "avisos", nombre: "Avisos", campos: encabezado("avisos", "Comunicación institucional", "Avisos y novedades", "Toda la información oficial de la escuela en un solo lugar: comunicados de la dirección, avisos para las familias y novedades del Centro de Estudiantes.") },
  { id: "calendario", nombre: "Calendario", campos: encabezado("calendario", "Agenda escolar", "Calendario de actividades", "Consultá las próximas actividades de la escuela: actos, reuniones con las familias, mesas de examen, jornadas y clases especiales.") },
  { id: "materias", nombre: "Materias", campos: encabezado("materias", "Propuesta curricular", "Materias por año y especialidad", "La formación se organiza en un Ciclo Básico común de 1° a 3° año y un Ciclo Superior de 4° a 7° año en el que cada estudiante cursa una de las tres especialidades técnicas.") },
  { id: "especialidades", nombre: "Especialidades", campos: encabezado("especialidades", "Aprender haciendo", "Especialidades", "Tres caminos para transformar la curiosidad en conocimientos, proyectos y nuevas oportunidades.") },
  { id: "capacitaciones", nombre: "Capacitaciones", campos: encabezado("capacitaciones", "Formación continua", "Capacitaciones abiertas a la comunidad", "La escuela dicta capacitaciones para estudiantes, egresados, familias y docentes, aprovechando los talleres, laboratorios y la experiencia de sus departamentos técnicos.") },
  {
    id: "centro",
    nombre: "Centro de Estudiantes",
    campos: [
      ...encabezado("centro", "Participación estudiantil", "Centro de Estudiantes", "El Centro de Estudiantes representa la voz de los y las estudiantes de la escuela: organiza actividades, canaliza propuestas y construye comunidad junto al equipo directivo."),
      { clave: "texto.centro.integrantes_nota", etiqueta: "Integrantes · nota debajo del título", largo: true, defecto: "" },
      { clave: "texto.centro.propuestas_texto", etiqueta: "Propuestas · texto de invitación", largo: true, defecto: "Contanos tu idea para una actividad, un proyecto o una mejora en la escuela. El mensaje llega directamente al Centro de Estudiantes." },
    ],
  },
  { id: "galeria", nombre: "Galería", campos: encabezado("galeria", "Nuestra escuela en imágenes", "Galería", "Un recorrido por los proyectos de los talleres, los actos institucionales y las jornadas que compartimos con la comunidad educativa.") },
  { id: "contacto", nombre: "Contacto", campos: encabezado("contacto", "Estamos para ayudarte", "Contacto", "Escribinos por consultas de inscripción, documentación, trayectorias escolares o propuestas de articulación con instituciones y empresas.") },
];

export const textosPorDefecto: Record<string, string> = Object.fromEntries(
  paginasTextos.flatMap((p) => p.campos.map((c) => [c.clave, c.defecto])),
);

/** Divide un texto en párrafos usando líneas en blanco. */
export function parrafos(texto: string): string[] {
  return texto.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
