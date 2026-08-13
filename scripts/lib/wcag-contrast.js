#!/usr/bin/env node
/**
 * WCAG CONTRAST — funciones puras de contraste, sin dependencias de red.
 *
 * Port 1:1 (mismo algoritmo, mismos nombres) de la neuro-auditoría que ya
 * corrió con éxito de forma interactiva vía Penpot MCP (`execute_code`) sobre
 * 8 boards reales — ver:
 *   C:\Users\Oscar\.claude\rules\PENPOT_MCP_PRODUCTION_PROTOCOL.md
 *   sección "NEURO-AUDITORÍA REAL (WCAG contraste + jerarquía)"
 *
 * Ese código vivía solo como snippet pegado en una sesión MCP interactiva —
 * nunca como archivo del repo, así que no se podía correr sin abrir Penpot ni
 * probar por separado. Aquí queda como módulo reutilizable y con tests
 * (ver __tests__/wcag-contrast.test.js), para que `scripts/penpot-audit.js`
 * lo use contra datos reales del archivo (fills + texto) obtenidos por la API
 * REST de Penpot, no solo contra shapes de una sesión de plugin en vivo.
 */

function hexToRgb(hex) {
  const clean = String(hex).replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function relLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const chan = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = relLuminance(hex1);
  const l2 = relLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** WCAG AA: texto "grande" (18px+ regular, o 14px+ bold) exige solo 3:1 en vez de 4.5:1. */
function isLargeText(fontSize, fontWeight) {
  const size = parseFloat(fontSize);
  const bold = parseInt(fontWeight, 10) >= 700;
  return bold ? size >= 14 : size >= 18;
}

/** @returns {{ratio:number, threshold:number, pass:boolean}} */
function evaluateContrast(textHex, bgHex, fontSize, fontWeight) {
  const ratio = contrastRatio(textHex, bgHex);
  const threshold = isLargeText(fontSize, fontWeight) ? 3.0 : 4.5;
  return { ratio: Math.round(ratio * 100) / 100, threshold, pass: ratio >= threshold };
}

module.exports = { hexToRgb, relLuminance, contrastRatio, isLargeText, evaluateContrast };
