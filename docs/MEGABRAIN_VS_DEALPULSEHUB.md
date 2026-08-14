# Megabrain vs DealPulseHub — Análisis Comparativo de Gobernanza y Arquitectura de Agentes

**Fecha:** 2026-08-10
**Propósito:** Explicar por qué el sistema de agentes de Megabrain funciona en la
práctica y qué patrones de ese sistema se adoptaron aquí — no una réplica 1:1
(Megabrain es un producto de gestión de conocimiento con ~500 archivos en `.claude/`;
DealPulseHub es un design system + backend de orquestación de un solo repo). Se
adoptó el **patrón**, dimensionado al tamaño real de este proyecto.

---

## Resumen ejecutivo: por qué Megabrain funciona

Megabrain funciona porque **la gobernanza está en el mismo lugar que la ejecución**.
Cada regla que describe (quién hace qué, qué se bloquea, cómo se enruta una tarea) o
bien vive en un hook que el propio Claude Code ejecuta automáticamente
(`.claude/hooks/*.py`, disparados desde `.claude/settings.json`), o vive en un
archivo de agente autocontenido que Claude Code puede invocar de verdad con la
herramienta `Agent`. Nada de la gobernanza "real" de Megabrain depende de que un
LLM recuerde leer un documento de prosa y decida obedecerlo por buena voluntad.

DealPulseHub, antes de esta sesión, tenía el patrón inverso: 20+ documentos de
`.claude/rules/` describiendo con gran detalle una jerarquía (CPS→CCO→CXO→CAO),
gates automáticos de 7 pasos, y una autoridad exclusiva de `@devops` sobre git push —
pero **cero de esos mecanismos estaban conectados a nada ejecutable**. Ningún
`.claude/agents/*.md` existía, ningún hook los hacía cumplir. Era gobernanza
*aspiracional*: correcta en su razonamiento, inerte en la práctica.

---

## Tabla comparativa

| Dimensión | Megabrain | DealPulseHub (antes de esta sesión) | DealPulseHub (después) |
|---|---|---|---|
| **Agentes** | 500+ archivos en `.claude/agents/` + `squads/*/agents/*.md`, invocables de verdad | 0 archivos — solo roles descritos en prosa | 7 archivos reales en `.claude/agents/` (analyst, pm, ux, dev, architect, qa, devops), autocontenidos |
| **Autoridad** | `agent-authority.md`: tabla corta, exclusive ops, delegation flows, escalation rules | Citado desde `deny-matrix.md` pero el archivo **no existía en ningún lugar** | `agent-authority.md` real, adaptado del de Megabrain |
| **Enforcement** | 60+ hooks Python/shell reales en `SessionStart`/`UserPromptSubmit`/`PreToolUse`/`PostToolUse`/`Stop` — validan de verdad | Solo el `deny` nativo global de `~/.claude/settings.json` (git push, gh pr) | 2 hooks reales propios (`guard-secrets-precommit.cjs` + `guard-qa-gate-prepush.cjs`, `PreToolUse` sobre `Bash`) — mecanismo, no documento (ver "Ola 2") |
| **Routing/Orquestación** | Algoritmo real con pesos (`domain_match: 0.4`, `problem_match: 0.35`...) y thresholds numéricos | "`@aiox-master` arbitra en 20 minutos" — prosa sin mecanismo, sin agente invocable | `@aiox-master` ya es agente real con tabla de ruteo determinística + protocolo de arbitraje (sin scoring ponderado — ver "Qué NO se portó") |
| **Memoria/Sesión** | `.claude/sessions/SESSION-*.md` + `continuous_save.py` corriendo en cada prompt + handoff YAML explícito para no recargar personas completas | Memoria de Claude Code estándar (`~/.claude/projects/.../memory/`), sin persistencia de sesión propia | Sin cambios (ver recomendación) |
| **Constitución/Gates** | `core/constitution.md` — aunque, dato honesto: los 5 wrapper agents de nivel superior (`orquestrador-global--*.md`) referencian este archivo y **tampoco existe** en el repo real; la gobernanza real vive un nivel más abajo, en `squads/orquestrador-global/agents/*.md` | `.aiox-core/constitution.md` citado por `safety-gates.md`/`AIOX_MASTER_COORDINATION_PROTOCOL.md` — **no existe en este repo**, solo en el proyecto no relacionado `Vitalidad Natural` | Documentado explícitamente como gap en `agent-authority.md` — sin fingir que el enforcement existe |
| **Registro único de verdad** | `squad.yaml` por squad: declara agentes/tasks/workflows/knowledge/templates/data, con changelog embebido de cada rename/sync | Ninguno — 27 documentos de `.claude/rules/` sin un índice canónico versionado | Sin cambios (ver recomendación) |

