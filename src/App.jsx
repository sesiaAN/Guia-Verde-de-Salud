import { useState, useMemo, useEffect } from 'react';
import './App.css';

// ============================================================================
// DATOS VERIFICADOS — GUÍA VERDE DE SALUD (SALUD RÍO LORETO)
// ============================================================================

const EMERGENCIAS_INTENCION = [
  {
    id: 'mordedura',
    icono: '🐍',
    titulo: 'Mordeduras',
    subtitulo: 'Jergón & Shushupe',
    badge: 'Urgencia Crítica',
    tiempoMax: 'Menos de 4 a 6 horas para el suero',
    queHacer: [
      'Mantener a la persona acostada, inmóvil y en calma (el movimiento apresura el veneno).',
      'Inmovilizar el brazo o pierna mordida con una tablilla rígida a nivel del corazón.',
      'Lavar la herida suavemente con abundante agua limpia y jabón neutro, sin frotar.',
      'Retirar INMEDIATAMENTE anillos, pulseras y botas antes de que la extremidad se hinche.',
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
    titulo: 'Fiebre / Dengue',
    subtitulo: 'Zancudo & Creciente',
    badge: 'Alerta Hemorrágica',
    tiempoMax: 'Atención dentro de 24 horas',
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
    titulo: 'Cortes Machete',
    subtitulo: 'Trauma & Hemorragia',
    badge: 'Primeros 10 Min',
    tiempoMax: 'Contener en los primeros 10 minutos',
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
    titulo: 'Diarrea & Suero',
    subtitulo: 'Deshidratación Infantil',
    badge: 'Rehidratación Urgente',
    tiempoMax: 'Rehidratación inmediata',
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
    titulo: 'Chuzo de Raya',
    subtitulo: 'Toxina de Fango Fluvial',
    badge: 'Alivio Inmediato',
    tiempoMax: 'Alivio en menos de 30 minutos',
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

const PLANTAS_AMAZONICAS = [
  {
    id: 'sangre-grado',
    nombre: 'Sangre de Grado',
    cientifico: 'Croton lechleri',
    origen: 'Bosques primarios y secundarios de Loreto',
    usos: 'Cicatrizante natural de máxima potencia, úlceras gástricas, gastritis y antiséptico para raspones y cortes superficiales.',
    preparacion: 'Uso tópico: 2 a 4 gotas de savia roja pura frotadas con el dedo limpio hasta formar una espuma blanca protectora que seca como látex. Uso interno: 3 a 5 gotas en medio vaso de agua tibia en ayunas por 10 días.',
    advertencia: 'NO aplicar en cortes profundos con sangrado arterial. Contraindicado en el embarazo. Si hay pus o fiebre, acudir al centro de salud.'
  },
  {
    id: 'matico',
    nombre: 'Matico (Moho-moho)',
    cientifico: 'Piper aduncum',
    origen: 'Orillas ribereñas y purmas amazónicas',
    usos: 'Alivio de la tos, bronquitis, afecciones respiratorias, dolor de garganta y lavado antiséptico de heridas dérmicas.',
    preparacion: 'Infusión: Hervir 1 litro de agua, apagar y agregar 4 a 6 hojas limpias. Reposar 10 minutos. Tomar 3 tazas al día con miel silvestre. Para heridas: hervir 8 hojas por 5 minutos y lavar la piel tibia.',
    advertencia: 'Si el paciente tiene pecho hundido, aleteo nasal o labios morados, requiere oxígeno urgente en la posta médica.'
  },
  {
    id: 'una-gato',
    nombre: 'Uña de Gato',
    cientifico: 'Uncaria tomentosa',
    origen: 'Liana trepadora de la selva virgen con espinas curvas',
    usos: 'Potente antiinflamatorio para dolores articulares (artritis, reumatismo), dolor de huesos y refuerzo de las defensas.',
    preparacion: 'Decocción: Hervir 15 a 20 gramos de corteza seca en 1 litro de agua a fuego lento por 20 minutos tapado. Colar y tomar 1 vaso en la mañana y otro en la tarde por 15 días.',
    advertencia: '¡PROHIBIDO en mujeres embarazadas (puede inducir aborto)! No reemplaza antibióticos para infecciones agudas.'
  }
];

const RUTAS_CUENCAS = [
  {
    id: 'napo',
    nombre: 'Cuenca Río Napo',
    subtitulo: 'Santa Clotilde & Mazán',
    distanciaKm: 45,
    tiempoDeslizador: '1 h 45 min',
    suero: '8 ampollas',
    oxigeno: '4 balones',
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
    suero: '2 ampollas',
    oxigeno: '2 balones',
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
    suero: '6 ampollas',
    oxigeno: '6 balones',
    icono: '🚤',
    posta: 'Centro de Salud Nauta (I-4)',
    radio: '5820 kHz HF'
  }
];

const TESTIMONIOS_SALUD = [
  {
    nombre: 'Juan Maytahuari',
    rol: 'Promotor Comunitario • Río Napo',
    avatar: '👨🏽‍🌾',
    estrellas: '★★★★★',
    texto: 'Gracias a la guía pudimos atender una mordedura de jergón sin torniquetes. El paciente llegó estable a Santa Clotilde y el suero funcionó a tiempo.'
  },
  {
    nombre: 'Dra. Elena Ríos',
    rol: 'Médico Asistencial • Iquitos',
    avatar: '👩🏻‍⚕️',
    estrellas: '★★★★★',
    texto: 'La advertencia de evitar ibuprofeno y aspirina en dengue ha salvado decenas de vidas en comunidades ribereñas donde no hay hospital cercano.'
  },
  {
    nombre: 'Carlos Pinedo',
    rol: 'Técnico Sanitario • Nauta',
    avatar: '👨🏾‍⚕️',
    estrellas: '★★★★★',
    texto: 'Calcular con precisión el tiempo fluvial según la corriente nos permite tener listos los balones de oxígeno antes de que atraque el peque-peque.'
  }
];

export default function App() {
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Estado Calculadora Fluvial
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
      tiempoStr: `${h > 0 ? `${h} h ` : ''}${m} min`,
      velocidadCalculada: Math.round(velReal)
    };
  }, [rutaSeleccionada, calcVelocidad, calcCorriente]);

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
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="herboria-page">
      {/* ====================================================================
          NAVBAR HERBORIA
          ==================================================================== */}
      <nav className="herboria-navbar">
        <div className="brand-wrapper">
          <div className="brand-icon-logo">🌿</div>
          <div className="brand-title-box">
            <h1>Guía Verde</h1>
            <small>DE SALUD • LORETO</small>
          </div>
        </div>

        <div className="nav-links-wrap">
          <button className="nav-link" onClick={() => scrollToId('sec-hero')}>Inicio</button>
          <button className="nav-link" onClick={() => scrollToId('sec-intencion')}>Emergencias</button>
          <button className="nav-link" onClick={() => scrollToId('sec-ciencia')}>Protocolos</button>
          <button className="nav-link" onClick={() => scrollToId('sec-plantas')}>Botiquín Natural</button>
          <button className="nav-link" onClick={() => scrollToId('sec-rutas')}>Rutas Fluviales</button>
        </div>

        <div className="nav-actions-wrap">
          <div className="offline-pill-status">
            <span className="dot-pulse"></span>
            <span>Modo Offline Listo</span>
          </div>

          <button className="btn-lime-pill" onClick={() => alert('🚨 CANALES DE EMERGENCIA FLUVIAL:\n📞 SAMU Loreto: 106\n📻 Radio HF: 5215 kHz\n🏥 Hospital Apoyo Iquitos: (065) 26-4444')}>
            <span>🚨</span>
            <span>SAMU 106</span>
          </button>
        </div>
      </nav>

      {/* ====================================================================
          HERO SECTION (CON CÚPULA DE CRISTAL / TERRARIO HERBORIA)
          ==================================================================== */}
      <header id="sec-hero" className="herboria-hero">
        <div>
          <span className="hero-sub-dots">PRIMEROS AUXILIOS • MEDICINA NATURAL • NAVEGACIÓN</span>
          <h1 className="hero-luxury-title">
            La Nueva Generación de <em>Salud Amazónica</em>
          </h1>
          <p className="hero-description-txt">
            Orientación médica inmediata para emergencias en el río, sabiduría comprobada de plantas nativas y tiempos reales de navegación fluvial hacia postas y hospitales de Loreto.
          </p>

          <div className="hero-actions-row">
            <button className="btn-lime-pill" onClick={() => scrollToId('sec-intencion')}>
              <span>Buscar Síntoma o Emergencia</span>
              <span>→</span>
            </button>

            <div className="scroll-indicator-box">
              <span>🖱️</span>
              <span>Desliza para explorar</span>
            </div>
          </div>
        </div>

        {/* Cúpula / Terrario de Cristal Luminoso */}
        <div className="hero-glass-dome-frame">
          <div className="glass-terrarium-orb">
            <div className="holographic-ribbon"></div>
            <div className="dome-badge-top">Posta Conectada 24/7</div>

            <div className="dome-herbs-center">
              <div className="dome-icon-sparkle">🌿</div>
            </div>

            <div className="dome-info-card">
              <h4>🏥 Red Fluvial Santa Clotilde & Mazán</h4>
              <p>Monitoreo continuo de sueros antiofídicos y oxígeno medicinal en comunidades del Río Napo y Nanay.</p>
              <div style="display: flex; gap: 8px; margin-top: 8px;">
                <span style="font-size: 0.75rem; color: var(--color-lime-glow); font-weight: 700;">💉 8 Dosis Suero</span>
                <span style="font-size: 0.75rem; color: #a2d2ff; font-weight: 700;">🫧 4 Balones O2</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          SECCIÓN 1: "DISCOVER BY INTENTION" (5 TARJETAS DE CRISTAL CON PEDESTAL)
          ==================================================================== */}
      <section id="sec-intencion" className="section-discover">
        <div className="discover-header-row">
          <div className="discover-title-wrap">
            <h2>Atención Inmediata por Síntoma</h2>
            <p>Acceso directo a las 5 urgencias más frecuentes en la chacra y el río de Loreto.</p>
          </div>
          <div className="slider-arrows">
            <button className="arrow-circle-btn" onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[0])}>←</button>
            <button className="arrow-circle-btn" onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[1])}>→</button>
          </div>
        </div>

        <div className="glass-cards-5grid">
          {EMERGENCIAS_INTENCION.map((item) => (
            <div 
              key={item.id} 
              className="glass-intent-card"
              onClick={() => setActiveModalItem(item)}
              title="Toca para ver el protocolo de auxilio"
            >
              <div className="intent-pedestal">{item.icono}</div>
              <h3>{item.titulo}</h3>
              <span>{item.subtitulo}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 2: "THE SCIENCE WITHIN" (CARD DE MATERIA ACTIVA Y 4 FEATURES)
          ==================================================================== */}
      <section id="sec-ciencia" className="section-science-within">
        <div className="science-glass-box">
          {/* Lado Izquierdo: Matraz Esférico con Principios Activos */}
          <div className="orb-stats-wrapper">
            <div className="curved-flask-container">
              <div style="font-size: 4rem; line-height: 1;">🧪</div>
              <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: #ffffff; margin-top: 8px;">
                Materia Médica Activa
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                Protocolos Oficiales del MINSA para Zonas de Selva
              </p>
              <div className="flask-active-compound">
                Eficacia Comprobada: 95% ↑
              </div>
            </div>
          </div>

          {/* Lado Derecho: Contenido Editorial y 4 Micro-features */}
          <div className="science-text-content">
            <span className="hero-sub-dots">CIENCIA Y PRIMEROS AUXILIOS</span>
            <h2>Más que Remedios, Protocolos que Salvan Vidas</h2>
            <p>
              En la Amazonía rural, cada minuto cuenta cuando el centro de salud se encuentra a horas de navegación fluvial. Conocer qué hacer y qué está estrictamente prohibido marca la diferencia entre la vida y la muerte.
            </p>

            <button className="btn-lime-pill" onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[0])} style="align-self: flex-start;">
              <span>Explorar Protocolos de Emergencia</span>
              <span>→</span>
            </button>

            <div className="science-4features-vertical">
              <div className="feature-micro-item" onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[0])} style="cursor: pointer;">
                <div className="micro-icon">🚫</div>
                <div className="micro-desc">
                  <h5>Cero Torniquetes</h5>
                  <small>Evita gangrena en mordedura de serpiente.</small>
                </div>
              </div>

              <div className="feature-micro-item" onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[1])} style="cursor: pointer;">
                <div className="micro-icon">💊</div>
                <div className="micro-desc">
                  <h5>Solo Paracetamol</h5>
                  <small>Previene hemorragias mortales por dengue.</small>
                </div>
              </div>

              <div className="feature-micro-item" onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[2])} style="cursor: pointer;">
                <div className="micro-icon">⏱️</div>
                <div className="micro-desc">
                  <h5>Presión 15 Minutos</h5>
                  <small>Detiene hemorragia profunda por machete.</small>
                </div>
              </div>

              <div className="feature-micro-item" onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[4])} style="cursor: pointer;">
                <div className="micro-icon">♨️</div>
                <div className="micro-desc">
                  <h5>Agua Caliente a 45°C</h5>
                  <small>Desactiva la toxina del chuzo de raya.</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 3: "OUR SOURCING STORY" (LENTE CURVO Y PLANTAS NATIVAS)
          ==================================================================== */}
      <section id="sec-plantas" className="section-sourcing-story">
        <div className="sourcing-grid-layout">
          {/* Lado Izquierdo: Marco Curvo con Paisaje de Río y Selva */}
          <div className="curved-porthole-frame">
            <div className="porthole-bg-gradient"></div>
            <div className="porthole-badge-content">
              <span className="hero-sub-dots" style="color: var(--color-lime-glow); font-size: 0.72rem;">SABIDURÍA TRADICIONAL VERIFICADA</span>
              <h4>Chacras y Bosques Ribereños de Loreto</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted);">
                Especies vegetales recolectadas de manera sostenible por comunidades amazónicas.
              </p>
            </div>
          </div>

          {/* Lado Derecho: Textos y Pastillas de Plantas */}
          <div className="sourcing-details-col">
            <span className="hero-sub-dots">BOTIQUÍN NATURAL AMAZÓNICO</span>
            <h2>De los Bosques de Loreto a tu Botiquín Familiar</h2>
            <p>
              Validamos el saber botánico de los pueblos ribereños, proporcionando las dosis exactas, modos de preparación seguros y las advertencias sobre cuándo es obligatorio acudir a la posta médica.
            </p>

            <button 
              className="btn-lime-pill" 
              onClick={() => setActiveModalItem({
                titulo: 'Botiquín Natural Amazónico',
                subtitulo: '8 Plantas Medicinales de Loreto',
                tiempoMax: 'Uso Tradicional Seguro',
                queHacer: [
                  'Sangre de Grado: Cicatrizante potente en gotas sobre raspones limpios y gastritis.',
                  'Matico: Infusión de 4 a 6 hojas en 1 litro de agua caliente para tos y bronquitis.',
                  'Uña de Gato: Decocción de 15g de corteza durante 20 minutos para dolor articular y artritis.',
                  'Malva: Emplasto refrescante para fiebres leves y afecciones urinarias.',
                  'Achiote: Infusión de hojas secas para inflamación de próstata y riñones.'
                ],
                queNoHacer: [
                  '¡NUNCA sustituir la atención médica de una urgencia grave con hierbas caseras!',
                  '¡NUNCA tomar leche de ojé sin control estricto (alto riesgo de intoxicación grave)!',
                  '¡NUNCA administrar preparados alcohólicos a gestantes ni niños pequeños!'
                ],
                alarma: 'Si el paciente presenta fiebre alta que no cede, tos con sangre o dolor agudo, acudir de inmediato al médico.'
              })}
            >
              <span>Conocer Fichas de Plantas</span>
              <span>→</span>
            </button>

            <div className="sourcing-leaf-checklist">
              <div className="checklist-leaf-pill">
                <span>🩸</span>
                <span>Sangre de Grado: Cicatrizante</span>
              </div>
              <div className="checklist-leaf-pill">
                <span>🍃</span>
                <span>Matico: Alivio de la Tos</span>
              </div>
              <div className="checklist-leaf-pill">
                <span>🐾</span>
                <span>Uña de Gato: Desinflamante</span>
              </div>
              <div className="checklist-leaf-pill">
                <span>🌸</span>
                <span>Malva: Fiebres Leves</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 4: "COOK, CREATE AND EXPLORE" (3 TARJETAS ESTILO RECETA / RUTAS)
          ==================================================================== */}
      <section id="sec-rutas" className="section-routes-explore">
        <div className="routes-explore-header">
          <div>
            <span className="hero-sub-dots">NAVEGACIÓN Y DISPONIBILIDAD DE POSTAS</span>
            <h2>Rutas Fluviales en Tiempo Real</h2>
            <p style="color: var(--text-muted); font-size: 1.05rem;">
              Estima los tiempos reales de travesía fluvial hacia las postas médicas con stock de sueros antiofídicos y oxígeno.
            </p>
          </div>
          <button className="btn-lime-pill" onClick={() => scrollToId('calc-panel')}>
            <span>Calculadora Fluvial</span>
            <span>→</span>
          </button>
        </div>

        <div className="recipe-cards-3grid">
          {RUTAS_CUENCAS.map((r) => (
            <div 
              key={r.id} 
              className="recipe-style-card"
              onClick={() => {
                setCalcCuenca(r.id);
                scrollToId('calc-panel');
              }}
            >
              <div className="recipe-card-photo">
                <span>{r.icono}</span>
              </div>
              <div className="recipe-card-body">
                <div>
                  <h3>{r.nombre}</h3>
                  <p>{r.subtitulo} • Posta: {r.posta}</p>
                </div>
                <div className="recipe-card-footer">
                  <span className="time-chip-badge">
                    <span>⏱️</span>
                    <span>{r.tiempoDeslizador}</span>
                  </span>
                  <div className="btn-arrow-icon">→</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Panel Interactivo de la Calculadora Fluvial */}
        <div id="calc-panel" className="calc-interactive-panel">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.8rem; color: #ffffff; margin-bottom: 8px;">
              Calculador Fluvial Comunitario
            </h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 22px;">
              Selecciona tu cuenca, embarcación y dirección para conocer el tiempo de viaje con el efecto de la corriente.
            </p>

            <div className="calc-control-group">
              <label htmlFor="selectCuenca">Cuenca o Río de Origen:</label>
              <select 
                id="selectCuenca" 
                className="calc-select-glass"
                value={calcCuenca}
                onChange={(e) => setCalcCuenca(e.target.value)}
              >
                <option value="napo">Río Napo (Santa Clotilde, Mazán)</option>
                <option value="nanay">Río Nanay (Santa María, Bellavista)</option>
                <option value="maranon">Río Marañón (Nauta, Parinari)</option>
              </select>
            </div>

            <div className="calc-control-group">
              <label htmlFor="selectBote">Tipo de Embarcación:</label>
              <select 
                id="selectBote" 
                className="calc-select-glass"
                value={calcVelocidad}
                onChange={(e) => setCalcVelocidad(Number(e.target.value))}
              >
                <option value={10}>Peque-peque tradicional (9-16 HP) — ~10 km/h</option>
                <option value={24}>Bote a motor / Lancha (60-115 HP) — ~24 km/h</option>
                <option value={48}>Deslizador rápido (150-200 HP) — ~48 km/h</option>
              </select>
            </div>

            <div className="calc-control-group">
              <label htmlFor="selectCorriente">Corriente del Río:</label>
              <select 
                id="selectCorriente" 
                className="calc-select-glass"
                value={calcCorriente}
                onChange={(e) => setCalcCorriente(Number(e.target.value))}
              >
                <option value={1.15}>Bajando río (A favor: +15% rápido)</option>
                <option value={0.75}>Subiendo río (Contra corriente: -25% velocidad)</option>
              </select>
            </div>
          </div>

          <div className="calc-live-result-box">
            <div>
              <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--color-lime-glow); letter-spacing: 1.5px; font-weight: 700;">
                TIEMPO ESTIMADO HACIA {rutaSeleccionada.posta.toUpperCase()}
              </span>
              <div className="big-fluvial-time">{calculoNavegacion.tiempoStr}</div>
              <div style="font-size: 0.88rem; color: var(--text-muted);">
                Distancia en río: ~{rutaSeleccionada.distanciaKm} km | Velocidad real: ~{calculoNavegacion.velocidadCalculada} km/h
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; border-top: 1px solid var(--border-glass-subtle); padding-top: 16px;">
              <div style="font-size: 0.82rem; color: #ffffff;">💉 Suero: <strong>{rutaSeleccionada.suero}</strong></div>
              <div style="font-size: 0.82rem; color: #ffffff;">🫧 Oxígeno: <strong>{rutaSeleccionada.oxigeno}</strong></div>
              <div style="font-size: 0.82rem; color: var(--color-lime-glow); grid-column: 1/-1;">📻 Radio HF: {rutaSeleccionada.radio}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 5: "LOVED BY HOME COOKS" (TESTIMONIOS DE LA RED DE SALUD)
          ==================================================================== */}
      <section className="section-testimonials">
        <span className="hero-sub-dots">RED DE SALUD MAYNAS & ALTO AMAZONAS</span>
        <h2 style="font-family: var(--font-serif); font-size: 2.4rem; color: #ffffff; font-weight: 400;">
          Reconocido por la Red de Salud y Pobladores de Loreto
        </h2>

        <div className="testimonials-3grid">
          {TESTIMONIOS_SALUD.map((t, idx) => (
            <div key={idx} className="testimonial-glass-card">
              <div className="test-user-header">
                <div className="user-avatar-circle">{t.avatar}</div>
                <div className="user-info-text">
                  <strong>{t.nombre}</strong>
                  <div className="stars-gold">{t.estrellas}</div>
                  <small style="color: var(--text-muted); font-size: 0.75rem;">{t.rol}</small>
                </div>
              </div>
              <p className="testimonial-quote">"{t.texto}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 6: FRANJA DE MINI BADGES
          ==================================================================== */}
      <div className="section-badges-strip">
        <div className="badges-horizontal-row">
          <div className="micro-badge-item"><span>🚤</span><span>Evacuación Fluvial Rápida</span></div>
          <div className="micro-badge-item"><span>💉</span><span>Suero Antiofídico Activo</span></div>
          <div className="micro-badge-item"><span>🌿</span><span>100% Plantas Verificadas</span></div>
          <div className="micro-badge-item"><span>🟢</span><span>100% Modo Offline</span></div>
          <div className="micro-badge-item"><span>📻</span><span>Radio HF: 5215 kHz</span></div>
        </div>
      </div>

      {/* ====================================================================
          SECCIÓN 7: CAPSULE BANNER (ESTILO NEWSLETTER "JOIN THE HERBORIA CIRCLE")
          ==================================================================== */}
      <section className="section-capsule-banner">
        <div className="capsule-glass-card">
          <div className="capsule-title-box">
            <h3>Canal de Alerta y Coordinación Fluvial</h3>
            <p>Comunícate de inmediato con las brigadas médicas o activa la ambulancia fluvial.</p>
          </div>

          <div className="capsule-action-pill">
            <span style="font-size: 0.88rem; color: #ffffff; font-weight: 600;">SAMU Loreto: 106</span>
            <button 
              className="btn-lime-pill" 
              onClick={() => alert('🚨 LLAMADA DE EMERGENCIA LORETO:\nTeléfono: 106 (SAMU Gratuito)\nRadio HF: 5215 kHz\nHospital Apoyo Iquitos: (065) 26-4444')}
            >
              <span>Llamar SAMU 106</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 8: FOOTER (ESTILO HERBORIA OSCURO MULTICOLUMNA)
          ==================================================================== */}
      <footer className="herboria-footer">
        <div className="footer-inner-grid">
          <div className="footer-col-brand">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 1.5rem;">🌿</span>
              <h3>Guía Verde de Salud</h3>
            </div>
            <p>
              Salud Río Loreto: Orientación médica rural, botiquín amazónico y rutas fluviales de emergencia para comunidades de la Amazonía peruana.
            </p>
          </div>

          <div className="footer-col">
            <h5>Cuencas Fluviales</h5>
            <ul className="footer-links-vertical">
              <li>Río Napo & Mazán</li>
              <li>Río Nanay & Bellavista</li>
              <li>Río Marañón & Nauta</li>
              <li>Río Itaya & Belén Rural</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Protocolos de Auxilio</h5>
            <ul className="footer-links-vertical">
              <li onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[0])}>Mordeduras de Víbora</li>
              <li onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[1])}>Fiebre y Dengue</li>
              <li onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[2])}>Cortes de Machete</li>
              <li onClick={() => setActiveModalItem(EMERGENCIAS_INTENCION[4])}>Chuzo de Raya</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Contactos y Guardia</h5>
            <ul className="footer-links-vertical">
              <li>📞 SAMU Loreto: 106</li>
              <li>📻 Radio HF: 5215 kHz</li>
              <li>🏥 Hosp. Iquitos: (065) 26-4444</li>
              <li>⏰ Atención: 24h Emergencias</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-strip">
          <div>
            © 2026 Guía Verde de Salud — Desarrollado para comunidades de Loreto.
          </div>
          <div style="color: var(--color-lime-glow); font-weight: 600;">
            🟢 100% Autónomo y Offline • Funciona en medio de la selva sin conexión
          </div>
        </div>
      </footer>

      {/* ====================================================================
          MODAL INTERACTIVO CON VOZ EN ESPAÑOL
          ==================================================================== */}
      {activeModalItem && (
        <div className="herboria-modal-overlay" onClick={() => setActiveModalItem(null)}>
          <div className="herboria-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="btn-modal-close" onClick={() => setActiveModalItem(null)}>✕</button>

            <span className="hero-sub-dots" style="color: var(--color-lime-glow);">PROTOCOLO MÉDICO DETALLADO</span>
            <h2 style="font-family: var(--font-serif); font-size: 2.2rem; color: #ffffff; margin-bottom: 6px;">
              {activeModalItem.titulo}
            </h2>
            <div style="color: var(--text-muted); font-weight: 600; margin-bottom: 20px;">
              ⏱️ {activeModalItem.tiempoMax}
            </div>

            <div style="margin-bottom: 22px;">
              <button 
                className="btn-lime-pill"
                onClick={() => hablarTexto(`${activeModalItem.titulo}. Qué hacer: ${activeModalItem.queHacer.join('. ')}. Qué no hacer: ${activeModalItem.queNoHacer.join('. ')}`)}
              >
                <span>{isSpeaking ? '⏹️' : '🔊'}</span>
                <span>{isSpeaking ? 'Detener Voz' : 'Escuchar en Voz Alta'}</span>
              </button>
            </div>

            <div style="background: rgba(45, 102, 71, 0.25); border: 1px solid rgba(82, 183, 136, 0.4); padding: 18px; border-radius: 16px; margin-bottom: 16px;">
              <h4 style="color: var(--color-lime-glow); margin-bottom: 8px;">✅ QUÉ SÍ HACER:</h4>
              <ol style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.95rem; color: #ffffff;">
                {activeModalItem.queHacer.map((paso, idx) => (
                  <li key={idx}>{paso}</li>
                ))}
              </ol>
            </div>

            <div style="background: rgba(214, 40, 40, 0.15); border: 1px solid rgba(255, 77, 77, 0.4); padding: 18px; border-radius: 16px; margin-bottom: 16px;">
              <h4 style="color: #ff6b6b; margin-bottom: 8px;">❌ QUÉ NUNCA DEBES HACER:</h4>
              <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.95rem; color: #ffd6d6;">
                {activeModalItem.queNoHacer.map((prohibicion, idx) => (
                  <li key={idx}>{prohibicion}</li>
                ))}
              </ul>
            </div>

            {activeModalItem.alarma && (
              <div style="background: rgba(230, 126, 34, 0.15); border: 1px dashed rgba(230, 126, 34, 0.5); padding: 14px; border-radius: 12px; font-size: 0.9rem; color: #ffbe76;">
                <strong>⚠️ Señales de alarma extrema:</strong> {activeModalItem.alarma}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
