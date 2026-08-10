#!/usr/bin/env node

/**
 * RESOURCE SELECTOR AUTO - Selección Automática de Recursos por Buyer Persona
 *
 * Dado un buyer persona, recomienda automáticamente:
 * - Tipografías
 * - Paletas de colores
 * - Estilos de botones CTA
 * - Imágenes apropiadas
 * - Animaciones
 * - Iconos
 *
 * USAGE:
 * npm run resource-selector -- --buyer=carlos --producto=infoproducto
 * npm run resource-selector -- --buyer=maria --producto=agencia
 * npm run resource-selector -- --buyer=roberto --producto=coaching
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// MAPEO: BUYER PERSONA → RECURSOS
// ============================================================================

const BUYER_RESOURCE_MAP = {
  carlos: {
    nombre: 'Carlos - Emprendedor Hustler',
    perfil: 'Joven, energético, busca resultados rápidos',

    tipografias: {
      primaria: { nombre: 'Inter', peso: 600, tamaño: '16px', descripcion: 'Moderna, limpia, confianza' },
      secundaria: { nombre: 'Roboto', peso: 400, tamaño: '14px', descripcion: 'Accesible, profesional' },
      titulos: { nombre: 'Poppins', peso: 700, tamaño: '32px', descripcion: 'Audaz, memorable' }
    },

    colores: {
      primario: '#6366f1',
      secundario: '#ec4899',
      acentos: '#f59e0b',
      fondo: '#ffffff',
      texto: '#1f2937',
      descripcion: 'Vibrante, energética, moderna'
    },

    botones: {
      cta: {
        estilo: 'filled-gradient',
        gradiente: 'from-indigo-500 to-pink-500',
        padding: '14px 28px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 600,
        sombra: 'shadow-lg',
        hover: 'scale-105',
        descripcion: 'Grande, vibrante, urgente'
      },
      secundario: {
        estilo: 'outline',
        color: '#6366f1',
        padding: '12px 24px',
        borderRadius: '6px',
        borderWidth: '2px'
      }
    },

    imagenes: {
      testimonios: 'profesionales jóvenes exitosos',
      heroes: 'computadora, startup, éxito',
      busqueda: 'professional entrepreneur success startup'
    },

    animaciones: {
      hero: 'data-loading, rocket-launch',
      transiciones: 'fast (200-300ms)',
      hover: 'subtle scale'
    },

    iconos: {
      estilo: 'feather-light',
      tamaño: '24px',
      peso: 'thin'
    }
  },

  maria: {
    nombre: 'María - Dueña de PYME',
    perfil: 'Ejecutiva, seria, busca resultados probados',

    tipografias: {
      primaria: { nombre: 'Segoe UI', peso: 400, tamaño: '16px', descripcion: 'Corporativa, confiable' },
      secundaria: { nombre: 'Open Sans', peso: 400, tamaño: '14px', descripcion: 'Profesional, clara' },
      titulos: { nombre: 'Montserrat', peso: 700, tamaño: '28px', descripcion: 'Seria, establecida' }
    },

    colores: {
      primario: '#1e40af',
      secundario: '#0ea5e9',
      acentos: '#059669',
      fondo: '#f8fafc',
      texto: '#0f172a',
      descripcion: 'Azul corporativo, confianza, crecimiento'
    },

    botones: {
      cta: {
        estilo: 'filled-solid',
        color: '#1e40af',
        padding: '12px 24px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 500,
        sombra: 'shadow-md',
        hover: 'opacity-90',
        descripcion: 'Profesional, serio, confiable'
      },
      secundario: {
        estilo: 'text-link',
        color: '#0ea5e9',
        padding: '0px'
      }
    },

    imagenes: {
      testimonios: 'ejecutivas profesionales con certificados',
      heroes: 'gráficos de crecimiento, equipo en reunión',
      busqueda: 'professional business team meeting success metrics'
    },

    animaciones: {
      hero: 'chart-rise, handshake',
      transiciones: 'normal (400-600ms)',
      hover: 'minimal opacity'
    },

    iconos: {
      estilo: 'feather-regular',
      tamaño: '20px',
      peso: 'medium'
    }
  },

  juan: {
    nombre: 'Juan - Diseñador Freelancer',
    perfil: 'Creativo, minimalista, busca elegancia',

    tipografias: {
      primaria: { nombre: 'Helvetica Neue', peso: 300, tamaño: '16px', descripcion: 'Minimalista, elegante' },
      secundaria: { nombre: 'Lato', peso: 300, tamaño: '14px', descripcion: 'Limpia, moderna' },
      titulos: { nombre: 'Playfair Display', peso: 700, tamaño: '36px', descripcion: 'Sofisticada, artística' }
    },

    colores: {
      primario: '#111827',
      secundario: '#6b7280',
      acentos: '#dc2626',
      fondo: '#ffffff',
      texto: '#1f2937',
      descripcion: 'Minimalista, monocromática, elegante'
    },

    botones: {
      cta: {
        estilo: 'minimal-border',
        color: 'transparent',
        borderColor: '#111827',
        padding: '10px 20px',
        borderRadius: '2px',
        fontSize: '12px',
        fontWeight: 300,
        sombra: 'none',
        hover: 'invert',
        descripcion: 'Sutile, elegante, minimalista'
      },
      secundario: {
        estilo: 'ghost-subtle',
        color: '#6b7280',
        padding: '8px 16px'
      }
    },

    imagenes: {
      testimonios: 'creadores con portafolios, trabajo fino',
      heroes: 'diseño, laptop con trabajo creativo',
      busqueda: 'creative designer portfolio modern minimal'
    },

    animaciones: {
      hero: 'fade-in smooth',
      transiciones: 'slow (800-1200ms)',
      hover: 'subtle slide'
    },

    iconos: {
      estilo: 'feather-ultralight',
      tamaño: '18px',
      peso: 'light'
    }
  },

  roberto: {
    nombre: 'Roberto - Ejecutivo Ambicioso',
    perfil: 'Premium, exclusivo, busca poder y estatus',

    tipografias: {
      primaria: { nombre: 'Poppins', peso: 400, tamaño: '16px', descripcion: 'Moderna, premium' },
      secundaria: { nombre: 'Inter', peso: 300, tamaño: '14px', descripcion: 'Limpia, ejecutiva' },
      titulos: { nombre: 'Bodoni Moda', peso: 700, tamaño: '40px', descripcion: 'Lujo, poder, elegancia' }
    },

    colores: {
      primario: '#000000',
      secundario: '#d4af37',
      acentos: '#f59e0b',
      fondo: '#ffffff',
      texto: '#1f2937',
      descripcion: 'Premium dorado y negro, lujo extremo'
    },

    botones: {
      cta: {
        estilo: 'luxury-gradient',
        gradiente: 'from-black via-gray-800 to-gold',
        padding: '16px 32px',
        borderRadius: '0px',
        fontSize: '14px',
        fontWeight: 600,
        sombra: 'shadow-2xl',
        hover: 'shadow-gold',
        descripcion: 'Ejecutivo, exclusivo, premium'
      },
      secundario: {
        estilo: 'gold-text',
        color: '#d4af37',
        padding: '0px',
        textDecoration: 'underline'
      }
    },

    imagenes: {
      testimonios: 'CEOs millonarios, ejecutivos de lujo',
      heroes: 'oficinas premium, yates, exclusividad',
      busqueda: 'luxury executive CEO office private jet exclusive'
    },

    animaciones: {
      hero: 'trophy-win, sophisticated fade',
      transiciones: 'very-slow (1200-1600ms)',
      hover: 'refined scale'
    },

    iconos: {
      estilo: 'feather-luxury',
      tamaño: '22px',
      peso: 'bold'
    }
  }
};

// ============================================================================
// RECOMENDACIONES AUTOMÁTICAS
// ============================================================================

/**
 * Recomienda recursos completos para un buyer persona
 */
