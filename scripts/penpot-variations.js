#!/usr/bin/env node
/**
 * PENPOT VARIATIONS — genera un PLAN de variaciones A/B, no las aplica.
 *
 * Por qué un plan y no una escritura directa: la única forma de recolor que
 * ya se probó funcionando de verdad (clone + `storage.recolor`, ver
 * PENPOT_MCP_PRODUCTION_PROTOCOL.md sección 3.6) corre DENTRO de una sesión
 * interactiva de Penpot MCP (`execute_code`, Plugin API en vivo sobre la
 * pestaña abierta del navegador) — no existe una ruta de escritura vía API
 * REST cruda probada para este proyecto. Mutar el archivo real de diseño del
 * usuario por una ruta sin verificar es exactamente el tipo de acción
 * irreversible que no se automatiza sin confirmación explícita. Este script
 * en cambio:
 *   1. Lee (solo lectura) los fills realmente usados en cada board.
 *   2. Los cruza contra la paleta psicológica de DESIGN_TOKENS_VARIABLES_SYSTEM.md.
 *   3. Propone swaps con nombre (p.ej. "urgencia → confianza") y genera el
 *      snippet exacto de `storage.recolor(...)` listo para pegar en una
 *      sesión MCP real — el humano/agente decide si lo aplica.
 *
 * ⚠️ Igual que penpot-audit.js: la lectura vía API es best-effort, sin
 * verificar contra un workspace real en esta sesión (sin .env configurado).
 *
 * Uso:
 *   npm run penpot:variations
 *
 * Salida:
 *   design_specs/variations-plan.json
 */

const fs = require('fs');
const path = require('path');
const client = require('./lib/penpot-client');
const { flattenShapes } = require('./lib/penpot-shapes');

const OUTPUT_DIR = path.join(__dirname, '../design_specs');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'variations-plan.json');

/**
 * Paleta psicológica — copiada de
 * .claude/rules/DESIGN_TOKENS_VARIABLES_SYSTEM.md ("COLOR SYSTEM").
 * Cada entrada mapea un color base a su contraparte en otra categoría
 * psicológica, para proponer variantes con intención (no solo "otro color").
 */
const PSYCHOLOGY_SWAPS = [
  {
    name: 'urgencia → confianza',
    rationale: 'De presión de decisión (rojo) a autoridad/profesional (azul) — para audiencias donde urgencia se lee como poco confiable.',
    map: { '#ef4444': '#3b82f6', '#dc2626': '#4f46e5', '#f59e0b': '#0ea5e9' },
  },
  {
    name: 'confianza → urgencia',
    rationale: 'De azul/profesional a rojo/ámbar — para ofertas de tiempo limitado que hoy se ven demasiado calmadas.',
    map: { '#3b82f6': '#ef4444', '#4f46e5': '#dc2626', '#6366f1': '#f97316' },
  },
  {
    name: 'valor → premium',
    rationale: 'De verde (ahorro/ROI) a violeta (exclusividad) — para upsells donde el mensaje es "más", no "más barato".',
    map: { '#10b981': '#7c3aed', '#059669': '#a855f7' },
  },
];

function findMatchingSwap(usedColorsLower) {
  return PSYCHOLOGY_SWAPS
    .map((swap) => {
      const applicable = Object.keys(swap.map).filter((hex) => usedColorsLower.has(hex));
      return { swap, applicable };
    })
    .filter((x) => x.applicable.length > 0);
}

function buildMcpSnippet(boardVarName, applicableMap) {
  const mapLiteral = JSON.stringify(applicableMap, null, 2);
  return [
    `// Pegar en una sesión Penpot MCP (execute_code) con storage.recolor ya definido`,
    `// (ver PENPOT_MCP_PRODUCTION_PROTOCOL.md sección 3.6):`,
    `const clone = ${boardVarName}.clone();`,
    `${boardVarName}.parent.appendChild(clone);`,
    `clone.x = ${boardVarName}.x + ${boardVarName}.width + 50; clone.name = "${boardVarName} — variante";`,
    `storage.recolor(clone, ${mapLiteral});`,
  ].join('\n');
}

function planForFile(fileName, pagesIndex) {
  const shapes = flattenShapes(pagesIndex);
  const boards = shapes.filter((s) => s.type === 'board');
  const plan = [];

  for (const board of boards) {
    const boardShapes = shapes.filter((s) => s.pageId === board.pageId);
    const usedColors = new Set(
      boardShapes.flatMap((s) => (s.fills || []).map((f) => (f.fillColor || '').toLowerCase())).filter(Boolean)
    );
    const matches = findMatchingSwap(usedColors);
    for (const { swap, applicable } of matches) {
      const applicableMap = Object.fromEntries(applicable.map((hex) => [hex, swap.map[hex]]));
      plan.push({
        file: fileName,
        page: board.pageName,
        board: board.name,
        boardId: board.id,
        variant: swap.name,
        rationale: swap.rationale,
        recolorMap: applicableMap,
        mcpSnippet: buildMcpSnippet('board', applicableMap),
      });
    }
  }
  return plan;
}

async function main() {
  client.assertConfigured();
  console.log('🎨 PENPOT VARIATIONS — plan de A/B (no escribe en Penpot)\n');

  const allPlans = [];
  try {
    const projects = await client.getTeamProjects();
    for (const project of projects) {
      const files = await client.getProjectFiles(project.id);
      for (const file of files) {
        const fileData = await client.getFileData(file.id);
        const pagesIndex = client.normalizePagesIndex(fileData);
        allPlans.push(...planForFile(file.name, pagesIndex));
      }
    }
  } catch (error) {
    console.error('❌ Error generando el plan:', error.response?.data || error.message);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), count: allPlans.length, plans: allPlans }, null, 2));

  console.log(`✅ ${allPlans.length} variante(s) propuesta(s).`);
  console.log(`📝 Plan: ${OUTPUT_FILE}`);
  console.log('\nCada entrada trae su snippet de MCP listo para pegar y aplicar manualmente.');
}

main();
