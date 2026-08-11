#!/usr/bin/env node
/**
 * guard-secrets-precommit.cjs
 *
 * PreToolUse hook (matcher: Bash) — bloquea `git add`/`git commit` si detecta
 * archivos de secretos referenciados como PATH en un `git add`, o ya presentes
 * en el staging area real (git diff --cached).
 *
 * Motivo real (no hipotético): en la auditoría GitHub/npm de 2026-08-10 se
 * encontró un token de Figma hardcodeado en texto plano DOS VECES en scripts/
 * (figma-config.json y scripts/descargador-recursos.js) — ver .ai/decision-log.md.
 * Este es el primer hook de enforcement real de DealPulseHub. El resto de la
 * gobernanza (agent-authority.md, safety-gates.md) sigue siendo criterio
 * editorial sin mecanismo — ver docs/MEGABRAIN_VS_DEALPULSEHUB.md.
 *
 * v2 (2026-08-10): la v1 revisaba el TEXTO CRUDO del comando completo contra
 * los patrones, lo cual disparó un falso positivo real en la primera prueba —
 * cualquier bash de varias líneas que simplemente MENCIONE ".env" (ej. un
 * script de test, un echo, un comentario) lo activaba, aunque no fuera un
 * `git add .env` real. v2 primero aísla los segmentos que son de verdad
 * invocaciones `git add`/`git commit`, y solo trata como "posible path" los
 * tokens de un `git add` — nunca el texto libre de un mensaje de `-m "..."`,
 * que se valida en cambio contra el estado real de staging.
 *
 * Protocolo de hooks de Claude Code: exit 0 = permitir, exit 2 = bloquear
 * (stderr se muestra como razón del bloqueo al agente).
 *
 * Diseño defensivo: cualquier fallo inesperado (no es repo git, parseo de
 * stdin falla, git no disponible) => fail-open (exit 0). Este hook nunca debe
 * poder bloquear trabajo legítimo por un bug propio.
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Se aplican solo a TOKENS individuales ya aislados (de un `git add <path>`,
// o de una línea de `git diff --cached --name-only`) — nunca contra texto libre.
const FORBIDDEN_FILENAME_PATTERNS = [
  /(^|\/)\.env($|\.)/,
  /(^|\/)\.npmrc$/,
  /(^|\/)\.vault\//,
  /\.google-service-account\.json$/,
];

function readStdin() {
  try {
    const data = fs.readFileSync(0, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/** Aísla los segmentos del comando que son de verdad `git add ...` / `git commit ...`,
 *  separando por saltos de línea y operadores de encadenamiento de shell. Cualquier
 *  otra cosa (echo, comentarios, strings de test) queda fuera aunque mencione ".env". */
function findGitAddOrCommitSegments(command) {
  return command
    .split(/\r?\n|&&|\|\||;/)
    .map((s) => s.trim())
    .filter((s) => /^git\s+(add|commit)\b/.test(s));
}

function tokenize(segment) {
  return segment
    .split(/\s+/)
    .map((t) => t.replace(/^['"]+|['"]+$/g, ''));
}

function main() {
  const input = readStdin();
  if (!input) process.exit(0); // fail-open: no pudimos leer input

  const command = input.tool_input && input.tool_input.command;
  if (typeof command !== 'string') process.exit(0);

  const gitSegments = findGitAddOrCommitSegments(command);
  if (gitSegments.length === 0) process.exit(0); // no hay un git add/commit real aquí

  const cwd = input.cwd || process.cwd();

  try {
    // 1. `git add <path>` con un path que es directamente un secreto.
    //    (No se aplica a `git commit -m "..."` — ese texto es prosa, no un path;
    //    lo cubre el chequeo 2 contra el estado real de staging.)
    for (const seg of gitSegments) {
      if (!/^git\s+add\b/.test(seg)) continue;
      const tokens = tokenize(seg).slice(2); // quita "git" "add"
      const forbiddenToken = tokens.find((t) =>
        FORBIDDEN_FILENAME_PATTERNS.some((p) => p.test(t))
      );
      if (forbiddenToken) {
        console.error(
          `BLOQUEADO por guard-secrets-precommit: "${seg}" agrega directamente ` +
          `un archivo de secretos ("${forbiddenToken}"). Si es intencional (ej. ` +
          `tocar .gitignore), reformula el comando, o confirma explícitamente con ` +
          `el usuario antes de forzar.`
        );
        process.exit(2);
      }
    }

    // 2. ¿Hay algo YA staged (de este comando o de una sesión anterior) que sea
    //    un secreto? Esto cubre tanto `git commit` como `git add .` genéricos.
    const staged = execSync('git diff --cached --name-only', {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'], // no heredar stderr de git
    })
      .split('\n')
      .filter(Boolean);

    const leaked = staged.filter((f) =>
      FORBIDDEN_FILENAME_PATTERNS.some((p) => p.test(f))
    );
    if (leaked.length > 0) {
      console.error(
        `BLOQUEADO por guard-secrets-precommit: hay archivos de secretos en el ` +
        `staging area: ${leaked.join(', ')}. Corre "git restore --staged <archivo>" ` +
        `antes de continuar.`
      );
      process.exit(2);
    }
  } catch {
    process.exit(0); // fail-open: no es repo git, git no disponible, etc.
  }

  process.exit(0);
}

main();
