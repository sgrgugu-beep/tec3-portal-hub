/**
 * Contenido institucional de ejemplo.
 *
 * IMPORTANTE (portabilidad): este módulo es la única fuente de datos del sitio
 * público. Cuando se conecte el proyecto de Supabase propio, cada función de
 * este archivo se reemplaza por una consulta a la tabla equivalente
 * (ver SCHEMA.md) sin tocar los componentes de UI.
 */

export type EstadoPublicacion = "publicado" | "borrador";

export interface Categoria {
  slug: string;
  nombre: string;
  ambito: "avisos" | "calendario" | "capacitaciones" | "galeria";
}

export interface Aviso {
  slug: string;
  titulo: string;
  resumen: string;
  cuerpo: string;
  categoria: string;
  fecha: string; // ISO
  destacado: boolean;
  estado: EstadoPublicacion;
  imagen?: string;
}

export interface EventoCalendario {
  slug: string;
  titulo: string;
  tipo: string;
  fecha: string; // ISO date
  horario: string;
  lugar: string;
  descripcion: string;
}

export interface Materia {
  slug: string;
  nombre: string;
  anio: number;
  ciclo: "basico" | "superior";
  especialidad?: EspecialidadSlug;
  cargaHoraria: string;
  descripcion: string;
}

export type EspecialidadSlug = "informatica" | "electronica" | "alimentos";

export interface Especialidad {
  slug: EspecialidadSlug;
  nombre: string;
  nombreCorto: string;
  resumen: string;
  salidaLaboral: string;
}

export interface Capacitacion {
  slug: string;
  titulo: string;
  descripcion: string;
  dicta: string;
  destinatarios: string;
  modalidad: "Presencial" | "Virtual" | "Mixta";
  fecha: string;
  duracion: string;
  area: string;
  estado: "proxima" | "en curso" | "finalizada";
}

export interface IntegranteCentro {
  nombre: string;
  rol: string;
  curso: string;
}

export interface Album {
  slug: string;
  titulo: string;
  categoria: string;
  descripcion: string;
  fotos: { src: string; alt: string }[];
}

export interface Autoridad {
  nombre: string;
  cargo: string;
}

export const escuela = {
  nombre: 'E.E.S.T. N° 3 de Avellaneda "República de México"',
  nombreCorto: "Técnica 3 Avellaneda",
  lema: "Formación técnica con proyección real",
  direccion: "Caxaraville 5875",
  localidad: "Avellaneda",
  provincia: "Buenos Aires",
  pais: "Argentina",
  codigoPostal: "1874",
  telefono: "+54 11 0000-0000",
  email: "contacto@tecnica3avellaneda.edu.ar",
  emailCentroEstudiantes: "centrodeestudiantes@tecnica3avellaneda.edu.ar",
  horarios: "Lunes a viernes de 8:00 a 17:00 h",
  redes: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    youtube: "https://www.youtube.com/",
  },
  coordenadas: { lat: -34.6795, lng: -58.3521 },
} as const;

export const numerosInstitucionales = [
  { valor: "+50", etiqueta: "años de trayectoria" },
  { valor: "3", etiqueta: "especialidades técnicas" },
  { valor: "+900", etiqueta: "estudiantes" },
  { valor: "+3.000", etiqueta: "técnicos egresados" },
];

export const categorias: Categoria[] = [
  { slug: "institucionales", nombre: "Institucionales", ambito: "avisos" },
  { slug: "familias", nombre: "Para las familias", ambito: "avisos" },
  { slug: "centro-estudiantes", nombre: "Centro de Estudiantes", ambito: "avisos" },
  { slug: "acto", nombre: "Acto", ambito: "calendario" },
  { slug: "reunion", nombre: "Reunión de familias", ambito: "calendario" },
  { slug: "examen", nombre: "Examen", ambito: "calendario" },
  { slug: "clase-especial", nombre: "Clase especial", ambito: "calendario" },
  { slug: "jornada", nombre: "Jornada", ambito: "calendario" },
];

