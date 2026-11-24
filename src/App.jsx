import { useState, useEffect, useMemo } from 'react'
import './App.css'

// ============================================================================
// BASE DE DATOS LOCAL OFFLINE — LORETO / AMAZONÍA PERUANA
// ============================================================================

const PRIMEROS_AUXILIOS = [
  {
    id: 'mordedura-serpiente',
    titulo: 'Mordedura de Serpiente (Jergón, Shushupe, Cascabel)',
    subtitulo: 'Acción crítica en las primeras 4 a 6 horas para el suero antiofídico',
    categoria: 'Urgencia Crítica',
    icono: '🐍',
    badge: 'Peligro Mortal',
    badgeClass: 'critical',
    tiempoMax: 'Menos de 4 a 6 horas para suero antiofídico',
    tags: ['mordedura', 'serpiente', 'vibora', 'jergon', 'shushupe', 'veneno', 'emergencia'],
    queHacer: [
      'Mantener a la persona en calma total y acostada inmóvil. El pánico y el movimiento aceleran la circulación del veneno por la sangre.',
      'Inmovilizar el brazo o la pierna mordida con una tablilla rígida (o caña brava) y vendaje flojo, manteniéndola al nivel del corazón.',
      'Lavar la herida suavemente con abundante agua limpia de lluvia o hervida fría y jabón neutro, sin frotar ni raspar.',
      'Retirar INMEDIATAMENTE anillos, pulseras, relojes o botas antes de que la extremidad se hinche por completo.',
      'Dar de beber agua limpia con frecuencia para mantener hidratados los riñones frente a las toxinas.',
      'Trasladar urgente a la posta más cercana en peque-peque o deslizador, manteniendo al paciente recostado.'
    ],
    queNoHacer: [
      '¡NUNCA hacer torniquetes ni amarras apretadas! Cortan la circulación, pudren los músculos (necrosis) y provocan amputación.',
      '¡NUNCA cortar la piel con machete, gillette ni navaja!',
      '¡NUNCA intentar chupar o succionar el veneno con la boca! Las caries y encías absorben el veneno y envenenan al auxiliador.',
      '¡NUNCA aplicar barro, kerosén, gasolina, cal, pólvora ni orina sobre la mordedura!',
      '¡NUNCA dar aguardiente, alcohol ni café al paciente!',
      '¡NUNCA perder horas persiguiendo a la víbora viva! Solo si ya murió llévela con cuidado o tómale foto para identificar el suero.'
    ],
    signosAlarma: 'Hinchazón que sube rápidamente, sangrado por encías, nariz u orina, visión doble o borrosa, dolor insoportable y manchas moradas en la piel.'
  },
  {
    id: 'fiebre-dengue-malaria',
    titulo: 'Fiebre Alta y Sospecha de Dengue, Malaria o Leptospirosis',
    subtitulo: 'Enfermedades transmitidas por zancudos en creciente y lluvias',
    categoria: 'Infección Aguda',
    icono: '🌡️',
    badge: 'Riesgo Hemorrágico',
    badgeClass: 'critical',
    tiempoMax: 'Atención dentro de 24 horas',
    tags: ['fiebre', 'dengue', 'malaria', 'calor', 'zancudo', 'dolor', 'cabeza'],
    queHacer: [
      'Bajar la temperatura con paños de tela limpios empapados en agua a temperatura de río o tibia en frente, cuello, axilas e ingles.',
      'Ofrecer abundantes líquidos fraccionados: suero oral casero, agua de coco verde fresca o caldos suaves cada 15 a 20 minutos.',
      'Para la fiebre y el dolor, administrar ÚNICAMENTE PARACETAMOL (Dosis adultos: 500 mg a 1 g cada 6 a 8 horas; niños según peso/indicación de posta).',
      'Mantener a la persona siempre acostada bajo mosquitero para evitar que los zancudos la piquen y contagien al resto de la comunidad.',
      'Vigilar constantemente la aparición de sangrado o dolor de estómago intolerable.'
    ],
    queNoHacer: [
      '¡NUNCA tomar ni inyectar IBUPROFENO, ASPIRINA, NAPROXENO, METAMIZOL ni DICLOFENACO! Destruyen las plaquetas y provocan hemorragias mortales por Dengue grave.',
      '¡NUNCA bañar con agua helada o con hielo (puede provocar choque térmico o convulsiones).',
      '¡NUNCA inyectar antibióticos en la nalga sin una prueba previa de sangre o gota gruesa en la posta médica.',
      '¡NUNCA suspender la hidratación aunque el paciente refiera falta de sed o náuseas.'
    ],
    signosAlarma: 'Dolor abdominal continuo e intenso, vómitos repetidos que impiden tomar suero, sangrado de encías o heces negras, desmayos o frialdad en manos y pies.'
  },
  {
    id: 'heridas-machete',
    titulo: 'Cortes Profundos y Hemorragias por Machete o Sierra',
    subtitulo: 'Accidentes comunes en chacras, desmontes y aserraderos',
    categoria: 'Trauma / Sangrado',
    icono: '🩹',
    badge: 'Urgencia Inmediata',
    badgeClass: 'critical',
    tiempoMax: 'Contener en los primeros 10 minutos',
    tags: ['corte', 'machete', 'sangre', 'herida', 'hemorragia', 'accidente'],
    queHacer: [
      'Aplicar PRESIÓN DIRECTA Y FIRME con un paño limpio, polo o toalla doblada directamente sobre el corte durante 10 a 15 minutos sin levantar la mano.',
      'Elevar el brazo o pierna herida por encima del nivel del corazón para reducir la fuerza del chorro de sangre.',
      'Si la tela se empapa por completo de sangre, NO la retires; coloca otra tela limpia encima y continúa presionando con más fuerza.',
      'Una vez contenido el flujo de sangre, vendar con firmeza comprobando que los dedos no se pongan fríos ni morados.',
      'Si es posible, enjuagar los bordes con agua hervida limpia o suero salino antes del traslado.'
    ],
    queNoHacer: [
      '¡NUNCA echar café molido, tabaco, cenizas, telarañas ni tierra sobre la herida! Provocan infección masiva y tétanos.',
      '¡NUNCA retirar objetos punzocortantes o astillas que estén profundamente clavadas; inmovilízalos en su lugar y traslade al paciente.',
      '¡NUNCA levantar el paño cada minuto para "ver si ya cerró"; eso rompe el coágulo en formación y reinicia el sangrado.',
      '¡NUNCA aplicar alcohol puro o kerosén dentro de una herida profunda abierta.'
    ],
    signosAlarma: 'Sangrado a borbotones o en pulsos (sangre arterial roja brillante), palidez extrema, pérdida de pulso o incapacidad para mover dedos.'
  },
  {
    id: 'diarrea-deshidratacion',
    titulo: 'Diarrea Aguda y Deshidratación en Niños y Adultos',
    subtitulo: 'Peligro mortal por pérdida rápida de electrolitos y agua de río contaminada',
    categoria: 'Urgencia Pediátrica',
    icono: '💧',
    badge: 'Riesgo Deshidratación',
    badgeClass: 'critical',
    tiempoMax: 'Rehidratación inmediata continua',
    tags: ['diarrea', 'vomito', 'deshidratacion', 'suero', 'estomago', 'infeccion', 'nino'],
    queHacer: [
      'Preparar SUERO CASERO de inmediato: En 1 litro de agua hervida fría, disolver 2 cucharadas soperas rasas de azúcar, 1/2 cucharadita de sal y el jugo de medio limón.',
      'Ofrecer el suero con cuchara o sorbos pequeños después de cada diarrea o vómito (1/2 taza en niños pequeños, 1 taza en adultos).',
      'Si es lactante o bebé, continuar dándole leche materna con mayor frecuencia; NUNCA suspender la teta.',
      'Ofrecer alimentos suaves y astringentes: mazamorra de plátano verde (inguiri), caldo de gallina desgrasado o arroz cocido.',
      'Trasladar en bote si el niño no orina, tiene ojos hundidos o boca completamente seca.'
    ],
    queNoHacer: [
      '¡NUNCA dar pastillas para cortar la diarrea (Loperamida) a niños ni sin indicación médica! Atrapan las bacterias en el intestino.',
      '¡NUNCA dar gaseosas, bebidas hidratantes para deportistas ni jugos enlatados (el exceso de azúcar empeora la diarrea por ósmosis).',
      '¡NUNCA dejar de dar líquidos por miedo a que vomite; espere 10 minutos y vuelva a ofrecer con cucharita muy despacio.',
      '¡NUNCA consumir agua de quebrada o río sin hervir al menos 3 a 5 minutos.'
    ],
    signosAlarma: 'Ojos hundidos, llanto sin lágrimas, boca reseca, piel que al pellizcarla suavemente en la barriga no regresa rápido (signo del pliegue), somnolencia excesiva.'
  },
  {
    id: 'picadura-raya',
    titulo: 'Picadura de Raya de Río (Rayón) o Pez con Espina',
    subtitulo: 'Punzadura con toxina en playas de arena o bancos de fango del río',
    categoria: 'Envenenamiento Fluvial',
    icono: '🐟',
    badge: 'Dolor Severo',
    badgeClass: 'critical',
    tiempoMax: 'Alivio en menos de 30 minutos',
    tags: ['raya', 'pez', 'espina', 'rio', 'fango', 'chuzo', 'veneno', 'dolor'],
    queHacer: [
      '¡SUMERGIR DE INMEDIATO EN AGUA CALIENTE! El agua debe estar lo más caliente posible que el paciente tolere sin quemarse (aprox. 45°C) durante 30 a 90 minutos continuos.',
      'El calor destruye las toxinas proteicas del veneno de la raya, logrando que el dolor insoportable desaparezca en minutos.',
      'Lavar cuidadosamente la herida con agua hervida limpia y jabón neutro para expulsar el fango del río.',
      'Retirar con pinza hervida la espina o fragmentos visibles ÚNICAMENTE si están sueltos y superficiales.',
      'Acudir a la posta para recibir refuerzo de vacuna antitetánica y antibióticos preventivos.'
    ],
    queNoHacer: [
      '¡NUNCA aplicar hielo ni agua fría! El frío multiplica el dolor y mantiene el veneno activo en los tejidos.',
      '¡NUNCA orinar sobre la herida ni rociar kerosén, gasolina o cenizas!',
      '¡NUNCA coser o cerrar la herida herméticamente; la herida de raya debe drenar los tejidos dañados para evitar gangrena bacteriana.',
      '¡NUNCA caminar apoyando el pie herido sobre el piso de la canoa o fango sucio.'
    ],
    signosAlarma: 'Pérdida de conciencia por dolor, inflamación masiva de la pierna, coloración negra en los bordes o fiebre alta al día siguiente.'
  }
];

