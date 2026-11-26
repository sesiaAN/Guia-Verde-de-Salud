import { useState, useMemo, useEffect } from 'react';
import './App.css';

// ============================================================================
// DATOS VERIFICADOS — GUÍA VERDE DE SALUD (SALUD RÍO LORETO)
// ============================================================================

const EMERGENCIAS_DATOS = [
  {
    id: 'mordedura',
    icono: '🐍',
    imagen: 'images/mordedura-serpiente.jpg',
    titulo: 'Mordedura de Serpiente',
    subtitulo: 'Jergón, Shushupe y Loromachaco',
    badge: 'Urgencia Crítica',
    tiempoMax: 'Menos de 4 a 6 horas para el suero',
    resumen: 'Inmovilización inmediata y traslado antes de que el veneno actúe.',
    queHacer: [
      'Mantener a la persona acostada, inmóvil y en calma (el movimiento apresura la dispersión del veneno).',
      'Inmovilizar el brazo o pierna mordida con una tablilla rígida a nivel del corazón.',
      'Lavar la herida suavemente con abundante agua limpia y jabón neutro, sin frotar.',
      'Retirar INMEDIATAMENTE anillos, pulseras y botas antes de que la extremidad se hinche por completo.',
      'Dar de beber agua limpia con frecuencia para proteger los riñones de las toxinas.',
      'Trasladar de inmediato a la posta médica con suero antiofídico polivalente.'
    ],
    queNoHacer: [
      '¡NUNCA hacer torniquetes ni ligaduras apretadas! Producen gangrena y pérdida obligatoria del miembro.',
      '¡NUNCA cortar la piel con machete, gillette ni navaja.',
      '¡NUNCA intentar chupar o succionar el veneno con la boca.',
      '¡NUNCA aplicar barro, kerosén, gasolina, cal ni pólvora.',
      '¡NUNCA dar alcohol ni aguardiente al herido.'
    ],
    alarma: 'Hinchazón rápida que sube por la extremidad, sangrado por encías u orina, ampollas moradas.'
  },
  {
    id: 'fiebre',
    icono: '🌡️',
    imagen: 'images/fiebre-dengue.jpg',
    titulo: 'Fiebre Alta y Dengue',
    subtitulo: 'Zancudo Aedes & Época de Creciente',
    badge: 'Alerta Hemorrágica',
    tiempoMax: 'Atención dentro de 24 horas',
    resumen: 'Manejo térmico con paños y prevención estricta de sangrados.',
    queHacer: [
      'Bajar la temperatura con paños de tela húmedos a temperatura de río en frente, axilas e ingles.',
      'Hidratación oral constante: dar suero casero o agua de coco verde fresca cada 15 a 20 min.',
      'Para el dolor y fiebre, administrar ÚNICAMENTE PARACETAMOL.',
      'Mantener a la persona bajo mosquitero para que los zancudos no contagien a la familia.',
      'Vigilar cualquier sangrado en encías o dolor abdominal severo.'
    ],
    queNoHacer: [
      '¡NUNCA tomar ni inyectar IBUPROFENO, ASPIRINA, NAPROXENO ni METAMIZOL! Causan hemorragias mortales por Dengue.',
      '¡NUNCA bañar con agua con hielo bruscamente (provoca choque térmico o convulsiones).',
      '¡NUNCA inyectar antibióticos sin una prueba previa de sangre o gota gruesa en la posta.'
    ],
    alarma: 'Dolor de estómago continuo, vómitos repetidos que no toleran suero, somnolencia extrema.'
  },
  {
    id: 'corte',
    icono: '🩹',
    imagen: 'images/cortes-machete.jpg',
    titulo: 'Cortes por Machete',
    subtitulo: 'Trauma en Chacra & Hemorragias',
    badge: 'Primeros 10 Min',
    tiempoMax: 'Contener en los primeros 10 minutos',
    resumen: 'Presión directa firme sin soltar para contener hemorragia activa.',
    queHacer: [
      'Hacer PRESIÓN DIRECTA Y FIRME con un paño limpio o polo doblado durante 15 minutos continuos sin levantar la mano.',
      'Elevar el brazo o pierna herida por encima del nivel del corazón.',
      'Si la tela se empapa de sangre, NO retirarla; coloca otra tela limpia encima y continúa presionando con firmeza.',
      'Una vez contenido el sangrado, vendar con firmeza pero comprobando que los dedos no se pongan fríos.'
    ],
    queNoHacer: [
      '¡NUNCA echar café molido, tabaco, cenizas ni tierra en la herida! Causan tétanos e infección generalizada.',
      '¡NUNCA retirar objetos clavados profundamente; inmovilízalos y traslada al paciente.',
      '¡NUNCA levantar el paño antes de los 15 minutos para ver si paró.'
    ],
    alarma: 'Sangrado que brota a borbotones rítmicos, palidez extrema o dedos fríos e insensibles.'
  },
  {
    id: 'diarrea',
    icono: '💧',
    imagen: 'images/diarrea-deshidratacion.jpg',
    titulo: 'Diarrea y Deshidratación',
    subtitulo: 'Suero Casero & Protección Infantil',
    badge: 'Rehidratación Urgente',
    tiempoMax: 'Rehidratación inmediata',
    resumen: 'Fórmula de suero casero oral para evitar deshidratación grave en niños.',
    queHacer: [
      'Preparar SUERO CASERO: 1 litro de agua hervida fría + 2 cucharadas de azúcar + 1/2 cucharadita de sal + gotas de limón.',
      'Ofrecer con cuchara o sorbos pequeños después de cada deposición líquida o vómito.',
      'Si es lactante, continuar con la lactancia materna con mayor frecuencia; nunca suspender la leche.',
      'Ofrecer mazamorra de plátano verde (inguiri) o caldo de gallina sin grasa en cuanto tolere.'
    ],
    queNoHacer: [
      '¡NUNCA dar pastillas para cortar la diarrea (Loperamida) a niños sin indicación médica.',
      '¡NUNCA dar gaseosas, energizantes ni jugos azucarados comerciales.',
      '¡NUNCA suspender los líquidos por miedo a que vomite; espere 10 minutos y vuelva a ofrecer despacio.'
    ],
    alarma: 'Ojos hundidos, llanto sin lágrimas, boca muy seca o el niño no orina en más de 6 horas.'
  },
  {
    id: 'raya',
    icono: '🐟',
    imagen: 'images/chuzo-raya.jpg',
    titulo: 'Chuzo de Raya de Río',
    subtitulo: 'Toxina de Fondo Fluvial',
    badge: 'Alivio Inmediato',
    tiempoMax: 'Alivio en menos de 30 minutos',
    resumen: 'Neutralización térmica de la toxina con inmersión en agua caliente.',
    queHacer: [
      '¡SUMERGIR DE INMEDIATO EN AGUA CALIENTE (45°C)! Lo más caliente tolerable sin quemar la piel.',
      'El calor desactiva la toxina proteica del veneno y detiene el dolor insoportable en minutos.',
      'Lavar suavemente con agua hervida y jabón blanco para retirar el limo del río.',
      'Retirar espinas sueltas superficiales y acudir a la posta para vacuna antitetánica.'
    ],
    queNoHacer: [
      '¡NUNCA aplicar hielo o agua fría! El frío multiplica el dolor a niveles intolerables.',
      '¡NUNCA orinar sobre la herida ni rociar kerosén, gasolina o cenizas.',
      '¡NUNCA coser o cerrar herméticamente la herida; debe drenar el veneno.'
    ],
    alarma: 'Desmayo por dolor agudo, hinchazón masiva o fiebre alta con pus al día siguiente.'
  }
];