export const avisos: Aviso[] = [
  {
    slug: "inscripciones-primer-anio",
    titulo: "Inscripciones a 1° año: fechas y documentación",
    resumen:
      "Abrimos el período de inscripción para el próximo ciclo lectivo. Conocé la documentación necesaria y los horarios de atención.",
    cuerpo:
      "La secretaría recibe inscripciones para 1° año en el horario de 8:00 a 16:00 h. Es necesario presentar fotocopia del DNI del estudiante y de un adulto responsable, certificado de estudios primarios en trámite o completo, y libreta sanitaria. El equipo directivo realiza entrevistas informativas con las familias para acompañar la elección de la escuela técnica y explicar la organización del ciclo básico y de las especialidades del ciclo superior.",
    categoria: "familias",
    fecha: "2026-08-18",
    destacado: true,
    estado: "publicado",
  },
  {
    slug: "muestra-proyectos-tecnicos",
    titulo: "Muestra anual de proyectos técnicos",
    resumen:
      "Los grupos de 6° y 7° año presentan sus proyectos finales de Informática, Electrónica y Alimentos ante la comunidad educativa.",
    cuerpo:
      "Durante la jornada, cada equipo expone el proceso completo de su proyecto: relevamiento, diseño, construcción y puesta en funcionamiento. Es una oportunidad para que las familias y las escuelas primarias del distrito conozcan de primera mano el trabajo real que se produce en los talleres y laboratorios de la escuela.",
    categoria: "institucionales",
    fecha: "2026-08-11",
    destacado: true,
    estado: "publicado",
  },
  {
    slug: "eleccion-centro-estudiantes",
    titulo: "Elecciones del Centro de Estudiantes",
    resumen:
      "Se presentan las listas y se define el cronograma de campaña y votación para la nueva conducción estudiantil.",
    cuerpo:
      "La participación estudiantil es parte de la formación ciudadana de la escuela. Las listas pueden presentar su propuesta ante la junta electoral estudiantil, con el acompañamiento del equipo de preceptores y del área de orientación.",
    categoria: "centro-estudiantes",
    fecha: "2026-08-05",
    destacado: false,
    estado: "publicado",
  },
  {
    slug: "entrega-boletines",
    titulo: "Entrega de boletines y reunión por curso",
    resumen:
      "Cada preceptoría comunica el horario de entrega de boletines y de la reunión con las familias.",
    cuerpo:
      "Pedimos a las familias asistir con la libreta de comunicaciones. En la reunión se comparte el estado de las trayectorias escolares y los espacios de apoyo disponibles para acompañar a cada estudiante.",
    categoria: "familias",
    fecha: "2026-07-28",
    destacado: false,
    estado: "publicado",
  },
  {
    slug: "practicas-profesionalizantes",
    titulo: "Prácticas profesionalizantes 2026",
    resumen:
      "Estudiantes de 7° año inician sus prácticas en empresas e instituciones del distrito.",
    cuerpo:
      "Las prácticas profesionalizantes son el último tramo de la formación técnica y ponen en juego los saberes del taller en contextos reales de trabajo, con seguimiento de docentes tutores.",
    categoria: "institucionales",
    fecha: "2026-07-15",
    destacado: false,
    estado: "publicado",
  },
];

