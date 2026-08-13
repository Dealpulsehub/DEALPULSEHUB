#!/usr/bin/env node
/**
 * Test manual (Node `assert`, sin Jest) para scripts/lib/wcag-contrast.js.
 *
 * Por qué no Jest: jest.config.js tiene `roots: ['<rootDir>/src']` y solo
 * descubre `.ts`/`.tsx` — es el runner que respalda el QA gate real
 * (`.claude/hooks/guard-qa-gate-prepush.cjs`, 59/59 tests). No se tocó esa
 * config para no arriesgar el gate por una necesidad de scripts/ que un
 * `assert` de Node resuelve igual de bien.
 *
 * Uso: node scripts/lib/__tests__/wcag-contrast.test.js
 *      npm run test:scripts   (corre este + los tests hermanos que existan)
 */

const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  hexToRgb,
  relLuminance,
  contrastRatio,
  isLargeText,
  evaluateContrast,
} = require('../wcag-contrast');

test('hexToRgb parsea con y sin #', () => {
  assert.deepEqual(hexToRgb('#FFFFFF'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(hexToRgb('000000'), { r: 0, g: 0, b: 0 });
});

test('relLuminance: blanco = 1, negro = 0 (vectores WCAG conocidos)', () => {
  assert.equal(relLuminance('#FFFFFF'), 1);
  assert.equal(relLuminance('#000000'), 0);
});

test('contrastRatio: negro sobre blanco = 21:1 (máximo posible en WCAG)', () => {
  assert.equal(contrastRatio('#000000', '#FFFFFF'), 21);
});

test('contrastRatio: mismo color = 1:1 (mínimo posible)', () => {
  assert.equal(contrastRatio('#6366F1', '#6366F1'), 1);
});

test('contrastRatio es simétrico (A,B) === (B,A)', () => {
  assert.equal(
    contrastRatio('#EF4444', '#FFFFFF'),
    contrastRatio('#FFFFFF', '#EF4444')
  );
});

test('isLargeText: 18px regular sí es grande, 17px regular no', () => {
  assert.equal(isLargeText(18, 400), true);
  assert.equal(isLargeText(17, 400), false);
});

test('isLargeText: 14px bold sí es grande, 13px bold no', () => {
  assert.equal(isLargeText(14, 700), true);
  assert.equal(isLargeText(13, 700), false);
});

test('evaluateContrast: blanco sobre ámbar medio falla AA (caso real documentado)', () => {
  // Hallazgo real de la sesión 2026-08-07 (PENPOT_MCP_PRODUCTION_PROTOCOL.md):
  // texto blanco sobre #F59E0B (ámbar) casi siempre falla AA.
  const result = evaluateContrast('#FFFFFF', '#F59E0B', 16, 400);
  assert.equal(result.threshold, 4.5);
  assert.equal(result.pass, false);
});

test('evaluateContrast: texto oscuro sobre blanco pasa AA de sobra', () => {
  const result = evaluateContrast('#111827', '#FFFFFF', 16, 400);
  assert.equal(result.pass, true);
});
