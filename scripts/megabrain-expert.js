#!/usr/bin/env node
/**
 * MEGABRAIN EXPERT — puente de solo lectura a los "minds" (expertos) del
 * repositorio hermano Megabrain. Consulta puntual bajo demanda, NO un quinto
 * sistema de DealPulseHub — ver docs/ARCHITECTURE_MAP.md sección 4️⃣.1
 * (decisión @architect, 2026-08-13) para el diseño completo y su rationale.
 *
 * Reglas de acoplamiento (no negociables, ver 4️⃣.1):
 *   - Una sola dirección, SOLO LECTURA. Nunca escribe en Megabrain/.
 *   - Dependencia OPCIONAL: si Megabrain no está en este equipo, este script
 *     falla limpio y NADA MÁS del repo se rompe.
 *   - Prohibido en cualquier ruta automática: no entra en
 *     .github/workflows/ci.yml, npm run build/test/prepublish/penpot:pipeline.
 *     Solo invocación manual.
 *   - Prohibido vendorizar: nunca copiar AGENT.md/SOUL.md a este repo (ni
 *     como caché commiteada, ni como submódulo). Megabrain es la única
 *     fuente de verdad — este script lee directo, cada vez.
 *
 * Requisitos (.env):
 *   MEGABRAIN_PATH — ruta absoluta al repo Megabrain en este equipo.
 *     Si no está seteada, se usa el default documentado abajo (ruta real del
 *     repo hermano en la máquina donde se construyó este script). El repo no
 *     tiene .env.example (ver cómo scripts/penpot-extract.js documenta
 *     PENPOT_API_KEY/PENPOT_WORKSPACE_ID de la misma forma), así que la
 *     variable se documenta aquí, en el header.
 *
 * Uso:
 *   npm run megabrain:expert -- alex-hormozi
 *   node scripts/megabrain-expert.js alex-hormozi
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
  parseMindsEntries,
  resolveRelativePath,
  isContainedIn,
  resolveMegabrainBase,
} = require('./lib/megabrain-index');

/** Default documentado — ver nota "Requisitos (.env)" arriba. Siempre cede
 *  ante MEGABRAIN_PATH si está seteada (nunca hardcodeado SIN fallback a
 *  la env var — ver docs/ARCHITECTURE_MAP.md 4️⃣.1). */
const DEFAULT_MEGABRAIN_PATH = 'C:\\Users\\Oscar\\Desktop\\Megabrain';

function assertConfigured(basePath) {
  if (!fs.existsSync(basePath)) {
    console.error('❌ No se encontró el repo Megabrain en la ruta configurada.');
    console.error('');
    console.error(`   Ruta buscada: ${basePath}`);
    console.error('');
    console.error('   Pasos:');
    console.error('   1. Confirma que el repo Megabrain existe en este equipo.');
    console.error('   2. Si vive en otra ruta, añade a .env:');
    console.error('        MEGABRAIN_PATH=C:\\ruta\\a\\Megabrain');
    console.error('   3. Este script es una dependencia OPCIONAL — sin Megabrain');
    console.error('      instalado, el resto del repo funciona con normalidad.');
    console.error('');
    console.error('   Detalle: docs/ARCHITECTURE_MAP.md sección 4️⃣.1');
    process.exit(1);
  }
}

function loadMindsIndex(basePath) {
  const indexPath = path.join(basePath, 'agents', 'AGENT-INDEX.yaml');
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ No se encontró el índice de expertos: ${indexPath}`);
    console.error('   ¿La estructura de Megabrain cambió? Revisa docs/ARCHITECTURE_MAP.md 4️⃣.1');
    process.exit(1);
  }
  const yamlText = fs.readFileSync(indexPath, 'utf-8');
  return parseMindsEntries(yamlText);
}

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

function main() {
  const identifier = process.argv[2];
  if (!identifier || !identifier.trim()) {
    console.error('Uso: node scripts/megabrain-expert.js <id-experto>');
    console.error('Ejemplo: node scripts/megabrain-expert.js alex-hormozi');
    console.error('(id tal como aparece en Megabrain/agents/AGENT-INDEX.yaml, bloque minds:)');
    process.exit(1);
  }

  const basePath = resolveMegabrainBase(process.env, DEFAULT_MEGABRAIN_PATH);
  assertConfigured(basePath);

  const mindsIndex = loadMindsIndex(basePath);
  const personsBase = path.join(basePath, 'agents', 'persons');
  const { relPath, source } = resolveRelativePath(identifier, mindsIndex);
  const absPath = path.resolve(basePath, relPath);

  if (!isContainedIn(personsBase, absPath)) {
    console.error('❌ Ruta resuelta fuera de agents/persons/ — rechazada por seguridad.');
    console.error(`   Identificador: ${identifier}`);
    process.exit(1);
  }

  if (!fs.existsSync(absPath)) {
    console.error(`❌ No se encontró carpeta de experto para "${identifier}".`);
    console.error(`   Ruta esperada (${source === 'index' ? 'del índice' : 'por convención NOMBRE_MAYUS'}): ${absPath}`);
    if (source === 'fallback') {
      console.error('   El id no está indexado en AGENT-INDEX.yaml y el nombre no resolvió por convención.');
    }
    process.exit(1);
  }

  const agentMdPath = path.join(absPath, 'AGENT.md');
  const soulMdPath = path.join(absPath, 'SOUL.md');
  const agentMd = readIfExists(agentMdPath);
  const soulMd = readIfExists(soulMdPath);

  console.log(`=== MEGABRAIN EXPERT: ${identifier} ===`);
  console.log(`Ruta: ${absPath}`);
  console.log(`Origen de la ruta: ${source === 'index' ? 'AGENT-INDEX.yaml' : 'convención NOMBRE_MAYUS (fallback)'}`);
  console.log('');

  if (agentMd) {
    console.log(`--- AGENT.md (${agentMdPath}) ---`);
    console.log(agentMd);
    console.log('');
  } else {
    console.warn(`⚠️ AVISO: no se encontró AGENT.md en ${agentMdPath}`);
    console.warn('   (el índice puede estar desincronizado del disco — ver comentario en AGENT-INDEX.yaml)');
  }

  if (soulMd) {
    console.log(`--- SOUL.md (${soulMdPath}) ---`);
    console.log(soulMd);
    console.log('');
  } else {
    console.warn(`⚠️ AVISO: no se encontró SOUL.md en ${soulMdPath}`);
    console.warn('   (el índice puede estar desincronizado del disco — ver comentario en AGENT-INDEX.yaml)');
  }

  if (!agentMd && !soulMd) {
    console.warn(`⚠️ AVISO: ni AGENT.md ni SOUL.md encontrados para "${identifier}". La carpeta existe pero está vacía o incompleta.`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  DEFAULT_MEGABRAIN_PATH,
  assertConfigured,
  loadMindsIndex,
  readIfExists,
};