export const eventos: EventoCalendario[] = [
  {
    slug: "reunion-familias-primer-anio",
    titulo: "Reunión informativa para familias de 1° año",
    tipo: "reunion",
    fecha: "2026-09-04",
    horario: "18:00 a 19:30 h",
    lugar: "Salón de actos",
    descripcion:
      "Presentación del equipo directivo, organización del ciclo básico y funcionamiento de los talleres.",
  },
  {
    slug: "jornada-puertas-abiertas",
    titulo: "Jornada de puertas abiertas",
    tipo: "jornada",
    fecha: "2026-09-12",
    horario: "9:00 a 13:00 h",
    lugar: "Talleres y laboratorios",
    descripcion:
      "Recorrido guiado por las tres especialidades, con demostraciones a cargo de estudiantes del ciclo superior.",
  },
  {
    slug: "acto-aniversario",
    titulo: "Acto por el aniversario de la escuela",
    tipo: "acto",
    fecha: "2026-09-25",
    horario: "10:00 h",
    lugar: "Patio central",
    descripcion: "Acto institucional con participación de estudiantes, familias y egresados.",
  },
  {
    slug: "mesas-examen",
    titulo: "Mesas de examen — período complementario",
    tipo: "examen",
    fecha: "2026-10-06",
    horario: "8:00 a 12:00 h",
    lugar: "Aulas del primer piso",
    descripcion: "Consultar el cronograma por materia en cartelera y en preceptoría.",
  },
  {
    slug: "clase-especial-robotica",
    titulo: "Clase especial de robótica educativa",
    tipo: "clase-especial",
    fecha: "2026-10-17",
    horario: "14:00 a 16:00 h",
    lugar: "Laboratorio de Informática",
    descripcion: "Actividad abierta a estudiantes de 2° y 3° año junto a escuelas primarias invitadas.",
  },
];

export const especialidades: Especialidad[] = [
  {
    slug: "informatica",
    nombre: "Técnico en Informática Personal y Profesional",
    nombreCorto: "Informática (IPP)",
    resumen:
      "Formación en armado y mantenimiento de equipos, redes, sistemas operativos, programación y soporte técnico a usuarios y organizaciones.",
    salidaLaboral:
      "Soporte técnico, administración de redes y equipos, desarrollo de software a nivel inicial y servicios informáticos.",
  },
  {
    slug: "electronica",
    nombre: "Técnico en Electrónica",
    nombreCorto: "Electrónica",
    resumen:
      "Diseño, montaje y reparación de circuitos analógicos y digitales, sistemas de control, automatización e instrumentación.",
    salidaLaboral:
      "Mantenimiento industrial, automatización, instalaciones electrónicas y proyectos de control.",
  },
  {
    slug: "alimentos",
    nombre: "Técnico en Industrias de Procesos — Alimentos",
    nombreCorto: "Alimentos",
    resumen:
      "Procesos de elaboración y conservación de alimentos, control de calidad, microbiología, bromatología y buenas prácticas de manufactura.",
    salidaLaboral:
      "Control de calidad, producción y laboratorio en plantas de elaboración de alimentos.",
  },
];

const materiaBase = (
  nombre: string,
  anio: number,
  cargaHoraria: string,
  descripcion: string,
): Materia => ({
  slug: `${nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${anio}`,
  nombre,
  anio,
  ciclo: "basico",
  cargaHoraria,
  descripcion,
});

const materiaSuperior = (
  nombre: string,
  anio: number,
  especialidad: EspecialidadSlug,
  cargaHoraria: string,
  descripcion: string,
): Materia => ({
  slug: `${nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${anio}-${especialidad}`,
  nombre,
  anio,
  ciclo: "superior",
  especialidad,
  cargaHoraria,
  descripcion,
});

