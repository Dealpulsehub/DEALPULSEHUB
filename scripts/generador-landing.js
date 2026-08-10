#!/usr/bin/env node

/**
 * GENERADOR AUTOMÁTICO DE LANDING PAGES
 *
 * Genera landing pages completas usando:
 * - Design System components
 * - Buyer personas
 * - Animaciones Lottie
 * - Russell Brunson framework
 *
 * USAGE:
 * npm run generador-landing -- --producto=infoproducto --persona=carlos --niche=marketing-digital
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURACIÓN GLOBAL
// ============================================================================

const PRODUCTOS = {
  infoproducto: {
    nombre: 'Infoproducto',
    precio: 97,
    titulo: 'Gana $5k/mes con nuestro Curso de Marketing Digital',
    subtitulo: 'Aprende paso a paso cómo crear tu negocio online',
    imagen: '/images/hero-course.jpg',
    animacion: 'data-loading.json',
    boton_cta: 'Quiero acceso ahora',
    tiempo_produccion: '14-21 días'
  },
  agencia: {
    nombre: 'Agencia Marketing',
    precio: 2500,
    titulo: 'Aumenta tus Ventas 50% en 90 Días',
    subtitulo: 'Agencia de marketing con resultados garantizados',
    imagen: '/images/hero-agency.jpg',
    animacion: 'growth-arrow.json',
    boton_cta: 'Agendar consultoría gratuita',
    tiempo_produccion: '21-30 días'
  },
  templates: {
    nombre: 'Plantillas WordPress',
    precio: 29,
    titulo: 'Templates WordPress Listos para Vender',
    subtitulo: 'Ahorra 40 horas por proyecto',
    imagen: '/images/hero-templates.jpg',
    animacion: 'product-showcase.json',
    boton_cta: 'Descargar demo gratis',
    tiempo_produccion: '7-14 días'
  },
  coaching: {
    nombre: 'Coaching Premium',
    precio: 1500,
    titulo: 'De $50k a $500k en 12 Meses',
    subtitulo: 'Coaching privado para CEOs que quieren escalar',
    imagen: '/images/hero-coaching.jpg',
    animacion: 'trophy-win.json',
    boton_cta: 'Agendar sesión de discovery',
    tiempo_produccion: 'Inmediato'
  }
};

const PERSONAS = {
  carlos: {
    nombre: 'Carlos',
    edad: '25-45',
    ubicacion: 'LATAM',
    ingresos: '$1k-5k/mes',
    motivacion: 'Generar ingresos pasivos',
    trigger: 'Promesa de $5k/mes en 30 días',
    colores: 'vibrant',
    velocidad: 'fast'
  },
  maria: {
    nombre: 'María',
    edad: '35-55',
    ubicacion: 'LATAM urbano',
    ingresos: '$5k-20k/mes',
    motivacion: 'Crecer sin riesgos',
    trigger: 'Aumento 50% en ventas en 90 días',
    colores: 'profesional',
    velocidad: 'normal'
  },
  juan: {
    nombre: 'Juan',
    edad: '22-35',
    ubicacion: 'Remoto',
    ingresos: '$2k-8k/mes',
    motivacion: 'Ingresos pasivos',
    trigger: 'Ahorra 40 horas/mes',
    colores: 'neutral',
    velocidad: 'slow'
  },
  roberto: {
    nombre: 'Roberto',
    edad: '40-60',
    ubicacion: 'LATAM metropolitan',
    ingresos: '$15k-50k/mes',
    motivacion: 'Escalar a $500k+',
    trigger: 'Mentalidad premium exclusive',
    colores: 'premium',
    velocidad: 'slow'
  }
};

// ============================================================================
// TEMPLATES DE COMPONENTES
// ============================================================================

const TEMPLATES = {
  // HTML HERO SECTION
  hero: (config) => `
<!-- ANIMATED HERO SECTION -->
<section class="hero-section" data-animation="${config.animacion}">
  <div class="hero-container">
    <div class="hero-content">
      <h1 class="hero-title">${config.titulo}</h1>
      <p class="hero-subtitle">${config.subtitulo}</p>

      <div class="hero-cta">
        <button class="btn btn-primary btn-lg">
          ${config.boton_cta}
        </button>
        <p class="guarantee">${config.garantia || '30 días dinero de vuelta 100%'}</p>
      </div>
    </div>

    <div class="hero-animation">
      <lottie-player
        src="/animations/${config.animacion}"
        background="transparent"
        speed="1"
        loop
        autoplay
        style="width: 100%; height: 100%; max-height: 500px;">
      </lottie-player>
    </div>
  </div>
</section>

<style>
  .hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px 20px;
    min-height: 600px;
    display: flex;
    align-items: center;
  }

  .hero-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
  }

  .hero-title {
    font-size: 3.2em;
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.3em;
    margin-bottom: 30px;
    opacity: 0.95;
  }

  .guarantee {
    margin-top: 15px;
    font-size: 0.9em;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    .hero-container {
      grid-template-columns: 1fr;
    }
    .hero-title {
      font-size: 2em;
    }
  }
</style>
  `,

  // FEATURES SECTION
  features: (features) => `
<!-- FEATURES SECTION -->
<section class="features-section">
  <div class="features-container">
    <h2>¿Qué Incluye?</h2>

    <div class="features-grid">
      ${features.map(f => `
        <div class="feature-card">
          <div class="feature-icon">✓</div>
          <h3>${f.titulo}</h3>
          <p>${f.descripcion}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<style>
  .features-section {
    padding: 60px 20px;
    background: white;
  }

  .features-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .features-container h2 {
    text-align: center;
    font-size: 2.2em;
    margin-bottom: 50px;
    color: #333;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .feature-card {
    background: #f9fafb;
    padding: 30px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }

  .feature-icon {
    font-size: 2em;
    color: #6366f1;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .feature-card h3 {
    font-size: 1.3em;
    margin-bottom: 10px;
    color: #333;
  }

  .feature-card p {
    color: #666;
    line-height: 1.6;
  }
</style>
  `,

  // TESTIMONIALS SECTION
  testimonios: (testimonios) => `
<!-- TESTIMONIALS SECTION -->
<section class="testimonials-section">
  <div class="testimonials-container">
    <h2>Resultados Reales de Clientes</h2>

    <div class="testimonials-grid">
      ${testimonios.map(t => `
        <div class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p class="testimonial-text">"${t.texto}"</p>
          <div class="testimonial-author">
            <strong>${t.autor}</strong>
            <span>${t.resultado}</span>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<style>
  .testimonials-section {
    padding: 60px 20px;
    background: #f9fafb;
  }

  .testimonials-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .testimonials-container h2 {
    text-align: center;
    font-size: 2.2em;
    margin-bottom: 50px;
    color: #333;
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .testimonial-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .stars {
    color: #f59e0b;
    font-size: 1.2em;
    margin-bottom: 15px;
  }

  .testimonial-text {
    font-size: 1em;
    margin-bottom: 20px;
    color: #333;
    font-style: italic;
    line-height: 1.6;
  }

  .testimonial-author {
    display: flex;
    flex-direction: column;
  }

  .testimonial-author strong {
    color: #333;
  }

  .testimonial-author span {
    color: #10b981;
    font-size: 0.9em;
  }
</style>
  `,

  // CTA SECTION
  cta: (config) => `
<!-- FINAL CTA SECTION -->
<section class="cta-section">
  <div class="cta-container">
    <h2>${config.titulo_cta || '¿Listo para empezar?'}</h2>
    <p>${config.subtitulo_cta || 'Únete a miles de clientes satisfechos'}</p>

    <button class="btn btn-primary btn-lg">${config.boton_cta}</button>

    <p class="cta-guarantee">${config.garantia}</p>
  </div>
</section>

<style>
  .cta-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 80px 20px;
    text-align: center;
  }

  .cta-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .cta-container h2 {
    font-size: 2.2em;
    margin-bottom: 15px;
  }

  .cta-container p {
    font-size: 1.1em;
    margin-bottom: 30px;
    opacity: 0.95;
  }

  .cta-guarantee {
    margin-top: 20px;
    font-size: 0.9em;
    opacity: 0.85;
  }
</style>
  `
};

// ============================================================================
// FUNCIONES PRINCIPALES
// ============================================================================

/**
 * Genera una landing page completa
 */
