# Guía Verde de Salud — Salud Río Loreto 🌿🚤

> **Plataforma web de orientación médica rural, botiquín natural amazónico y rutas fluviales de emergencia.**
> Diseñada para pobladores de comunidades ribereñas y rurales de la Amazonía peruana (Región Loreto) con enfoque **Offline-First**, alta accesibilidad y cero dependencia de conexión a internet.

---

## 🌟 Características Principales

### 1. 🟢 Modo Offline Permanente & Accesibilidad Rural
- **100% Funcional sin Internet:** Toda la información médica, botánica y fluvial está incrustada en el código local.
- **Narrador de Voz Integrado:** Permite escuchar las instrucciones de primeros auxilios y recetas de plantas en voz alta con un solo toque (pensado para emergencias donde no se puede leer la pantalla o personas con baja alfabetización).
- **Diseño de Alto Contraste:** Botón de ajuste para visibilidad bajo la luz intensa del sol amazónico.
- **Botones Grandes y Tipografía Legible:** Blancos táctiles de más de 48px diseñados para uso en celulares y embarcaciones en movimiento.
- **Canales de Radio y Teléfonos de Emergencia:** SAMU Loreto (106), frecuencias de radio HF fluvial (5215 kHz) y hospitales de Iquitos.

### 2. 🚨 Módulo 1: Primeros Auxilios Inmediatos (Color Alerta Rojo/Naranja)
Tarjetas prácticas con pasos numerados de **QUÉ HACER** y advertencias estrictas de **QUÉ NUNCA HACER** en:
- **Mordedura de serpiente venenosa** (Jergón, Shushupe, Cascabel): inmovilización, lavado suave y traslado urgente para suero antiofídico; prohibición total de torniquetes y cortes.
- **Fiebre alta y sospecha de Dengue, Malaria o Leptospirosis:** hidratación oral, uso exclusivo de Paracetamol, mosquiteros y prohibición estricta de Ibuprofeno, Aspirina o inyecciones que causan hemorragias mortales.
- **Cortes y hemorragias graves por machete o motosierra:** técnica de presión directa continua por 15 minutos, elevación de miembros y prohibición de café, tabaco o telas quemadas.
- **Diarrea aguda y deshidratación severa:** receta casera de suero oral (agua hervida, sal, azúcar y limón), lactancia materna continua y señales de alarma por deshidratación infantil.
- **Picadura de raya de río o pez venenoso:** inmersión inmediata en agua caliente para desnaturalizar la toxina proteica y calmar el dolor lacerante en minutos.

### 3. 🌿 Módulo 2: Botiquín Natural Amazónico (Color Verde Selva)
Fichas medicinales prácticas de especies locales de Loreto con indicaciones, modo de preparación y **advertencia de seguridad médica obligatoria**:
- **Sangre de Grado** (*Croton lechleri*): potente cicatrizante, úlceras y gastritis.
- **Matico / Moho-moho** (*Piper aduncum*): afecciones respiratorias, tos, bronquitis y lavado de heridas.
- **Uña de Gato** (*Uncaria tomentosa*): desinflamante osteoarticular y defensas.
- **Malva Amazónica** (*Malachra alceifolia*): fiebres e infecciones urinarias leves.
- **Ojé** (*Ficus antihelmintica*): antiparasitario tradicional y advertencias de toxicidad por sobredosis.
- **Achiote** (*Bixa orellana*): desinflamante prostático y renal.
- **Amor Seco / Pega-Pega** (*Desmodium adscendens*): alergias y asma.
- **Llantén Amazónico** (*Plantago major*): lavados oculares y gástricos.

### 4. 🚤 Módulo 3: Calculadora de Tiempo Fluvial y Postas de Salud (Color Azul Río)
Herramienta interactiva para calcular el tiempo real de navegación:
- **Cuencas fluviales:** Río Napo, Río Nanay, Río Marañón, Río Itaya, Río Ucayali, Río Amazonas.
- **Embarcaciones:** Peque-peque (~10 km/h), Bote a motor (~24 km/h), Deslizador rápido (~48 km/h).
- **Sentido de navegación:** Bajando río (a favor de corriente) vs. Subiendo río (contra corriente).
- **Resultados calculados:** Horas y minutos a la posta más cercana y al Hospital Regional de Loreto / Hosp. Apoyo Iquitos, combustible requerido en galones y estado de insumos críticos (suero antiofídico, oxígeno, pruebas de dengue, guardia médica y frecuencia radial).

---

## 🚀 Cómo Usar el Proyecto

### Opción A: Archivo Único Autónomo (Sin instalar nada)
Puedes abrir directamente en cualquier navegador o celular el archivo:
```
GuiaVerde/guia_verde_de_salud.html
```
No requiere conexión a internet, servidores ni Node.js. Ideal para copiar en una memoria USB o enviar por Bluetooth.

### Opción B: Aplicación React + Vite
Para desarrollo local o despliegue en la nube (Vercel, Netlify, GitHub Pages):

1. Instalar dependencias (si no están instaladas):
   ```bash
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Compilar para producción:
   ```bash
   npm run build
   ```
