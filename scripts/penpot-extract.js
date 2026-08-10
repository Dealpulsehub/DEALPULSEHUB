#!/usr/bin/env node
/**
 * PENPOT EXTRACTOR — Fase 1 (DealPulseHub / División Creativa)
 *
 * Extrae mockups del workspace de Penpot y los exporta a
 * design_assets/ (PNG) para handoff a @dev.
 *
 * Requisitos (.env):
 *   PENPOT_API_KEY       — token generado en Penpot → Settings → API Tokens
 *   PENPOT_WORKSPACE_ID  — id del team/workspace (visible en la URL del dashboard)
 *
 * Uso:
 *   npm run penpot:extract
 *
 * Referencia de diseño: .claude/rules/PENPOT_AUTOMATION_SYSTEM_COMPLETE.md
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PENPOT_API_KEY = process.env.PENPOT_API_KEY;
const PENPOT_WORKSPACE_ID = process.env.PENPOT_WORKSPACE_ID;
const API_BASE = 'https://design.penpot.app/api/rpc/command';
const OUTPUT_DIR = path.join(__dirname, '../design_assets');

function assertConfigured() {
  const missing = [];
  if (!PENPOT_API_KEY) missing.push('PENPOT_API_KEY');
  if (!PENPOT_WORKSPACE_ID) missing.push('PENPOT_WORKSPACE_ID');

  if (missing.length > 0) {
    console.error('❌ Falta configuración en .env:', missing.join(', '));
    console.error('');
    console.error('   Pasos (Fase 1 — hacer una sola vez, manual):');
    console.error('   1. Sign up en https://app.penpot.app');
    console.error('   2. Crea workspace "DealPulseHub"');
    console.error('   3. Settings → Access Tokens → Generate new token');
    console.error('   4. Copia el token → PENPOT_API_KEY en .env');
    console.error('   5. El workspace/team id aparece en la URL del dashboard → PENPOT_WORKSPACE_ID en .env');
    console.error('');
    console.error('   Detalle completo: .claude/rules/FASE_1_START_AHORA.md');
    process.exit(1);
  }
}

async function getTeamProjects() {
  const { data } = await axios.post(
    `${API_BASE}/get-projects`,
    { 'team-id': PENPOT_WORKSPACE_ID },
    { headers: { Authorization: `Token ${PENPOT_API_KEY}` } }
  );
  return data;
}

async function getProjectFiles(projectId) {
  const { data } = await axios.post(
    `${API_BASE}/get-project-files`,
    { 'project-id': projectId },
    { headers: { Authorization: `Token ${PENPOT_API_KEY}` } }
  );
  return data;
}

async function exportFileAsPng(fileId, pageId, objectId, filename) {
  const { data } = await axios.post(
    `${API_BASE}/export`,
    {
      exports: [{ 'file-id': fileId, 'page-id': pageId, 'object-id': objectId, type: 'png', scale: 2 }],
    },
    {
      headers: { Authorization: `Token ${PENPOT_API_KEY}` },
      responseType: 'arraybuffer',
    }
  );

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const filepath = path.join(OUTPUT_DIR, `${filename}.png`);
  fs.writeFileSync(filepath, data);
  console.log(`✅ Exportado: ${filepath}`);
  return filepath;
}

async function main() {
  assertConfigured();

  console.log('🎨 PENPOT EXTRACTOR\n');
  console.log('📡 Conectando a Penpot API...');

  try {
    const projects = await getTeamProjects();
    console.log(`✅ Conectado. ${projects.length} proyecto(s) encontrados en el workspace.\n`);

    for (const project of projects) {
      console.log(`📁 Proyecto: ${project.name}`);
      const files = await getProjectFiles(project.id);
      for (const file of files) {
        console.log(`   📄 ${file.name} (id: ${file.id})`);
      }
    }

    console.log('\n💡 Siguiente paso: implementar exportFileAsPng() por página/objeto');
    console.log('   una vez confirmada la estructura real del workspace (nombres de');
    console.log('   proyectos/archivos creados en Fase 1: Mockups, Design System, Templates Library).');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('❌ Token inválido o sin permisos. Revisa PENPOT_API_KEY en .env.');
    } else {
      console.error('❌ Error conectando a Penpot:', error.response?.data || error.message);
    }
    process.exit(1);
  }
}

main();
