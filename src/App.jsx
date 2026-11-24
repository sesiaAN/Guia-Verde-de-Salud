import { useState, useMemo, useEffect } from 'react';
import './App.css';

// ============================================================================
// BASE DE DATOS LOCAL OFFLINE — GUÍA VERDE DE SALUD (SALUD RÍO LORETO)
// ============================================================================

const MODULOS_ATENCION = [
  {
    id: 'mordedura',
    icono: '🐍',
    titulo: 'Mordeduras de Víbora',
    subtitulo: 'Jergón, Shushupe y Cascabel',
    tiempoMax: 'Menos de 4 a 6 horas para el suero',
    queHacer: [
      'Mantener al paciente acostado, inmóvil y tranquilo (el movimiento acelera el veneno).',
      'Inmovilizar el brazo o pierna mordida con una tablilla rígida a nivel del corazón.',
      'Lavar suavemente con agua limpia y jabón neutro, sin frotar ni raspar.',
      'Quitar de inmediato anillos, pulseras y botas antes de que se hinche el miembro.',
      'Dar de beber agua limpia con frecuencia para proteger los riñones.',
      'Trasladar urgente a la posta más cercana con suero antiofídico polivalente.'
    ],
    queNoHacer: [
      '¡NUNCA hacer torniquetes ni ligaduras apretadas! Producen gangrena y pérdida del miembro.',
      '¡NUNCA cortar la piel con machete, gillette ni navaja.',
      '¡NUNCA intentar chupar o succionar el veneno con la boca.',
      '¡NUNCA aplicar barro, kerosén, gasolina, cal ni pólvora en la herida.',
      '¡NUNCA dar alcohol ni aguardiente al herido.',
      '¡NUNCA perder tiempo cazando a la serpiente viva.'
    ],
    alarma: 'Hinchazón rápida que sube por la extremidad, sangrado en encías u orina, ampollas moradas.'
  },
  {
    id: 'fiebre',
    icono: '🌡️',
    titulo: 'Fiebre y Dengue',
    subtitulo: 'Zancudos y crecientes del río',
    tiempoMax: 'Atención dentro de 24 horas',
    queHacer: [
      'Bajar la temperatura con paños de tela húmedos a temperatura de río en frente, axilas e ingles.',
      'Hidratación oral constante: suero casero, agua de coco verde fresca o caldos suaves cada 15 min.',
      'Para dolor y fiebre, administrar ÚNICAMENTE PARACETAMOL.',
      'Mantener a la persona bajo mosquitero para que los zancudos no contagien a la familia.',
      'Vigilar sangrado en encías o dolor abdominal fuerte.'
    ],
    queNoHacer: [
      '¡NUNCA tomar ni inyectar IBUPROFENO, ASPIRINA, NAPROXENO ni METAMIZOL! Causan hemorragias mortales por Dengue.',
      '¡NUNCA bañar con agua con hielo bruscamente (provoca convulsiones).',
      '¡NUNCA inyectar antibióticos sin una prueba de sangre o gota gruesa en la posta médica.'
    ],
    alarma: 'Dolor de estómago continuo, vómitos repetidos, sangrado por nariz o heces oscuras.'
  },
  {
    id: 'corte',
    icono: '🩹',
    titulo: 'Cortes y Machete',
    subtitulo: 'Hemorragias en chacras y monte',
    tiempoMax: 'Contener en los primeros 10 minutos',
    queHacer: [
      'Hacer PRESIÓN DIRECTA Y FIRME con un paño limpio o polo sobre el corte por 15 minutos continuos.',
      'Elevar la extremidad herida por encima del nivel del corazón.',
      'Si la tela se empapa de sangre, NO retirarla; coloca otra tela limpia encima y continúa presionando.',
      'Una vez contenido el sangrado, vendar con firmeza pero sin cortar el pulso.'
    ],
    queNoHacer: [
      '¡NUNCA echar café molido, tabaco, cenizas ni tierra! Causan tétanos e infecciones fulminantes.',
      '¡NUNCA retirar objetos clavados profundamente; inmovilízalos y acude a la posta.',
      '¡NUNCA levantar el paño antes de los 15 minutos para ver si paró.'
    ],
    alarma: 'Sangrado que brota a chorros rítmicos, palidez extrema o dedos fríos y morados.'
  },
  {
    id: 'diarrea',
    icono: '💧',
    titulo: 'Diarrea y Suero',
    subtitulo: 'Deshidratación infantil y cólera',
    tiempoMax: 'Rehidratación inmediata continua',
    queHacer: [
      'Preparar SUERO CASERO: 1 litro de agua hervida fría + 2 cucharadas de azúcar + 1/2 cucharadita de sal + gotas de limón.',
      'Ofrecer con cuchara o sorbos pequeños después de cada diarrea o vómito.',
      'Si es lactante, continuar con la leche materna con más frecuencia; nunca suspenderla.',
      'Dar alimentos suaves: mazamorra de plátano verde (inguiri) o caldo de gallina sin grasa.'
    ],
    queNoHacer: [
      '¡NUNCA dar pastillas para frenar la diarrea (Loperamida) a niños sin indicación médica.',
      '¡NUNCA dar gaseosas ni jugos comerciales ultraprocesados.',
      '¡NUNCA suspender la hidratación aunque el paciente vomite; esperar 10 min y reanudar despacio.'
    ],
    alarma: 'Ojos hundidos, llanto sin lágrimas, boca reseca o el niño no orina en más de 6 horas.'
  },
  {
    id: 'raya',
    icono: '🐟',
    titulo: 'Chuzo de Raya',
    subtitulo: 'Toxina de playa y fango del río',
    tiempoMax: 'Alivio en menos de 30 minutos',
    queHacer: [
      '¡SUMERGIR DE INMEDIATO EN AGUA CALIENTE (45°C)! Lo más caliente tolerable sin quemar la piel.',
      'El calor neutraliza la toxina proteica del veneno y detiene el dolor agudo en minutos.',
      'Lavar con agua hervida limpia y jabón blanco para retirar el fango.',
      'Retirar espinas sueltas superficiales y acudir a la posta para vacuna antitetánica.'
    ],
    queNoHacer: [
      '¡NUNCA aplicar hielo o agua fría! Multiplica el dolor a niveles insoportables.',
      '¡NUNCA orinar sobre la herida ni rociar gasolina o kerosén.',
      '¡NUNCA coser o cerrar herméticamente la herida; debe drenar el veneno.'
    ],
    alarma: 'Desmayo por dolor, hinchazón masiva de la pierna o fiebre alta con pus al día siguiente.'
  },
  {
    id: 'botiquin',
    icono: '🌿',
    titulo: 'Botiquín Amazónico',
    subtitulo: '8 plantas medicinales de Loreto',
    tiempoMax: 'Uso tradicional responsable',
    queHacer: [
      'Reconocer las plantas nativas verificadas: Sangre de Grado, Matico, Uña de Gato, Malva, Ojé, Achiote.',
      'Usar dosis moderadas en infusiones, cocimientos o emplastos.',
      'Lavarse siempre las manos antes de manipular hojas o savia fresca.'
    ],
    queNoHacer: [
      '¡NUNCA sustituir la atención médica de una emergencia con hierbas caseras.',
      '¡NUNCA ingerir plantas no identificadas ni sobredosificar leche de ojé.',
      '¡NUNCA dar preparados alcohólicos a niños ni mujeres embarazadas.'
    ],
    alarma: 'Vómitos violentos tras ingerir purgantes tradicionales o alergia respiratoria.'
  },
  {
    id: 'rutas',
    icono: '🚤',
    titulo: 'Rutas Fluviales',
    subtitulo: 'Tiempos a postas y hospitales',
    tiempoMax: 'Cálculo antes de zarpar',
    queHacer: [
      'Calcular combustible con 30% de reserva por corriente en contra o lluvias.',
      'Llevar chalecos salvavidas abrochados para todo tripulante.',
      'Avisar por radio HF (5215 kHz) a la posta para preparar el suero antiofídico antes de llegar.'
    ],
    queNoHacer: [
      '¡NUNCA navegar de noche sin linternas potentes para esquivar boyas y troncos.',
      '¡NUNCA dejar al enfermo desprotegido del viento y lluvia torrencial.'
    ],
    alarma: 'Embarcación sin suficiente gasolina para navegar contra corriente.'
  }
];

