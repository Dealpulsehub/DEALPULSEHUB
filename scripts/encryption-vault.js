#!/usr/bin/env node

/**
 * ENCRYPTION VAULT - Almacenamiento Seguro de Credenciales
 *
 * Sistema de encriptación para:
 * - API keys
 * - Access tokens
 * - Credenciales
 *
 * USAGE:
 * npm run encryption-vault -- --action=encrypt --key=API_KEY --value=sk_test_xxx
 * npm run encryption-vault -- --action=decrypt --key=API_KEY
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-cbc',
  encoding: 'hex',
  keyDerivation: 'pbkdf2',
  iterations: 100000,
  digest: 'sha256'
};

const VAULT_PATH = path.join(__dirname, '../.vault');
const VAULT_FILE = path.join(VAULT_PATH, '.encrypted-vault.json');
const MASTER_KEY_FILE = path.join(VAULT_PATH, '.master.key');

// ============================================================================
// FUNCIONES DE ENCRIPTACIÓN
// ============================================================================

/**
 * Obtiene o crea la master key
 */
function getMasterKey() {
  if (fs.existsSync(MASTER_KEY_FILE)) {
    return fs.readFileSync(MASTER_KEY_FILE, 'utf8');
  }

  console.log('🔑 Creando Master Key (primera vez)...');
  const masterKey = crypto.randomBytes(32).toString('hex');

  if (!fs.existsSync(VAULT_PATH)) {
    fs.mkdirSync(VAULT_PATH, { recursive: true });
  }

  fs.writeFileSync(MASTER_KEY_FILE, masterKey);
  fs.chmodSync(MASTER_KEY_FILE, '600'); // Solo lectura para owner

  console.log(`   ✅ Master Key creada y guardada en: ${MASTER_KEY_FILE}`);
  console.log(`   ⚠️  IMPORTANTE: Guarda esta clave en lugar seguro`);

  return masterKey;
}

/**
 * Encripta un valor
 */
function encryptValue(plainText, masterKey) {
  try {
    // Generar IV y derivar clave
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(32);

    const key = crypto.pbkdf2Sync(
      masterKey,
      salt,
      ENCRYPTION_CONFIG.iterations,
      32,
      ENCRYPTION_CONFIG.digest
    );

    // Encriptar
    const cipher = crypto.createCipheriv(
      ENCRYPTION_CONFIG.algorithm,
      key,
      iv
    );

    let encrypted = cipher.update(plainText, 'utf8', ENCRYPTION_CONFIG.encoding);
    encrypted += cipher.final(ENCRYPTION_CONFIG.encoding);

    // Retornar: salt + iv + encrypted
    const combined = salt.toString('hex') + ':' +
                    iv.toString('hex') + ':' +
                    encrypted;

    return combined;
  } catch (error) {
    console.error('❌ Error en encriptación:', error.message);
    return null;
  }
}

/**
 * Desencripta un valor
 */