---

## Detalle por área

### Jerarquía

**Megabrain:** no hay una jerarquía de "roles de negocio" (CPS/CCO/CXO) sino una
jerarquía **funcional de pipeline**: `intent-parser` clasifica → `roteador` enruta con
un score numérico → `capability-cartographer` mantiene el índice de qué squad hace
qué → `dag-architect` ejecuta como grafo de dependencias (Agent Teams) → `supervisor-sistema`
observa y sugiere (nunca ejecuta ni decide, solo genera evidencia para que un humano
decida). Es una jerarquía de **funciones de sistema**, no de títulos de negocio.

**DealPulseHub:** la jerarquía (Director General → CPS → CCO → CXO/CAO) es una
jerarquía de **roles narrativos de negocio**, heredada de la metodología de marketing
de Antigravity — tiene sentido como framework de decisión editorial, pero no mapea a
funciones de sistema (no hay nada que "clasifique intención" o "enrute con score").

**Qué cambia aquí:** no se reemplazó la jerarquía de negocio (sigue teniendo sentido
para el trabajo de copy/diseño de campañas) — se le dio, por primera vez, una capa de
ejecución real por debajo (los 7 agentes), y una tabla de autoridad que sí se puede
verificar en vez de solo describir.

**⚠️ Revertido 2026-08-14.** Lo de arriba describía una decisión consciente de *mantener*
la jerarquía narrativa de negocio (Director General → CPS/CCO/CXO/CAO) como framework
editorial. Por instrucción explícita del usuario, esa decisión queda revertida:
DealPulseHub opera únicamente con los 8 agentes AIOX de `.claude/agents.yaml`. El resto
de este documento sigue vigente. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣.

### Gobernanza

La diferencia central: en Megabrain, `agent-authority.md` es **corto y verificable**
(tablas, sin narrativa) porque describe algo que ya existe (agentes reales, hooks
reales). En DealPulseHub, `safety-gates.md` y `AIOX_MASTER_COORDINATION_PROTOCOL.md`
son largos y narrativos porque están describiendo algo que *debería* existir —
compensan la ausencia de mecanismo con más prosa explicando el mecanismo ausente.

El nuevo `agent-authority.md` de este repo sigue el patrón corto de Megabrain
deliberadamente, y es honesto en su última sección sobre qué de la "gobernanza
fantasma" previa queda sin resolver.

### Arquitectura

Megabrain declara sus componentes en YAML versionado (`squad.yaml`) con un
changelog que registra cada rename/merge de agentes en el tiempo — es trazable
mecánicamente. DealPulseHub ya tenía, desde la auditoría GitHub/npm de esta misma
fecha, su equivalente aproximado: `docs/ARCHITECTURE_MAP.md`, con una tabla
"Estado de coherencia" que cumple una función similar (aunque en Markdown libre,
no YAML validable). No hace falta migrar eso a YAML — el tamaño de DealPulseHub no
lo justifica; ya es proporcional.

### Memoria

Megabrain persiste sesión en archivos (`SESSION-*.md`, `continuous_save.py` en cada
prompt) y usa handoffs YAML explícitos (~400 tokens) en vez de recargar personas
completas (~3-5K tokens) al cambiar de agente — una solución de ingeniería real a un
problema real de ventana de contexto. DealPulseHub usa la memoria estándar de Claude
Code (carpeta por proyecto en `~/.claude/projects/.../memory/`), que ya cumple una
función parecida pero sin el mecanismo de handoff explícito entre agentes (no hace
falta todavía: con 7 agentes de un solo repo, el volumen de handoffs no justifica un
protocolo dedicado — sí lo justificaría si el proyecto creciera a multi-squad).

**Hallazgo colateral (no de esta comparación, de la auditoría de memoria hecha antes
en esta sesión):** la carpeta de memoria de DealPulseHub tiene ~40 archivos que en
realidad pertenecen a un proyecto de copywriting distinto — vale la pena separarlos,
independientemente de Megabrain.

### Inteligencia / Routing

Este es el gap más grande que Megabrain expone. `@aiox-master` en DealPulseHub
"arbitra en 20 minutos" — es una promesa de tiempo sin mecanismo. El `roteador` de
Megabrain calcula un score real (`domain_match*0.4 + problem_match*0.35 +
task_type_match*0.15 + keywords*0.1`) contra thresholds (`route_direct: 0.8`,
`escalate_to_human: 0.6`) y actúa según el resultado. No se portó este mecanismo
completo (sería sobre-ingeniería para 7 agentes de un solo repo), pero si
`@aiox-master` alguna vez necesita arbitrar entre más de 2-3 agentes de forma
recurrente, este es el patrón a copiar — no más prosa de "20 minutos", sino una
tabla de prioridad simple con 2-3 señales objetivas.