function generarLanding(config) {
  const { producto, persona, niche } = config;

  const prodConfig = PRODUCTOS[producto];
  const personaConfig = PERSONAS[persona];

  if (!prodConfig) {
    console.error(`❌ Producto no encontrado: ${producto}`);
    console.log(`Productos disponibles: ${Object.keys(PRODUCTOS).join(', ')}`);
    return;
  }

  if (!personaConfig) {
    console.error(`❌ Persona no encontrada: ${persona}`);
    console.log(`Personas disponibles: ${Object.keys(PERSONAS).join(', ')}`);
    return;
  }

  console.log(`\n🚀 Generando landing page...`);
  console.log(`   Producto: ${prodConfig.nombre}`);
  console.log(`   Persona: ${personaConfig.nombre}`);
  console.log(`   Nicho: ${niche || 'general'}`);

  // Configuración por producto
  const features = obtenerFeatures(producto);
  const testimonios = obtenerTestimonios(producto);

  // Generar HTML
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${prodConfig.titulo}</title>
  <link rel="stylesheet" href="/styles/landing.css">
  <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
</head>
<body>
  <!-- HEADER -->
  <header class="header">
    <div class="header-content">
      <div class="logo">DealPulseHub</div>
      <nav>
        <a href="#features">Características</a>
        <a href="#testimonios">Testimonios</a>
        <a href="#precio">Precio</a>
      </nav>
    </div>
  </header>

  ${TEMPLATES.hero(prodConfig)}

  ${TEMPLATES.features(features)}

  <section id="testimonios">
    ${TEMPLATES.testimonios(testimonios)}
  </section>

  <section id="precio" class="pricing-section">
    <div class="pricing-container">
      <h2>Precio Especial (Tiempo Limitado)</h2>
      <div class="pricing-card">
        <div class="price-tag">$${prodConfig.precio}</div>
        <p class="price-description">Acceso completo + soporte</p>
        <button class="btn btn-primary btn-lg">
          ${prodConfig.boton_cta}
        </button>
      </div>
    </div>
  </section>

  ${TEMPLATES.cta(prodConfig)}

  <!-- FOOTER -->
  <footer class="footer">
    <p>&copy; 2024 DealPulseHub. Todos los derechos reservados.</p>
  </footer>

  <!-- ANALYTICS -->
  <script>
    // Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX'); // Reemplazar con tu ID
  </script>
</body>
</html>
  `;

  // Guardar archivo
  const outputDir = path.join(__dirname, '../landing-pages', producto, persona);
  const outputFile = path.join(outputDir, 'index.html');

  // Crear directorio si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, html);

  console.log(`\n✅ Landing page generada exitosamente!`);
  console.log(`   Ubicación: ${outputFile}`);
  console.log(`   URL: http://localhost:3000${outputFile.replace(__dirname, '')}`);

  return {
    success: true,
    ubicacion: outputFile,
    producto: prodConfig.nombre,
    persona: personaConfig.nombre,
    tiempo_produccion: prodConfig.tiempo_produccion
  };
}