const RUTAS_CUENCAS = [
  {
    id: 'napo',
    nombre: 'Cuenca Río Napo',
    subtitulo: 'Santa Clotilde & Mazán',
    distanciaKm: 45,
    tiempoDeslizador: '1 h 45 min',
    suero: '8 ampollas polivalentes',
    oxigeno: '4 balones (6m³)',
    pruebasDengue: 'Disponibles (Rápidas)',
    icono: '🌊',
    posta: 'C.S. Santa Clotilde (I-4)',
    radio: '5215 kHz HF'
  },
  {
    id: 'nanay',
    nombre: 'Cuenca Río Nanay',
    subtitulo: 'Santa María & Bellavista',
    distanciaKm: 22,
    tiempoDeslizador: '55 min',
    suero: '2 ampollas polivalentes',
    oxigeno: '2 balones (6m³)',
    pruebasDengue: 'Disponibles',
    icono: '🛶',
    posta: 'P.S. Santa María del Ojeal (I-2)',
    radio: '4890 kHz HF'
  },
  {
    id: 'maranon',
    nombre: 'Cuenca Río Marañón',
    subtitulo: 'Nauta & Parinari',
    distanciaKm: 35,
    tiempoDeslizador: '2 h 15 min',
    suero: '6 ampollas polivalentes',
    oxigeno: '6 balones (6m³)',
    pruebasDengue: 'Laboratorio básico',
    icono: '🚤',
    posta: 'Centro de Salud Nauta (I-4)',
    radio: '5820 kHz HF'
  },
  {
    id: 'itaya',
    nombre: 'Cuenca Río Itaya',
    subtitulo: 'Belén & Varillales',
    distanciaKm: 18,
    tiempoDeslizador: '40 min',
    suero: '4 ampollas polivalentes',
    oxigeno: '3 balones (6m³)',
    pruebasDengue: 'Disponibles',
    icono: '🌿',
    posta: 'P.S. San Juan Bautista (I-3)',
    radio: '4550 kHz HF'
  }
];

