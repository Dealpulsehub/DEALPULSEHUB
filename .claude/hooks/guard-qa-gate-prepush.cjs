#!/usr/bin/env node
/**
 * guard-qa-gate-prepush.cjs
 *
 * PreToolUse hook (matcher: Bash) — bloquea `git push` si no hay un veredicto
 * APRUEBA de @qa (ver .claude/agents/aiox-qa.md) reciente Y correspondiente al
 * commit exacto (HEAD) que se está intentando subir.
 *
 * Estado esperado: .claude/state/qa-verdict.json (gitignored — hereda de
 * .claude/ en .gitignore — es estado de runtime, no algo a versionar).
 *
 * Diseño (mismo patrón que guard-secrets-precommit.cjs, aplicado desde el
 * inicio esta vez): primero AISLA los segmentos que son de verdad `git push`
 * separando por saltos de línea y operadores de encadenamiento — nunca se
 * matchea texto crudo contra todo el comando completo, que fue la causa del
 * falso positivo real encontrado en el hook hermano.
 *
 * Auto-invalidación: no hace falta borrar el estado manualmente después de un
 * push exitoso — en cuanto HEAD cambia (nuevo commit), el head_commit guardado
 * deja de coincidir y el siguiente push vuelve a exigir un veredicto fresco.
 *
 * Fail-open deliberado: esta gate es una capa ADICIONAL sobre el deny global de
 * `git push*` que ya exige aprobación humana explícita antes de cualquier push
 * real (ver agent-authority.md, "Flujo de Push"). Si este hook falla por
 * cualquier razón inesperada (JSON corrupto, no es repo git, etc.), la
 * aprobación humana obligatoria sigue siendo la línea de defensa real — este
 * hook nunca debe poder bloquear trabajo legítimo por un bug propio.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STATE_RELATIVE_PATH = path.join('.claude', 'state', 'qa-verdict.json');
const MAX_AGE_HOURS = 72;

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf-8'));
  } catch {
    return null;
  }
}

/** Aísla los segmentos del comando que son de verdad `git push ...`, igual que
 *  el hook hermano hace con `git add`/`git commit`. */
function findGitPushSegments(command) {
  return command
    .split(/\r?\n|&&|\|\||;/)
    .map((s) => s.trim())
    .filter((s) => /^git\s+push\b/.test(s));
}

function block(reason) {
  console.error(`BLOQUEADO por guard-qa-gate-prepush: ${reason}`);
  process.exit(2);
}

function main() {
  const input = readStdin();
  if (!input) process.exit(0); // fail-open: no pudimos leer input

  const command = input.tool_input && input.tool_input.command;
  if (typeof command !== 'string') process.exit(0);

  const pushSegments = findGitPushSegments(command);
  if (pushSegments.length === 0) process.exit(0); // no hay un git push real aquí

  const cwd = input.cwd || process.cwd();
  const statePath = path.join(cwd, STATE_RELATIVE_PATH);

  try {
    if (!fs.existsSync(statePath)) {
      block(
        `no hay veredicto de @qa registrado (${STATE_RELATIVE_PATH} no existe). ` +
        `Invoca aiox-qa antes de proponer el push.`
      );
    }

    const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

    if (state.verdict !== 'APRUEBA') {
      block(
        `el último veredicto registrado es "${state.verdict}", no APRUEBA. ` +
        `Corrige y vuelve a pedir veredicto a aiox-qa.`
      );
    }

    const currentHead = execSync('git rev-parse HEAD', {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'], // no heredar stderr de git (ej. "not a git repository")
    }).trim();
    if (state.head_commit !== currentHead) {
      block(
        `el veredicto APRUEBA fue para el commit ${state.head_commit}, pero HEAD ` +
        `actual es ${currentHead} — el código cambió desde entonces. Pide un ` +
        `nuevo veredicto a aiox-qa.`
      );
    }

    const ageMs = Date.now() - new Date(state.timestamp).getTime();
    const ageHours = ageMs / 3_600_000;
    if (!Number.isFinite(ageHours) || ageHours < 0 || ageHours > MAX_AGE_HOURS) {
      block(
        `el veredicto APRUEBA tiene ${Number.isFinite(ageHours) ? ageHours.toFixed(1) + 'h' : 'timestamp inválido'} ` +
        `(máximo ${MAX_AGE_HOURS}h). Pide un veredicto fresco a aiox-qa.`
      );
    }
  } catch {
    // process.exit() dentro de block() termina el proceso de inmediato — nunca
    // llega aquí desde un bloqueo intencional. Este catch solo atrapa fallos
    // reales inesperados: JSON corrupto, no es repo git, git no disponible, etc.
    process.exit(0); // fail-open, ver nota de diseño al inicio del archivo
  }

  process.exit(0);
}

main();
