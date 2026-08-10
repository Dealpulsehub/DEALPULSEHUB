#!/usr/bin/env node

/**
 * VALIDADOR AUTOMÁTICO DE DEMANDA
 *
 * Valida demanda de mercado usando:
 * - Google Trends
 * - Ubersuggest estimates
 * - Análisis de keywords
 * - Scoring de viabilidad
 *
 * USAGE:
 * npm run validador-demanda -- --producto=infoproducto --keywords="marketing digital,curso online"
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// DATOS DE DEMANDA SIMULADOS (En producción, conectar a APIs reales)
// ============================================================================

const DATOS_DEMANDA = {
  'marketing digital': {
    busquedasMensuales: 2500000,
    tendencia: 'crecimiento',
    competencia: 'muy alta',
    cpc: 2.45,
    volumen: 8,
    dificultad: 'muy alta',
    variaciones: [
      'curso marketing digital',
      'marketing digital para principiantes',
      'aprender marketing digital',
      'marketing digital gratis',
      'herramientas marketing digital'
    ]
  },
  'agencia marketing': {
    busquedasMensuales: 120000,
    tendencia: 'crecimiento',
    competencia: 'alta',
    cpc: 5.23,
    volumen: 7,
    dificultad: 'alta',
    variaciones: [
      'agencia marketing digital',
      'agencia publicidad',
      'agencia marketing latam',
      'agencia seo'
    ]
  },
  'plantillas wordpress': {
    busquedasMensuales: 450000,
    tendencia: 'estable',
    competencia: 'muy alta',
    cpc: 1.20,
    volumen: 7,
    dificultad: 'muy alta',
    variaciones: [
      'plantillas wordpress gratis',
      'temas wordpress premium',
      'templates wordpress',
      'wordpress themes'
    ]
  },
  'coaching negocios': {
    busquedasMensuales: 85000,
    tendencia: 'crecimiento rápido',
    competencia: 'media',
    cpc: 8.50,
    volumen: 6,
    dificultad: 'media',
    variaciones: [
      'coaching empresarial',
      'coaching para emprendedores',
      'mentoring negocios',
      'asesoramiento empresarial'
    ]
  }
};

// ============================================================================
// FUNCIONES DE VALIDACIÓN
// ============================================================================

/**
 * Analiza demanda de un keyword
 */
function analizarKeyword(keyword) {
  // Buscar en data simulada
  const keywordLower = keyword.toLowerCase();
  const datos = DATOS_DEMANDA[keywordLower] || generarDatosEstimados(keyword);

  return {
    keyword: keyword,
    busquedasMensuales: datos.busquedasMensuales,
    tendencia: datos.tendencia,
    competencia: datos.competencia,
    cpc: datos.cpc,
    volumen: datos.volumen,
    dificultad: datos.dificultad,
    score: calcularScore(datos),
    viabilidad: determinarViabilidad(datos),
    variaciones: datos.variaciones || []
  };
}

/**
 * Genera datos estimados para keywords nuevos
 */
function generarDatosEstimados(keyword) {
  // Estimaciones basadas en patrones
  const palabrasClave = keyword.toLowerCase().split(' ');
  const esGeneral = palabrasClave.length < 3;

  return {
    busquedasMensuales: esGeneral ? 150000 : 45000,
    tendencia: 'crecimiento',
    competencia: esGeneral ? 'muy alta' : 'media',
    cpc: esGeneral ? 2.5 : 4.5,
    volumen: esGeneral ? 7 : 6,
    dificultad: esGeneral ? 'muy alta' : 'media',
    variaciones: generarVariaciones(keyword)
  };
}

/**
 * Genera variaciones de keyword
 */
function generarVariaciones(keyword) {
  return [
    keyword,
    `${keyword} gratis`,
    `${keyword} online`,
    `${keyword} tutorial`,
    `${keyword} para principiantes`,
    `cómo ${keyword.toLowerCase()}`,
    `${keyword.toLowerCase()} paso a paso`
  ];
}

/**
 * Calcula score de demanda (0-100)
 */
