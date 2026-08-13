#!/usr/bin/env node
/**
 * PENPOT CLIENT — helper compartido de la API REST de Penpot.
 *
 * Extraído de scripts/penpot-extract.js para que penpot-audit.js y
 * penpot-variations.js no dupliquen la lectura de credenciales ni las
 * llamadas base. penpot-extract.js sigue funcionando igual (no se tocó su
 * lógica), este módulo solo centraliza lo nuevo.
 *
 * ⚠️ Sin verificar contra un workspace real en esta sesión: no hay `.env`
 * con PENPOT_API_KEY/PENPOT_WORKSPACE_ID configurado en este entorno, así
 * que `getFileData()` (que llama al comando `get-file`, no usado todavía por
 * ningún script del repo) no se probó end-to-end contra la API real. La
 * forma del payload de respuesta (`data.pagesIndex` vs `data['pages-index']`)
 * se maneja de forma defensiva (ver `normalizePagesIndex`) porque Penpot
 * expone sus datos internos en Clojure/transit y la key exacta que llega ya
 * serializada a JSON depende de la versión del backend. Antes de confiar en
 * `penpot-audit.js`/`penpot-variations.js` en producción, correr una vez con
 * credenciales reales y confirmar que `normalizePagesIndex` encuentra las
 * páginas (si no, ajustar aquí — un solo punto de cambio).
 *
 * Requisitos (.env):
 *   PENPOT_API_KEY       — token generado en Penpot → Settings → API Tokens
 *   PENPOT_WORKSPACE_ID  — id del team/workspace (visible en la URL del dashboard)
 */

require('dotenv').config();
const axios = require('axios');

const PENPOT_API_KEY = process.env.PENPOT_API_KEY;
const PENPOT_WORKSPACE_ID = process.env.PENPOT_WORKSPACE_ID;
const API_BASE = 'https://design.penpot.app/api/rpc/command';

function assertConfigured() {
  const missing = [];
  if (!PENPOT_API_KEY) missing.push('PENPOT_API_KEY');
  if (!PENPOT_WORKSPACE_ID) missing.push('PENPOT_WORKSPACE_ID');
  if (missing.length > 0) {
    console.error('❌ Falta configuración en .env:', missing.join(', '));
    console.error('   Detalle: docs/archive/FASE_1_START_AHORA.md (setup) +');
    console.error('   C:\\Users\\Oscar\\.claude\\rules\\PENPOT_MCP_PRODUCTION_PROTOCOL.md (uso real)');
    process.exit(1);
  }
}

async function rpc(command, body) {
  const { data } = await axios.post(`${API_BASE}/${command}`, body, {
    headers: { Authorization: `Token ${PENPOT_API_KEY}` },
  });
  return data;
}

function getTeamProjects() {
  return rpc('get-projects', { 'team-id': PENPOT_WORKSPACE_ID });
}

function getProjectFiles(projectId) {
  return rpc('get-project-files', { 'project-id': projectId });
}

/** Trae el árbol completo de un archivo (páginas + shapes + fills + texto). */
function getFileData(fileId) {
  return rpc('get-file', { id: fileId });
}

async function exportObjectAsPng(fileId, pageId, objectId, scale = 2) {
  const { data } = await axios.post(
    `${API_BASE}/export`,
    { exports: [{ 'file-id': fileId, 'page-id': pageId, 'object-id': objectId, type: 'png', scale }] },
    { headers: { Authorization: `Token ${PENPOT_API_KEY}` }, responseType: 'arraybuffer' }
  );
  return data;
}

/**
 * Penpot serializa `data` con distintas convenciones de key según versión/ruta
 * (camelCase vs kebab-case vs snake). Prueba las variantes conocidas en vez de
 * asumir una sola, y falla explícito si ninguna aparece (mejor que un objeto
 * vacío silencioso).
 */
function normalizePagesIndex(fileData) {
  const d = fileData?.data ?? fileData;
  const candidates = [d?.pagesIndex, d?.['pages-index'], d?.pages_index];
  const found = candidates.find((c) => c && typeof c === 'object');
  if (!found) {
    throw new Error(
      'No se encontró pagesIndex/pages-index/pages_index en la respuesta de get-file. ' +
      'Revisar la forma real del payload (ver nota al inicio de penpot-client.js) y ' +
      'ajustar normalizePagesIndex().'
    );
  }
  return found;
}

module.exports = {
  PENPOT_API_KEY,
  PENPOT_WORKSPACE_ID,
  API_BASE,
  assertConfigured,
  rpc,
  getTeamProjects,
  getProjectFiles,
  getFileData,
  exportObjectAsPng,
  normalizePagesIndex,
};