const BOTIQUIN_PLANTAS = [
  {
    id: 'sangre-grado',
    nombre: 'Sangre de Grado',
    cientifico: 'Croton lechleri',
    origen: 'Bosques primarios y secundarios de Loreto',
    usos: 'Cicatrizante natural potente, úlceras gástricas, gastritis y antiséptico para raspones y cortes superficiales.',
    preparacion: 'Uso tópico: Aplicar 2 a 4 gotas de savia roja pura frotando hasta formar una espuma blanca protectora que seca como látex. Uso interno: 3 a 5 gotas en medio vaso de agua tibia en ayunas por 10 días.',
    advertencia: 'NO aplicar en heridas abiertas profundas con sangrado arterial. Contraindicado en el embarazo. Si hay pus, acudir a la posta.',
    rating: '★★★★★'
  },
  {
    id: 'matico',
    nombre: 'Matico (Moho-moho)',
    cientifico: 'Piper aduncum',
    origen: 'Orillas ribereñas y purmas amazónicas',
    usos: 'Alivio de la tos, bronquitis, afecciones respiratorias, dolor de garganta y lavado antiséptico de heridas dérmicas.',
    preparacion: 'Infusión: Hervir 1 litro de agua, apagar y agregar 4 a 6 hojas limpias. Reposar 10 minutos. Tomar 3 tazas al día con miel silvestre. Para heridas: hervir 8 hojas por 5 minutos y lavar la piel tibia.',
    advertencia: 'Si el paciente tiene pecho hundido, aleteo nasal o labios morados, requiere oxígeno urgente en la posta médica.',
    rating: '★★★★★'
  },
  {
    id: 'una-gato',
    nombre: 'Uña de Gato',
    cientifico: 'Uncaria tomentosa',
    origen: 'Liana trepadora de la selva virgen con espinas curvas',
    usos: 'Potente antiinflamatorio para dolores articulares (artritis, reumatismo), dolor de huesos y refuerzo de las defensas.',
    preparacion: 'Decocción: Hervir 15 a 20 gramos de corteza seca en 1 litro de agua a fuego lento por 20 minutos tapado. Colar y tomar 1 vaso en la mañana y otro en la tarde por 15 días.',
    advertencia: '¡PROHIBIDO en mujeres embarazadas (puede inducir aborto)! No reemplaza antibióticos en infecciones agudas.',
    rating: '★★★★★'
  }
];