/**
 * Obtiene features según el producto
 */
function obtenerFeatures(producto) {
  const features = {
    infoproducto: [
      { titulo: 'Módulos Completos', descripcion: 'Paso a paso desde 0 hasta $5k/mes' },
      { titulo: 'Soporte 24/7', descripcion: 'Acceso a comunidad privada + email support' },
      { titulo: 'Garantía 30 días', descripcion: 'Si no te gusta, dinero de vuelta 100%' },
      { titulo: 'Actualizaciones', descripcion: 'Acceso de por vida a nuevos contenidos' }
    ],
    agencia: [
      { titulo: 'Auditoría Inicial', descripcion: 'Análisis profundo de tu negocio' },
      { titulo: 'Estrategia Custom', descripcion: 'Plan personalizado de 90 días' },
      { titulo: 'Garantía de Resultados', descripcion: '50% en ventas o dinero atrás' },
      { titulo: 'Reporte Mensual', descripcion: 'Métrica s transparentes + optimizaciones' }
    ],
    templates: [
      { titulo: 'Templates Premium', descripcion: 'Designs profesionales listos para vender' },
      { titulo: 'Documentación', descripcion: 'Videos + guías de customización' },
      { titulo: 'Soporte Técnico', descripcion: 'Help desk para problemas de setup' },
      { titulo: 'Actualizaciones', descripcion: 'Nuevos templates cada mes' }
    ],
    coaching: [
      { titulo: 'Sesiones 1-on-1', descripcion: '8 sesiones/mes con el coach' },
      { titulo: 'Planificación Estratégica', descripcion: 'Roadmap de escalamiento personizado' },
      { titulo: 'Acceso 24/7', descripcion: 'WhatsApp directo para urgencias' },
      { titulo: 'Network Premium', descripcion: 'Acceso a comunidad de CEOs' }
    ]
  };

  return features[producto] || features.infoproducto;
}

/**
 * Obtiene testimonios según el producto
 */
