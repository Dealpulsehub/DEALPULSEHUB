#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../figma-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Token secreto: siempre desde variable de entorno (.env local o GitHub Secret en CI).
// figma-config.json NUNCA debe contener el token en texto plano (se commitea a git).
config.figmaToken = process.env.FIGMA_TOKEN || '';

async function syncFigmaTokens() {
  try {
    console.log('🔄 Sincronizando tokens de Figma...\n');

    // Validar configuración
    if (!config.figmaToken || config.figmaToken.includes('YOUR_')) {
      console.error('❌ Error: Figma token no configurado');
      console.error('   Por favor, establece FIGMA_TOKEN en tu archivo .env (local) o como GitHub Secret (CI)');
      process.exit(1);
    }

    if (!config.figmaProjectId || config.figmaProjectId.includes('YOUR_')) {
      console.error('❌ Error: Figma Project ID no configurado');
      console.error('   Por favor, establece figmaProjectId en figma-config.json');
      process.exit(1);
    }

    // Hacer request a Figma API
    console.log(`📡 Conectando a Figma API...`);
    console.log(`   Project: ${config.figmaFile}`);
    console.log(`   ID: ${config.figmaProjectId}\n`);

    const response = await axios.get(
      `https://api.figma.com/v1/files/${config.figmaProjectId}`,
      {
        headers: {
          'X-Figma-Token': config.figmaToken,
        },
      }
    );

    console.log('✅ Conexión exitosa a Figma\n');

    // Procesar tokens
    const figmaTokens = extractTokensFromFigma(response.data);

    // Guardar tokens
    const outputPath = path.join(config.outputPath, 'figma-tokens.json');
    fs.writeFileSync(outputPath, JSON.stringify(figmaTokens, null, 2));

    console.log('✅ Tokens sincronizados exitosamente');
    console.log(`   📁 Guardado en: ${outputPath}`);
    console.log(`   📊 Tokens: ${Object.keys(figmaTokens).length}\n`);

    if (config.gitConfig && config.gitConfig.autoCommit) {
      console.log('📝 Preparando commit...');
      // Git commit logic would go here
      console.log('✅ Commit listo (ejecutar manualmente: git commit)\n');
    }

  } catch (error) {
    if (error.response?.status === 403) {
      console.error('❌ Error: Token de Figma inválido o expirado');
    } else if (error.response?.status === 404) {
      console.error('❌ Error: Proyecto de Figma no encontrado');
    } else {
      console.error('❌ Error sincronizando tokens:', error.message);
    }
    process.exit(1);
  }
}

function extractTokensFromFigma(figmaData) {
  // Placeholder para lógica de extracción
  // En producción, esto parsearia la estructura de Figma
  return {
    colors: {},
    typography: {},
    spacing: {},
    shadows: {},
  };
}

// Ejecutar
console.log('🎨 FIGMA TOKEN SYNC\n');
syncFigmaTokens();

// Auto-sync si está habilitado
if (config.autoSync) {
  const intervalMs = config.syncInterval * 1000;
  console.log(`⏱️  Auto-sync habilitado cada ${config.syncInterval}s`);
  console.log('💡 El sistema sincronizará automáticamente los tokens\n');

  setInterval(syncFigmaTokens, intervalMs);
}