const BOTIQUIN_AMAZONICO = [
  {
    id: 'sangre-de-grado',
    nombre: 'Sangre de Grado',
    cientifico: 'Croton lechleri',
    icono: '🩸',
    origen: 'Árbol nativo de bosques primarios y secundarios de Loreto',
    usos: 'Cicatrizante natural de máxima potencia, úlceras gástricas, gastritis y antiséptico dérmico para raspones y heridas limpias.',
    preparacion: 'Uso tópico: Aplicar 2 a 4 gotas de savia roja pura sobre la herida limpia y frotar con la yema limpia hasta formar una espuma blanca protectora que seque como látex. Uso interno: 3 a 5 gotas en medio vaso de agua tibia en ayunas por 10 días.',
    advertencia: 'NO aplicar en heridas abiertas profundas con sangrado arterial. Contraindicado en el embarazo y lactancia. Si la herida supura pus o huele mal, acudir de inmediato al centro de salud.',
    tags: ['cicatrizante', 'gastritis', 'herida', 'sangre de grado', 'latex', 'piel']
  },
  {
    id: 'matico',
    nombre: 'Matico (Moho-moho)',
    cientifico: 'Piper aduncum',
    icono: '🍃',
    origen: 'Arbusto ribereño común en orillas de ríos y purmas amazónicas',
    usos: 'Alivio de la tos, bronquitis, afecciones respiratorias, desinflamante de garganta y lavado antiséptico de heridas dérmicas.',
    preparacion: 'Infusión respiratoria: Hervir 1 litro de agua, apagar el fuego y agregar 4 a 6 hojas limpias. Reposar tapado 10 minutos. Tomar caliente 3 veces al día con miel silvestre. Lavado de heridas: Hervir 8 hojas por 5 minutos, dejar entibiar y lavar la piel 2 veces al día.',
    advertencia: 'Si el enfermo tiene respiración rápida, pecho hundido, labios morados o no puede hablar, NO perder tiempo con hierbas: requiere oxígeno en la posta médica.',
    tags: ['tos', 'respiratorio', 'pulmon', 'matico', 'garganta', 'infeccion']
  },
  {
    id: 'una-de-gato',
    nombre: 'Uña de Gato',
    cientifico: 'Uncaria tomentosa',
    icono: '🐾',
    origen: 'Liana trepadora de la selva virgen con espinas curvas en forma de uña',
    usos: 'Potente antiinflamatorio para dolores articulares (reumatismo, artritis), dolor de huesos y refuerzo del sistema inmunológico.',
    preparacion: 'Decocción de corteza: Hervir 15 a 20 gramos de corteza seca en 1 litro de agua a fuego lento durante 20 minutos con la olla tapada. Dejar enfriar y colar. Beber 1 vaso por la mañana y otro por la tarde durante 15 días consecutivos.',
    advertencia: '¡PROHIBIDO en mujeres embarazadas (puede inducir abortos o contracciones)! Tampoco administrar a personas con trasplantes. No sustituye tratamientos antibióticos de urgencia.',
    tags: ['articulaciones', 'artritis', 'defensas', 'reumatismo', 'corteza', 'dolor']
  },
  {
    id: 'malva',
    nombre: 'Malva Amazónica',
    cientifico: 'Malachra alceifolia',
    icono: '🌸',
    origen: 'Hierba silvestre que crece en orillas húmedas y huertos familiares',
    usos: 'Fiebres moderadas, inflamaciones urinarias, ardor al orinar, inflamación de encías y hemorroides.',
    preparacion: 'Emplasto refrescante: Machacar hojas frescas limpias hasta obtener una masa verde jugosa; colocar sobre la zona hinchada con gasa por 30 minutos. Infusión: 1 cucharada de hojas picadas en 1 taza de agua hervida; tomar tibia 2 veces al día.',
    advertencia: 'Si el ardor al orinar se acompaña de dolor intenso en la espalda baja (riñones) y fiebre alta con escalofríos, es una infección renal grave que requiere antibióticos de la posta.',
    tags: ['rinon', 'orina', 'inflamacion', 'fiebre', 'malva', 'ardor']
  },
  {
    id: 'oje',
    nombre: 'Ojé (Doctor Ojé)',
    cientifico: 'Ficus antihelmintica',
    icono: '🌳',
    origen: 'Árbol gigante de la selva baja, productor de látex blanco',
    usos: 'Antiparasitario tradicional de gran potencia para expulsar lombrices y tenias intestinales rebeldes.',
    preparacion: 'El látex debe tomarse con extrema precaución: Máximo 1 cucharada sopera de látex fresco mezclada en medio vaso de leche o jugo de naranja dulce en ayunas, seguido de estricto reposo y dieta sin grasas, condimentos ni alcohol.',
    advertencia: '¡PELIGRO DE INTOXICACIÓN GRAVE POR SOBREDOSIS! Puede provocar vómitos violentos, deshidratación y daño estomacal severo. NUNCA dar a niños menores de 2 años, embarazadas ni ancianos débiles. Se aconseja SIEMPRE solicitar antiparasitarios seguros en la posta médica.',
    tags: ['parasitos', 'lombrices', 'oje', 'estomago', 'purga', 'tenias']
  },
  {
    id: 'achiote',
    nombre: 'Achiote',
    cientifico: 'Bixa orellana',
    icono: '🌺',
    origen: 'Arbusto cultivado en chacras de toda la cuenca del Amazonas',
    usos: 'Desinflamante prostático en hombres mayores, alivio de inflamación renal, dolor de garganta y quemaduras superficiales.',
    preparacion: 'Infusión de hojas: Hervir 1 litro de agua y agregar 6 a 8 hojas secas picadas. Dejar reposar 10 minutos tapado. Tomar 3 tazas al día después de las comidas por 10 días.',
    advertencia: 'Si el paciente presenta imposibilidad total para orinar por más de 6 a 8 horas (retención urinaria aguda), se debe realizar traslado fluvial de emergencia para colocación de sonda vesical.',
    tags: ['prostata', 'rinon', 'garganta', 'achiote', 'orinar']
  },
  {
    id: 'amor-seco',
    nombre: 'Amor Seco (Pega-Pega)',
    cientifico: 'Desmodium adscendens',
    icono: '🌱',
    origen: 'Hierba rastrera común con pequeñas flores rosadas y frutos pegajosos',
    usos: 'Alivio de cuadros alérgicos, asma bronquial, picazón en la piel y protector del hígado frente a toxinas.',
    preparacion: 'Infusión: 1 cucharada sopera de tallos y hojas secas desmenuzadas en una taza de agua hirviendo. Reposar 10 minutos. Tomar 2 tazas al día por 7 a 10 días.',
    advertencia: 'En caso de hinchazón súbita de labios, lengua o dificultad para tragar y respirar (shock anafiláctico), trasladar de inmediato al paciente; requiere inyección de adrenalina/antihistamínicos en la posta.',
    tags: ['alergia', 'asma', 'higado', 'pega pega', 'picazon']
  },
  {
    id: 'llanten-amazonico',
    nombre: 'Llantén Amazónico',
    cientifico: 'Plantago major',
    icono: '🌿',
    origen: 'Hierba perenne adaptable a suelos húmedos de restinga y huertos',
    usos: 'Desinflamante ocular, enjuagues bucales para aftas y llagas, úlceras dérmicas y protector gástrico.',
    preparacion: 'Colirio/lavado: Hervir 5 hojas limpias en medio litro de agua filtrada por 5 minutos. Colar con tela limpia estéril y dejar enfriar completamente antes de lavar ojos o heridas. Para tomar: 1 taza de infusión tibia antes de dormir.',
    advertencia: 'Si hay dolor ocular penetrante con pérdida brusca de visión o pus copioso, acudir de urgencia al médico oftalmólogo en el hospital de Iquitos.',
    tags: ['ojos', 'llagas', 'boca', 'llanten', 'ulceras', 'gastrico']
  }
];

