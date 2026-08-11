# Agent Authority — DealPulseHub

Aplica cuando cualquier agente de `.claude/agents/` es activado. Formato adaptado del
patrón real de Megabrain (`Megabrain/.claude/rules/agent-authority.md`) — tablas
cortas y verificables, no prosa. Este archivo es la fuente que `deny-matrix.md`
(global, `~/.claude/rules/`) citaba sin que existiera — con esto queda resuelto para
este repo.

**Nomenclatura:** las tablas de abajo usan el alias de persona corto (`@qa`, `@dev`...)
por legibilidad — no es el `subagent_type` técnico. Para invocar de verdad con la
herramienta `Agent`, usa el nombre con prefijo `aiox-` (`aiox-qa`, `aiox-dev`...) —
ver la tabla de mapeo completa en `.claude/agents/aiox-master.md` sección 0.

## Autoridades Exclusivas

| Agente | Operaciones Exclusivas |
|---|---|
| `@devops` | `git push`, `gh pr create/merge`, `npm publish` (no dry-run), gestión de MCP servers, rotación de GitHub Secrets |
| `@pm` | Veredicto APRUEBA/RECHAZA/CONDICIONA sobre copy público (README, docs de usuario, copy de campaña) |
| `@dev` | Git local (`add`/`commit`/`branch`/`diff`/`stash`), implementación en `src/` |
| `@architect` | Decisiones de arquitectura (API oficial entre versiones en competencia, estructura de módulos, adopción de dependencias grandes) |
| `@qa` | Veredicto APRUEBA/BLOQUEA sobre merge — gate real antes de que `@devops` pueda desplegar |
| `@ux-design-expert` | Diseño del Design System (`src/components/`, `src/tokens/`) y mockups vía Penpot MCP |
| `@analyst` | Investigación previa (Buyer Persona / perfil de adoptante) — insumo para `@pm` y `@ux-design-expert`, nunca copy o diseño final |

**`@dev` bloqueado de:** `git push`, `gh pr create/merge`, `npm publish`, gestión de MCP, decidir arquitectura mayor sin pasar por `@architect`.

## Protocolo de Delegación

### Flujo de Push
```
CUALQUIER agente → @devops (propone) → usuario aprueba explícitamente → @devops ejecuta
```
Esto es consistente con `.claude/settings.json` (deny global de `git push*`, `gh pr create*`,
etc. — bloqueado para TODOS, incluido `@devops`): la autoridad de `@devops` es *quién
debería* proponer y ejecutar la acción una vez aprobada, no un bypass del deny global.
Ver `~/.claude/rules/deny-matrix.md` para el detalle completo de por qué el deny es
global mientras la autoridad es semántica.

### Flujo de Feature
```
@analyst (investiga) → @pm (aprueba copy) → @ux-design-expert + @dev (paralelo) → @qa (gate) → @devops (push)
```

### Flujo de Decisión de Arquitectura
```
@architect (decide + documenta en docs/ARCHITECTURE_MAP.md) → @dev (implementa)
```

### Flujo de Mockup de Campaña
```
@analyst (buyer persona) → @pm (aprueba ángulo) → @ux-design-expert (Penpot MCP + neuro-auditoría)
```

### Flujo de Ruteo / Arbitraje (`@aiox-master`)

```
Tarea sin dueño obvio, o conflicto entre 2 agentes → @aiox-master
```
`@aiox-master` (`.claude/agents/aiox-master.md`) enruta por tabla determinística y
arbitra por protocolo — ver ese archivo. Nunca ejecuta operaciones protegidas él
mismo; solo recomienda a quién delegar.

## Reglas de Escalación

1. Agente no puede completar su tarea → escalar al usuario (Director General), no inventar una decisión fuera de su alcance.
2. `@qa` BLOQUEA → vuelve a `@dev` con feedback específico, no vago.
3. `@pm` CONDICIONA → máximo 3 iteraciones antes de escalar al usuario.
4. Conflicto de límites entre agentes (ej. `@ux-design-expert` quiere escribir copy) → el agente cuya autoridad exclusiva cubre esa operación tiene la última palabra; si ninguno la tiene claramente, escala a `@aiox-master`, y si tampoco resuelve, al usuario.

## Gobernanza de MCP

**Solo `@devops`** gestiona MCP servers (`claude mcp add/remove/list/get`). El resto de
agentes son consumidores de las tools MCP ya registradas (ej. `mcp__penpot__*`), nunca
administradores.

## Nota de alcance

Este archivo reemplaza, para DealPulseHub, la referencia rota a `.aiox-core/constitution.md`
que citaban `AIOX_MASTER_COORDINATION_PROTOCOL.md` y `safety-gates.md` — ese framework
(`.aiox-core/`) nunca se instaló en este repo (ver `docs/MEGABRAIN_VS_DEALPULSEHUB.md`
sección "Gobernanza fantasma"). La mayoría de los 7 gates que `safety-gates.md` describe
como `ACTIVE ✅` siguen sin enforcement automático — son criterio editorial que los
agentes (`@pm`, `@qa`) aplican al emitir su veredicto, no un hook que bloquee nada.

**Actualizado 2026-08-10 (segunda ola, patrón Megabrain):** el sistema ya no es 100%
documental. Existen dos hooks de enforcement real activos, ambos registrados en
`.claude/settings.json` (`PreToolUse` sobre `Bash`):

1. `guard-secrets-precommit.cjs` — bloquea `git add`/`git commit` que toque `.env`,
   `.npmrc`, `.vault/` o credenciales de Google. 6/6 casos de prueba (incluido un
   falso positivo real encontrado y corregido en la propia sesión de creación).
2. `guard-qa-gate-prepush.cjs` — bloquea `git push` salvo que exista un veredicto
   `APRUEBA` de `@qa` (`aiox-qa.md` sección 4) para el commit exacto (HEAD) que se
   va a subir, con máximo 72h de antigüedad. Se auto-invalida solo: en cuanto hay
   un commit nuevo, el veredicto guardado deja de coincidir. 9/9 casos de prueba,
   corridos en un repo git temporal aislado para no arriesgar el repo real.

Es exactamente el patrón de Megabrain: la regla vive en un mecanismo que Claude Code
ejecuta, no solo en un documento que la describe. Ambos hooks son fail-open ante
cualquier fallo inesperado — son una capa adicional sobre la aprobación humana
obligatoria que ya exige el deny global de `git push*`, nunca la única barrera.
El registro completo de agentes y enforcement está en `.claude/agents.yaml`.
