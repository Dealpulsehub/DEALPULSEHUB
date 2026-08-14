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
        textFill: extractTextFill(o),
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

/**
 * Extrae el color de relleno real del texto (para un `Text` shape).
 *
 * BUG histórico que este fix corrige: `penpot-audit.js` leía `shape.fills[0]`
 * para el color de texto, pero en Penpot el fill de un `Text` vive dentro del
 * árbol `content` (por párrafo/run), igual que `font-size`/`font-weight` —
 * `shape.fills` a nivel de shape típicamente viene vacío para texto. El
 * resultado real, verificado en vivo contra el workspace de producción vía
 * Penpot MCP (Plugin API) el 2026-08-13: 67/67 filas del audit-report.json
 * traían `textColor: "#000000"` — un default silencioso, nunca el color real
 * — produciendo tanto falsos positivos (Badge Text, Cover Title/Subtitle:
 * texto blanco real sobre fondo oscuro, reportado como negro sobre oscuro →
 * "falla") como falsos negativos (Secondary Link, Value Callout, Urgency
 * Text: texto real de bajo contraste, reportado como negro sobre fondo claro
 * → "pasa" cuando en realidad fallaba).
 *
 * Camino primario: `shape.fills` a nivel de shape (algunos texto sí lo traen
 * si el color es uniforme). Fallback: caminar `content` buscando `fills` por
 * nodo, igual patrón que `extractTextStyle`. Sin verificar contra la forma
 * exacta del payload REST `get-file` en un workspace real (mismo caveat
 * best-effort del resto de este archivo) — si ninguna de las dos rutas
 * encuentra un color, se marca `assumed: true` en vez de asumir negro en
 * silencio, para que el caller pueda decidir qué hacer con esa fila.
 *
 * LIMITACIÓN CONOCIDA (encontrada en revisión QA 2026-08-13, no resuelta,
 * documentada a propósito en vez de dejarla como hueco silencioso): si un
 * mismo shape de texto tiene varios párrafos/runs con colores DISTINTOS
 * (ej. un CTA con una palabra resaltada en otro color), `walk()` es
 * depth-first y se queda con el PRIMER fill que encuentra — el resto de los
 * colores presentes en ese texto se ignoran, y el resultado se marca
 * `assumed: false` (alta confianza) aunque en realidad describa solo una
 * parte del texto. No hay señal de "colores mixtos ignorados" en el output.
 * Ver test "colores mixtos por párrafo" en penpot-shapes.test.js.
 */
function extractTextFill(shape) {
  if (shape.type !== 'text') return null;
  if (Array.isArray(shape.fills) && shape.fills[0]?.fillColor) {
    return { fillColor: shape.fills[0].fillColor, assumed: false };
  }
  const root = shape.content;
  if (!root) return { fillColor: '#000000', assumed: true };
  let found = null;
  const walk = (node) => {
    if (found || !node || typeof node !== 'object') return;
    const fills = node.fills;
    if (Array.isArray(fills) && fills[0]?.fillColor) {
      found = { fillColor: fills[0].fillColor, assumed: false };
      return;
    }
    const children = node.children;
    if (Array.isArray(children)) children.forEach(walk);
  };
  walk(root);
  return found ?? { fillColor: '#000000', assumed: true };
}

module.exports = { isContainedIn, findBackgroundFor, flattenShapes, extractTextStyle, extractTextFill };