const CUENCAS_LORETO = [
  {
    id: 'napo',
    nombre: 'Río Napo',
    comunidades: 'Santa Clotilde, Mazán, Angoteros, Tacsha Curaray',
    distanciaPostaKm: 45,
    distanciaHospitalKm: 145,
    postaCercana: 'Centro de Salud Santa Clotilde (I-4) / C.S. Mazán (I-3)',
    sueroAntiofidico: 'Disponible (8 ampollas)',
    sueroStatus: 'ok',
    oxigeno: 'Disponible (4 balones llenos)',
    oxigenoStatus: 'ok',
    pruebasDengue: 'Disponible (Prueba rápida + Gota gruesa)',
    pruebasStatus: 'ok',
    personalGuardia: 'Médico General, 2 Enfermeros, 1 Obstetra',
    radioFrecuencia: '5215 kHz HF / Red de Salud Napo-Mazán'
  },
  {
    id: 'nanay',
    nombre: 'Río Nanay',
    comunidades: 'Santa María del Ojeal, Nina Rumi, Diamante Azul, Pucaurco',
    distanciaPostaKm: 22,
    distanciaHospitalKm: 65,
    postaCercana: 'P.S. Santa María del Ojeal (I-2) / C.S. Bellavista Nanay (I-3)',
    sueroAntiofidico: 'Limitado (2 ampollas)',
    sueroStatus: 'warn',
    oxigeno: 'Disponible (2 balones)',
    oxigenoStatus: 'ok',
    pruebasDengue: 'Disponible (Pruebas reactivas)',
    pruebasStatus: 'ok',
    personalGuardia: '1 Médico serumista, 1 Técnico de enfermería',
    radioFrecuencia: '4890 kHz HF / Frecuencia Micro-red Nanay'
  },
  {
    id: 'maranon',
    nombre: 'Río Marañón',
    comunidades: 'Nauta, Parinari, San Regis, Santa Rita de Castilla',
    distanciaPostaKm: 35,
    distanciaHospitalKm: 115,
    postaCercana: 'Centro de Salud Nauta (I-4) / P.S. San Regis (I-2)',
    sueroAntiofidico: 'Disponible (6 ampollas)',
    sueroStatus: 'ok',
    oxigeno: 'Disponible (6 balones)',
    oxigenoStatus: 'ok',
    pruebasDengue: 'Disponible (Laboratorio operativo)',
    pruebasStatus: 'ok',
    personalGuardia: '2 Médicos, 3 Enfermeros, Laboratorista',
    radioFrecuencia: '5820 kHz HF / Red de Salud Loreto-Nauta'
  },
  {
    id: 'itaya',
    nombre: 'Río Itaya',
    comunidades: 'Belén Sector Rural, San Andrés, Varillal, Santa Clara',
    distanciaPostaKm: 12,
    distanciaHospitalKm: 28,
    postaCercana: 'Centro de Salud 6 de Octubre / Hospital Apoyo Iquitos (Belén)',
    sueroAntiofidico: 'Disponible (12 ampollas)',
    sueroStatus: 'ok',
    oxigeno: 'Disponible (Planta y balones)',
    oxigenoStatus: 'ok',
    pruebasDengue: 'Disponible (Resultado en 30 min)',
    pruebasStatus: 'ok',
    personalGuardia: 'Guardia médica las 24 horas y especialistas',
    radioFrecuencia: '106 SAMU / Teléfono de Urgencias: 965-884-123'
  },
  {
    id: 'ucayali',
    nombre: 'Río Ucayali',
    comunidades: 'Requena, Jenaro Herrera, Orellana, Flor de Punga',
    distanciaPostaKm: 50,
    distanciaHospitalKm: 185,
    postaCercana: 'Hospital I Requena (II-1) / C.S. Jenaro Herrera (I-3)',
    sueroAntiofidico: 'Disponible (5 ampollas)',
    sueroStatus: 'ok',
    oxigeno: 'Disponible (5 balones)',
    oxigenoStatus: 'ok',
    pruebasDengue: 'Disponible (Gota gruesa + Dengue)',
    pruebasStatus: 'ok',
    personalGuardia: 'Médico cirujano, Médico general, Obstetra',
    radioFrecuencia: '5300 kHz HF / Red de Salud Requena'
  },
  {
    id: 'amazonas',
    nombre: 'Río Amazonas',
    comunidades: 'Indiana, Pebas, San Pablo, Caballo Cocha',
    distanciaPostaKm: 30,
    distanciaHospitalKm: 95,
    postaCercana: 'Centro de Salud Indiana (I-3) / C.S. Pebas (I-3)',
    sueroAntiofidico: 'Disponible (4 ampollas)',
    sueroStatus: 'ok',
    oxigeno: 'Disponible (3 balones)',
    oxigenoStatus: 'ok',
    pruebasDengue: 'Disponible (Stock regular)',
    pruebasStatus: 'ok',
    personalGuardia: '1 Médico, 2 Enfermeros, 1 Técnico',
    radioFrecuencia: '5120 kHz HF / Red de Salud Bajo Amazonas'
  }
];