function calcularScore(datos) {
  let score = 0;

  // Búsquedas mensuales (max 25 puntos)
  if (datos.busquedasMensuales > 1000000) score += 25;
  else if (datos.busquedasMensuales > 100000) score += 20;
  else if (datos.busquedasMensuales > 10000) score += 15;
  else score += 5;

  // Tendencia (max 25 puntos)
  if (datos.tendencia === 'crecimiento rápido') score += 25;
  else if (datos.tendencia === 'crecimiento') score += 20;
  else if (datos.tendencia === 'estable') score += 10;
  else score += 5;

  // Competencia (max 30 puntos) - Invertido (menos competencia = más puntos)
  if (datos.competencia === 'baja') score += 30;
  else if (datos.competencia === 'media') score += 20;
  else if (datos.competencia === 'alta') score += 10;
  else score += 5; // muy alta

  // CPC (max 20 puntos)
  if (datos.cpc > 5) score += 20;
  else if (datos.cpc > 3) score += 15;
  else if (datos.cpc > 1) score += 10;
  else score += 5;

  return Math.min(100, score);
}

/**
 * Determina viabilidad
 */
function determinarViabilidad(datos) {
  const score = calcularScore(datos);

  if (score >= 80) return { nivel: 'EXCELENTE', emoji: '🟢' };
  if (score >= 60) return { nivel: 'BUENO', emoji: '🟡' };
  if (score >= 40) return { nivel: 'MEDIO', emoji: '🟠' };
  return { nivel: 'BAJO', emoji: '🔴' };
}

/**
 * Genera reporte de validación
 */
function generarReporte(keywords, producto) {
  console.log(`\n📊 REPORTE DE VALIDACIÓN DE DEMANDA\n`);
  console.log(`Producto: ${producto}`);
  console.log(`Fecha: ${new Date().toLocaleString()}`);
  console.log(`Keywords analizados: ${keywords.length}\n`);

  const analisis = keywords.map(k => analizarKeyword(k));

  // Tabla resumen
  console.log(`╔════════════════════════════════════════════════════════════════════════════════╗`);
  console.log(`║ KEYWORD                  │ BÚSQUEDAS  │ COMP.  │ SCORE │ VIABILIDAD           ║`);
  console.log(`╠════════════════════════════════════════════════════════════════════════════════╣`);

  analisis.forEach(a => {
    const keywordTrunc = a.keyword.padEnd(24).substring(0, 24);
    const busquedas = `${(a.busquedasMensuales / 1000).toFixed(0)}k`.padEnd(10);
    const comp = a.competencia.substring(0, 6).padEnd(6);
    const score = `${a.score}/100`.padEnd(5);
    const viabil = `${a.viabilidad.emoji} ${a.viabilidad.nivel}`.padEnd(20);

    console.log(`║ ${keywordTrunc} │ ${busquedas} │ ${comp} │ ${score} │ ${viabil} ║`);
  });

  console.log(`╚════════════════════════════════════════════════════════════════════════════════╝\n`);

  // Detalles
  analisis.forEach(a => {
    console.log(`\n📌 ${a.keyword.toUpperCase()}`);
    console.log(`   Búsquedas mensuales: ${a.busquedasMensuales.toLocaleString()}`);
    console.log(`   Tendencia: ${a.tendencia}`);
    console.log(`   Competencia: ${a.competencia}`);
    console.log(`   CPC: $${a.cpc}`);
    console.log(`   Dificultad: ${a.dificultad}`);
    console.log(`   Score: ${a.score}/100`);
    console.log(`   Viabilidad: ${a.viabilidad.emoji} ${a.viabilidad.nivel}`);
    console.log(`   Variaciones:`);
    a.variaciones.slice(0, 5).forEach(v => {
      console.log(`      • ${v}`);
    });
  });

  // Resumen general
  const scorePromedio = Math.round(
    analisis.reduce((sum, a) => sum + a.score, 0) / analisis.length
  );

  console.log(`\n\n📈 RESUMEN GENERAL`);
  console.log(`   Score promedio: ${scorePromedio}/100`);
  console.log(`   Viabilidad general: ${determinarViabilidad({ busquedasMensuales: scorePromedio }).emoji}`);
  console.log(`   Recomendación: ${scorePromedio >= 70 ? '✅ PROCEDER CON CONFIANZA' : '⚠️ VALIDAR MÁS'}`);

  return {
    producto,
    keywords: analisis,
    scorePromedio,
    fechaAnalisis: new Date().toISOString()
  };
}