function obtenerTestimonios(producto) {
  const testimonios = {
    infoproducto: [
      { autor: 'Carlos R.', texto: 'Pasé de $0 a $8k/mes en 3 meses. Increíble!', resultado: 'Ganó $8k/mes' },
      { autor: 'María G.', texto: 'El mejor curso que he tomado. Muy práctico y directo.', resultado: 'Escaló 5x' },
      { autor: 'Juan P.', texto: 'Esto cambió mi vida. Ahora trabajo desde casa.', resultado: 'Ingresos pasivos' }
    ],
    agencia: [
      { autor: 'Empresa XYZ', texto: 'Aumentamos ventas 60% en 90 días. Recomendado 100%.', resultado: 'ROI 300%' },
      { autor: 'PYME ABC', texto: 'Mejor decisión que pudimos haber tomado. Resultados garantizados.', resultado: 'Escaló 3x' }
    ],
    templates: [
      { autor: 'Diseñador 1', texto: 'Ahorro 40 horas por proyecto. Mis clientes aman los templates.', resultado: 'Ganó 3x/mes' },
      { autor: 'Diseñador 2', texto: 'Ingresos pasivos mientras duermo. Perfecto para freelancers.', resultado: 'Pasivo $2k/mes' }
    ],
    coaching: [
      { autor: 'CEO Tech', texto: 'Escalé de $50k a $200k/mes en 6 meses. Coach profesional.', resultado: 'Escaló 4x' },
      { autor: 'Founder SaaS', texto: 'La mentoría que necesitaba. Resultados comprobables.', resultado: 'Series A ready' }
    ]
  };

  return testimonios[producto] || testimonios.infoproducto;
}

/**
 * Imprime instrucciones de uso
 */
function printInstructions() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║   GENERADOR AUTOMÁTICO DE LANDING PAGES                       ║
╚════════════════════════════════════════════════════════════════╝

USAR:
  npm run generador-landing -- --producto=PRODUCTO --persona=PERSONA --niche=NICHE

PRODUCTOS DISPONIBLES:
  - infoproducto    (Curso online - $97)
  - agencia         (Marketing services - $2,500/mes)
  - templates       (WordPress themes - $29)
  - coaching        (1-on-1 premium - $1,500/mes)

PERSONAS DISPONIBLES:
  - carlos          (Emprendedor 25-45, LATAM)
  - maria           (PYME 35-55, LATAM urbano)
  - juan            (Diseñador 22-35, remoto)
  - roberto         (CEO 40-60, LATAM metro)

NICHES:
  - marketing-digital
  - saas-gtm
  - ecommerce
  - coaching-education
  - real-estate

EJEMPLOS:
  npm run generador-landing -- --producto=infoproducto --persona=carlos --niche=marketing-digital
  npm run generador-landing -- --producto=agencia --persona=maria --niche=saas-gtm
  npm run generador-landing -- --producto=templates --persona=juan

RESULTADO:
  ✅ Landing page HTML lista para publicar
  ✅ Componentes del Design System integrados
  ✅ Animaciones Lottie incluidas
  ✅ Copy optimizado con Russell Brunson framework
  ✅ Analytics tracking configurado
  ✅ Mobile responsive
  ✅ Ready para Facebook/Google Ads

OUTPUT:
  landing-pages/[producto]/[persona]/index.html

  `);
}

// ============================================================================
// EJECUCIÓN
// ============================================================================

const args = process.argv.slice(2);

if (!args.length || args.includes('--help')) {
  printInstructions();
  process.exit(0);
}

// Parsear argumentos
const config = {};
args.forEach(arg => {
  const [key, value] = arg.replace('--', '').split('=');
  config[key] = value;
});

// Validar y ejecutar
if (!config.producto) {
  console.error('❌ Falta --producto. Ver instrucciones con: npm run generador-landing -- --help');
  process.exit(1);
}

if (!config.persona) {
  console.error('❌ Falta --persona. Ver instrucciones con: npm run generador-landing -- --help');
  process.exit(1);
}

const resultado = generarLanding(config);

if (resultado.success) {
  console.log(`\n📊 Landing Page Creada:`);
  console.log(`   ✅ Producto: ${resultado.producto}`);
  console.log(`   ✅ Persona: ${resultado.persona}`);
  console.log(`   ✅ Ubicación: ${resultado.ubicacion}`);
  console.log(`\n🚀 Próximos pasos:`);
  console.log(`   1. Revisar landing page`);
  console.log(`   2. Actualizar copy si es necesario`);
  console.log(`   3. Descargar animaciones de LottieFiles`);
  console.log(`   4. Configurar formulario + email`);
  console.log(`   5. Publicar en Netlify/Vercel`);
}