/** Contenido orientativo y editable: la información curricular oficial se completa desde el panel. */
export const materias: Materia[] = [
  materiaBase("Prácticas del Lenguaje", 1, "5 h semanales", "Lectura, escritura y oralidad con énfasis en textos de estudio."),
  materiaBase("Matemática", 1, "5 h semanales", "Números racionales, proporcionalidad y primeras nociones de álgebra."),
  materiaBase("Ciencias Naturales", 1, "4 h semanales", "Introducción a fenómenos físicos, químicos y biológicos."),
  materiaBase("Ciencias Sociales", 1, "4 h semanales", "Espacio geográfico, organización social y procesos históricos."),
  materiaBase("Educación Tecnológica", 1, "4 h semanales", "Procesos técnicos, materiales y análisis de productos."),
  materiaBase("Taller (Ciclo Básico)", 1, "6 h semanales", "Rotación por los talleres de las tres especialidades de la escuela."),
  materiaBase("Prácticas del Lenguaje", 2, "5 h semanales", "Producción escrita, argumentación y literatura."),
  materiaBase("Matemática", 2, "5 h semanales", "Funciones, ecuaciones y geometría analítica inicial."),
  materiaBase("Físico Química", 2, "4 h semanales", "Materia, energía, reacciones y magnitudes."),
  materiaBase("Biología", 2, "3 h semanales", "Células, organismos y salud."),
  materiaBase("Sistemas Tecnológicos", 2, "4 h semanales", "Sistemas, control y representación técnica."),
  materiaBase("Taller (Ciclo Básico)", 2, "6 h semanales", "Prácticas de medición, herramientas y seguridad e higiene."),
  materiaBase("Literatura", 3, "4 h semanales", "Géneros literarios y análisis crítico de textos."),
  materiaBase("Matemática", 3, "5 h semanales", "Funciones cuadráticas, trigonometría y estadística."),
  materiaBase("Física", 3, "3 h semanales", "Cinemática, dinámica y energía."),
  materiaBase("Química", 3, "3 h semanales", "Estructura atómica, enlaces y estequiometría."),
  materiaBase("Lenguajes Tecnológicos", 3, "4 h semanales", "Dibujo técnico y representación asistida por computadora."),
  materiaBase("Taller (Ciclo Básico)", 3, "6 h semanales", "Proyecto técnico integrador previo a la elección de especialidad."),

  materiaSuperior("Instalación y Mantenimiento de Equipos", 4, "informatica", "8 h semanales", "Armado, diagnóstico y mantenimiento de equipos informáticos."),
  materiaSuperior("Programación I", 4, "informatica", "4 h semanales", "Lógica de programación, estructuras de control y algoritmos."),
  materiaSuperior("Redes de Datos I", 5, "informatica", "6 h semanales", "Cableado estructurado, direccionamiento IP y servicios de red."),
  materiaSuperior("Programación II", 5, "informatica", "6 h semanales", "Programación orientada a objetos y bases de datos."),
  materiaSuperior("Desarrollo de Sistemas", 6, "informatica", "8 h semanales", "Análisis, diseño y desarrollo de aplicaciones con bases de datos."),
  materiaSuperior("Seguridad Informática", 6, "informatica", "4 h semanales", "Buenas prácticas, resguardo de datos y gestión de usuarios."),
  materiaSuperior("Prácticas Profesionalizantes", 7, "informatica", "10 h semanales", "Proyecto final y prácticas en organizaciones del distrito."),

  materiaSuperior("Circuitos Analógicos", 4, "electronica", "8 h semanales", "Componentes, mediciones y análisis de circuitos."),
  materiaSuperior("Electrotecnia", 4, "electronica", "4 h semanales", "Magnitudes eléctricas, leyes fundamentales y ensayos."),
  materiaSuperior("Electrónica Digital", 5, "electronica", "6 h semanales", "Lógica combinacional y secuencial, sistemas numéricos."),
  materiaSuperior("Instrumentos y Mediciones", 5, "electronica", "4 h semanales", "Instrumental de laboratorio y análisis de señales."),
  materiaSuperior("Sistemas de Control", 6, "electronica", "6 h semanales", "Sensores, actuadores, automatización y microcontroladores."),
  materiaSuperior("Diseño de Proyectos Electrónicos", 6, "electronica", "6 h semanales", "Documentación, prototipado y puesta en marcha."),
  materiaSuperior("Prácticas Profesionalizantes", 7, "electronica", "10 h semanales", "Proyecto final y prácticas en entornos productivos."),

  materiaSuperior("Química Analítica", 4, "alimentos", "6 h semanales", "Técnicas de análisis cuantitativo y cualitativo."),
  materiaSuperior("Operaciones Unitarias I", 4, "alimentos", "6 h semanales", "Transferencia de calor y materia en procesos alimentarios."),
  materiaSuperior("Microbiología de los Alimentos", 5, "alimentos", "6 h semanales", "Microorganismos, conservación e inocuidad."),
  materiaSuperior("Bromatología", 5, "alimentos", "4 h semanales", "Composición, rotulado y normativa alimentaria."),
  materiaSuperior("Control de Calidad", 6, "alimentos", "6 h semanales", "Buenas prácticas de manufactura, HACCP y trazabilidad."),
  materiaSuperior("Tecnología de los Alimentos", 6, "alimentos", "6 h semanales", "Líneas de elaboración y desarrollo de productos."),
  materiaSuperior("Prácticas Profesionalizantes", 7, "alimentos", "10 h semanales", "Proyecto final y prácticas en plantas y laboratorios."),
];

