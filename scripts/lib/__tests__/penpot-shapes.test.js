#!/usr/bin/env node
/**
 * Test manual (Node `assert`) para las funciones geométricas puras de
 * scripts/lib/penpot-shapes.js — ver justificación de por qué no Jest en
 * wcag-contrast.test.js. Usa shapes mock, no llama a la API de Penpot.
 *
 * Uso: node scripts/lib/__tests__/penpot-shapes.test.js
 */

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { isContainedIn, findBackgroundFor, extractTextFill } = require('../penpot-shapes');

const board = { id: 'board-1', type: 'board', x: 0, y: 0, width: 400, height: 300, fills: [{ fillColor: '#ffffff' }], name: 'OrderBumpCard' };
const button = { id: 'rect-1', type: 'rect', x: 20, y: 200, width: 360, height: 50, fills: [{ fillColor: '#ef4444' }], name: 'CTA Button' };
const textOnButton = { id: 'text-1', type: 'text', x: 40, y: 210, width: 300, height: 24 };
const textOnBoard = { id: 'text-2', type: 'text', x: 20, y: 20, width: 200, height: 24 };
const textOutside = { id: 'text-3', type: 'text', x: 999, y: 999, width: 10, height: 10 };

test('isContainedIn: rect dentro del board cuenta como contenido', () => {
  assert.equal(isContainedIn(button, board), true);
});

test('isContainedIn: shape fuera del bbox no cuenta', () => {
  assert.equal(isContainedIn(textOutside, board), false);
});

test('isContainedIn: un shape nunca se contiene a sí mismo', () => {
  assert.equal(isContainedIn(board, board), false);
});

test('findBackgroundFor: texto sobre el botón encuentra el botón, no el board (área mínima)', () => {
  const bg = findBackgroundFor(textOnButton, [board, button]);
  assert.equal(bg.fillColor, '#ef4444');
  assert.equal(bg.source, 'CTA Button');
  assert.equal(bg.assumed, false);
});

test('findBackgroundFor: texto directamente sobre el board (sin botón debajo) encuentra el board', () => {
  const bg = findBackgroundFor(textOnBoard, [board, button]);
  assert.equal(bg.fillColor, '#ffffff');
  assert.equal(bg.source, 'OrderBumpCard');
});

test('findBackgroundFor: sin ningún contenedor, asume blanco y lo marca explícito', () => {
  const bg = findBackgroundFor(textOutside, [board, button]);
  assert.equal(bg.assumed, true);
  assert.equal(bg.fillColor, '#ffffff');
});

// Regresión del bug real 2026-08-13: penpot-audit.js leía shape.fills[0] para
// el color de texto y caía siempre a '#000000' porque Penpot guarda el fill
// del texto dentro de `content` (por párrafo/run), no en shape.fills a nivel
// de shape. Ver comentario en penpot-shapes.js::extractTextFill.

test('extractTextFill: no-text shape devuelve null', () => {
  assert.equal(extractTextFill(button), null);
});

test('extractTextFill: usa shape.fills si está presente (texto con color uniforme)', () => {
  const text = { type: 'text', fills: [{ fillColor: '#ffffff' }] };
  const fill = extractTextFill(text);
  assert.equal(fill.fillColor, '#ffffff');
  assert.equal(fill.assumed, false);
});

test('extractTextFill: sin shape.fills, cae a buscar dentro de content (caso real que causaba el bug)', () => {
  const text = {
    type: 'text',
    fills: [],
    content: {
      children: [
        { children: [{ fills: [{ fillColor: '#e0e7ff' }], text: 'Cover Subtitle' }] },
      ],
    },
  };
  const fill = extractTextFill(text);
  assert.equal(fill.fillColor, '#e0e7ff');
  assert.equal(fill.assumed, false);
});

test('extractTextFill: sin fills en ningún lado, asume negro y lo marca explícito (nunca en silencio)', () => {
  const text = { type: 'text', fills: [], content: { children: [] } };
  const fill = extractTextFill(text);
  assert.equal(fill.assumed, true);
  assert.equal(fill.fillColor, '#000000');
});

// Limitación conocida, señalada en revisión QA 2026-08-13 (condición para
// confiar el reporte en producción, no bloqueante para el fix del bug
// original): un texto con colores mixtos por párrafo/run reporta solo el
// PRIMER color encontrado (depth-first, izquierda-a-derecha) con
// assumed:false, ignorando en silencio cualquier otro color presente en el
// mismo shape. Documentado a propósito — ver comentario en
// penpot-shapes.js::extractTextFill. Si algún día se corrige (ej. detectar
// mezcla y marcar assumed:true), este test debe actualizarse.
test('extractTextFill: colores mixtos por párrafo — reporta solo el primero encontrado (comportamiento actual, no ideal)', () => {
  const text = {
    type: 'text',
    fills: [],
    content: {
      children: [
        { children: [{ fills: [{ fillColor: '#111827' }], text: 'Texto normal ' }] },
        { children: [{ fills: [{ fillColor: '#ef4444' }], text: 'palabra resaltada' }] },
      ],
    },
  };
  const fill = extractTextFill(text);
  // Comportamiento actual: gana el primer run, el segundo color (#ef4444)
  // queda completamente ignorado — y ni siquiera se marca assumed:true.
  assert.equal(fill.fillColor, '#111827');
  assert.equal(fill.assumed, false);
});