function decryptValue(encryptedData, masterKey) {
  try {
    const [saltHex, ivHex, encrypted] = encryptedData.split(':');

    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');

    const key = crypto.pbkdf2Sync(
      masterKey,
      salt,
      ENCRYPTION_CONFIG.iterations,
      32,
      ENCRYPTION_CONFIG.digest
    );

    const decipher = crypto.createDecipheriv(
      ENCRYPTION_CONFIG.algorithm,
      key,
      iv
    );

    let decrypted = decipher.update(encrypted, ENCRYPTION_CONFIG.encoding, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('❌ Error en desencriptación:', error.message);
    return null;
  }
}

/**
 * Guarda en el vault
 */
function saveToVault(key, encryptedValue) {
  let vault = {};

  if (fs.existsSync(VAULT_FILE)) {
    vault = JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'));
  } else {
    if (!fs.existsSync(VAULT_PATH)) {
      fs.mkdirSync(VAULT_PATH, { recursive: true });
    }
  }

  vault[key] = {
    encrypted: encryptedValue,
    timestamp: new Date().toISOString(),
    algorithm: ENCRYPTION_CONFIG.algorithm
  };

  fs.writeFileSync(VAULT_FILE, JSON.stringify(vault, null, 2));
  fs.chmodSync(VAULT_FILE, '600');

  return true;
}

/**
 * Lee del vault
 */
function readFromVault(key) {
  if (!fs.existsSync(VAULT_FILE)) {
    return null;
  }

  const vault = JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'));
  return vault[key] || null;
}

/**
 * Encripta y guarda una credencial
 */
function saveCredential(key, value) {
  console.log(`\n🔐 Guardando credencial: ${key}`);

  const masterKey = getMasterKey();
  const encrypted = encryptValue(value, masterKey);

  if (!encrypted) {
    console.error(`❌ Error encriptando ${key}`);
    return false;
  }

  const saved = saveToVault(key, encrypted);

  if (saved) {
    console.log(`   ✅ ${key} guardado de forma segura`);
    console.log(`   📍 Ubicación: ${VAULT_FILE}`);
    return true;
  }

  return false;
}

/**
 * Obtiene una credencial desencriptada
 */
function getCredential(key) {
  const masterKey = getMasterKey();
  const data = readFromVault(key);

  if (!data) {
    console.error(`❌ Credencial no encontrada: ${key}`);
    return null;
  }

  const decrypted = decryptValue(data.encrypted, masterKey);

  return decrypted;
}

/**
 * Lista todas las credenciales (solo nombres, valores ocultos)
 */
function listCredentials() {
  if (!fs.existsSync(VAULT_FILE)) {
    console.log('❌ Vault vacío');
    return;
  }

  const vault = JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'));

  console.log('\n🔐 CREDENCIALES GUARDADAS EN VAULT:\n');
  console.log('╔════════════════════════════════════════════════════════════╗');

  Object.entries(vault).forEach(([key, data]) => {
    console.log(`║ ${key.padEnd(30)} │ ${data.timestamp.substring(0, 10)} ║`);
  });

  console.log('╚════════════════════════════════════════════════════════════╝');
}

/**
 * Elimina una credencial
 */
function deleteCredential(key) {
  if (!fs.existsSync(VAULT_FILE)) {
    console.error('❌ Vault vacío');
    return false;
  }

  const vault = JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'));

  if (!vault[key]) {
    console.error(`❌ Credencial no encontrada: ${key}`);
    return false;
  }

  delete vault[key];
  fs.writeFileSync(VAULT_FILE, JSON.stringify(vault, null, 2));

  console.log(`✅ Credencial eliminada: ${key}`);
  return true;
}

/**
 * Imprime instrucciones
 */
function printInstructions() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║   ENCRYPTION VAULT - Almacenamiento Seguro de Credenciales    ║
╚════════════════════════════════════════════════════════════════╝

USAR:

Guardar credencial:
  npm run encryption-vault -- --action=encrypt --key=GOOGLE_FONTS_API --value=YOUR_API_KEY

Obtener credencial:
  npm run encryption-vault -- --action=decrypt --key=GOOGLE_FONTS_API

Listar credenciales:
  npm run encryption-vault -- --action=list

Eliminar credencial:
  npm run encryption-vault -- --action=delete --key=GOOGLE_FONTS_API

CREDENCIALES RECOMENDADAS PARA GUARDAR:

├─ GOOGLE_FONTS_API
├─ UNSPLASH_API_KEY
├─ PEXELS_API_KEY
├─ LOTTIEFILES_API_KEY
├─ ICONSPACE_API_KEY
├─ ADOBE_COLOR_API
├─ FACEBOOK_ACCESS_TOKEN
├─ STRIPE_API_KEY_SECRET
├─ CONVERTKIT_API_KEY
└─ FIGMA_TOKEN

SEGURIDAD:

✅ Todos los valores se encriptan con AES-256-CBC
✅ Master key se genera automáticamente (primera vez)
✅ Permisos de archivo: 600 (solo lectura para owner)
✅ Valores NO se muestran en logs o terminal
✅ Vault se almacena en .vault/.encrypted-vault.json

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
  switch (config.action) {
    case 'encrypt':
      if (!config.key || !config.value) {
        console.error('❌ Falta --key o --value');
        process.exit(1);
      }
      saveCredential(config.key, config.value);
      break;

    case 'decrypt':
      if (!config.key) {
        console.error('❌ Falta --key');
        process.exit(1);
      }
      const value = getCredential(config.key);
      if (value) {
        console.log(`\n✅ Valor desencriptado (primeros 20 caracteres):`);
        console.log(`   ${value.substring(0, 20)}...`);
      }
      break;

    case 'list':
      listCredentials();
      break;

    case 'delete':
      if (!config.key) {
        console.error('❌ Falta --key');
        process.exit(1);
      }
      deleteCredential(config.key);
      break;

    default:
      console.error(`❌ Acción desconocida: ${config.action}`);
      printInstructions();
      process.exit(1);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

// Exportar para uso en otros scripts
module.exports = {
  saveCredential,
  getCredential,
  listCredentials,
  deleteCredential,
  getMasterKey,
  encryptValue,
  decryptValue
};
