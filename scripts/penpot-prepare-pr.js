#!/usr/bin/env node
/**
 * PENPOT PREPARE-PR — arma el cuerpo de PR a partir de los artefactos
 * locales ya generados; NO ejecuta git ni gh.
 *
 * Por qué se detiene ahí: `git push*` y `gh pr create*` están en el deny
 * global de settings.json para TODOS los agentes (ver
 * .claude/rules/agent-authority.md, "Flujo de Push") — cualquier cosa que
 * este script hiciera más allá de escribir un archivo local exigiría de
 * todas formas aprobación humana explícita antes de ejecutarse. En vez de
 * fingir automatización hasta un punto que igual se bloquea, el script
 * entrega el material listo (branch sugerido, cuerpo de PR, comandos
 * exactos) para que un humano — o @devops, tras aprobación — los corra.
 *
 * Entradas (todas opcionales — el script reporta qué faltó):
 *   design_assets/*.png           (de npm run penpot:extract)
 *   design_specs/audit-report.json    (de npm run penpot:audit)
 *   design_specs/variations-plan.json (de npm run penpot:variations)
 *
 * Salida:
 *   design_specs/PR_BODY.md
 *   (y, en consola, los comandos git/gh exactos — no ejecutados)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'design_assets');
const SPECS_DIR = path.join(ROOT, 'design_specs');
const AUDIT_FILE = path.join(SPECS_DIR, 'audit-report.json');
const VARIATIONS_FILE = path.join(SPECS_DIR, 'variations-plan.json');
const PR_BODY_FILE = path.join(SPECS_DIR, 'PR_BODY.md');

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function listAssets() {
  try {
    return fs.readdirSync(ASSETS_DIR).filter((f) => f.endsWith('.png'));
  } catch {
    return [];
  }
}

function buildPrBody({ assets, audit, variations }) {
  const lines = [];
  lines.push('## 🎨 Export de diseño — Penpot');
  lines.push('');
  lines.push(`Generado automáticamente el ${new Date().toISOString()} por el pipeline`);
  lines.push('`penpot:extract` → `penpot:audit` → `penpot:variations` → `penpot:prepare-pr`.');
  lines.push('');

  lines.push('### Assets');
  if (assets.length > 0) {
    lines.push(`${assets.length} archivo(s) en \`design_assets/\`:`);
    assets.forEach((a) => lines.push(`- \`${a}\``));
  } else {
    lines.push('_Sin assets — corre `npm run penpot:extract` antes de este script._');
  }
  lines.push('');

  lines.push('### Neuro-auditoría (WCAG)');
  if (audit) {
    const { pass, fail, total, assumed } = audit.summary;
    lines.push(`${pass}/${total} pasan · ${fail} fallan · ${assumed} con datos asumidos (revisar a mano).`);
    if (fail > 0) {
      lines.push('');
      lines.push('**Fallas a corregir antes de dar por lista la entrega:**');
      audit.results.filter((r) => !r.pass).forEach((r) => {
        lines.push(`- [${r.file} / ${r.page} / ${r.shape}] ${r.textColor} sobre ${r.backgroundColor} → ${r.ratio}:1 (necesita ${r.threshold}:1)`);
      });
    }
  } else {
    lines.push('_Sin reporte — corre `npm run penpot:audit` antes de este script._');
  }
  lines.push('');

  lines.push('### Variaciones A/B propuestas');
  if (variations && variations.count > 0) {
    lines.push(`${variations.count} variante(s) propuesta(s) (ver \`design_specs/variations-plan.json\` para el snippet de MCP de cada una):`);
    variations.plans.forEach((p) => lines.push(`- **${p.board}** (${p.file} / ${p.page}): ${p.variant}`));
  } else {
    lines.push('_Sin variaciones propuestas, o `npm run penpot:variations` no se corrió._');
  }
  lines.push('');
  lines.push('---');
  lines.push('*PR preparado por automatización — requiere revisión y aprobación humana antes de mergear ' +
    '(ver `.claude/rules/agent-authority.md`, gate de `@qa` + deny global de `git push`/`gh pr`).*');

  return lines.join('\n');
}

function main() {
  console.log('📦 PENPOT PREPARE-PR — arma el material, no ejecuta git/gh\n');

  const assets = listAssets();
  const audit = readJsonSafe(AUDIT_FILE);
  const variations = readJsonSafe(VARIATIONS_FILE);

  if (assets.length === 0 && !audit && !variations) {
    console.error('❌ No hay nada que empaquetar todavía.');
    console.error('   Corre en orden: npm run penpot:extract && npm run penpot:audit && npm run penpot:variations');
    process.exit(1);
  }

  fs.mkdirSync(SPECS_DIR, { recursive: true });
  const body = buildPrBody({ assets, audit, variations });
  fs.writeFileSync(PR_BODY_FILE, body);

  const branch = `design/export-${new Date().toISOString().slice(0, 10)}`;
  console.log(`✅ Cuerpo de PR escrito: ${PR_BODY_FILE}\n`);
  console.log('Comandos sugeridos (NO ejecutados por este script — requieren tu aprobación explícita,');
  console.log('y `git push`/`gh pr create` están bloqueados globalmente hasta que la des):\n');
  console.log(`  git checkout -b ${branch}`);
  console.log(`  git add design_assets/ design_specs/`);
  console.log(`  git commit -m "chore: export de diseño Penpot (${new Date().toISOString().slice(0, 10)})"`);
  console.log(`  git push origin ${branch}`);
  console.log(`  gh pr create --title "Design: export de Penpot" --body-file design_specs/PR_BODY.md --base main`);
}

main();