const CATALOGO_BOTIQUIN_20 = [
  // 1. Tos, Gripe y Garganta (8 elementos)
  {
    id: 1,
    categoria: 'tos',
    categoriaNombre: 'Tos, Gripe y Garganta',
    nombre: 'Jengibre (Kion)',
    nombreCientifico: 'Zingiber officinale',
    icono: '🫚',
    ingredientes: 'Jengibre fresco, agua limpia, jugo de limón criollo y miel de abeja.',
    preparacion: 'Cocinar pequeños trozos de jengibre en agua hirviendo; dejar entibiar y añadir jugo de limón y miel pura.',
    uso: 'Alivio de molestias de garganta, irritación y tos húmeda.',
    precaucion: 'Evitar consumo en personas con gastritis erosiva severa o en dosis excesivas en hipertensos.'
  },
  {
    id: 2,
    categoria: 'tos',
    categoriaNombre: 'Tos, Gripe y Garganta',
    nombre: 'Cebolla con Ajo',
    nombreCientifico: 'Allium cepa & Allium sativum',
    icono: '🧅',
    ingredientes: 'Cebolla morada, 3 dientes de ajo y agua potable.',
    preparacion: 'Preparación tradicional Ticuna: cortar una cebolla en cuatro partes y cocinarla durante cinco minutos con tres dientes de ajo machacados.',
    uso: 'Tos rebelde y malestar febril.',
    precaucion: 'Si la fiebre persiste por más de 24 horas o se acompaña de dolor retroocular (sospecha de dengue), acudir urgente a la posta médica.'
  },
  {
    id: 3,
    categoria: 'tos',
    categoriaNombre: 'Tos, Gripe y Garganta',
    nombre: 'Limón con Miel y Ajo',
    nombreCientifico: 'Citrus aurantiifolia & Miel',
    icono: '🍋',
    ingredientes: 'Jugo de limón criollo, miel pura de monte y ajo machacado.',
    preparacion: 'Mezclar el jugo fresco de 2 limones con 2 cucharadas de miel y un diente de ajo machacado. Tomar por cucharaditas.',
    uso: 'Molestias de garganta, inflamación y tos seca.',
    precaucion: 'NUNCA administrar miel de abeja a niños menores de 1 año por riesgo de botulismo infantil.'
  },
  {
    id: 4,
    categoria: 'tos',
    categoriaNombre: 'Tos, Gripe y Garganta',
    nombre: 'Matico Amazónico',
    nombreCientifico: 'Piper aduncum',
    icono: '🍃',
    ingredientes: 'Hojas frescas y limpias de matico y agua.',
    preparacion: 'Preparación tradicional documentada: cocinar las hojas en agua limpia durante 5 minutos y dejar entibiar antes de tomar o hacer gárgaras.',
    uso: 'Fiebre, dolor corporal y afecciones respiratorias leves.',
    precaucion: 'Confirmar la especie botánica; en la selva existen diferentes plantas llamadas matico. No sustituye la atención médica en neumonía.'
  },
  {
    id: 5,
    categoria: 'tos',
    categoriaNombre: 'Tos, Gripe y Garganta',
    nombre: 'Ajo Sacha',
    nombreCientifico: 'Mansoa alliacea',
    icono: '🌿',
    ingredientes: 'Hojas de ajo sacha y cáscara de limón.',
    preparacion: 'Cocinar las hojas con la cáscara de limón para realizar prácticas tradicionales de vaporización o baños tibios.',
    uso: 'Tos seca y fiebre mediante vahos y prácticas tradicionales de vapor.',
    precaucion: 'Evitar inhalar vapor de agua hirviendo muy cerca por riesgo grave de quemaduras en vías respiratorias.'
  },
  {
    id: 6,
    categoria: 'tos',
    categoriaNombre: 'Tos, Gripe y Garganta',
    nombre: 'Mucura',
    nombreCientifico: 'Petiveria alliacea (Anamú)',
    icono: '☘️',
    ingredientes: 'Hojas frescas de mucura y agua fresca de río.',
    preparacion: 'Preparación tradicional Ticuna: estrujar las hojas en agua fresca para preparar un baño tradicional en la cabeza y cuerpo.',
    uso: 'Refrescar la cabeza y aliviar la sensación intensa de fiebre.',
    precaucion: 'NO ingerir preparados caseros concentrados sin evaluación de seguridad. Contraindicado en mujeres embarazadas.'
  },
  {
    id: 7,
    categoria: 'tos',
    categoriaNombre: 'Tos, Gripe y Garganta',
    nombre: 'Sacha Culantro',
    nombreCientifico: 'Eryngium foetidum',
    icono: '🌱',
    ingredientes: 'Hojas, tallos, raíces y agua hervida.',
    preparacion: 'Cocinar la planta completa en agua hervida durante 5 minutos.',
    uso: 'Fiebre y dolor de cabeza.',
    precaucion: 'No automedicarse ante fiebres altas con dolor abdominal severo; puede ser dengue hemorrágico.'
  },
  {
    id: 8,
    categoria: 'tos',
    categoriaNombre: 'Tos, Gripe y Garganta',
    nombre: 'Menta Tradicional Amazónica',
    nombreCientifico: 'Lantana sp. local',
    icono: '🌿',
    ingredientes: 'Hojas identificadas de menta local y agua hervida.',
    preparacion: 'Infusión de 3 a 4 hojas en agua hervida caliente reposada durante 8 minutos.',
    uso: 'Molestias de estómago, dolor de cabeza y fiebre leve.',
    precaucion: 'La investigación botánica identifica Lantana sp. como menta local; no es la menta comercial. No ingerir concentrados ni dar a niños.'
  },

  // 2. Estómago y Digestión (5 elementos)
  {
    id: 9,
    categoria: 'estomago',
    categoriaNombre: 'Estómago y Digestión',
    nombre: 'Hojas de Casho',
    nombreCientifico: 'Anacardium occidentale',
    icono: '🌳',
    ingredientes: 'Hojas tiernas de casho (marañón) y agua.',
    preparacion: 'Preparación documentada: cocimiento de hojas limpias durante cinco minutos a fuego lento.',
    uso: 'Molestias de garganta y diarrea acuosa leve.',
    precaucion: 'NUNCA utilizar como sustituto del suero de rehidratación oral. En niños con diarrea, la rehidratación es obligatoria e inmediata.'
  },
  {
    id: 10,
    categoria: 'estomago',
    categoriaNombre: 'Estómago y Digestión',
    nombre: 'Basuri o Ñucño Pichana',
    nombreCientifico: 'Scoparia dulcis',
    icono: '🌾',
    ingredientes: 'Hojas, ramitas tiernas y agua limpia.',
    preparacion: 'Preparación tradicional: estrujar suavemente las hojas en agua hervida fría y colar con lienzo limpio.',
    uso: 'Alivio de tos seca y malestar digestivo.',
    precaucion: 'Confirmar la identificación botánica con sabios de la comunidad antes de cualquier uso medicinal.'
  },
  {
    id: 11,
    categoria: 'estomago',
    categoriaNombre: 'Estómago y Digestión',
    nombre: 'Guayaba',
    nombreCientifico: 'Psidium guajava',
    icono: '🍈',
    ingredientes: 'Cogollos y hojas tiernas de guayabo con agua.',
    preparacion: 'Infusión de 4 a 6 hojas en 1 litro de agua hervida; dejar reposar 10 minutos y beber tibio.',
    uso: 'Molestias digestivas, retortijones y diarrea leve.',
    precaucion: 'La diarrea con moco o sangre requiere atención médica inmediata en la posta, especialmente en lactantes y niños pequeños.'
  },
  {
    id: 12,
    categoria: 'estomago',
    categoriaNombre: 'Estómago y Digestión',
    nombre: 'Hierba Luisa',
    nombreCientifico: 'Cymbopogon citratus',
    icono: '🌾',
    ingredientes: 'Hojas frescas aromáticas de hierba luisa y agua caliente.',
    preparacion: 'Infusión aromática de hojas frescas reposadas durante 5 minutos en agua hervida.',
    uso: 'Molestias digestivas, cólicos leves, gases y digestión pesada.',
    precaucion: 'Si el dolor abdominal es agudo o localizado en el lado derecho, no tomar líquidos y acudir a la posta para descartar apendicitis.'
  },
  {
    id: 13,
    categoria: 'estomago',
    categoriaNombre: 'Estómago y Digestión',
    nombre: 'Paico',
    nombreCientifico: 'Dysphania ambrosioides',
    icono: '🌿',
    ingredientes: 'Hojas y tallos tiernos (uso extremadamente controlado).',
    preparacion: 'Preparación registrada en medicina tradicional: infusión muy suave de pocas hojas.',
    uso: 'Cólicos leves y expulsión tradicional de parásitos intestinales.',
    precaucion: '¡PRECAUCIÓN CRÍTICA! Puede ser tóxico por su contenido de ascaridol, especialmente en preparados concentrados. NO administrar a niños ni gestantes.'
  },

  // 3. Plantas, Frutos y Cortezas Amazónicas (7 elementos)
  {
    id: 14,
    categoria: 'cortezas',
    categoriaNombre: 'Cortezas y Frutos Amazónicos',
    nombre: 'Sangre de Grado',
    nombreCientifico: 'Croton lechleri',
    icono: '🩸',
    ingredientes: 'Látex rojizo puro del tronco del árbol.',
    preparacion: 'Recolección del látex mediante incisión diagonal en la corteza; aplicación externa directa frotando hasta hacer película blanca.',
    uso: 'Cuidado externo de la piel, raspaduras y heridas superficiales limpias (cicatrizante natural).',
    precaucion: 'NO aplicar en heridas profundas que requieran sutura ni consumir por vía oral sin indicación profesional.'
  },
  {
    id: 15,
    categoria: 'cortezas',
    categoriaNombre: 'Cortezas y Frutos Amazónicos',
    nombre: 'Copaiba',
    nombreCientifico: 'Copaifera reticulata / paupera',
    icono: '🪵',
    ingredientes: 'Oleorresina translúcida del corazón del tronco.',
    preparacion: 'Extracción tradicional mediante orificio cuidadoso en el tronco y recolección limpia.',
    uso: 'Cuidado dérmico externo, molestias inflamatorias y picaduras de insectos.',
    precaucion: 'NO ingerir directamente ni aplicar pura sobre mucosas o heridas abiertas sin orientación sanitaria.'
  },
  {
    id: 16,
    categoria: 'cortezas',
    categoriaNombre: 'Cortezas y Frutos Amazónicos',
    nombre: 'Uña de Gato',
    nombreCientifico: 'Uncaria tomentosa',
    icono: '🐾',
    ingredientes: 'Corteza interna fibrosa de la liana.',
    preparacion: 'Cocimiento: hervir 15 a 20 gramos de corteza en 1 litro de agua a fuego lento durante 20 minutos. Tomar colado.',
    uso: 'Molestias articulares, dolores reumáticos y procesos inflamatorios.',
    precaucion: 'Puede interactuar con fármacos inmunosupresores y antihipertensivos. Contraindicado en gestación y lactancia.'
  },
  {
    id: 17,
    categoria: 'cortezas',
    categoriaNombre: 'Cortezas y Frutos Amazónicos',
    nombre: 'Chuchuhuasi',
    nombreCientifico: 'Maytenus macrocarpa',
    icono: '🌳',
    ingredientes: 'Corteza gruesa del tronco.',
    preparacion: 'Cocimientos tradicionales de la corteza en agua a fuego moderado.',
    uso: 'Molestias musculares, dolor lumbar y fatiga física.',
    precaucion: 'NO se recomiendan macerados alcohólicos caseros ni su consumo medicinal en personas con hipertensión o úlcera activa.'
  },
  {
    id: 18,
    categoria: 'cortezas',
    categoriaNombre: 'Cortezas y Frutos Amazónicos',
    nombre: 'Achiote',
    nombreCientifico: 'Bixa orellana',
    icono: '🔴',
    ingredientes: 'Hojas secas y semillas con pigmento rojo (bixina).',
    preparacion: 'Infusión tradicional de hojas secas o cataplasmas tópicos con las semillas molidas.',
    uso: 'Cuidado de la piel, molestias inflamatorias y bienestar prostático tradicional.',
    precaucion: 'No está demostrado científicamente que cure infecciones bacterianas graves. Acudir al médico si hay síntomas urinarios.'
  },
  {
    id: 19,
    categoria: 'cortezas',
    categoriaNombre: 'Cortezas y Frutos Amazónicos',
    nombre: 'Bolsa Mullaca',
    nombreCientifico: 'Physalis angulata',
    icono: '🏮',
    ingredientes: 'Hojas y frutos protegidos en vesícula membranosa.',
    preparacion: 'Infusión de hojas o consumo moderado del fruto fresco cuando está completamente maduro.',
    uso: 'Molestias inflamatorias, afecciones dérmicas y vías urinarias.',
    precaucion: 'NO consumir hojas ni frutos verdes sin identificación botánica segura por presencia de alcaloides potencialmente irritantes.'
  },
  {
    id: 20,
    categoria: 'cortezas',
    categoriaNombre: 'Cortezas y Frutos Amazónicos',
    nombre: 'Amasisa',
    nombreCientifico: 'Erythrina fusca',
    icono: '🌺',
    ingredientes: 'Hojas y corteza según la práctica etnobotánica ribereña.',
    preparacion: 'Emplastos y baños externos documentados en medicina popular amazónica.',
    uso: 'Distintos malestares corporales, inflamaciones externas y golpes en faenas de monte.',
    precaucion: 'NO se recomienda preparar para consumo interno sin identificar con precisión la especie y validar su seguridad toxicológica.'
  }
];

