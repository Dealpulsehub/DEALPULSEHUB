#!/usr/bin/env node
/**
 * PENPOT AUDIT — neuro-auditoría WCAG real, como script versionado.
 *
 * Antes: la única auditoría de contraste que de verdad corrió (2026-08-07,
 * 8 boards, encontró fallas reales) vivía como snippet pegado en una sesión
 * interactiva de Penpot MCP (`execute_code`) — no quedaba en el repo, no se
 * podía re-correr sin reabrir Penpot y repegar el código a mano. Este script
 * hace lo mismo contra la API REST de Penpot, versionado y reproducible.
 *
 * ⚠️ La parte de red (`getFileData` → `flattenShapes`) es best-effort, sin
 * verificar contra un workspace real en esta sesión (no hay .env con
 * credenciales configurado en este entorno). La matemática de contraste
 * (scripts/lib/wcag-contrast.js) y la geometría de contención
 * (scripts/lib/penpot-shapes.js) sí están cubiertas por tests reales — ver
 * npm run test:scripts.
 *
 * Uso:
 *   npm run penpot:audit
 *
 * Salida:
 *   design_specs/audit-report.json
 */

const fs = require('fs');
const path = require('path');
const client = require('./lib/penpot-client');
const { flattenShapes, findBackgroundFor } = require('./lib/penpot-shapes');
const { evaluateContrast } = require('./lib/wcag-contrast');

const OUTPUT_DIR = path.join(__dirname, '../design_specs');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'audit-report.json');

function auditFile(fileId, fileName, pagesIndex) {
  const shapes = flattenShapes(pagesIndex);
  const texts = shapes.filter((s) => s.type === 'text');
  const results = texts.map((t) => {
    const bg = findBackgroundFor(t, shapes);
    const style = t.textStyle || { fontSize: 16, fontWeight: 400, assumed: true };
    const textFill = t.fills?.[0]?.fillColor || '#000000';
    const evalResult = evaluateContrast(textFill, bg.fillColor, style.fontSize, style.fontWeight);
    return {
      file: fileName,
      fileId,
      page: t.pageName,
      shape: t.name,
      shapeId: t.id,
      textColor: textFill,
      backgroundColor: bg.fillColor,
      backgroundSource: bg.source,
      backgroundAssumed: bg.assumed,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      styleAssumed: !!style.assumed,
      ...evalResult,
    };
  });
  return results;
}

async function main() {
  client.assertConfigured();
  console.log('🔎 PENPOT AUDIT — neuro-auditoría WCAG\n');

  const allResults = [];
  try {
    const projects = await client.getTeamProjects();
    for (const project of projects) {
      const files = await client.getProjectFiles(project.id);
      for (const file of files) {
        console.log(`📄 Auditando: ${project.name} / ${file.name}`);
        const fileData = await client.getFileData(file.id);
        const pagesIndex = client.normalizePagesIndex(fileData);
        allResults.push(...auditFile(file.id, file.name, pagesIndex));
      }
    }
  } catch (error) {
    console.error('❌ Error auditando:', error.response?.data || error.message);
    console.error('   (¿Primera vez corriendo este script? Ver advertencia al inicio del archivo:');
    console.error('    la forma del payload de get-file no está verificada contra un workspace real.)');
    process.exit(1);
  }

  const pass = allResults.filter((r) => r.pass).length;
  const fail = allResults.filter((r) => !r.pass).length;
  const assumed = allResults.filter((r) => r.backgroundAssumed || r.styleAssumed).length;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify({ generatedAt: new Date().toISOString(), summary: { pass, fail, total: allResults.length, assumed }, results: allResults }, null, 2)
  );

  console.log(`\n✅ Pasan: ${pass}  ❌ Fallan: ${fail}  ⚠️ Con datos asumidos (revisar a mano): ${assumed}`);
  console.log(`📝 Reporte: ${OUTPUT_FILE}`);

  if (fail > 0) {
    console.log('\nFallas de contraste:');
    for (const r of allResults.filter((x) => !x.pass)) {
      console.log(`  - [${r.file} / ${r.page} / ${r.shape}] ${r.textColor} sobre ${r.backgroundColor} (${r.backgroundSource || 'fondo asumido'}) → ${r.ratio}:1, necesita ${r.threshold}:1`);
    }
  }
}

main();