const TIPOS_EMBARCACION = [
  { id: 'peque-peque', nombre: 'Peque-peque (Motor 9-16 HP)', velocidadKmH: 10, descripcion: 'Embarcación artesanal lenta pero accesible' },
  { id: 'bote-motor', nombre: 'Bote a motor / Lancha (60-115 HP)', velocidadKmH: 24, descripcion: 'Velocidad intermedia con mayor estabilidad' },
  { id: 'deslizador', nombre: 'Deslizador rápido (150-200 HP)', velocidadKmH: 48, descripcion: 'Lancha rápida ideal para evacuaciones de emergencia' }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function App() {
  // Estado de Navegación y Vistas
  const [activeTab, setActiveTab] = useState('primeros-auxilios'); // 'primeros-auxilios', 'botiquin', 'calculadora', 'directorio'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');
  
  // Estado Offline y Accesibilidad
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState('normal'); // 'normal', 'lg', 'xl'
  
  // Audio Speech Synthesis
  const [speakingId, setSpeakingId] = useState(null);

  // Marcadores guardados localmente (Offline persistence)
  const [savedBookmarks, setSavedBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('guia_verde_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculadora Fluvial
  const [selectedCuencaId, setSelectedCuencaId] = useState('napo');
  const [selectedBoatId, setSelectedBoatId] = useState('bote-motor');
  const [corrienteSentido, setCorrienteSentido] = useState('favor'); // 'favor' (bajada) o 'contra' (subida)

  // Modal de Detalle
  const [selectedModalItem, setSelectedModalItem] = useState(null);

  // --------------------------------------------------------------------------
  // EFECTOS DE ACCESIBILIDAD Y DETECCIÓN DE RED
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Ajustes de accesibilidad en el elemento <body>
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    document.body.classList.remove('text-lg', 'text-xl');
    if (fontSizeLevel === 'lg') document.body.classList.add('text-lg');
    if (fontSizeLevel === 'xl') document.body.classList.add('text-xl');
  }, [highContrast, fontSizeLevel]);

  // Persistir marcadores en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guia_verde_bookmarks', JSON.stringify(savedBookmarks));
    } catch {
      // Ignorar fallas si localStorage está bloqueado
    }
  }, [savedBookmarks]);

  // Detener la síntesis de voz al desmontar
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // FUNCIONES DE SOPORTE
  // --------------------------------------------------------------------------
  const toggleBookmark = (id) => {
    setSavedBookmarks((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSpeak = (id, textToSpeak) => {
    if (!('speechSynthesis' in window)) {
      alert('La síntesis de voz no está disponible en este navegador, pero todo el texto puede leerse en pantalla.');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'es-PE'; // Español de Perú / Neutro
    utterance.rate = 0.9; // Habla ligeramente pausada para comprensión óptima

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // --------------------------------------------------------------------------
  // CÁLCULO DE TIEMPO FLUVIAL
  // --------------------------------------------------------------------------
  const cuencaSeleccionada = useMemo(() => {
    return CUENCAS_LORETO.find((c) => c.id === selectedCuencaId) || CUENCAS_LORETO[0];
  }, [selectedCuencaId]);

  const embarcacionSeleccionada = useMemo(() => {
    return TIPOS_EMBARCACION.find((b) => b.id === selectedBoatId) || TIPOS_EMBARCACION[1];
  }, [selectedBoatId]);

  const navegacionCalculada = useMemo(() => {
    let velocidadReal = embarcacionSeleccionada.velocidadKmH;
    
    // Ajuste por corriente del río
    if (corrienteSentido === 'favor') {
      velocidadReal *= 1.15; // 15% más rápido río abajo
    } else {
      velocidadReal *= 0.75; // 25% más lento contra la corriente
    }

    // Tiempo a Posta
    const horasPostaDec = cuencaSeleccionada.distanciaPostaKm / velocidadReal;
    const hPosta = Math.floor(horasPostaDec);
    const mPosta = Math.round((horasPostaDec - hPosta) * 60);

    // Tiempo a Hospital Central
    const horasHospDec = cuencaSeleccionada.distanciaHospitalKm / velocidadReal;
    const hHosp = Math.floor(horasHospDec);
    const mHosp = Math.round((horasHospDec - hHosp) * 60);

    // Estimación de combustible en galones (aprox.)
    let galonesEstimados = 0;
    if (selectedBoatId === 'peque-peque') {
      galonesEstimados = Math.ceil(horasHospDec * 0.4); // 0.4 galón/hora
    } else if (selectedBoatId === 'bote-motor') {
      galonesEstimados = Math.ceil(horasHospDec * 2.5); // 2.5 galones/hora
    } else {
      galonesEstimados = Math.ceil(horasHospDec * 5.0); // 5 galones/hora
    }

    return {
      tiempoPostaStr: `${hPosta > 0 ? `${hPosta} h ` : ''}${mPosta} min`,
      tiempoHospStr: `${hHosp > 0 ? `${hHosp} h ` : ''}${mHosp} min`,
      combustibleGalones: galonesEstimados,
      velocidadAjustada: Math.round(velocidadReal)
    };
  }, [cuencaSeleccionada, embarcacionSeleccionada, corrienteSentido, selectedBoatId]);

  // --------------------------------------------------------------------------
  // FILTRADO DINÁMICO DE SÍNTOMAS Y PLANTAS
  // --------------------------------------------------------------------------
  const primerosAuxiliosFiltrados = useMemo(() => {
    return PRIMEROS_AUXILIOS.filter((item) => {
      const matchSearch = searchTerm.trim() === '' || 
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.queHacer.some((q) => q.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = filterCategory === 'todos' || 
        (filterCategory === 'mordedura' && item.id.includes('mordedura')) ||
        (filterCategory === 'fiebre' && item.id.includes('fiebre')) ||
        (filterCategory === 'corte' && item.id.includes('heridas')) ||
        (filterCategory === 'diarrea' && item.id.includes('diarrea')) ||
        (filterCategory === 'raya' && item.id.includes('raya')) ||
        (filterCategory === 'guardados' && savedBookmarks.includes(item.id));

      return matchSearch && matchCategory;
    });
  }, [searchTerm, filterCategory, savedBookmarks]);

  const botiquinFiltrado = useMemo(() => {
    return BOTIQUIN_AMAZONICO.filter((item) => {
      const matchSearch = searchTerm.trim() === '' ||
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cientifico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.usos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = filterCategory === 'todos' ||
        (filterCategory === 'plantas') ||
        (filterCategory === 'corte' && item.tags.includes('cicatrizante')) ||
        (filterCategory === 'fiebre' && item.tags.includes('respiratorio')) ||
        (filterCategory === 'diarrea' && (item.tags.includes('gastritis') || item.tags.includes('purga'))) ||
        (filterCategory === 'guardados' && savedBookmarks.includes(item.id));

      return matchSearch && matchCategory;
    });
  }, [searchTerm, filterCategory, savedBookmarks]);

  // Indicador final de conexión
  const offlineModeActive = simulatedOffline || !isOnline;

  return (
    <div className="app-container">
      {/* ====================================================================
          BARRA DE ACCESIBILIDAD Y ESTADO OFFLINE
          ==================================================================== */}
      <header className="top-accessibility-bar" role="region" aria-label="Controles de accesibilidad y estado offline">
        <div className="offline-status-badge">
          <span className={`status-dot ${offlineModeActive ? 'offline' : ''}`} aria-hidden="true"></span>
          <span>
            {offlineModeActive 
              ? '🟢 Modo Offline Listo (Funciona sin internet)' 
              : '🟢 En Línea / Datos Locales Listos'}
          </span>
        </div>

        <div className="accessibility-controls">
          {/* Botón Simulador Offline */}
          <button 
            type="button" 
            className={`btn-pill-control ${simulatedOffline ? 'active' : ''}`}
            onClick={() => setSimulatedOffline(!simulatedOffline)}
            title="Activa o desactiva la simulación de corte de señal para probar la aplicación"
          >
            {simulatedOffline ? '📶 Salir de Prueba Offline' : '📡 Probar Modo Sin Internet'}
          </button>

          {/* Selector de Contraste */}
          <button 
            type="button" 
            className={`btn-pill-control ${highContrast ? 'active' : ''}`}
            onClick={() => setHighContrast(!highContrast)}
            title="Aumentar contraste para lectura bajo la luz del sol"
          >
            ☀️ {highContrast ? 'Contraste Normal' : 'Alto Contraste'}
          </button>

          {/* Ajuste de Fuente */}
          <button 
            type="button"
            className="btn-pill-control"
            onClick={() => {
              if (fontSizeLevel === 'normal') setFontSizeLevel('lg');
              else if (fontSizeLevel === 'lg') setFontSizeLevel('xl');
              else setFontSizeLevel('normal');
            }}
            title="Cambiar tamaño de letra para facilitar la lectura"
          >
            🔤 Letra: {fontSizeLevel === 'normal' ? 'Mediana' : fontSizeLevel === 'lg' ? 'Grande' : 'Muy Grande'}
          </button>
        </div>
      </header>

      {/* ====================================================================
          CABECERA PRINCIPAL (BRANDING AMAZÓNICO)
          ==================================================================== */}
      <div className="main-header">
        <div className="brand-eyebrow">Amazonía Peruana • Región Loreto</div>
        <h1 className="brand-title">Guía Verde de Salud</h1>
        <p className="brand-subtitle">
          <strong>Salud Río Loreto:</strong> Orientación médica rápida, botiquín natural amazónico y calculadora de tiempo fluvial para comunidades ribereñas y rurales.
        </p>

        {/* Banner SOS de Urgencia Inmediata */}
        <div className="sos-callout-banner">
          <div className="sos-text">
            🚨 ¿EMERGENCIA GRAVE EN EL RÍO? Radio y Comunicaciones:
          </div>
          <div className="sos-channels">
            <span className="sos-tag">📞 SAMU Loreto: 106</span>
            <span className="sos-tag">📻 Radio HF Red Salud: 5215 kHz</span>
            <span className="sos-tag">🏥 Hosp. Iquitos: (065) 26-4444</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          BUSCADOR RÁPIDO DE SÍNTOMAS Y FILTROS
          ==================================================================== */}
      <section className="search-filter-section" aria-label="Búsqueda rápida de síntomas y filtros">
        <div className="search-box-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input 
            type="search"
            className="search-input"
            placeholder="Buscar síntoma o dolencia: ej. mordedura, fiebre, machete, vómito, matico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar síntomas o remedios en la guía"
          />
          {searchTerm && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="quick-filter-chips">
          <span className="chips-label">Filtros rápidos:</span>
          
          <button 
            type="button" 
            className={`chip-btn ${filterCategory === 'todos' ? 'active' : ''}`}
            onClick={() => setFilterCategory('todos')}
          >
            📋 Todos
          </button>

          <button 
            type="button" 
            className={`chip-btn ${filterCategory === 'mordedura' ? 'active' : ''}`}
            onClick={() => { setFilterCategory('mordedura'); setActiveTab('primeros-auxilios'); }}
          >
            🐍 Mordedura Víbora
          </button>

          <button 
            type="button" 
            className={`chip-btn ${filterCategory === 'fiebre' ? 'active' : ''}`}
            onClick={() => { setFilterCategory('fiebre'); setActiveTab('primeros-auxilios'); }}
          >
            🌡️ Fiebre / Dengue
          </button>

          <button 
            type="button" 
            className={`chip-btn ${filterCategory === 'corte' ? 'active' : ''}`}
            onClick={() => { setFilterCategory('corte'); setActiveTab('primeros-auxilios'); }}
          >
            🩹 Machetazos y Cortes
          </button>

          <button 
            type="button" 
            className={`chip-btn ${filterCategory === 'diarrea' ? 'active' : ''}`}
            onClick={() => { setFilterCategory('diarrea'); setActiveTab('primeros-auxilios'); }}
          >
            💧 Diarrea y Suero
          </button>

          <button 
            type="button" 
            className={`chip-btn ${filterCategory === 'raya' ? 'active' : ''}`}
            onClick={() => { setFilterCategory('raya'); setActiveTab('primeros-auxilios'); }}
          >
            🐟 Chuzo de Raya
          </button>

          <button 
            type="button" 
            className={`chip-btn ${filterCategory === 'plantas' ? 'active' : ''}`}
            onClick={() => { setFilterCategory('plantas'); setActiveTab('botiquin'); }}
          >
            🌿 Plantas Medicinales
          </button>

          {savedBookmarks.length > 0 && (
            <button 
              type="button" 
              className={`chip-btn ${filterCategory === 'guardados' ? 'active' : ''}`}
              onClick={() => setFilterCategory('guardados')}
            >
              ⭐ Guardados ({savedBookmarks.length})
            </button>
          )}
        </div>
      </section>

      {/* ====================================================================
          PESTAÑAS PRINCIPALES (BOTONES TÁCTILES GRANDES)
          ==================================================================== */}
      <nav className="nav-tab-container" role="tablist">
        <button 
          type="button"
          role="tab"
          aria-selected={activeTab === 'primeros-auxilios'}
          className={`tab-btn ${activeTab === 'primeros-auxilios' ? 'active-emergency' : ''}`}
          onClick={() => setActiveTab('primeros-auxilios')}
        >
          <span>🚨</span> Módulo 1: Primeros Auxilios
        </button>

        <button 
          type="button"
          role="tab"
          aria-selected={activeTab === 'botiquin'}
          className={`tab-btn ${activeTab === 'botiquin' ? 'active-plants' : ''}`}
          onClick={() => setActiveTab('botiquin')}
        >
          <span>🌿</span> Módulo 2: Botiquín Amazónico
        </button>

        <button 
          type="button"
          role="tab"
          aria-selected={activeTab === 'calculadora'}
          className={`tab-btn ${activeTab === 'calculadora' ? 'active-river' : ''}`}
          onClick={() => setActiveTab('calculadora')}
        >
          <span>🚤</span> Módulo 3: Rutas Fluviales y Postas
        </button>

        <button 
          type="button"
          role="tab"
          aria-selected={activeTab === 'directorio'}
          className={`tab-btn ${activeTab === 'directorio' ? 'active-river' : ''}`}
          onClick={() => setActiveTab('directorio')}
        >
          <span>📻</span> Directorio Radial y Postas
        </button>
      </nav>

      {/* ====================================================================
          MÓDULO 1: PRIMEROS AUXILIOS INMEDIATOS (COLOR ALERTA ROJO/NARANJA)
          ==================================================================== */}
      {(activeTab === 'primeros-auxilios' || searchTerm.length > 0) && (
        <section aria-labelledby="sec-primeros-auxilios">
          <div className="section-module-banner module-emergency-banner">
            <div className="banner-title-group">
              <h2 id="sec-primeros-auxilios">🚨 Módulo 1: Primeros Auxilios Inmediatos</h2>
              <p>Pasos claros sobre qué hacer y qué está TERMINANTEMENTE PROHIBIDO ante urgencias vitales.</p>
            </div>
          </div>

          {primerosAuxiliosFiltrados.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>
              No se encontraron guías de primeros auxilios con ese término.
            </p>
          ) : (
            <div className="cards-grid">
              {primerosAuxiliosFiltrados.map((item) => {
                const isBookmarked = savedBookmarks.includes(item.id);
                const isSpeaking = speakingId === item.id;
                const narrationText = `${item.titulo}. Qué hacer: ${item.queHacer.join('. ')}. Qué NO hacer: ${item.queNoHacer.join('. ')}`;

                return (
                  <article key={item.id} className="emergency-card">
                    <div className="card-header-flex">
                      <div className="card-icon-avatar" aria-hidden="true">{item.icono}</div>
                      <div className="card-title-group">
                        <span className={`badge-tag ${item.badgeClass}`}>{item.badge}</span>
                        <h3>{item.titulo}</h3>
                      </div>
                    </div>

                    <div className="time-warning-box">
                      ⏱️ <span>{item.tiempoMax}</span>
                    </div>

                    {/* Columnas Qué Hacer vs Qué NO Hacer */}
                    <div className="actions-comparison-grid">
                      {/* QUÉ SÍ HACER */}
                      <div className="action-column column-do">
                        <div className="action-column-header">
                          <span>✅</span> QUÉ HACER PASO A PASO:
                        </div>
                        <ol className="action-list">
                          {item.queHacer.map((paso, idx) => (
                            <li key={idx} className="action-item">
                              <span className="item-number">{idx + 1}</span>
                              <span>{paso}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* QUÉ NO HACER */}
                      <div className="action-column column-dont">
                        <div className="action-column-header">
                          <span>❌</span> QUÉ NUNCA DEBES HACER:
                        </div>
                        <ul className="action-list">
                          {item.queNoHacer.map((prohibicion, idx) => (
                            <li key={idx} className="action-item">
                              <span className="item-cross">✕</span>
                              <span>{prohibicion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Signos de alarma */}
                    <div className="card-alarm-alert">
                      <strong>⚠️ Signos de gravedad extrema:</strong>
                      {item.signosAlarma}
                    </div>

                    {/* Botones de accesibilidad al pie de la tarjeta */}
                    <div className="card-footer-actions">
                      <button 
                        type="button" 
                        className={`btn-audio-speak ${isSpeaking ? 'speaking' : ''}`}
                        onClick={() => handleSpeak(item.id, narrationText)}
                        title="Escuchar instrucciones en voz alta en español"
                      >
                        {isSpeaking ? '⏹️ Detener Voz' : '🔊 Escuchar Instrucciones'}
                      </button>

                      <button 
                        type="button" 
                        className={`btn-bookmark ${isBookmarked ? 'saved' : ''}`}
                        onClick={() => toggleBookmark(item.id)}
                        title={isBookmarked ? 'Guardado en tu botiquín rápido' : 'Guardar en favoritos'}
                        aria-label="Guardar guía"
                      >
                        {isBookmarked ? '★' : '☆'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ====================================================================
          MÓDULO 2: BOTIQUÍN NATURAL AMAZÓNICO (COLOR VERDE BOSQUE)
          ==================================================================== */}
      {(activeTab === 'botiquin' || searchTerm.length > 0) && (
        <section aria-labelledby="sec-botiquin-natural">
          <div className="section-module-banner module-plants-banner">
            <div className="banner-title-group">
              <h2 id="sec-botiquin-natural">🌿 Módulo 2: Botiquín Natural Amazónico</h2>
              <p>Fichas prácticas de plantas medicinales locales de Loreto, preparación segura y advertencias médicas obligatorias.</p>
            </div>
          </div>

          {botiquinFiltrado.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>
              No se encontraron plantas medicinales con ese término.
            </p>
          ) : (
            <div className="cards-grid">
              {botiquinFiltrado.map((planta) => {
                const isBookmarked = savedBookmarks.includes(planta.id);
                const isSpeaking = speakingId === planta.id;
                const narrationText = `${planta.nombre}, ${planta.cientifico}. Para qué sirve: ${planta.usos}. Preparación: ${planta.preparacion}. Advertencia médica: ${planta.advertencia}`;

                return (
                  <article key={planta.id} className="plant-card">
                    <div className="card-header-flex">
                      <div className="card-icon-avatar" aria-hidden="true">{planta.icono}</div>
                      <div className="card-title-group">
                        <h3>{planta.nombre}</h3>
                        <div className="scientific-name">{planta.cientifico}</div>
                        <div className="plant-habitat-badge">📍 {planta.origen}</div>
                      </div>
                    </div>

                    <div className="plant-info-block">
                      <div className="info-item">
                        <h4>🎯 Para qué sirve:</h4>
                        <p>{planta.usos}</p>
                      </div>

                      <div className="info-item preparation-box">
                        <h4>🍵 Cómo se prepara y usa:</h4>
                        <p>{planta.preparacion}</p>
                      </div>

                      <div className="info-item medical-warning-box">
                        <strong>⚠️ ADVERTENCIA MÉDICA OBLIGATORIA:</strong>
                        <p>{planta.advertencia}</p>
                      </div>
                    </div>

                    <div className="card-footer-actions">
                      <button 
                        type="button" 
                        className={`btn-audio-speak ${isSpeaking ? 'speaking' : ''}`}
                        onClick={() => handleSpeak(planta.id, narrationText)}
                        title="Escuchar ficha de la planta medicinal"
                      >
                        {isSpeaking ? '⏹️ Detener Voz' : '🔊 Escuchar Receta'}
                      </button>

                      <button 
                        type="button" 
                        className={`btn-bookmark ${isBookmarked ? 'saved' : ''}`}
                        onClick={() => toggleBookmark(planta.id)}
                        title={isBookmarked ? 'Guardada en botiquín' : 'Guardar planta'}
                        aria-label="Guardar planta"
                      >
                        {isBookmarked ? '★' : '☆'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ====================================================================
          MÓDULO 3: CALCULADORA DE TIEMPO FLUVIAL Y POSTAS (COLOR AZUL RÍO)
          ==================================================================== */}
      {activeTab === 'calculadora' && (
        <section aria-labelledby="sec-calculadora-fluvial">
          <div className="section-module-banner module-river-banner">
            <div className="banner-title-group">
              <h2 id="sec-calculadora-fluvial">🚤 Módulo 3: Calculadora de Tiempo Fluvial y Disponibilidad de Postas</h2>
              <p>Estima el tiempo real de traslado en bote según la corriente del río y consulta insumos críticos de cada posta médica.</p>
            </div>
          </div>

          <div className="calculator-container">
            {/* Controles de Selección */}
            <div className="calculator-controls-grid">
              {/* Cuenca */}
              <div className="calc-control-group">
                <label htmlFor="select-cuenca" className="calc-label">
                  <span>🌊</span> Cuenca o Río de Origen (Loreto):
                </label>
                <select 
                  id="select-cuenca" 
                  className="calc-select"
                  value={selectedCuencaId}
                  onChange={(e) => setSelectedCuencaId(e.target.value)}
                >
                  {CUENCAS_LORETO.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.comunidades.split(',')[0]} y aledaños)
                    </option>
                  ))}
                </select>
              </div>

              {/* Embarcación */}
              <div className="calc-control-group">
                <label htmlFor="select-bote" className="calc-label">
                  <span>🛥️</span> Tipo de Embarcación Fluvial:
                </label>
                <select 
                  id="select-bote" 
                  className="calc-select"
                  value={selectedBoatId}
                  onChange={(e) => setSelectedBoatId(e.target.value)}
                >
                  {TIPOS_EMBARCACION.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nombre} (~{b.velocidadKmH} km/h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Sentido de la Corriente */}
              <div className="calc-control-group">
                <label htmlFor="select-corriente" className="calc-label">
                  <span>🔄</span> Sentido de Navegación en el Río:
                </label>
                <select 
                  id="select-corriente" 
                  className="calc-select"
                  value={corrienteSentido}
                  onChange={(e) => setCorrienteSentido(e.target.value)}
                >
                  <option value="favor">Bajando río (A favor de corriente: +15% rápido)</option>
                  <option value="contra">Subiendo río (Contra corriente: -25% velocidad)</option>
                </select>
              </div>
            </div>

            {/* Resultados de Navegación */}
            <div className="calc-results-wrapper">
              <div className="calc-results-header">
                <h3>
                  <span>⏱️</span> Tiempos Estimados de Evacuación Fluvial
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-river-900)', fontWeight: 600 }}>
                  Velocidad calculada con corriente: ~{navegacionCalculada.velocidadAjustada} km/h
                </span>
              </div>

              <div className="times-display-grid">
                {/* Tiempo a Posta Cercana */}
                <div className="time-card">
                  <div className="time-card-title">TIEMPO A POSTA MÁS CERCANA:</div>
                  <div className="time-card-value">{navegacionCalculada.tiempoPostaStr}</div>
                  <div className="time-card-dest">
                    🏥 <strong>Destino:</strong> {cuencaSeleccionada.postaCercana} ({cuencaSeleccionada.distanciaPostaKm} km río)
                  </div>
                </div>

                {/* Tiempo a Hospital Regional */}
                <div className="time-card hospital">
                  <div className="time-card-title">TIEMPO A HOSPITAL EN IQUITOS:</div>
                  <div className="time-card-value">{navegacionCalculada.tiempoHospStr}</div>
                  <div className="time-card-dest">
                    🏨 <strong>Destino:</strong> Hosp. Regional Felipe Arriola / Hosp. Apoyo Iquitos ({cuencaSeleccionada.distanciaHospitalKm} km río)
                  </div>
                </div>
              </div>

              {/* Insumos Críticos de la Posta */}
              <div className="supplies-box">
                <div className="supplies-title">
                  <span>📦</span> Estado de Insumos Críticos en {cuencaSeleccionada.postaCercana.split('/')[0]}:
                </div>

                <div className="supplies-grid">
                  <div className="supply-item">
                    <span className="supply-name">💉 Suero Antiofídico:</span>
                    <span className={`supply-status ${cuencaSeleccionada.sueroStatus === 'ok' ? 'status-badge-ok' : 'status-badge-warn'}`}>
                      {cuencaSeleccionada.sueroStatus === 'ok' ? '🟢' : '🟡'} {cuencaSeleccionada.sueroAntiofidico}
                    </span>
                  </div>

                  <div className="supply-item">
                    <span className="supply-name">🫧 Oxígeno Medicinal:</span>
                    <span className={`supply-status ${cuencaSeleccionada.oxigenoStatus === 'ok' ? 'status-badge-ok' : 'status-badge-warn'}`}>
                      🟢 {cuencaSeleccionada.oxigeno}
                    </span>
                  </div>

                  <div className="supply-item">
                    <span className="supply-name">🔬 Pruebas Dengue / Malaria:</span>
                    <span className="supply-status status-badge-ok">
                      🟢 {cuencaSeleccionada.pruebasDengue}
                    </span>
                  </div>

                  <div className="supply-item">
                    <span className="supply-name">👨‍⚕️ Personal de Turno:</span>
                    <span className="supply-status" style={{ fontSize: '0.88rem', color: 'var(--color-jungle-900)' }}>
                      👤 {cuencaSeleccionada.personalGuardia}
                    </span>
                  </div>

                  <div className="supply-item" style={{ gridColumn: '1 / -1' }}>
                    <span className="supply-name">📻 Contacto Radial de la Posta antes de zarpar:</span>
                    <span className="radio-freq-badge">
                      {cuencaSeleccionada.radioFrecuencia}
                    </span>
                  </div>
                </div>
              </div>

              {/* Consejos de Navegación Fluvial en Emergencias */}
              <div className="river-navigation-tips">
                <div className="tips-title">
                  <span>⚠️</span> Recomendaciones de Seguridad para el Viaje Fluvial:
                </div>
                <ul className="tips-list">
                  <li>
                    <strong>Combustible necesario:</strong> Llevar mínimo <strong>{navegacionCalculada.combustibleGalones} galones</strong> de gasolina mezclada con aceite 2T (calcular siempre 30% de reserva por palizadas o lluvia).
                  </li>
                  <li>
                    <strong>Chalecos salvavidas:</strong> Todo tripulante y paciente debe llevar chaleco abrochado. En caso de vómito, mantener la cabeza de lado.
                  </li>
                  <li>
                    <strong>Navegación nocturna:</strong> Llevar 2 linternas con baterías cargadas para divisar troncos a flote (boyas) y señalizar a embarcaciones grandes.
                  </li>
                  <li>
                    <strong>Protección del enfermo:</strong> Cubrir con lona plástica o toldo impermeable contra la lluvia torrencial y el viento frío del río.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          MÓDULO ADICIONAL: DIRECTORIO RADIAL Y POSTAS
          ==================================================================== */}
      {activeTab === 'directorio' && (
        <section className="directory-section" aria-labelledby="sec-directorio">
          <h2 id="sec-directorio" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-jungle-900)' }}>
            📻 Directorio de Postas de Salud y Frecuencias Radiales de Loreto
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Comunícate por radio HF en caso de emergencia para que la posta prepare el suero antiofídico o la ambulancia fluvial antes de tu llegada.
          </p>

          <div className="directory-grid">
            {CUENCAS_LORETO.map((c) => (
              <div key={c.id} className="directory-card">
                <h4>🌊 {c.nombre}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  <strong>Comunidades:</strong> {c.comunidades}
                </p>
                <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>
                  <strong>Posta / Centro:</strong> {c.postaCercana}
                </p>
                <div className="radio-freq-badge">
                  📻 {c.radioFrecuencia}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================================
          PIE DE PÁGINA
          ==================================================================== */}
      <footer className="app-footer">
        <div>
          <span className="footer-offline-note">
            💾 Aplicación 100% Autónoma — Funciona en la selva sin cobertura telefónica
          </span>
        </div>
        <p>
          <strong>Guía Verde de Salud — Salud Río Loreto</strong>
        </p>
        <p style={{ maxWidth: '650px', margin: '8px auto', fontSize: '0.85rem' }}>
          Diseñada para preservar vidas en comunidades ribereñas y rurales de la Amazonía peruana. Toda la información medicinal y de primeros auxilios está basada en guías del Ministerio de Salud del Perú (MINSA) y saberes ancestrales botánicos verificados.
        </p>
        <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '8px' }}>
          En emergencias con riesgo vital, el uso de plantas es temporal mientras se concreta el traslado fluvial al centro médico.
        </p>
      </footer>
    </div>
  );
}