const ESPECIES_LORETO_TABLA = [
  { num: 21, nombre: 'Malva', parte: 'Hojas', uso: 'Refrescante en fiebres leves y lavados dérmicos.' },
  { num: 22, nombre: 'Amor seco', parte: 'Hojas y partes aéreas', uso: 'Inflamaciones leves y molestias urinarias tradicionales.' },
  { num: 23, nombre: 'Abuta', parte: 'Corteza y raíces', uso: 'Cólicos menstruales y dolores de espalda en el bosque.' },
  { num: 24, nombre: 'Clavo huasca', parte: 'Corteza', uso: 'Macerados tradicionales vigorizantes y dolor muscular.' },
  { num: 25, nombre: 'Amasisa', parte: 'Corteza y hojas', uso: 'Baños corporales externos y cicatrización de contusiones.' },
  { num: 26, nombre: 'Ayahuma', parte: 'Fruto', uso: 'Emplastos tradicionales y baños contra dolores reumáticos.' },
  { num: 27, nombre: 'Huito (Jagua)', parte: 'Fruto', uso: 'Tinte protector contra zancudos y cuidado dérmico y capilar.' },
  { num: 28, nombre: 'Azúcar huayo', parte: 'Corteza', uso: 'Afecciones bronquiales y debilidad física general.' },
  { num: 29, nombre: 'Achira', parte: 'Rizoma', uso: 'Emplastos emolientes en quemaduras superficiales y llagas.' },
  { num: 30, nombre: 'Algodón', parte: 'Hojas y semillas', uso: 'Emplastos tradicionales en picaduras y afecciones de oídos.' }
];

const FUENTES_BIBLIOGRAFICAS = [
  'Instituto de Investigaciones de la Amazonía Peruana (IIAP) – Plantas medicinales de uso popular en la Amazonía peruana.',
  'Estudio etnobotánico de plantas medicinales utilizadas por dos comunidades Ticuna de Loreto.',
  'Conocimiento tradicional de plantas medicinales del pueblo Shawi (Alto Amazonas, Loreto).',
  'Estudio etnobotánico de la comunidad El Chino, cuenca Tamshiyacu-Tahuayo (Loreto, Perú).'
];

