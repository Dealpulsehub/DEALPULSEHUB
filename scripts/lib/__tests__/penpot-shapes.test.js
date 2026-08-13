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
const { isContainedIn, findBackgroundFor } = require('../penpot-shapes');

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