function recommendResourcesForBuyer(buyerName) {
  console.log(`\n🎯 RECOMENDACIÓN DE RECURSOS AUTOMÁTICA:\n`);
  console.log(`Buyer Persona: ${buyerName}\n`);

  const buyer = BUYER_RESOURCE_MAP[buyerName.toLowerCase()];

  if (!buyer) {
    console.error(`❌ Buyer persona no encontrado: ${buyerName}`);
    console.log(`Disponibles: ${Object.keys(BUYER_RESOURCE_MAP).join(', ')}`);
    return null;
  }

  console.log(`═══════════════════════════════════════════════════════════════`);
  console.log(`NOMBRE: ${buyer.nombre}`);
  console.log(`PERFIL: ${buyer.perfil}`);
  console.log(`═══════════════════════════════════════════════════════════════\n`);

  // Tipografías
  console.log(`📝 TIPOGRAFÍAS RECOMENDADAS:`);
  Object.entries(buyer.tipografias).forEach(([tipo, font]) => {
    console.log(`   ${tipo.toUpperCase()}`);
    console.log(`   ├─ Fuente: ${font.nombre} (Peso: ${font.peso})`);
    console.log(`   ├─ Tamaño: ${font.tamaño}`);
    console.log(`   └─ Razón: ${font.descripcion}\n`);
  });

  // Colores
  console.log(`🎨 PALETA DE COLORES:`);
  console.log(`   Primario: ${buyer.colores.primario} (${buyer.colores.descripcion})`);
  console.log(`   Secundario: ${buyer.colores.secundario}`);
  console.log(`   Acentos: ${buyer.colores.acentos}`);
  console.log(`   Fondo: ${buyer.colores.fondo}`);
  console.log(`   Texto: ${buyer.colores.texto}\n`);

  // Botones
  console.log(`🔘 BOTONES CTA:`);
  console.log(`   Estilo: ${buyer.botones.cta.estilo}`);
  console.log(`   Padding: ${buyer.botones.cta.padding}`);
  console.log(`   Border Radius: ${buyer.botones.cta.borderRadius}`);
  console.log(`   Hover: ${buyer.botones.cta.hover}`);
  console.log(`   Descripción: ${buyer.botones.cta.descripcion}\n`);

  // Imágenes
  console.log(`🖼️ IMÁGENES:`);
  console.log(`   Testimonios: ${buyer.imagenes.testimonios}`);
  console.log(`   Heroes: ${buyer.imagenes.heroes}`);
  console.log(`   Búsqueda sugerida: "${buyer.imagenes.busqueda}"\n`);

  // Animaciones
  console.log(`✨ ANIMACIONES:`);
  console.log(`   Hero: ${buyer.animaciones.hero}`);
  console.log(`   Transiciones: ${buyer.animaciones.transiciones}`);
  console.log(`   Hover effects: ${buyer.animaciones.hover}\n`);

  // Iconos
  console.log(`🎯 ICONOS:`);
  console.log(`   Estilo: ${buyer.iconos.estilo}`);
  console.log(`   Tamaño: ${buyer.iconos.tamaño}`);
  console.log(`   Peso: ${buyer.iconos.peso}\n`);

  return buyer;
}