export const capacitaciones: Capacitacion[] = [
  {
    slug: "redes-y-soporte",
    titulo: "Redes y soporte técnico para la comunidad",
    descripcion:
      "Curso práctico de armado de redes domésticas, diagnóstico de equipos y resguardo de información.",
    dicta: "Departamento de Informática",
    destinatarios: "Estudiantes del ciclo superior y egresados",
    modalidad: "Presencial",
    fecha: "2026-09-08",
    duracion: "8 encuentros de 2 h",
    area: "Informática",
    estado: "proxima",
  },
  {
    slug: "automatizacion-con-microcontroladores",
    titulo: "Automatización con microcontroladores",
    descripcion:
      "Programación de placas de desarrollo, sensores y actuadores aplicados a proyectos escolares.",
    dicta: "Departamento de Electrónica",
    destinatarios: "Estudiantes de 5° a 7° año",
    modalidad: "Mixta",
    fecha: "2026-08-20",
    duracion: "10 encuentros de 2 h",
    area: "Electrónica",
    estado: "en curso",
  },
  {
    slug: "manipulacion-de-alimentos",
    titulo: "Manipulación segura de alimentos",
    descripcion:
      "Buenas prácticas de manufactura, higiene y trazabilidad, con certificación institucional.",
    dicta: "Departamento de Alimentos",
    destinatarios: "Estudiantes, familias y personal de la escuela",
    modalidad: "Presencial",
    fecha: "2026-06-10",
    duracion: "4 encuentros de 3 h",
    area: "Alimentos",
    estado: "finalizada",
  },
  {
    slug: "acompanamiento-de-trayectorias",
    titulo: "Acompañamiento de trayectorias escolares",
    descripcion:
      "Espacio de formación docente sobre estrategias de acompañamiento y evaluación formativa.",
    dicta: "Equipo de Orientación Escolar",
    destinatarios: "Docentes y preceptores",
    modalidad: "Virtual",
    fecha: "2026-10-02",
    duracion: "3 encuentros de 2 h",
    area: "Formación docente",
    estado: "proxima",
  },
];

export const integrantesCentro: IntegranteCentro[] = [
  { nombre: "Nombre de ejemplo", rol: "Presidencia", curso: "6° año — Informática" },
  { nombre: "Nombre de ejemplo", rol: "Vicepresidencia", curso: "5° año — Electrónica" },
  { nombre: "Nombre de ejemplo", rol: "Secretaría general", curso: "6° año — Alimentos" },
  { nombre: "Nombre de ejemplo", rol: "Tesorería", curso: "4° año — Informática" },
  { nombre: "Nombre de ejemplo", rol: "Prensa y comunicación", curso: "5° año — Informática" },
  { nombre: "Nombre de ejemplo", rol: "Deportes y cultura", curso: "4° año — Electrónica" },
];

export const autoridades: Autoridad[] = [
  { nombre: "Nombre de ejemplo", cargo: "Dirección" },
  { nombre: "Nombre de ejemplo", cargo: "Vicedirección — Ciclo Básico" },
  { nombre: "Nombre de ejemplo", cargo: "Vicedirección — Ciclo Superior" },
  { nombre: "Nombre de ejemplo", cargo: "Jefatura de Área Técnica" },
  { nombre: "Nombre de ejemplo", cargo: "Secretaría" },
];