export default function App() {
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Filtros y Búsqueda del Botiquín Natural (30 Plantas y Remedios)
  const [botiquinFiltro, setBotiquinFiltro] = useState('todos');
  const [botiquinBusqueda, setBotiquinBusqueda] = useState('');

  // Estados de la Calculadora Fluvial
  const [calcCuenca, setCalcCuenca] = useState('napo');
  const [calcVelocidad, setCalcVelocidad] = useState(24);
  const [calcCorriente, setCalcCorriente] = useState(1.15);

  const rutaSeleccionada = useMemo(() => {
    return RUTAS_CUENCAS.find(r => r.id === calcCuenca) || RUTAS_CUENCAS[0];
  }, [calcCuenca]);

  const calculoNavegacion = useMemo(() => {
    const velReal = calcVelocidad * calcCorriente;
    const hDec = rutaSeleccionada.distanciaKm / velReal;
    const h = Math.floor(hDec);
    const m = Math.round((hDec - h) * 60);

    return {
      horas: h,
      minutos: m,
      velReal: Math.round(velReal),
      distancia: rutaSeleccionada.distanciaKm
    };
  }, [calcVelocidad, calcCorriente, rutaSeleccionada]);

  const plantasFiltradas = useMemo(() => {
    return CATALOGO_BOTIQUIN_20.filter(p => {
      const matchCat = botiquinFiltro === 'todos' || p.categoria === botiquinFiltro;
      const term = botiquinBusqueda.toLowerCase().trim();
      const matchSearch = !term ||
        p.nombre.toLowerCase().includes(term) ||
        p.nombreCientifico.toLowerCase().includes(term) ||
        p.uso.toLowerCase().includes(term) ||
        p.ingredientes.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [botiquinFiltro, botiquinBusqueda]);

  const hablarTexto = (texto) => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta lectura por voz.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-PE';
    u.rate = 0.9;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="ocean-app-root">
      {/* 1. BARRA SUPERIOR DE ESTADO OFFLINE */}
      <div className="top-offline-strip">
        <span className="pulse-dot"></span>
        <span>MODO OFFLINE ACTIVO • GUÍA MÉDICA RURAL Y RUTAS FLUVIALES DE LORETO • FUNCIONA 100% SIN INTERNET</span>
      </div>

      {/* 2. NAVBAR ESTILO OCEANKIND */}
      <nav className="ocean-navbar">
        <div className="brand-ocean-wrap" onClick={() => scrollToId('hero-section')}>
          <div className="brand-wave-icon">🌿</div>
          <div className="brand-ocean-text">
            <h1>Guía Verde de Salud</h1>
            <small>Salud Río Loreto</small>
          </div>
        </div>

        <div className="nav-ocean-links">
          <button className="nav-ocean-link" onClick={() => scrollToId('hero-section')}>Inicio</button>
          <button className="nav-ocean-link" onClick={() => scrollToId('bundles-section')}>Primeros Auxilios</button>
          <button className="nav-ocean-link" onClick={() => scrollToId('collection-section')}>Guías Rápidas</button>
          <button className="nav-ocean-link" onClick={() => scrollToId('calc-section')}>Rutas Fluviales</button>
          <button className="nav-ocean-link" onClick={() => scrollToId('botiquin-section')}>Botiquín Natural</button>
        </div>

        <div className="nav-ocean-actions">
          <button 
            className="btn-coral-nav" 
            onClick={() => alert('🚨 CANAL DE EMERGENCIA FLUVIAL LORETO:\n📞 Teléfono SAMU: 106 (Gratuito)\n📻 Radio HF: 5215 kHz\n🏥 Hospital de Apoyo Iquitos: (065) 26-4444\n🚤 Centro Salud Santa Clotilde: HF 5215 kHz')}
          >
            <span>🚨</span>
            <span>SAMU 106</span>
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION (OCEANKIND AQUATIC IMMERSION) */}
      <header id="hero-section" className="ocean-hero">
        <div className="hero-text-side">
          <div className="hero-ocean-badge">
            <span>💧</span>
            <span>SALUD RÍO LORETO • ACCESIBILIDAD RURAL OFFLINE</span>
          </div>

          {/* TÍTULO ESTILO COLLAGE / RECORTES DE STICKERS (IMAGEN 2) */}
          <div className="collage-title-wrapper" aria-label="Salud en los Ríos de Loreto">
            <div className="collage-decor-stars">
              <span className="silver-sticker" title="Sticker estrella plateada">⭐</span>
              <span className="silver-sticker star-delay" title="Sticker corazón plateado">🤍</span>
            </div>

            <div className="collage-words-row">
              <div className="collage-word">
                <span className="collage-tile tile-navy-stitch rot-m3">S</span>
                <span className="collage-tile tile-denim rot-p2">A</span>
                <span className="collage-tile tile-white-paper rot-m2">L</span>
                <span className="collage-tile tile-blue-thick rot-p3">U</span>
                <span className="collage-tile tile-navy-stitch rot-m1">D</span>
              </div>
              <div className="collage-word">
                <span className="collage-tile tile-denim rot-p2">E</span>
                <span className="collage-tile tile-navy-stitch rot-m3">N</span>
              </div>
            </div>

            <div className="collage-words-row">
              <div className="collage-word">
                <span className="collage-tile tile-white-paper rot-p1">L</span>
                <span className="collage-tile tile-blue-thick rot-m2">O</span>
                <span className="collage-tile tile-navy-stitch rot-p3">S</span>
              </div>
              <div className="collage-word">
                <span className="collage-tile tile-denim rot-m3">R</span>
                <span className="collage-tile tile-white-paper rot-p2">Í</span>
                <span className="collage-tile tile-blue-thick rot-m1">O</span>
                <span className="collage-tile tile-navy-stitch rot-p2">S</span>
              </div>
              <div className="collage-word">
                <span className="collage-tile tile-denim rot-m2">D</span>
                <span className="collage-tile tile-white-paper rot-p3">E</span>
              </div>
            </div>

            <div className="collage-words-row">
              <div className="collage-word">
                <span className="collage-tile tile-navy-stitch rot-m3">L</span>
                <span className="collage-tile tile-blue-thick rot-p1">O</span>
                <span className="collage-tile tile-denim rot-m2">R</span>
                <span className="collage-tile tile-white-paper rot-p3">E</span>
                <span className="collage-tile tile-navy-stitch rot-m1">T</span>
                <span className="collage-tile tile-blue-thick rot-p2">O</span>
              </div>
            </div>
          </div>

          {/* SUBTÍTULO ESTILO CALIGRAFÍA 3D AZUL INTENSO (IMAGEN 1) */}
          <h3 className="subtitle-cursive-3d subtitle-cursive-3d-lg">
            <span className="sparkle-icon">✦</span> Protege la Vida en Cada Comunidad <span className="sparkle-icon">✨</span>
          </h3>

          <p className="hero-ocean-desc">
            Orientación médica inmediata ante mordeduras, fiebres y heridas, combinada con la sabiduría botánica de nuestras plantas amazónicas y cálculo exacto de navegación hacia la posta más cercana.
          </p>

          <div className="hero-cta-group">
            <button className="btn-coral-pill" onClick={() => scrollToId('bundles-section')}>
              <span>🚨 Ver Primeros Auxilios Inmediatos</span>
              <span>→</span>
            </button>
            <button className="btn-outline-pill" onClick={() => scrollToId('calc-section')}>
              <span>⏱️ Calcular Tiempos de Río</span>
            </button>
          </div>

          <div className="hero-4badges-row">
            <div className="hero-micro-badge">
              <span className="icon">🌿</span>
              <span className="label">100% Offline<br />Sin Internet</span>
            </div>
            <div className="hero-micro-badge">
              <span className="icon">💊</span>
              <span className="label">Botiquín Seguro<br />Plantas Nativas</span>
            </div>
            <div className="hero-micro-badge">
              <span className="icon">⏱️</span>
              <span className="label">Rutas de Río<br />Tiempos Reales</span>
            </div>
            <div className="hero-micro-badge">
              <span className="icon">📡</span>
              <span className="label">Radio HF 24/7<br />SAMU Loreto 106</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO DEL HERO: IMAGEN 1 (RED FLUVIAL Y MEDICINA ANCESTRAL) */}
        <div className="hero-visual-side">
          <div className="hero-floating-card">
            <div className="hero-floating-badge-top">Posta Conectada 24/7</div>
            <img src="images/red-fluvial.jpg" alt="Red Fluvial y Medicina Ancestral de Loreto" />
            
            <div className="hero-floating-overlay">
              <h3>🏥 Red Fluvial Santa Clotilde & Mazán</h3>
              <p>Monitoreo continuo de sueros antiofídicos y oxígeno medicinal en comunidades ribereñas del Río Napo y Nanay.</p>
              
              <div className="hero-floating-pills-row">
                <span className="pill-stat-mini">💉 8 Dosis Suero</span>
                <span className="pill-stat-mini">🫧 4 Balones O2</span>
                <span className="pill-stat-mini">📻 5215 kHz HF</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4. DIVISOR DE OLA SUPERIOR (TRANSICIÓN A BLANCO / HIELO) */}
      <div className="wave-divider" style={{ background: 'var(--ocean-darkest)' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z" fill="#ffffff"></path>
        </svg>
      </div>

      {/* 5. SECCIÓN DE ESTADÍSTICAS ("OUR IMPACT TOGETHER" STAT BAR) */}
      <section className="stats-impact-section">
        <div className="stats-impact-container">
          <div className="impact-lead-box">
            <h3>Nuestra Red de<br />Salud Fluvial</h3>
            <p>Monitoreo en tiempo real de postas e insumos en Loreto</p>
          </div>

          <div className="impact-stat-item">
            <div className="stat-num-box">
              <span className="stat-icon">🏥</span>
              <span className="stat-big-number">4</span>
            </div>
            <small>Postas Conectadas en Santa Clotilde, Nauta y Nanay</small>
          </div>

          <div className="impact-stat-item">
            <div className="stat-num-box">
              <span className="stat-icon">💉</span>
              <span className="stat-big-number">16+</span>
            </div>
            <small>Dosis de Suero Antiofídico Polivalente en red</small>
          </div>

          <div className="impact-stat-item">
            <div className="stat-num-box">
              <span className="stat-icon">🫧</span>
              <span className="stat-big-number">8</span>
            </div>
            <small>Balones de Oxígeno Medicinal para emergencias</small>
          </div>

          <div className="impact-stat-item">
            <div className="stat-num-box">
              <span className="stat-icon">📻</span>
              <span className="stat-big-number">24/7</span>
            </div>
            <small>Canal Abierto de Radiofonía HF 5215 kHz y SAMU 106</small>
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN "FEATURED BUNDLES" (PRIMEROS AUXILIOS INMEDIATOS) */}
      <section id="bundles-section" className="section-featured-bundles">
        <div className="bundles-header-row">
          <div className="bundles-title-wrap">
            <span className="coral-badge-tag">URGENCIAS FRECUENTES</span>
            <h2 className="subtitle-cursive-3d">
              <span className="sparkle-icon">✦</span> Primeros Auxilios Inmediatos <span className="sparkle-icon">✨</span>
            </h2>
          </div>
          <p>
            Protocolos paso a paso sobre qué hacer y qué NUNCA hacer mientras se organiza el traslado a la posta médica.
          </p>
        </div>

        <div className="bundles-3grid">
          {/* Card 1: Mordedura de Serpiente (Imagen 2) */}
          <div className="bundle-card">
            <div className="bundle-card-img-wrap">
              <span className="bundle-pill-alert">URGENCIA CRÍTICA</span>
              <img src="images/mordedura-serpiente.jpg" alt="Mordedura de Serpiente Jergón" />
            </div>
            <div className="bundle-card-body">
              <h3>Mordedura de Serpiente</h3>
              <div className="bundle-sub-tag">Jergón, Shushupe y Loromachaco</div>

              <ul className="bundle-checklist">
                <li className="positive"><span className="bullet">✔</span> Inmovilizar con tablilla a nivel del corazón</li>
                <li className="positive"><span className="bullet">✔</span> Lavar suavemente con agua y jabón neutro</li>
                <li className="positive"><span className="bullet">✔</span> Retirar anillos, botas y ropa ajustada</li>
                <li className="negative"><span className="bullet">✖</span> NUNCA hacer torniquetes ni tajear con machete</li>
              </ul>

              <div className="bundle-footer-strip">
                <div className="bundle-time-badge">⏱️ Menos de 4 a 6 horas</div>
                <button className="btn-bundle-view" onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[0])}>
                  <span>Ver Protocolo</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Fiebre Alta y Dengue (Imagen 3) */}
          <div className="bundle-card">
            <div className="bundle-card-img-wrap">
              <span className="bundle-pill-alert">ALERTA HEMORRÁGICA</span>
              <img src="images/fiebre-dengue.jpg" alt="Fiebre Alta y Dengue en Niños" />
            </div>
            <div className="bundle-card-body">
              <h3>Fiebre Alta y Dengue</h3>
              <div className="bundle-sub-tag">Zancudo Aedes y Época de Creciente</div>

              <ul className="bundle-checklist">
                <li className="positive"><span className="bullet">✔</span> Paños húmedos a temperatura de río</li>
                <li className="positive"><span className="bullet">✔</span> Hidratación continua con suero o agua de coco</li>
                <li className="positive"><span className="bullet">✔</span> Para dolor y fiebre: ÚNICAMENTE Paracetamol</li>
                <li className="negative"><span className="bullet">✖</span> NUNCA tomar Ibuprofeno, Aspirina ni Metamizol</li>
              </ul>

              <div className="bundle-footer-strip">
                <div className="bundle-time-badge">⏱️ Atención en 24 horas</div>
                <button className="btn-bundle-view" onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[1])}>
                  <span>Ver Protocolo</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Cortes por Machete (Imagen 4) */}
          <div className="bundle-card">
            <div className="bundle-card-img-wrap">
              <span className="bundle-pill-alert">PRIMEROS 10 MINUTOS</span>
              <img src="images/cortes-machete.jpg" alt="Cortes Profundos de Machete" />
            </div>
            <div className="bundle-card-body">
              <h3>Cortes por Machete</h3>
              <div className="bundle-sub-tag">Trauma en Chacra y Hemorragias</div>

              <ul className="bundle-checklist">
                <li className="positive"><span className="bullet">✔</span> Presión directa firme por 15 min sin soltar</li>
                <li className="positive"><span className="bullet">✔</span> Elevar el miembro por encima del corazón</li>
                <li className="positive"><span className="bullet">✔</span> Si empapa, poner otra tela encima</li>
                <li className="negative"><span className="bullet">✖</span> NUNCA aplicar café, tabaco, cenizas ni tierra</li>
              </ul>

              <div className="bundle-footer-strip">
                <div className="bundle-time-badge">⏱️ Contener en 10 min</div>
                <button className="btn-bundle-view" onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[2])}>
                  <span>Ver Protocolo</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DIVISOR DE OLA HACIA SECCIÓN OSCURA ("SHOP BY COLLECTION") */}
      <div className="wave-divider" style={{ background: 'var(--ocean-light-bg)' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C200,100 450,20 700,90 C950,160 1100,30 1200,60 L1200,120 L0,120 Z" fill="#02232c"></path>
        </svg>
      </div>

      {/* 8. SECCIÓN "SHOP BY COLLECTION" (GUÍAS RÁPIDAS POR SÍNTOMA) */}
      <section id="collection-section" className="section-shop-collection">
        <div className="collection-header-row">
          <div>
            <h2 className="subtitle-cursive-3d">
              <span className="sparkle-icon">✦</span> Guías Rápidas por Síntoma <span className="sparkle-icon">✨</span>
            </h2>
            <p>Toca cualquier tarjeta para abrir el protocolo médico con voz guiada sin conexión.</p>
          </div>
        </div>

        <div className="collection-cards-grid">
          {/* Card 1: Serpiente (Foto 2) */}
          <div className="collection-pill-card" onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[0])}>
            <div className="collection-card-img-thumb">
              <img src="images/mordedura-serpiente.jpg" alt="Mordedura" />
            </div>
            <h4>Mordedura Serpiente</h4>
            <p>Jergón, shushupe y traslado con suero.</p>
            <div className="collection-card-arrow-row">
              <div className="collection-circle-arrow">→</div>
            </div>
          </div>

          {/* Card 2: Fiebre (Foto 3) */}
          <div className="collection-pill-card" onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[1])}>
            <div className="collection-card-img-thumb">
              <img src="images/fiebre-dengue.jpg" alt="Fiebre" />
            </div>
            <h4>Fiebre y Dengue</h4>
            <p>Manejo térmico y prevención hemorrágica.</p>
            <div className="collection-card-arrow-row">
              <div className="collection-circle-arrow">→</div>
            </div>
          </div>

          {/* Card 3: Cortes (Foto 4) */}
          <div className="collection-pill-card" onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[2])}>
            <div className="collection-card-img-thumb">
              <img src="images/cortes-machete.jpg" alt="Cortes" />
            </div>
            <h4>Cortes Machete</h4>
            <p>Presión continua y vendaje en chacra.</p>
            <div className="collection-card-arrow-row">
              <div className="collection-circle-arrow">→</div>
            </div>
          </div>

          {/* Card 4: Diarrea (Foto 5) */}
          <div className="collection-pill-card" onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[3])}>
            <div className="collection-card-img-thumb">
              <img src="images/diarrea-deshidratacion.jpg" alt="Diarrea" />
            </div>
            <h4>Diarrea y Suero</h4>
            <p>Fórmula de rehidratación oral infantil.</p>
            <div className="collection-card-arrow-row">
              <div className="collection-circle-arrow">→</div>
            </div>
          </div>

          {/* Card 5: Chuzo (Foto 6) */}
          <div className="collection-pill-card" onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[4])}>
            <div className="collection-card-img-thumb">
              <img src="images/chuzo-raya.jpg" alt="Chuzo Raya" />
            </div>
            <h4>Chuzo de Raya</h4>
            <p>Inmersión en agua caliente para alivio.</p>
            <div className="collection-card-arrow-row">
              <div className="collection-circle-arrow">→</div>
            </div>
          </div>

          {/* Card 6: Botiquín Plantas (Foto 1) */}
          <div className="collection-pill-card" onClick={() => scrollToId('botiquin-section')}>
            <div className="collection-card-img-thumb">
              <img src="images/red-fluvial.jpg" alt="Plantas Medicinales" />
            </div>
            <h4>Botiquín Natural</h4>
            <p>Sangre de grado, matico y uña de gato.</p>
            <div className="collection-card-arrow-row">
              <div className="collection-circle-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SECCIÓN PANORÁMICA DE LA CALCULADORA FLUVIAL ("MORE THAN A PURCHASE" MODEL) */}
      <section id="calc-section" className="section-panoramic-calc">
        <div className="panoramic-header-box">
          <h2 className="subtitle-cursive-3d subtitle-cursive-3d-lg">
            <span className="sparkle-icon">✦</span> Una Ruta Segura en el Río Loreto <span className="sparkle-icon">✨</span>
          </h2>
          <p>
            Calcula con precisión las horas y minutos de navegación según tu río, embarcación y corriente para llegar a tiempo a la posta con suero y oxígeno.
          </p>
        </div>

        <div className="fluvial-calc-card">
          {/* LADO IZQUIERDO: SELECTORES INTERACTIVOS */}
          <div className="calc-controls-col">
            <div className="calc-input-group">
              <label htmlFor="selCuenca">1. Cuenca o Río de Origen:</label>
              <select 
                id="selCuenca" 
                className="calc-select-ocean"
                value={calcCuenca}
                onChange={(e) => setCalcCuenca(e.target.value)}
              >
                {RUTAS_CUENCAS.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.nombre} — {r.subtitulo} ({r.distanciaKm} km)
                  </option>
                ))}
              </select>
            </div>

            <div className="calc-input-group">
              <label htmlFor="selBote">2. Tipo de Embarcación:</label>
              <select 
                id="selBote" 
                className="calc-select-ocean"
                value={calcVelocidad}
                onChange={(e) => setCalcVelocidad(Number(e.target.value))}
              >
                <option value={12}>Peque-peque artesanal (12 km/h)</option>
                <option value={24}>Bote con motor fuera de borda (24 km/h)</option>
                <option value={45}>Deslizador rápido de emergencia (45 km/h)</option>
              </select>
            </div>

            <div className="calc-input-group">
              <label htmlFor="selCorriente">3. Sentido de la Corriente del Río:</label>
              <select 
                id="selCorriente" 
                className="calc-select-ocean"
                value={calcCorriente}
                onChange={(e) => setCalcCorriente(Number(e.target.value))}
              >
                <option value={1.2}>Aguas abajo (Corriente a favor +20%)</option>
                <option value={1.0}>Aguas tranquilas / Remanso normal</option>
                <option value={0.75}>Aguas arriba (Contra corriente -25%)</option>
              </select>
            </div>
          </div>

          {/* LADO DERECHO: RESULTADOS Y DISPONIBILIDAD DE POSTA */}
          <div className="calc-results-col">
            <div className="calc-time-display">
              <small>Tiempo Estimado de Viaje</small>
              <div className="time-big">
                {calculoNavegacion.horas > 0 && `${calculoNavegacion.horas} h `}
                {calculoNavegacion.minutos} min
              </div>
              <p>
                Destino: <strong>{rutaSeleccionada.posta}</strong> (~{calculoNavegacion.distancia} km a ~{calculoNavegacion.velReal} km/h)
              </p>
            </div>

            <div className="supplies-tags-grid">
              <div className="supply-tag-card">
                <span>💉</span>
                <span>{rutaSeleccionada.suero}</span>
              </div>
              <div className="supply-tag-card">
                <span>🫧</span>
                <span>{rutaSeleccionada.oxigeno}</span>
              </div>
              <div className="supply-tag-card">
                <span>🦟</span>
                <span>{rutaSeleccionada.pruebasDengue}</span>
              </div>
              <div className="supply-tag-card">
                <span>📻</span>
                <span>HF: {rutaSeleccionada.radio}</span>
              </div>
            </div>

            <button 
              className="btn-emergency-action"
              onClick={() => alert(`🚨 ALERTA FLUVIAL ACTIVADA:\nDestino: ${rutaSeleccionada.posta}\nFrecuencia Radio: ${rutaSeleccionada.radio}\nLlamada SAMU: 106\nDistancia de río: ${rutaSeleccionada.distanciaKm} km\nTiempo calculado: ${calculoNavegacion.horas}h ${calculoNavegacion.minutos}m`)}
            >
              <span>🚨 Activar Alerta Fluvial SAMU 106</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. SECCIÓN BOTIQUÍN NATURAL AMAZÓNICO (CATÁLOGO COMPLETO DE 30 ESPECIES) */}
      <section id="botiquin-section" className="section-botiquin-natural">
        <div className="botiquin-header-row">
          <h2 className="subtitle-cursive-3d">
            <span className="sparkle-icon">✦</span> Botiquín Natural Amazónico <span className="sparkle-icon">✨</span>
          </h2>
          <p>
            Catálogo etnobotánico verificado de Loreto: fichas prácticas de 20 remedios tradicionales, tabla de 10 especies adicionales, advertencias sanitarias y fuentes bibliográficas oficiales.
          </p>
        </div>

        {/* Buscador y Pestañas de Categoría */}
        <div className="botiquin-controls-wrap">
          <div className="botiquin-search-bar">
            <span className="botiquin-search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar planta, síntoma (ej. kion, tos, fiebre, estómago, uña de gato)..."
              value={botiquinBusqueda}
              onChange={(e) => setBotiquinBusqueda(e.target.value)}
            />
          </div>

          <div className="botiquin-tabs-row">
            <button 
              className={`btn-botiquin-tab ${botiquinFiltro === 'todos' ? 'active' : ''}`}
              onClick={() => setBotiquinFiltro('todos')}
            >
              🌿 Todas las Fichas (20)
            </button>
            <button 
              className={`btn-botiquin-tab ${botiquinFiltro === 'tos' ? 'active' : ''}`}
              onClick={() => setBotiquinFiltro('tos')}
            >
              🫁 Tos, Gripe y Garganta (8)
            </button>
            <button 
              className={`btn-botiquin-tab ${botiquinFiltro === 'estomago' ? 'active' : ''}`}
              onClick={() => setBotiquinFiltro('estomago')}
            >
              🥣 Estómago y Digestión (5)
            </button>
            <button 
              className={`btn-botiquin-tab ${botiquinFiltro === 'cortezas' ? 'active' : ''}`}
              onClick={() => setBotiquinFiltro('cortezas')}
            >
              🌳 Cortezas y Frutos (7)
            </button>
            <button 
              className={`btn-botiquin-tab ${botiquinFiltro === 'tabla' ? 'active' : ''}`}
              onClick={() => {
                setBotiquinFiltro('tabla');
                scrollToId('tabla-especies');
              }}
            >
              📋 Tabla Especies 21-30 (10)
            </button>
          </div>
        </div>

        {/* Fichas Botánicas (Primeros 20 elementos) */}
        {botiquinFiltro !== 'tabla' && (
          <div className="botiquin-cards-grid">
            {plantasFiltradas.map((p) => (
              <div 
                key={p.id} 
                className="botanical-card"
                onClick={() => setActiveModalItem({
                  titulo: p.nombre,
                  subtitulo: `${p.nombreCientifico} • ${p.categoriaNombre}`,
                  tiempoMax: 'Uso Tradicional Seguro',
                  queHacer: [
                    `Ingredientes / Parte utilizada: ${p.ingredientes}`,
                    `Preparación tradicional: ${p.preparacion}`,
                    `Uso popular reportado: ${p.uso}`
                  ],
                  queNoHacer: [
                    '¡NUNCA sustituir la atención médica de una urgencia grave con hierbas caseras!',
                    '¡NUNCA administrar preparados alcohólicos a gestantes ni niños pequeños!',
                    '¡NUNCA ingerir plantas de dudosa identificación sin consultar a sabios locales!'
                  ],
                  alarma: p.precaucion
                })}
              >
                <div className="card-top-meta">
                  <span className="card-cat-badge">{p.categoriaNombre}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)', fontWeight: 700 }}>#{p.id}</span>
                </div>

                <div className="botanical-card-header">
                  <div className="botanical-icon-orb">{p.icono}</div>
                  <div className="botanical-title-wrap">
                    <h4>{p.nombre}</h4>
                    <small>{p.nombreCientifico}</small>
                  </div>
                </div>

                <div className="botanical-details-list">
                  <div className="botanical-detail-row">
                    <strong>Ingredientes / Parte:</strong>
                    <span>{p.ingredientes}</span>
                  </div>
                  <div className="botanical-detail-row">
                    <strong>Preparación tradicional:</strong>
                    <span>{p.preparacion}</span>
                  </div>
                  <div className="botanical-detail-row">
                    <strong>Uso popular reportado:</strong>
                    <span>{p.uso}</span>
                  </div>
                </div>

                <div className="botanical-alert-box">
                  <strong>⚠️ Precaución:</strong> {p.precaucion}
                </div>

                <button 
                  className="btn-card-listen"
                  onClick={(e) => {
                    e.stopPropagation();
                    hablarTexto(`${p.nombre}. Uso tradicional: ${p.uso}. Preparación: ${p.preparacion}. Precaución importante: ${p.precaucion}`);
                  }}
                >
                  <span>🔊</span>
                  <span>Escuchar Ficha</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tabla de Especies Adicionales de Loreto (Elementos 21 al 30) */}
        <div id="tabla-especies" className="botiquin-table-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.4rem' }}>📋</span>
            <h3>Otros Nombres de Plantas Medicinales de Loreto (Catálogo Complementario)</h3>
          </div>
          <p>
            Especies vegetales registradas en publicaciones sobre flora medicinal amazónica para incorporar a la biblioteca comunitaria. No todas cuentan con dosificación segura o indicación clínica comprobada.
          </p>

          <div className="table-responsive-box">
            <table className="plantas-loreto-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>N.º</th>
                  <th style={{ width: '25%' }}>Nombre Popular</th>
                  <th style={{ width: '25%' }}>Parte Vegetal</th>
                  <th style={{ width: '42%' }}>Uso Tradicional Registrado</th>
                </tr>
              </thead>
              <tbody>
                {ESPECIES_LORETO_TABLA.map((item) => (
                  <tr key={item.num}>
                    <td><strong>{item.num}</strong></td>
                    <td style={{ fontWeight: 700, color: 'var(--ocean-deep)' }}>{item.nombre}</td>
                    <td>{item.parte}</td>
                    <td>{item.uso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cuadro de Seguridad y Recomendaciones Importantes */}
        <div className="safety-guidelines-box">
          <h3>
            <span>🛡️</span>
            <span>Recomendaciones Importantes para la Guía Verde de Salud</span>
          </h3>

          <p>
            En el contexto ribereño y rural de Loreto, es fundamental que la población y los promotores de salud diferencien con total claridad tres aspectos al utilizar medicina natural:
          </p>

          <div className="safety-triad-grid">
            <div className="safety-triad-item">
              <h5>1. Uso Tradicional</h5>
              <p>Saberes ancestrales transmitidos por generaciones de sabios, curacas y parteras de nuestras cuencas.</p>
            </div>
            <div className="safety-triad-item">
              <h5>2. Evidencia Científica</h5>
              <p>Propiedades farmacológicas y principios activos estudiados y validados por centros de investigación etnobotánica.</p>
            </div>
            <div className="safety-triad-item">
              <h5>3. Precauciones y Alertas</h5>
              <p>Límites de toxicidad, interacciones y el momento exacto en que es obligatorio acudir al centro de salud.</p>
            </div>
          </div>

          <ul className="safety-rules-list">
            <li><strong>Para diarrea aguda:</strong> Priorizar siempre el suero de rehidratación oral (casero o en sobre). Las plantas astringentes no reemplazan los líquidos y electrolitos perdidos, especialmente en niños.</li>
            <li><strong>Para fiebre alta:</strong> Evaluar inmediatamente la causa. En Loreto circulan dengue, malaria y leptospirosis. NUNCA administrar ibuprofeno ni aspirina por riesgo de hemorragia fatal.</li>
            <li><strong>Para heridas y cortes:</strong> Lavar con agua hervida limpia y jabón. Si son profundas, infectadas o causadas por machete sucio, trasladar a la posta para sutura y vacuna antitetánica.</li>
            <li><strong>Para mordeduras de serpientes o rayas:</strong> ¡ACUDIR URGENTEMENTE A LA POSTA MÉDICA! NUNCA aplicar plantas, barro ni torniquetes sobre la mordedura. El único tratamiento eficaz contra el veneno es el suero antiofídico del MINSA.</li>
          </ul>
        </div>

        {/* Fuentes Bibliográficas */}
        <div className="sources-bibliography-box">
          <h4>
            <span>📚</span>
            <span>Fuentes Bibliográficas e Investigaciones Científicas</span>
          </h4>
          <ol className="sources-ol">
            {FUENTES_BIBLIOGRAFICAS.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* 11. BARRA DE 4 VALORES (OCEANKIND BOTTOM BADGES BAR) */}
      <section className="ocean-bottom-badges-bar">
        <div className="bottom-badges-container">
          <div className="bottom-value-badge">
            <span className="badge-icon">🌿</span>
            <div className="badge-text">
              <h5>100% Autónomo y Offline</h5>
              <small>No requiere conexión en el río</small>
            </div>
          </div>

          <div className="bottom-value-badge">
            <span className="badge-icon">🩺</span>
            <div className="badge-text">
              <h5>Protocolos Médicos Validados</h5>
              <small>Basados en directivas oficiales MINSA</small>
            </div>
          </div>

          <div className="bottom-value-badge">
            <span className="badge-icon">🛶</span>
            <div className="badge-text">
              <h5>Tiempos Reales de Navegación</h5>
              <small>Cuencas de Napo, Nanay, Marañón e Itaya</small>
            </div>
          </div>

          <div className="bottom-value-badge">
            <span className="badge-icon">📡</span>
            <div className="badge-text">
              <h5>Red Fluvial de Auxilio 24/7</h5>
              <small>Enlace SAMU 106 y Radio HF 5215 kHz</small>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER OSCURO ESTILO OCEANKIND */}
      <footer className="ocean-footer">
        <div className="footer-main-grid">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.6rem' }}>🌿</span>
              <h4 style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>Guía Verde de Salud</h4>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
              Salud Río Loreto: Plataforma de asistencia médica rural, sabiduría botánica tradicional y tiempos de auxilio fluvial para comunidades de la Amazonía peruana.
            </p>
          </div>

          <div className="footer-col">
            <h5>Navegación Rápida</h5>
            <ul>
              <li onClick={() => scrollToId('hero-section')}>Inicio</li>
              <li onClick={() => scrollToId('bundles-section')}>Primeros Auxilios</li>
              <li onClick={() => scrollToId('collection-section')}>Guías Rápidas</li>
              <li onClick={() => scrollToId('calc-section')}>Calculadora Fluvial</li>
              <li onClick={() => scrollToId('botiquin-section')}>Botiquín Natural</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Urgencias</h5>
            <ul>
              <li onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[0])}>Mordedura de Serpiente</li>
              <li onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[1])}>Fiebre Alta y Dengue</li>
              <li onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[2])}>Cortes de Machete</li>
              <li onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[3])}>Diarrea y Deshidratación</li>
              <li onClick={() => setActiveModalItem(EMERGENCIAS_DATOS[4])}>Chuzo de Raya</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Canales de Emergencia</h5>
            <ul>
              <li>📞 SAMU Loreto: 106 (Gratuito)</li>
              <li>📻 Radio HF Fluvial: 5215 kHz</li>
              <li>🏥 Hospital Regional Iquitos: (065) 26-4444</li>
              <li>🚤 Posta Santa Clotilde: HF 5215 kHz</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-copy">
          <div>© 2026 Guía Verde de Salud — Desarrollado para comunidades y pueblos de Loreto.</div>
          <div style={{ color: 'var(--ocean-cyan-glow)', fontWeight: 700 }}>
            🟢 100% Funcional sin Internet ni Señal
          </div>
        </div>
      </footer>

      {/* 13. MODAL INTERACTIVO CON VOZ */}
      {activeModalItem && (
        <div className="ocean-modal-overlay" onClick={() => setActiveModalItem(null)}>
          <div className="ocean-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="btn-modal-close" onClick={() => setActiveModalItem(null)}>✕</button>

            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--ocean-cyan-glow)', textTransform: 'uppercase' }}>
              PROTOCOLO MÉDICO VERIFICADO
            </span>

            <div className="modal-header-with-img">
              {activeModalItem.imagen && (
                <div className="modal-thumb-box">
                  <img src={activeModalItem.imagen} alt={activeModalItem.titulo} />
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                  {activeModalItem.titulo}
                </h3>
                <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                  ⏱️ {activeModalItem.tiempoMax}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <button 
                className="btn-coral-pill"
                onClick={() => hablarTexto(`${activeModalItem.titulo}. Qué hacer: ${activeModalItem.queHacer.join('. ')}. Qué no hacer: ${activeModalItem.queNoHacer.join('. ')}`)}
              >
                <span>{isSpeaking ? '⏹️' : '🔊'}</span>
                <span>{isSpeaking ? 'Detener Voz' : 'Escuchar Protocolo en Voz Alta'}</span>
              </button>
            </div>

            <div className="modal-box-positive">
              <h4 style={{ color: '#34d399', marginBottom: '8px', fontSize: '0.95rem' }}>✅ QUÉ SÍ HACER:</h4>
              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.92rem', color: '#ffffff' }}>
                {activeModalItem.queHacer.map((paso, idx) => (
                  <li key={idx}>{paso}</li>
                ))}
              </ol>
            </div>

            <div className="modal-box-negative">
              <h4 style={{ color: '#f87171', marginBottom: '8px', fontSize: '0.95rem' }}>❌ QUÉ NUNCA DEBES HACER:</h4>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.92rem', color: '#fee2e2' }}>
                {activeModalItem.queNoHacer.map((prohibicion, idx) => (
                  <li key={idx}>{prohibicion}</li>
                ))}
              </ul>
            </div>

            {activeModalItem.alarma && (
              <div className="modal-box-alert">
                <strong>⚠️ Señales de alarma extrema:</strong> {activeModalItem.alarma}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
