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

const PLANTAS_BOTIQUIN = [
  {
    nombre: 'Sangre de Grado',
    nombreCientifico: 'Croton lechleri',
    icono: '🩸',
    sirvePara: 'Cicatrizante potente en raspaduras, cortes limpios y úlceras. Estimula la regeneración del tejido dérmico.',
    preparacion: 'Aplicar 2 a 3 gotas de látex puro directamente sobre la herida limpia y frotar hasta formar una película blanca protectora.',
    advertencia: 'No usar en heridas profundas que requieran sutura o con signos de infección activa.'
  },
  {
    nombre: 'Matico Amazónico',
    nombreCientifico: 'Piper aduncum',
    icono: '🍃',
    sirvePara: 'Alivio de afecciones respiratorias, tos seca, bronquitis e inflamación de garganta.',
    preparacion: 'Infusión: 4 a 6 hojas en 1 litro de agua hervida caliente. Dejar reposar 10 minutos y tomar tibio con miel de abeja.',
    advertencia: 'Si la dificultad para respirar empeora o hay hundimiento de costillas, acudir urgente a la posta.'
  },
  {
    nombre: 'Uña de Gato',
    nombreCientifico: 'Uncaria tomentosa',
    icono: '🐾',
    sirvePara: 'Desinflamante natural potente para dolores articulares, reumatismo y fortalecimiento del sistema inmune.',
    preparacion: 'Decocción: Hervir 15 a 20 gramos de corteza en 1 litro de agua a fuego lento durante 20 minutos. Tomar 1 taza al día.',
    advertencia: 'Contraindicado estrictamente en mujeres gestantes, lactantes y personas con úlcera activa.'
  },
  {
    nombre: 'Malva Silvestre',
    nombreCientifico: 'Malva sylvestris',
    icono: '🌸',
    sirvePara: 'Reducción de fiebres leves a moderadas, inflamaciones gástricas y lavado de ojos irritados.',
    preparacion: 'Emplasto refrescante: machacar hojas limpias con agua fría y colocar sobre abdomen o frente.',
    advertencia: 'Si la fiebre supera 38.5°C o se acompaña de dolor abdominal agudo, sospechar de dengue y acudir a la posta.'
  },
  {
    nombre: 'Ojé (Uso Supervisado)',
    nombreCientifico: 'Ficus antihelmintica',
    icono: '🌱',
    sirvePara: 'Antiparasitario tradicional de amplio espectro contra parásitos intestinales rebeldes.',
    preparacion: 'Debe tomarse bajo estricta dosificación tradicional de sabios locales con dieta sin sal ni grasa.',
    advertencia: '¡ALTO RIESGO DE INTOXICACIÓN! No administrar a niños menores de 5 años ni a mujeres embarazadas.'
  }
];

export default function App() {
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

          <h2 className="hero-ocean-title">
            Salud en los Ríos de Loreto.
            <span className="coral-highlight">Protege la Vida en Cada Comunidad.</span>
          </h2>

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
            <h2>Primeros Auxilios Inmediatos</h2>
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
            <h2>Guías Rápidas por Síntoma</h2>
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
          <h2>Más que una Guía: Una Ruta Segura en el Río Loreto.</h2>
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

      {/* 10. SECCIÓN BOTIQUÍN NATURAL AMAZÓNICO */}
      <section id="botiquin-section" className="section-botiquin-natural">
        <div className="botiquin-header-row">
          <h2>Botiquín Natural Amazónico</h2>
          <p>
            Fichas prácticas de plantas medicinales locales con modo de preparación seguro y advertencia sobre cuándo es obligatorio acudir al médico.
          </p>
        </div>

        <div className="botiquin-cards-5grid">
          {PLANTAS_BOTIQUIN.map((p, idx) => (
            <div 
              key={idx} 
              className="plant-card"
              onClick={() => setActiveModalItem({
                titulo: p.nombre,
                subtitulo: p.nombreCientifico,
                tiempoMax: 'Uso Tradicional Seguro',
                queHacer: [
                  `Para qué sirve: ${p.sirvePara}`,
                  `Modo de preparación: ${p.preparacion}`
                ],
                queNoHacer: [
                  '¡NUNCA sustituir la atención médica de una urgencia grave con hierbas!',
                  '¡NUNCA administrar preparados con alcohol a niños o mujeres embarazadas!'
                ],
                alarma: p.advertencia
              })}
            >
              <div className="plant-icon">{p.icono}</div>
              <h4>{p.nombre}</h4>
              <p>{p.sirvePara}</p>
              <div className="plant-prep">
                <strong>Preparación:</strong> {p.preparacion}
              </div>
              <div className="plant-warning">
                <strong>Advertencia:</strong> {p.advertencia}
              </div>
            </div>
          ))}
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