### Agentes: la diferencia estructural real

Cada agente real de Megabrain (ej. `supervisor-sistema.md`, revisado línea por línea
en esta sesión) tiene, sin excepción: inputs esperados con tipo y ejemplo, outputs
con formato exacto, una sección explícita de "qué este agente NO hace", dependencias
upstream/downstream nombradas, y anti-patrones documentados ("nunca sugerir squad
nuevo sin evidencia de demanda recurrente"). Es un contrato, no una biografía.

Los 7 agentes creados en DealPulseHub en esta sesión siguen esa misma disciplina a
escala reducida: cada uno tiene su Mission Router (tabla, no prosa), su lista de
restricciones explícitas, y referencias solo a archivos que **existen de verdad**
en este repo (a diferencia de los agentes portados literalmente desde
`Vitalidad Natural`, que fallarían porque apuntan a `.aiox-core/development/tasks/`
— un directorio que no existe aquí).

---

## Honestidad sobre Megabrain: tampoco es perfecto

Para no idealizar el ejemplo: los 5 archivos de nivel superior
`Megabrain/.claude/agents/orquestrador-global--*.md` son wrappers finos que instruyen
leer `squads/orquestrador-global/agents/*.md` (correcto, existe) pero también generar
un saludo vía `core/development/scripts/generate-greeting.js` y seguir
`core/constitution.md` — **ninguno de esos dos últimos archivos existe en el repo**.
Es el mismo tipo de referencia rota que se encontró en DealPulseHub, solo que un
nivel más abajo en la pila. La lección no es "Megabrain es perfecto" — es que incluso
un sistema maduro acumula drift, y que la robustez real está en que el contenido
*funcional* (los agentes de `squads/`) no depende de esas referencias rotas para
operar — el wrapper roto es cosmético (un saludo), no gobernanza crítica.

---

## Qué se adoptó (tres olas)

**Ola 1:**
1. `DealPulseHub/.claude/agents/` — 7 agentes de trabajo: `aiox-analyst`, `aiox-pm`,
   `aiox-ux`, `aiox-dev`, `aiox-architect`, `aiox-qa`, `aiox-devops`.
2. `DealPulseHub/.claude/rules/agent-authority.md` — tabla de autoridad real,
   adaptada del patrón de Megabrain, con las operaciones reales de este repo.
3. Este documento.

**Ola 2 (2026-08-10, misma fecha — a petición explícita de "hacer los agentes
perfectamente funcionales como Megabrain"):**

4. `DealPulseHub/.claude/agents/aiox-master.md` — el orquestador mismo, que en la
   ola 1 seguía sin existir como agente invocable (era el gap más grande: "7 agentes
   de trabajo sin cabeza"). Ruteo por tabla determinística (no scoring ponderado —
   desproporcionado para 8 agentes) + protocolo de arbitraje concreto que reemplaza
   la promesa vaga de "@aiox-master arbitra en 20 minutos".
5. `DealPulseHub/.claude/agents.yaml` — registro único de los 8 agentes, patrón
   simplificado de `Megabrain/.claude/agents.yaml` (sin capas L0-L4 ni squads, que
   resuelven una escala que este proyecto no tiene).
6. `DealPulseHub/.claude/hooks/guard-secrets-precommit.cjs` + wiring en
   `.claude/settings.json` (`PreToolUse` sobre `Bash`) — **primer mecanismo de
   enforcement real** del proyecto, no solo documental. Motivado por un incidente
   real de este mismo repo (token de Figma expuesto dos veces en `scripts/`, ver
   `.ai/decision-log.md`), no por imitar Megabrain en abstracto.

   **Nota de proceso, honesta:** la v1 del hook probaba el texto crudo del comando
   completo contra los patrones prohibidos, y en la primera prueba real disparó un
   falso positivo (bloqueó mi propio script de diagnóstico porque contenía la
   substring `.env` dentro de un `echo` de prueba). Se corrigió a v2: primero aísla
   los segmentos que son de verdad `git add`/`git commit`, y solo trata como
   "posible path" los tokens de un `git add` real — un mensaje de commit que
   simplemente *mencione* `.env` en prosa ya no bloquea. Verificado con 6 casos de
   prueba explícitos antes de darlo por bueno. Se documenta este error a propósito:
   es la misma lección que ya se nombró sobre Megabrain — hasta el mecanismo mejor
   intencionado tiene bugs reales la primera vez, y la diferencia entre gobernanza
   real y gobernanza aspiracional no es "nunca falla", es "se puede probar y
   corregir porque existe".

**Ola 3 (2026-08-10, misma fecha — validación real + cierre del segundo hook):**

7. **Validación real de los agentes** (no simulada). Al intentar invocar `aiox-qa`
   por primera vez, el runtime respondió `Agent type 'aiox-qa' not found` — no por
   un error en los archivos (frontmatter verificado línea por línea, válido), sino
   porque **la lista de subagentes se enumera al arrancar la sesión, no se relee
   dinámicamente** — mismo comportamiento que el registro de MCP servers, ya
   documentado para Penpot. Tras reiniciar la app, se invocaron `aiox-qa` y
   `aiox-master` de verdad: ambos respondieron citando su propio archivo
   textualmente (checklist, plantilla de veredicto, tabla de ruteo), y
   `aiox-master` resolvió correctamente un conflicto simulado aplicando autoridad
   exclusiva en vez de inventar un "compromiso" — el comportamiento exacto que se
   diseñó para reemplazar el arbitraje vago original. También se encontró y
   corrigió, en el mismo pase, una inconsistencia real de nomenclatura: la prosa
   de `aiox-master.md`/`agent-authority.md` usaba el alias de persona (`@qa`)
   donde se necesitaba el `subagent_type` técnico (`aiox-qa`) — ahora hay una
   tabla de mapeo explícita en ambos archivos.
8. `DealPulseHub/.claude/hooks/guard-qa-gate-prepush.cjs` — segundo hook de
   enforcement real: bloquea `git push` salvo que exista un veredicto `APRUEBA` de
   `@qa` para el commit exacto (`HEAD`) que se va a subir, con máximo 72h de
   antigüedad. El estado vive en `.claude/state/qa-verdict.json` (gitignored,
   `aiox-qa.md` sección 4 lo escribe) y se auto-invalida solo — no hace falta
   borrarlo manualmente, un commit nuevo ya lo vuelve obsoleto por comparación de
   HEAD. Verificado con 9 casos de prueba en un **repo git temporal aislado**
   (nunca contra el repo real, para no dejar un veredicto de prueba contaminando
   el estado real). Cierra el gap que la Ola 2 había dejado explícitamente
   anotado como pendiente.

## Qué NO se portó (y por qué)

- **Los 60+ hooks Python de Megabrain, en su totalidad.** Están resolviendo problemas
  de un producto de gestión de conocimiento con ingesta de archivos, RAG, sesiones
  largas y multi-squad. DealPulseHub no tiene esos problemas todavía. Se adoptaron
  **dos** (`guard-secrets-precommit.cjs` y `guard-qa-gate-prepush.cjs`), cada uno
  justificado por un problema real de este repo, no por completitud — ver tabla de
  enforcement en `.claude/agents.yaml`. El segundo cierra el gap que quedaba abierto
  en la primera versión de este documento: el estado entre turnos ("cuál fue el
  último veredicto de @qa") ahora vive en `.claude/state/qa-verdict.json`,
  auto-invalidado por comparación de `HEAD` — no hizo falta un sistema de sesión
  persistente como el de Megabrain, un archivo JSON simple resuelve exactamente
  este caso de uso a esta escala.
- **El algoritmo de routing con scoring.** Sobre-ingeniería para 7 agentes.
- **El sistema de sesión persistente (`SESSION-*.md` + handoffs YAML).** La memoria
  estándar de Claude Code ya cubre esta necesidad al tamaño actual del proyecto.
- **`squad.yaml` como registro YAML versionado.** `docs/ARCHITECTURE_MAP.md` ya
  cumple la misma función en Markdown, proporcional al tamaño del repo.

## Próximo paso recomendado (si se quiere seguir profundizando)

Si en algún momento el número de agentes activos en DealPulseHub crece más allá de
estos 7, o si `@aiox-master` empieza a arbitrar conflictos con frecuencia real (no
hipotética), el siguiente paso natural — tomado directamente del patrón de
Megabrain — es reemplazar la prosa de `AIOX_MASTER_COORDINATION_PROTOCOL.md` por
una tabla de scoring simple (2-3 señales, no el sistema completo de Megabrain).

(El hook `PreToolUse` que hace cumplir la gate de `@qa` antes de `git push` —
mencionado aquí como pendiente en una versión anterior de este documento — ya
está implementado y verificado: ver Ola 3, punto 8.)