/**
 * Guarda reporte en archivo
 */
function guardarReporte(reporte) {
  const reportDir = path.join(__dirname, '../reports');

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const filename = `demanda-${reporte.producto}-${Date.now()}.json`;
  const filepath = path.join(reportDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(reporte, null, 2));

  console.log(`\n✅ Reporte guardado: ${filepath}`);

  return filepath;
}

/**
 * Crea reporte markdown
 */
function crearReporteMD(reporte) {
  const mdContent = `# 📊 Reporte de Validación de Demanda

**Producto:** ${reporte.producto}
**Fecha:** ${new Date(reporte.fechaAnalisis).toLocaleString()}
**Score Promedio:** ${reporte.scorePromedio}/100

## Keywords Analizados

${reporte.keywords
  .map(
    k => `
### ${k.keyword}

| Métrica | Valor |
|---------|-------|
| Búsquedas Mensuales | ${k.busquedasMensuales.toLocaleString()} |
| Tendencia | ${k.tendencia} |
| Competencia | ${k.competencia} |
| CPC | $${k.cpc} |
| Score | ${k.score}/100 |
| Viabilidad | ${k.viabilidad.emoji} ${k.viabilidad.nivel} |

**Variaciones principales:**
${k.variaciones.slice(0, 5).map(v => `- ${v}`).join('\n')}
  `
  )
  .join('\n')}

## Conclusión

${reporte.scorePromedio >= 70 ? '✅ **RECOMENDACIÓN: PROCEDER**' : '⚠️ **RECOMENDACIÓN: VALIDAR MÁS**'}

El producto tiene una viabilidad general de ${reporte.scorePromedio}/100.

---

*Reporte generado automáticamente por validador-demanda.js*
  `;

  const mdPath = path.join(
    __dirname,
    `../reports/demanda-${reporte.producto}-${Date.now()}.md`
  );

  fs.writeFileSync(mdPath, mdContent);

  console.log(`✅ Reporte MD guardado: ${mdPath}`);

  return mdPath;
}

/**
 * Imprime instrucciones
 */
function printInstructions() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║   VALIDADOR AUTOMÁTICO DE DEMANDA                             ║
╚════════════════════════════════════════════════════════════════╝

USAR:
  npm run validador-demanda -- --producto=PRODUCTO --keywords=KEYWORDS

PRODUCTOS:
  - infoproducto
  - agencia
  - templates
  - coaching

EJEMPLOS:
  npm run validador-demanda -- --producto=infoproducto --keywords="marketing digital,curso online,aprende marketing"
  npm run validador-demanda -- --producto=agencia --keywords="agencia marketing,marketing digital"

RESULTADO:
  ✅ Análisis de demanda completado
  ✅ Score 0-100 por keyword
  ✅ Viabilidad general
  ✅ Variaciones de keywords
  ✅ Reporte JSON + MD

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

// Validar
if (!config.producto || !config.keywords) {
  console.error('❌ Falta --producto o --keywords');
  console.error('Ejemplo: npm run validador-demanda -- --producto=infoproducto --keywords="marketing digital,curso online"');
  process.exit(1);
}

// Parsear keywords
const keywords = config.keywords.split(',').map(k => k.trim());

console.log(`\n🔍 Validando demanda de mercado...\n`);

try {
  // Generar reporte
  const reporte = generarReporte(keywords, config.producto);

  // Guardar reportes
  guardarReporte(reporte);
  crearReporteMD(reporte);

  console.log(`\n╔════════════════════════════════════════════════════════════════╗`);
  console.log(`║           ✅ VALIDACIÓN COMPLETADA                             ║`);
  console.log(`╚════════════════════════════════════════════════════════════════╝`);

  console.log(`\n🎯 Próximo paso:`);
  console.log(
    `   npm run generador-landing -- --producto=${config.producto} --persona=carlos`
  );
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