const CUENCAS_LORETO = [
  {
    id: 'napo',
    nombre: 'Río Napo',
    comunidades: 'Santa Clotilde, Mazán, Angoteros',
    distanciaPostaKm: 45,
    distanciaHospitalKm: 145,
    postaCercana: 'Centro de Salud Santa Clotilde (I-4) / Mazán',
    suero: '🟢 Disponible (8 ampollas)',
    oxigeno: '🟢 Disponible (4 balones)',
    pruebas: '🟢 Disponible',
    personal: 'Médico General, Enfermeros y Obstetra',
    radio: '5215 kHz HF / Red Napo-Mazán'
  },
  {
    id: 'nanay',
    nombre: 'Río Nanay',
    comunidades: 'Santa María del Ojeal, Nina Rumi, Pucaurco',
    distanciaPostaKm: 22,
    distanciaHospitalKm: 65,
    postaCercana: 'P.S. Santa María del Ojeal (I-2) / Bellavista Nanay',
    suero: '🟡 Limitado (2 ampollas)',
    oxigeno: '🟢 Disponible (2 balones)',
    pruebas: '🟢 Disponible',
    personal: '1 Médico serumista y Técnico',
    radio: '4890 kHz HF / Red Nanay'
  },
  {
    id: 'maranon',
    nombre: 'Río Marañón',
    comunidades: 'Nauta, Parinari, San Regis',
    distanciaPostaKm: 35,
    distanciaHospitalKm: 115,
    postaCercana: 'Centro de Salud Nauta (I-4) / P.S. San Regis',
    suero: '🟢 Disponible (6 ampollas)',
    oxigeno: '🟢 Disponible (6 balones)',
    pruebas: '🟢 Disponible',
    personal: '2 Médicos, Enfermeros y Laboratorista',
    radio: '5820 kHz HF / Red Loreto-Nauta'
  },
  {
    id: 'itaya',
    nombre: 'Río Itaya',
    comunidades: 'Belén Rural, San Andrés, Varillal',
    distanciaPostaKm: 12,
    distanciaHospitalKm: 28,
    postaCercana: 'C.S. 6 de Octubre / Hosp. Apoyo Iquitos',
    suero: '🟢 Disponible (12 ampollas)',
    oxigeno: '🟢 Disponible (Planta operativa)',
    pruebas: '🟢 Disponible',
    personal: 'Guardia médica 24 horas y especialistas',
    radio: '106 SAMU / Tel: 965-884-123'
  },
  {
    id: 'ucayali',
    nombre: 'Río Ucayali',
    comunidades: 'Requena, Jenaro Herrera, Orellana',
    distanciaPostaKm: 50,
    distanciaHospitalKm: 185,
    postaCercana: 'Hospital I Requena (II-1) / Jenaro Herrera',
    suero: '🟢 Disponible (5 ampollas)',
    oxigeno: '🟢 Disponible (5 balones)',
    pruebas: '🟢 Disponible',
    personal: 'Médico Cirujano y Obstetra',
    radio: '5300 kHz HF / Red Requena'
  },
  {
    id: 'amazonas',
    nombre: 'Río Amazonas',
    comunidades: 'Indiana, Pebas, San Pablo, Caballo Cocha',
    distanciaPostaKm: 30,
    distanciaHospitalKm: 95,
    postaCercana: 'Centro de Salud Indiana (I-3) / Pebas',
    suero: '🟢 Disponible (4 ampollas)',
    oxigeno: '🟢 Disponible (3 balones)',
    pruebas: '🟢 Disponible',
    personal: 'Médico, Enfermeros y Técnico',
    radio: '5120 kHz HF / Red Bajo Amazonas'
  }
];