/**
 * Genera archivo de recomendación en JSON
 */
function generateRecommendationFile(buyer) {
  const timestamp = new Date().toISOString();
  const filename = `${buyer.toLowerCase()}-resources-${Date.now()}.json`;
  const filepath = path.join(path.dirname(__dirname), 'reports', filename);

  const recommendation = {
    timestamp,
    buyer: buyer,
    resources: BUYER_RESOURCE_MAP[buyer.toLowerCase()],
    generatedFor: 'landing-page-design',
    implementationSteps: [
      '1. Descargar tipografías recomendadas de Google Fonts',
      '2. Crear paleta de colores en proyecto de diseño',
      '3. Descargar imágenes usando búsqueda sugerida en Unsplash',
      '4. Seleccionar animaciones de LottieFiles',
      '5. Aplicar estilos de botones CTA exactos',
      '6. Usar iconos Feather del peso especificado',
      '7. Validar contrast ratio WCAG AA en todos los textos'
    ]
  };

  if (!fs.existsSync(path.dirname(filepath))) {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
  }

  fs.writeFileSync(filepath, JSON.stringify(recommendation, null, 2));

  console.log(`\n✅ Recomendación guardada en: ${filepath}`);
  return filepath;
}

/**
 * Imprime instrucciones
 */
function printInstructions() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║   RESOURCE SELECTOR AUTO - Selección Automática por Buyer     ║
╚════════════════════════════════════════════════════════════════╝

USAR:

Recomendar recursos para un buyer:
  npm run resource-selector -- --buyer=carlos
  npm run resource-selector -- --buyer=maria
  npm run resource-selector -- --buyer=juan
  npm run resource-selector -- --buyer=roberto

Generar archivo de recomendación (JSON):
  npm run resource-selector -- --buyer=maria --generate=true

Listar todos los buyers disponibles:
  npm run resource-selector -- --action=list-buyers

BUYERS DISPONIBLES:

✅ carlos   - Emprendedor Hustler (Joven, energético)
✅ maria    - Dueña de PYME (Profesional, seria)
✅ juan     - Diseñador Freelancer (Creativo, minimalista)
✅ roberto  - Ejecutivo Premium (Lujo, poder)

RECOMENDACIONES AUTOMÁTICAS:

Cada buyer recibe:
├─ 3 tipografías específicas (primaria, secundaria, títulos)
├─ Paleta de 5 colores (primario, secundario, acentos, fondo, texto)
├─ Estilo de botón CTA personalizado
├─ Búsqueda sugerida de imágenes
├─ Animaciones recomendadas
└─ Estilos de iconos

INTEGRACIÓN:

1. Auditor recomiendan buyer persona
2. Selector genera recomendaciones automáticas
3. Generador crea landing con recursos exactos
4. Propuesta muestra mockups con estilos aplicados

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

const config = {};
args.forEach(arg => {
  const [key, value] = arg.replace('--', '').split('=');
  config[key] = value;
});

try {
  if (config.action === 'list-buyers') {
    console.log(`\n👥 BUYERS DISPONIBLES:\n`);
    Object.entries(BUYER_RESOURCE_MAP).forEach(([key, buyer]) => {
      console.log(`✅ ${key.padEnd(10)} - ${buyer.nombre}`);
    });
    console.log();
  } else if (config.buyer) {
    const recommendation = recommendResourcesForBuyer(config.buyer);

    if (recommendation && config.generate === 'true') {
      generateRecommendationFile(config.buyer);
    }
  } else {
    console.error('❌ Falta --buyer o --action');
    printInstructions();
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

module.exports = {
  BUYER_RESOURCE_MAP,
  recommendResourcesForBuyer,
  generateRecommendationFile
};