export const albumes: Album[] = [
  {
    slug: "proyectos-tecnicos",
    titulo: "Proyectos técnicos",
    categoria: "Proyectos",
    descripcion: "Prototipos y trabajos finales desarrollados en los talleres de las tres especialidades.",
    fotos: [
      { src: "/galeria/proyectos-1.svg", alt: "Estudiantes ensamblando un prototipo electrónico en el taller" },
      { src: "/galeria/proyectos-2.svg", alt: "Placa de circuito impreso terminada sobre la mesa de trabajo" },
      { src: "/galeria/proyectos-3.svg", alt: "Grupo de estudiantes presentando un proyecto de informática" },
    ],
  },
  {
    slug: "eventos-institucionales",
    titulo: "Eventos institucionales",
    categoria: "Eventos",
    descripcion: "Actos, aniversarios y encuentros con la comunidad educativa.",
    fotos: [
      { src: "/galeria/eventos-1.svg", alt: "Acto institucional en el patio de la escuela" },
      { src: "/galeria/eventos-2.svg", alt: "Familias participando de una reunión en el salón de actos" },
    ],
  },
  {
    slug: "jornadas-especiales",
    titulo: "Jornadas especiales",
    categoria: "Jornadas",
    descripcion: "Puertas abiertas, olimpíadas y visitas de escuelas primarias.",
    fotos: [
      { src: "/galeria/jornadas-1.svg", alt: "Visita guiada por el laboratorio de alimentos" },
      { src: "/galeria/jornadas-2.svg", alt: "Demostración de robótica durante la jornada de puertas abiertas" },
      { src: "/galeria/jornadas-3.svg", alt: "Estudiantes de primaria recorriendo el taller de electrónica" },
    ],
  },
];

/* ---------- utilidades de consulta (reemplazables por Supabase) ---------- */

export const avisosPublicados = () =>
  avisos
    .filter((a) => a.estado === "publicado")
    .sort((a, b) => Number(b.destacado) - Number(a.destacado) || b.fecha.localeCompare(a.fecha));

export const avisosDestacados = () => avisosPublicados().filter((a) => a.destacado);

export const proximosEventos = (cantidad = 4) =>
  [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, cantidad);

export const nombreCategoria = (slug: string) =>
  categorias.find((c) => c.slug === slug)?.nombre ?? slug;

export const formatearFecha = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export const formatearFechaCorta = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  return {
    dia: d.toLocaleDateString("es-AR", { day: "2-digit" }),
    mes: d.toLocaleDateString("es-AR", { month: "short" }).replace(".", ""),
  };
};

export interface ResultadoBusqueda {
  tipo: "Avisos" | "Materias" | "Capacitaciones" | "Calendario";
  titulo: string;
  detalle: string;
  ruta: string;
}

export function buscar(consulta: string): ResultadoBusqueda[] {
  const q = consulta.trim().toLowerCase();
  if (q.length < 2) return [];
  const coincide = (...campos: string[]) => campos.join(" ").toLowerCase().includes(q);

  return [
    ...avisosPublicados()
      .filter((a) => coincide(a.titulo, a.resumen, a.cuerpo, nombreCategoria(a.categoria)))
      .map<ResultadoBusqueda>((a) => ({
        tipo: "Avisos",
        titulo: a.titulo,
        detalle: `${nombreCategoria(a.categoria)} · ${formatearFecha(a.fecha)}`,
        ruta: "/avisos",
      })),
    ...materias
      .filter((m) => coincide(m.nombre, m.descripcion))
      .map<ResultadoBusqueda>((m) => ({
        tipo: "Materias",
        titulo: m.nombre,
        detalle: `${m.anio}° año · ${m.especialidad ? especialidades.find((e) => e.slug === m.especialidad)!.nombreCorto : "Ciclo Básico"}`,
        ruta: "/materias",
      })),
    ...capacitaciones
      .filter((c) => coincide(c.titulo, c.descripcion, c.area, c.dicta))
      .map<ResultadoBusqueda>((c) => ({
        tipo: "Capacitaciones",
        titulo: c.titulo,
        detalle: `${c.area} · ${c.estado}`,
        ruta: "/capacitaciones",
      })),
    ...eventos
      .filter((e) => coincide(e.titulo, e.descripcion, e.lugar, nombreCategoria(e.tipo)))
      .map<ResultadoBusqueda>((e) => ({
        tipo: "Calendario",
        titulo: e.titulo,
        detalle: `${formatearFecha(e.fecha)} · ${e.lugar}`,
        ruta: "/calendario",
      })),
  ];
}