export default function App() {
  const [selectedCuencaId, setSelectedCuencaId] = useState('napo');
  const [boatSpeed, setBoatSpeed] = useState(24); // km/h
  const [corrienteFactor, setCorrienteFactor] = useState(1.15); // favor vs contra

  // Modal para ver detalles completos
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Cuenca seleccionada
  const cuenca = useMemo(() => {
    return CUENCAS_LORETO.find((c) => c.id === selectedCuencaId) || CUENCAS_LORETO[0];
  }, [selectedCuencaId]);

  // Cálculos de navegación fluvial
  const navegacion = useMemo(() => {
    const velReal = boatSpeed * corrienteFactor;

    // A posta
    const hPostaDec = cuenca.distanciaPostaKm / velReal;
    const hP = Math.floor(hPostaDec);
    const mP = Math.round((hPostaDec - hP) * 60);

    // A hospital Iquitos
    const hHospDec = cuenca.distanciaHospitalKm / velReal;
    const hH = Math.floor(hHospDec);
    const mH = Math.round((hHospDec - hH) * 60);

    return {
      postaTiempo: `${hP > 0 ? `${hP} h ` : ''}${mP} min`,
      hospTiempo: `${hH > 0 ? `${hH} h ` : ''}${mH} min`,
      velocidadAjustada: Math.round(velReal)
    };
  }, [cuenca, boatSpeed, corrienteFactor]);

  // Síntesis de voz para accesibilidad
  const hablarTexto = (texto) => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta lectura por voz, pero el texto completo está en pantalla.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-PE';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper">
      {/* ====================================================================
          NAVBAR FLOTANTE TRANSPARENTE / GLASS
          ==================================================================== */}
      <nav className="site-navbar">
        <div className="nav-brand">
          <div className="brand-icon-leaf">🌿</div>
          <div className="brand-names">
            <span className="brand-title-main">Guía Verde de Salud</span>
            <span className="brand-subtitle-tag">LORETO • SALUD RURAL</span>
          </div>
        </div>

        <div className="nav-links-center">
          <button className="nav-link-item" onClick={() => scrollToSection('sec-hero')}>Inicio</button>
          <button className="nav-link-item" onClick={() => scrollToSection('sec-servicios')}>Servicios</button>
          <button className="nav-link-item" onClick={() => scrollToSection('sec-protocolos')}>Protocolos</button>
          <button className="nav-link-item" onClick={() => scrollToSection('sec-promotores')}>Promotores</button>
          <button className="nav-link-item" onClick={() => scrollToSection('sec-botiquin')}>Botiquín</button>
          <button className="nav-link-item" onClick={() => scrollToSection('sec-fluvial')}>Calculadora</button>
        </div>

        <div className="nav-right-actions">
          <div className="pill-offline-indicator">
            <span className="dot-indicator"></span>
            <span>Modo Offline Listo</span>
          </div>

          <button className="btn-pill-action" onClick={() => alert('Canal de Emergencia Fluvial:\n📞 SAMU Loreto: 106\n📻 Radio HF: 5215 kHz\n🏥 Hospital de Apoyo Iquitos: (065) 26-4444')}>
            <span>🚨</span>
            <span>SAMU 106</span>
          </button>
        </div>
      </nav>

      {/* ====================================================================
          SECCIÓN 1: HERO (FONDO OSCURO BOSQUE EXACTO A LA IMAGEN)
          ==================================================================== */}
      <header id="sec-hero" className="hero-section">
        <div className="hero-content-grid">
          {/* Lado Izquierdo: Textos y CTAs */}
          <div className="hero-text-block">
            <span className="hero-eyebrow">Orientación Médica Rural y Fluvial</span>
            <h1 className="hero-main-title">
              Salud Fluvial y Medicina en <em>Armonía con la Amazonía</em>
            </h1>
            <p className="hero-description">
              Una plataforma comunitaria para los pobladores de Loreto que une los primeros auxilios inmediatos, la sabiduría de plantas medicinales amazónicas y rutas fluviales hacia postas y hospitales.
            </p>

            <div className="hero-cta-group">
              <button className="btn-hero-primary" onClick={() => scrollToSection('sec-servicios')}>
                <span>Buscar Síntoma o Emergencia</span>
                <span>→</span>
              </button>

              <button className="btn-hero-secondary" onClick={() => scrollToSection('sec-fluvial')}>
                <span>🚤</span>
                <span>Calculadora Fluvial</span>
              </button>
            </div>
          </div>

          {/* Lado Derecho: Vitrina Curva con Vegetación Amazónica */}
          <div className="hero-visual-showcase">
            <div className="hero-curved-frame">
              <div className="showcase-bg-leaves">🌿</div>
              <div className="showcase-badge-top">Posta Médica Conectada 24/7</div>

              <div className="showcase-center-card">
                <h4><span>🏥</span> C.S. Santa Clotilde & Mazán</h4>
                <p>Monitoreo en tiempo real de insumos críticos fluviales en la cuenca del Río Napo y Nanay.</p>
                <div className="showcase-mini-stats">
                  <div className="mini-stat">
                    <span>💉</span> Suero Antiofídico: 8 Frascos
                  </div>
                  <div className="mini-stat">
                    <span>🫧</span> Oxígeno: 4 Balones
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Franja Inferior del Hero (4 Pastillas) */}
        <div className="hero-features-bar">
          <div className="feature-pill-item">
            <span className="feature-icon-circle">🌿</span>
            <span>Saberes del Botiquín Amazónico</span>
          </div>

          <div className="feature-pill-item">
            <span className="feature-icon-circle">💉</span>
            <span>Suero Antiofídico en Postas</span>
          </div>

          <div className="feature-pill-item">
            <span className="feature-icon-circle">🫧</span>
            <span>Balones de Oxígeno Activos</span>
          </div>

          <div className="feature-pill-item">
            <span className="feature-icon-circle">🟢</span>
            <span>100% Funcional sin Internet</span>
          </div>
        </div>
      </header>

      {/* ====================================================================
          ONDA 1: DE OSCURO BOSQUE A CREMA / ARENA
          ==================================================================== */}
      <svg className="wave-divider wave-to-cream" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,0 C340,95 620,15 880,60 C1140,105 1320,35 1440,75 L1440,90 L0,90 Z" />
      </svg>

      {/* ====================================================================
          SECCIÓN 2: NUESTROS MÓDULOS DE ATENCIÓN (FONDO CREMA / ARENA)
          Layout Idéntico a "Our Services / Comprehensive Care"
          ==================================================================== */}
      <section id="sec-servicios" className="services-section-cream">
        <div className="section-header-centered">
          <span className="section-eyebrow">NUESTROS MÓDULOS DE ATENCIÓN RURAL</span>
          <h2 className="section-title-serif">Atención Integral para las Comunidades de Loreto</h2>
          <p className="section-subtitle">
            Acceso rápido a protocolos vitales de emergencia, medicina natural y coordinación médica sin depender de internet.
          </p>
        </div>

        {/* 7 Tarjetas Circulares / Pastillas */}
        <div className="services-pills-grid">
          {MODULOS_ATENCION.map((mod) => (
            <div 
              key={mod.id} 
              className="service-pill-card"
              onClick={() => setActiveModalItem(mod)}
              title="Toca para ver el protocolo completo"
            >
              <div className="service-pill-icon">{mod.icono}</div>
              <div className="service-pill-title">{mod.titulo}</div>
              <small style={{ fontSize: '0.78rem', color: 'var(--text-light-muted)' }}>{mod.subtitulo}</small>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          ONDA 2: DE CREMA / ARENA A OSCURO BOSQUE
          ==================================================================== */}
      <svg className="wave-divider wave-to-dark" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,90 C340,10 620,80 880,35 C1140,0 1320,65 1440,20 L1440,0 L0,0 Z" />
      </svg>

      {/* ====================================================================
          SECCIÓN 3: PROTOCOLOS VITALES (FONDO OSCURO CON 4 TARJETAS CIRCULARES)
          Layout Idéntico a "Sustainable Care. Advanced Dentistry"
          ==================================================================== */}
      <section id="sec-protocolos" className="protocol-features-dark">
        <div className="dark-split-layout">
          {/* Lado Izquierdo */}
          <div className="dark-text-block">
            <h2>Primeros Auxilios Inmediatos. Medicina que Salva Vidas en el Río.</h2>
            <p>
              Conoce los protocolos exactos validados para zonas rurales. Cada minuto cuenta cuando la posta médica se encuentra a horas de navegación fluvial.
            </p>
            <button className="btn-link-pill" onClick={() => setActiveModalItem(MODULOS_ATENCION[0])}>
              <span>Ver Protocolo de Mordeduras</span>
              <span>→</span>
            </button>
          </div>

          {/* Lado Derecho: 4 Tarjetas Glassmorphism Circulares */}
          <div className="dark-features-4grid">
            <div className="glass-circle-card" onClick={() => setActiveModalItem(MODULOS_ATENCION[0])} style={{ cursor: 'pointer' }}>
              <div className="glass-icon-ring">🚫</div>
              <h4>No Torniquetes</h4>
              <p>En mordeduras de víbora, jamás ligar el miembro; produce gangrena y amputación inevitable.</p>
            </div>

            <div className="glass-circle-card" onClick={() => setActiveModalItem(MODULOS_ATENCION[1])} style={{ cursor: 'pointer' }}>
              <div className="glass-icon-ring">💊</div>
              <h4>Solo Paracetamol</h4>
              <p>En sospecha de dengue, el ibuprofeno, aspirina o metamizol causan hemorragias mortales.</p>
            </div>

            <div className="glass-circle-card" onClick={() => setActiveModalItem(MODULOS_ATENCION[2])} style={{ cursor: 'pointer' }}>
              <div className="glass-icon-ring">⏱️</div>
              <h4>Presión 15 Minutos</h4>
              <p>En heridas por machete, presionar firmemente sin levantar para permitir coagulación.</p>
            </div>

            <div className="glass-circle-card" onClick={() => setActiveModalItem(MODULOS_ATENCION[4])} style={{ cursor: 'pointer' }}>
              <div className="glass-icon-ring">♨️</div>
              <h4>Agua Caliente a 45°C</h4>
              <p>En picaduras de raya, el calor desactiva la toxina proteica y quita el dolor de inmediato.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ONDA 3: DE OSCURO BOSQUE A CREMA / ARENA
          ==================================================================== */}
      <svg className="wave-divider wave-to-cream" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,0 C380,85 680,20 920,65 C1160,110 1340,40 1440,80 L1440,90 L0,90 Z" />
      </svg>

      {/* ====================================================================
          SECCIÓN 4: PROMOTORES DE SALUD Y MÉDICOS (FONDO CREMA / ARENA)
          Layout Idéntico a "Meet Your Dentist Dr. Elena Rivers"
          ==================================================================== */}
      <section id="sec-promotores" className="doctor-section-cream">
        <div className="doctor-split-container">
          {/* Lado Izquierdo: Marco Curvo con Imagen Representativa */}
          <div className="doctor-image-frame">
            <div className="doctor-curved-img-box">
              <div className="doctor-placeholder-graphic">
                <div className="doctor-avatar-circle">👩‍⚕️</div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#1b4332' }}>
                  Atención Intercultural Loreto
                </h4>
                <small style={{ color: '#4a5c51', fontWeight: 600 }}>Red de Salud Maynas & Alto Amazonas</small>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Descripción y Checklist */}
          <div className="doctor-details-text">
            <span className="section-eyebrow">RED DE SALUD MAYNAS Y ALTO AMAZONAS</span>
            <h2>Dra. Elena Ríos & Promotores de Salud Comunitarios</h2>
            <p>
              Uniendo la medicina científica con el respeto profundo a los saberes tradicionales de los pueblos ribereños de Loreto. Nuestro compromiso es que ningún poblador quede desamparado ante una mordedura de serpiente, una hemorragia o una emergencia fluvial.
            </p>

            <div className="doctor-checklist">
              <div className="checklist-row">
                <div className="check-leaf-icon">✓</div>
                <span>Protocolos médicos actualizados del MINSA para zonas rurales de la Amazonía</span>
              </div>

              <div className="checklist-row">
                <div className="check-leaf-icon">✓</div>
                <span>Monitoreo continuo de stock de suero antiofídico y balones de oxígeno en postas</span>
              </div>

              <div className="checklist-row">
                <div className="check-leaf-icon">✓</div>
                <span>Guardia y coordinación las 24 horas por radio HF (Frecuencia 5215 kHz)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ONDA 4: DE CREMA / ARENA A OSCURO BOSQUE
          ==================================================================== */}
      <svg className="wave-divider wave-to-dark" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,90 C340,15 640,75 900,30 C1160,0 1340,60 1440,25 L1440,0 L0,0 Z" />
      </svg>

      {/* ====================================================================
          SECCIÓN 5: BOTIQUÍN AMAZÓNICO (FONDO OSCURO CON 3 TARJETAS TESTIMONIALES)
          Layout Idéntico a "Patient Reviews / Smiles & Kind Words"
          ==================================================================== */}
      <section id="sec-botiquin" className="plants-reviews-dark">
        <div className="plants-reviews-container">
          <div className="plants-reviews-header">
            <span className="section-eyebrow" style={{ color: '#88c2a1' }}>SABIDURÍA DE LA SELVA • MEDICINA NATURAL</span>
            <h2>Botiquín Natural Amazónico: Fichas Prácticas</h2>
            <p>Plantas medicinales de Loreto para aliviar dolencias, con su preparación correcta y advertencias obligatorias de seguridad.</p>
          </div>

          {/* 3 Tarjetas Glassmorphism */}
          <div className="plants-3cards-grid">
            {BOTIQUIN_PLANTAS.map((p) => (
              <div 
                key={p.id} 
                className="plant-review-card"
                onClick={() => setActiveModalItem({
                  titulo: p.nombre,
                  subtitulo: p.cientifico,
                  tiempoMax: 'Medicina Natural Amazónica',
                  queHacer: [p.usos, `Preparación: ${p.preparacion}`],
                  queNoHacer: [p.advertencia],
                  alarma: 'Si los síntomas persisten o empeoran, acudir a la posta médica.'
                })}
                style={{ cursor: 'pointer' }}
                title="Toca para ver la ficha completa"
              >
                <div className="stars-rating-bar">{p.rating}</div>
                <h3>{p.nombre}</h3>
                <div className="plant-scientific-name">{p.cientifico}</div>
                <p className="plant-review-text">{p.usos}</p>

                <div className="plant-card-author">
                  <span>📍 {p.origen}</span>
                  <span style={{ color: '#88c2a1', fontWeight: 600 }}>Ver Ficha →</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button 
              className="btn-link-pill"
              onClick={() => setActiveModalItem(MODULOS_ATENCION[5])}
            >
              <span>Ver las 8 Plantas Medicinales del Botiquín</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ONDA 5: DE OSCURO BOSQUE A CREMA / ARENA
          ==================================================================== */}
      <svg className="wave-divider wave-to-cream" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,0 C320,85 640,15 900,60 C1160,105 1320,35 1440,75 L1440,90 L0,90 Z" />
      </svg>

      {/* ====================================================================
          SECCIÓN 6: PROCESO EN 4 PASOS (FONDO CREMA / ARENA)
          Layout Idéntico a "Your Care Journey / A Simple, Supportive Process"
          ==================================================================== */}
      <section className="journey-section-cream">
        <div className="section-header-centered">
          <span className="section-eyebrow">PROTOCOLO DE TRASLADO FLUVIAL</span>
          <h2 className="section-title-serif">Un Proceso Claro y Rápido para Salvar Vidas</h2>
          <p className="section-subtitle">Los 4 pasos esenciales desde que ocurre el accidente en la chacra hasta llegar a la posta médica.</p>
        </div>

        {/* 4 Pasos Conectados */}
        <div className="timeline-4steps-wrapper">
          <div className="step-card-journey">
            <div className="step-icon-bubble">1</div>
            <div className="step-number-title">1. Identificar</div>
            <p>Reconocer los signos de alarma (mordedura, hemorragia, asfixia) y mantener la calma.</p>
          </div>

          <div className="step-card-journey">
            <div className="step-icon-bubble">2</div>
            <div className="step-number-title">2. Auxiliar</div>
            <p>Aplicar primeros auxilios inmediatos: inmovilizar, presionar o calentar según el caso.</p>
          </div>

          <div className="step-card-journey">
            <div className="step-icon-bubble">3</div>
            <div className="step-number-title">3. Calcular</div>
            <p>Estimar horas de viaje fluvial según corriente y asegurar gasolina con reserva.</p>
          </div>

          <div className="step-card-journey">
            <div className="step-icon-bubble">4</div>
            <div className="step-number-title">4. Avisar</div>
            <p>Comunicarse por radio HF (5215 kHz) a la posta para preparar el suero antes de zarpar.</p>
          </div>
        </div>

        {/* ====================================================================
            SECCIÓN 7: CALCULADORA FLUVIAL (ESTILO "BOOK YOUR APPOINTMENT TODAY")
            ==================================================================== */}
        <div id="sec-fluvial" className="calc-appointment-block">
          <div className="calc-appointment-grid">
            {/* Lado Izquierdo: Formulario de Selección */}
            <div>
              <div className="calc-appointment-header">
                <span className="section-eyebrow">RUTAS Y EMBARCACIONES</span>
                <h3>Calcula tu Tiempo Fluvial y Consulta Disponibilidad de Postas</h3>
                <p>Estima el tiempo real de viaje en río y verifica si la posta de destino cuenta con suero antiofídico y oxígeno.</p>
              </div>

              <div className="custom-form-group">
                <label htmlFor="select-cuenca">🌊 Cuenca o Río de Origen (Loreto):</label>
                <select 
                  id="select-cuenca" 
                  className="custom-select"
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

              <div className="custom-form-group">
                <label htmlFor="select-bote">🛥️ Tipo de Embarcación:</label>
                <select 
                  id="select-bote" 
                  className="custom-select"
                  value={boatSpeed}
                  onChange={(e) => setBoatSpeed(Number(e.target.value))}
                >
                  <option value={10}>Peque-peque artesanal (9-16 HP) — ~10 km/h</option>
                  <option value={24}>Bote a motor / Lancha (60-115 HP) — ~24 km/h</option>
                  <option value={48}>Deslizador rápido (150-200 HP) — ~48 km/h</option>
                </select>
              </div>

              <div className="custom-form-group">
                <label htmlFor="select-corriente">🔄 Sentido de Navegación:</label>
                <select 
                  id="select-corriente" 
                  className="custom-select"
                  value={corrienteFactor}
                  onChange={(e) => setCorrienteFactor(Number(e.target.value))}
                >
                  <option value={1.15}>Bajando río (A favor de corriente: +15% rápido)</option>
                  <option value={0.75}>Subiendo río (Contra corriente: -25% velocidad)</option>
                </select>
              </div>
            </div>

            {/* Lado Derecho: Tarjeta de Resultados Fluviales */}
            <div className="calc-live-result-card">
              <div>
                <div className="result-time-row">
                  <small>TIEMPO A POSTA MÁS CERCANA ({cuenca.distanciaPostaKm} KM DE RÍO):</small>
                  <div className="result-big-time">{navegacion.postaTiempo}</div>
                  <div style={{ fontSize: '0.9rem', color: '#c7e5d3' }}>
                    🏥 {cuenca.postaCercana}
                  </div>
                </div>

                <div className="result-time-row">
                  <small>TIEMPO A HOSPITAL EN IQUITOS ({cuenca.distanciaHospitalKm} KM DE RÍO):</small>
                  <div className="result-big-time" style={{ color: '#ffd166' }}>{navegacion.hospTiempo}</div>
                  <div style={{ fontSize: '0.85rem', color: '#d8e2dc' }}>
                    🏨 Hosp. Regional de Loreto / Hosp. Apoyo Iquitos
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#88c2a1', marginTop: '6px' }}>
                  Velocidad real calculada con corriente: ~{navegacion.velocidadAjustada} km/h
                </div>
              </div>

              <div className="supplies-mini-checklist">
                <div className="supply-tag-item">💉 Suero: {cuenca.suero}</div>
                <div className="supply-tag-item">🫧 Oxígeno: {cuenca.oxigeno}</div>
                <div className="supply-tag-item">🔬 Dengue: {cuenca.pruebas}</div>
                <div className="supply-tag-item">📻 HF: {cuenca.radio.split('/')[0]}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FOOTER OSCURO (IDÉNTICO A LA BASE DE LA IMAGEN DE REFERENCIA)
          ==================================================================== */}
      <footer className="site-footer-dark">
        <div className="footer-top-columns">
          {/* Columna 1: Marca */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🌿</span>
              <h4>Guía Verde de Salud</h4>
            </div>
            <p>
              Salud Río Loreto: Orientación médica rural, medicina natural amazónica y rutas fluviales de emergencia para la Amazonía peruana.
            </p>
            <p style={{ color: '#88c2a1', fontWeight: 600 }}>
              Región Loreto • Comunidades Ribereñas
            </p>
          </div>

          {/* Columna 2: Cuencas */}
          <div className="footer-col">
            <h5>Cuencas Fluviales</h5>
            <ul className="footer-links-list">
              <li>Río Napo & Mazán</li>
              <li>Río Nanay & Bellavista</li>
              <li>Río Marañón & Nauta</li>
              <li>Río Itaya & Belén Rural</li>
              <li>Río Ucayali & Requena</li>
              <li>Río Amazonas & Indiana</li>
            </ul>
          </div>

          {/* Columna 3: Enlaces Rápidos */}
          <div className="footer-col">
            <h5>Módulos de Atención</h5>
            <ul className="footer-links-list">
              <li style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-servicios')}>Primeros Auxilios</li>
              <li style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-protocolos')}>Mordedura de Víbora</li>
              <li style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-botiquin')}>Plantas Medicinales</li>
              <li style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-fluvial')}>Calculadora Fluvial</li>
              <li style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-promotores')}>Red de Salud Maynas</li>
            </ul>
          </div>

          {/* Columna 4: Radios y Guardias */}
          <div className="footer-col">
            <h5>Canales de Emergencia</h5>
            <ul className="footer-links-list">
              <li>📞 SAMU Loreto: 106</li>
              <li>📻 Radio HF: 5215 kHz</li>
              <li>🏥 Hosp. Iquitos: (065) 26-4444</li>
              <li>🛥️ Capitanía Iquitos: Ch 16 VHF</li>
              <li>⏰ Atención: 24h Emergencias</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>
            © 2026 Guía Verde de Salud — Desarrollado para comunidades ribereñas de Loreto.
          </div>
          <div style={{ color: '#88c2a1', fontWeight: 600 }}>
            🟢 100% Autónomo y Offline • Funciona en medio de la selva sin conexión
          </div>
        </div>
      </footer>

      {/* ====================================================================
          MODAL DETALLE DE EMERGENCIA O PLANTA MEDICINAL (CON VOZ EN ESPAÑOL)
          ==================================================================== */}
      {activeModalItem && (
        <div className="detail-modal-overlay" onClick={() => setActiveModalItem(null)}>
          <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={() => setActiveModalItem(null)}>✕</button>

            <span className="section-eyebrow">PROTOCOLO MÉDICO DETALLADO</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#14281c', marginBottom: '6px' }}>
              {activeModalItem.titulo}
            </h2>
            <div style={{ color: '#4a5c51', fontWeight: 600, marginBottom: '14px' }}>
              ⏱️ {activeModalItem.tiempoMax}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button 
                className="btn-pill-action"
                style={{ backgroundColor: isSpeaking ? '#e67e22' : '#2d6647' }}
                onClick={() => hablarTexto(`${activeModalItem.titulo}. Qué hacer: ${activeModalItem.queHacer.join('. ')}. Qué no hacer: ${activeModalItem.queNoHacer.join('. ')}`)}
              >
                <span>{isSpeaking ? '⏹️' : '🔊'}</span>
                <span>{isSpeaking ? 'Detener Voz' : 'Escuchar en Voz Alta'}</span>
              </button>
            </div>

            <div style={{ marginBottom: '18px', backgroundColor: '#f1fbf4', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #2d6647' }}>
              <h4 style={{ color: '#1b4332', marginBottom: '8px' }}>✅ QUÉ SÍ HACER:</h4>
              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.95rem' }}>
                {activeModalItem.queHacer.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ol>
            </div>

            <div style={{ marginBottom: '18px', backgroundColor: '#fff0f0', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #d62828' }}>
              <h4 style={{ color: '#d62828', marginBottom: '8px' }}>❌ QUÉ NUNCA DEBES HACER:</h4>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.95rem' }}>
                {activeModalItem.queNoHacer.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            {activeModalItem.alarma && (
              <div style={{ backgroundColor: '#fff8eb', border: '1px dashed #e67e22', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', color: '#8c4300' }}>
                <strong>⚠️ Señales de gravedad extrema:</strong> {activeModalItem.alarma}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
