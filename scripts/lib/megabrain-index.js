#!/usr/bin/env node
/**
 * MEGABRAIN INDEX — funciones puras para leer AGENT-INDEX.yaml (Megabrain),
 * sin dependencias de red ni de una librería YAML.
 *
 * Decisión @architect (docs/ARCHITECTURE_MAP.md sección 4️⃣.1):
 *   1. El bloque `minds:` es la única sección relevante — el archivo también
 *      trae `conclave:` y `cargo:` después, que NO son "expertos" en el
 *      sentido de este puente y no deben incluirse. El parseo debe detenerse
 *      en la SIGUIENTE CLAVE DE NIVEL SUPERIOR (no específicamente en
 *      `conclave:` — cualquier clave a columna 0 cierra el bloque), porque
 *      el orden de secciones en el YAML no está garantizado.
 *   2. `path:` de cada entrada del índice es la fuente autoritativa de la
 *      ruta de un experto. La convención NOMBRE_MAYUS (id → carpeta) es solo
 *      fallback cuando el id no aparece indexado.
 *   3. Toda ruta resuelta (venga del índice o del fallback) debe validarse
 *      contenida dentro de `agents/persons/` antes de leer nada — el
 *      fallback deriva la ruta directamente del input del usuario, así que
 *      sin esta validación un identificador tipo `../../../etc/passwd`
 *      convierte el script en lectura arbitraria de archivos.
 *
 * Sin dependencias de librería YAML a propósito: la sección `minds:` tiene
 * una forma estable y acotada (lista de `- id / path / has_soul /
 * has_agent_md / status`), un parseo por líneas cubre el caso real sin
 * añadir una dependencia de producción nueva.
 *
 * Tests: scripts/lib/__tests__/megabrain-index.test.js
 */

const path = require('path');

/** Línea `minds:` a columna 0 (clave de nivel superior, no indentada). */
const MINDS_KEY_RE = /^minds:\s*$/;

/** Cualquier línea de clave YAML a columna 0 (ej. `conclave:`, `cargo:`, `totals:`). */
const TOP_LEVEL_KEY_RE = /^[A-Za-z0-9_-]+:/;

/**
 * Extrae el texto crudo del bloque `minds:` (sin la línea `minds:` misma),
 * deteniéndose en la siguiente clave de nivel superior — nunca asume que
 * `conclave:` es necesariamente la que sigue.
 *
 * @param {string} yamlText — contenido completo de AGENT-INDEX.yaml
 * @returns {string} texto del bloque (puede incluir líneas de comentario)
 */
function extractMindsBlock(yamlText) {
  const lines = String(yamlText).split(/\r?\n/);
  const startIdx = lines.findIndex((line) => MINDS_KEY_RE.test(line));
  if (startIdx === -1) return '';

  const blockLines = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (TOP_LEVEL_KEY_RE.test(lines[i])) break;
    blockLines.push(lines[i]);
  }
  return blockLines.join('\n');
}

/**
 * Parsea el bloque `minds:` a un Map(id → path). Ignora `has_soul`,
 * `has_agent_md`, `status` y cualquier línea de comentario — solo nos
 * interesa el par id/path para resolver la carpeta de un experto.
 *
 * @param {string} yamlText — contenido completo de AGENT-INDEX.yaml
 * @returns {Map<string,string>}
 */
function parseMindsEntries(yamlText) {
  const block = extractMindsBlock(yamlText);
  const entries = new Map();
  let currentId = null;

  for (const rawLine of block.split('\n')) {
    const idMatch = rawLine.match(/^\s*-\s*id:\s*(.+?)\s*$/);
    if (idMatch) {
      currentId = idMatch[1].trim();
      continue;
    }
    const pathMatch = rawLine.match(/^\s*path:\s*(.+?)\s*$/);
    if (pathMatch && currentId && !entries.has(currentId)) {
      entries.set(currentId, pathMatch[1].trim());
    }
  }

  return entries;
}

/** Convención de fallback: `alex-hormozi` → `ALEX_HORMOZI` (id → nombre de carpeta). */
function toConventionalFolder(identifier) {
  return String(identifier).trim().toUpperCase().replace(/-/g, '_');
}

/**
 * Resuelve la ruta relativa (dentro del repo Megabrain) para un identificador:
 * 1. Busca en el índice `minds:` por id exacto (case-insensitive).
 * 2. Si no está indexado, cae a la convención NOMBRE_MAYUS bajo agents/persons/.
 *
 * NOTA: esta función NO valida contención — eso es responsabilidad de
 * `isContainedIn()`, siempre después de resolver la ruta absoluta final.
 *
 * @param {string} identifier
 * @param {Map<string,string>} mindsIndex
 * @returns {{relPath: string, source: 'index'|'fallback'}}
 */
function resolveRelativePath(identifier, mindsIndex) {
  const normalized = String(identifier).trim().toLowerCase();

  for (const [id, relPath] of mindsIndex.entries()) {
    if (id.toLowerCase() === normalized) {
      return { relPath, source: 'index' };
    }
  }

  return {
    relPath: `agents/persons/${toConventionalFolder(identifier)}/`,
    source: 'fallback',
  };
}

/**
 * Contención de ruta: `candidateAbsPath` debe quedar DENTRO de `baseAbsDir`.
 * Previene path traversal (`../../../etc/passwd` vía el fallback de
 * convención, que deriva la ruta directamente del input del usuario).
 *
 * @param {string} baseAbsDir — directorio contenedor esperado (ya absoluto)
 * @param {string} candidateAbsPath — ruta a validar (ya absoluta)
 * @returns {boolean}
 */
function isContainedIn(baseAbsDir, candidateAbsPath) {
  const base = path.resolve(baseAbsDir) + path.sep;
  const candidate = path.resolve(candidateAbsPath) + path.sep;
  return candidate.startsWith(base);
}

/**
 * Resuelve la ruta base de Megabrain: `env.MEGABRAIN_PATH` tiene prioridad;
 * si no está seteada, cae al default documentado. Pura (no toca fs) — la
 * verificación de existencia real vive en el script (fs.existsSync es I/O).
 *
 * @param {NodeJS.ProcessEnv} env
 * @param {string} defaultPath
 * @returns {string} ruta absoluta resuelta (sin verificar que exista)
 */
function resolveMegabrainBase(env, defaultPath) {
  const configured = (env && env.MEGABRAIN_PATH) || defaultPath;
  return path.resolve(configured);
}

module.exports = {
  extractMindsBlock,
  parseMindsEntries,
  toConventionalFolder,
  resolveRelativePath,
  isContainedIn,
  resolveMegabrainBase,
};
