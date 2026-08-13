#!/usr/bin/env node
/**
 * PENPOT SHAPES — utilidades geométricas puras sobre el árbol de shapes de un
 * archivo Penpot, independientes de la API (reciben un array ya normalizado,
 * no llaman a red). Testeadas en __tests__/penpot-shapes.test.js con mocks.
 *
 * `flattenShapes()` sí depende de la forma real del payload de Penpot
 * (`get-file`) y es la parte marcada como best-effort/sin verificar en vivo —
 * ver nota en penpot-client.js. `findBackgroundFor()` e `isContainedIn()` NO
 * dependen de esa forma (solo de x/y/width/height/fills, campos estables de
 * Penpot desde hace años) y sí están cubiertas por tests reales.
 */

/** ¿El bbox de `inner` cabe completamente dentro del bbox de `outer`? */
function isContainedIn(inner, outer) {
  if (!inner || !outer || inner === outer) return false;
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  );
}

/**
 * Mismo criterio que `storage.findBackgroundFor` en el protocolo global de
 * Penpot MCP: entre todos los rects/boards con fill que contienen
 * geométricamente al shape, el de MENOR área gana (el fondo más inmediato,
 * no el board raíz) — evita falsos positivos tipo "texto blanco sobre
 * blanco" cuando en realidad está sobre un botón de color.
 */
function findBackgroundFor(shape, allShapes) {
  const candidates = allShapes.filter(
    (s) =>
      s.id !== shape.id &&
      (s.type === 'rect' || s.type === 'board' || s.type === 'frame') &&
      Array.isArray(s.fills) &&
      s.fills.length > 0 &&
      isContainedIn(shape, s)
  );
  if (candidates.length === 0) {
    return { fillColor: '#ffffff', source: null, assumed: true };
  }
  const smallest = candidates.reduce((best, s) => {
    const area = s.width * s.height;
    return area < best.area ? { shape: s, area } : best;
  }, { shape: candidates[0], area: candidates[0].width * candidates[0].height });
  return { fillColor: smallest.shape.fills[0].fillColor, source: smallest.shape.name || smallest.shape.id, assumed: false };
}

/**
 * Aplana el `pagesIndex` de un `get-file` de Penpot a un array simple.
 * BEST-EFFORT — ver advertencia en el header de este archivo y en
 * penpot-client.js. Campos que no se puedan resolver quedan en `null` en vez
 * de reventar, para que el resto del pipeline degrade con avisos en vez de
 * crashear sobre un archivo real con forma ligeramente distinta.
 */
function flattenShapes(pagesIndex) {
  const shapes = [];
  for (const pageId of Object.keys(pagesIndex || {})) {
    const page = pagesIndex[pageId];
    const objects = page?.objects ?? {};
    for (const objId of Object.keys(objects)) {
      const o = objects[objId];
      if (!o || typeof o !== 'object') continue;
      shapes.push({
        id: objId,
        pageId,
        pageName: page?.name ?? pageId,
        name: o.name ?? objId,
        type: o.type ?? 'unknown',
        x: Number(o.x ?? o.selrect?.x ?? 0),
        y: Number(o.y ?? o.selrect?.y ?? 0),
        width: Number(o.width ?? o.selrect?.width ?? 0),
        height: Number(o.height ?? o.selrect?.height ?? 0),
        fills: Array.isArray(o.fills) ? o.fills : [],
        textStyle: extractTextStyle(o),
      });
    }
  }
  return shapes;
}

/** Extrae {fontSize, fontWeight} del primer "leaf" con tipografía, si existe. */
function extractTextStyle(shape) {
  if (shape.type !== 'text') return null;
  const root = shape.content;
  if (!root) return { fontSize: 16, fontWeight: 400, assumed: true };
  let found = null;
  const walk = (node) => {
    if (found || !node || typeof node !== 'object') return;
    if (node['font-size'] || node.fontSize) {
      found = {
        fontSize: Number(node['font-size'] ?? node.fontSize ?? 16),
        fontWeight: Number(node['font-weight'] ?? node.fontWeight ?? 400),
        assumed: false,
      };
      return;
    }
    const children = node.children;
    if (Array.isArray(children)) children.forEach(walk);
  };
  walk(root);
  return found ?? { fontSize: 16, fontWeight: 400, assumed: true };
}

module.exports = { isContainedIn, findBackgroundFor, flattenShapes, extractTextStyle };
