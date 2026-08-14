# 🗺️ ARCHITECTURE MAP — Los Sistemas Reales de DealPulseHub

**Documento:** Mapa de verdad de qué existe en este repo y cómo se relaciona  
**Versión:** 1.0.0  
**Creado:** 2026-08-10, tras auditoría GitHub/npm que reveló que el repo contiene
**varios sistemas construidos en sesiones distintas, sin conexión narrativa entre ellos.**

---

## 🎯 Por qué existe este documento

Una auditoría de GitHub + npm (2026-08-10) encontró que:
- El código real en `src/` tiene ~2000 líneas de un backend de orquestación de agentes
  ("Sistema Antigravity") que **no aparece mencionado en ningún otro doc** de `.claude/rules/`.
- El README.md solo describe ~20% de lo que el repo realmente contiene.
- Existen 2 sistemas de automatización de diseño (Figma sync + Penpot MCP) documentados
  por separado sin que se indique cuál usar cuándo.

Este documento es el punto de entrada que conecta todo. Si vas a trabajar en este proyecto,
**lee esto primero**, luego profundiza en el doc específico del sistema que te toque.

---

## 📦 LOS 4 SISTEMAS REALES

```
DealPulseHub (1 solo repo, 4 sistemas)
│
├─ 1. DESIGN SYSTEM (público, npm package)
│     └─ src/components/, src/tokens/, .storybook/
│     └─ README.md lo describe (correctamente, pero de forma incompleta)
│
├─ 2. SISTEMA ANTIGRAVITY (backend interno de orquestación de agentes)
│     └─ src/orchestration/, src/quality/, src/security/, src/clients/,
│        src/integration/, src/metrics/, src/audit/, src/api/server-phase*.js
│     └─ NO documentado en README.md — solo vive en memoria de Claude + este mapa
│
├─ 3. PENPOT MCP (producción de mockups vía IA)
│     └─ scripts/penpot-extract.js + protocolo GLOBAL en
│        C:\Users\Oscar\.claude\rules\PENPOT_MCP_PRODUCTION_PROTOCOL.md
│     └─ Reemplaza en gran parte al Figma Sync para creación (no solo extracción)
│
└─ 4. METODOLOGÍA (Opción C Divisional + roles CPS/CCO/CXO/CAO)
      ├─ .claude/rules/ORGANIZATIONAL_STRUCTURE_DIVISIONAL.md y relacionados
      ├─ Es la CAPA DE PROCESO — gobierna cómo se decide trabajar,
      │  independiente del código en src/
      └─ 4.1 Puente Megabrain (scripts/megabrain-expert.js) — herramienta de
         consulta, NO un quinto sistema. Ver sección 4️⃣.1
```

---

## 1️⃣ Design System (lo único que describe el README)

**Qué es:** Paquete npm `@dealpulsehub/design-system` — componentes React tipados
(Button, Card, Input, Badge, Typography) + design tokens autogenerados + Storybook.

**Estado real (2026-08-10):**
- ✅ Componentes funcionan, con tests reales (`npm test`, 33 tests pasando)
- ✅ `npm run build` compila limpio (TypeScript + tokens)
- ✅ Publicado a npm: [`@dealpulsehub/design-system@1.0.0`](https://www.npmjs.com/package/@dealpulsehub/design-system)
  (2026-08-10) — el build publicable usa `tsconfig.build.json` (solo
  components/tokens/hooks), no el `tsconfig.json` principal, para no filtrar el
  backend Antigravity dentro del paquete
- ✅ Storybook actualizado 7.6 → 8.x — 3 vulnerabilidades moderadas restantes
  (cadena `@storybook/addon-actions` → `uuid`, sin fix disponible aún, dev-only)

**Comandos clave:** `npm run dev` (Storybook), `npm test`, `npm run build`, `npm run lint`

---

## 2️⃣ Sistema Antigravity (el que NADIE documentó fuera del código)

**Qué es:** Backend de orquestación multi-agente — coordina tareas, valida calidad,
audita decisiones, gestiona seguridad y clientes, resuelve conflictos entre GRAVX↔AIOX.

**Módulos (`src/`):**
| Módulo | Función |
|---|---|
| `orchestration/task-orchestrator.js` | Crea/asigna/trackea tareas entre agentes |
| `quality/quality-gate.js` | Valida calidad de entregables antes de aprobar |
| `security/security-officer.js` | Audita código, valida inputs, calcula score de seguridad |
| `clients/client-manager.js` | Gestión de clientes/proyectos/notificaciones |
| `integration/bridge-agent.js` | Traduce y resuelve conflictos GRAVX↔AIOX |
| `metrics/metrics-monitor.js` | Métricas de aprobación/rendimiento |
| `audit/decision-auditor.js` | Registro de decisiones tomadas |

**Servidores API (evolución por fases, `src/api/`):**
- `server-phase4.js` — **API oficial** (`npm run api` / `npm run dev:api`). Integra
  los 7 módulos de arriba (40+ endpoints: `/api/v4/bridge/*`, `/api/v4/security/*`,
  `/api/v4/clients/*`, `/api/v4/workflow/*`). Verificado end-to-end 2026-08-10: los
  14 tests de `demo-phase4.js` pasan de punta a punta.
- `server.ts` — Fase 1, prototipo inicial (task queue simple, sin integración con
  los módulos Antigravity). **Retirado como API oficial el 2026-08-10** — se mantiene
  solo como referencia histórica, ejecutable con `npm run api:legacy-v1`. No se borró
  el archivo por si hace falta consultar el diseño original.
- `server-phase2.js`, `server-phase3.js` — incrementos intermedios hacia Fase 4.
  Ejecutables con `npm run api:phase2` / `api:phase3`, mantenidos por referencia.
- `demo-phase2/3/4.js` (antes `test-phase*.js`, renombrados 2026-08-10) — **son demos
  con `console.log`, NO son tests automatizados** (sin asserts). Ejecutables con
  `npm run demo:phase2/3/4`.

**✅ Resuelto 2026-08-10 — Bug end-to-end de `demo:phase4`:** el workflow terminaba
con `Status: undefined` y un crash `Cannot read properties of undefined (reading
'phases')`. Causa real (no de configuración): `server-phase4.js` descartaba el
valor de retorno de `orchestrator.enqueueTask()` (que construye un objeto nuevo con
su propio id, sin mutar el argumento recibido) y llamaba a
`qualityGate.validateOutput()` con 2 argumentos en vez de los 3 que espera
(`taskId, taskType, output`), desplazando los parámetros y devolviendo `null`. Ver
`.ai/decision-log.md` para el detalle completo del debugging (incluye un proceso
Node huérfano de horas antes que enmascaró el fix durante varios intentos).

---

## 3️⃣ Penpot MCP (construcción de mockups por IA)

Ver protocolo completo (GLOBAL, aplica a cualquier proyecto):
`C:\Users\Oscar\.claude\rules\PENPOT_MCP_PRODUCTION_PROTOCOL.md`

**Relación con Figma Sync:** son complementarios, no excluyentes.
- **Figma Sync** (`scripts/figma-sync.js`, workflow `.github/workflows/figma-sync.yml`):
  sincroniza tokens DESDE Figma hacia este repo (dirección: Figma → código).
- **Penpot MCP**: crea/modifica mockups DESDE código hacia Penpot (dirección: código → diseño),
  útil para producción de mockups de campaña (Product Box, Order Bump, etc.), no para
  el design system de componentes en sí.

No hay conflicto — Figma Sync alimenta el Design System (sistema 1), Penpot MCP alimenta
la producción de campañas de marketing (mockups de ofertas, ads), que es un output distinto.

---

## 4️⃣ Metodología (Opción C Divisional)

Ver `.claude/rules/ORGANIZATIONAL_STRUCTURE_DIVISIONAL.md`,
`DIVISION_AUTONOMY_CHARTER.md`, `AIOX_MASTER_COORDINATION_PROTOCOL.md`.

**Relación con el código:** Esta capa define CÓMO se decide trabajar (roles CPS/CCO/CXO/CAO,
gates de aprobación) — es independiente de si el trabajo resultante toca el Design System,
el Sistema Antigravity, o Penpot. Un mismo proyecto puede tocar los 3 sistemas de código
bajo la misma metodología de decisión.

---

## 4️⃣.1 Puente Megabrain — consulta de expertos (decisión @architect 2026-08-13)

**Veredicto: APROBADO CON CAMBIOS.** El diseño de `@analyst` (CPS) para
`scripts/megabrain-expert.js` se aprueba en su forma general (script CommonJS de
solo lectura, sin dependencias nuevas, consulta puntual bajo demanda), con 3
cambios obligatorios y 1 recomendado antes de que `@dev` lo dé por terminado.

### Por qué NO es un quinto sistema

Los 4 sistemas de este mapa son cuerpos de código con estado, ciclo de vida y
superficie propia. Esto es ~150 líneas de solo lectura que no genera artefactos,
no expone endpoints y no participa de ningún build. Elevarlo a "sistema 5"
inflaría el mapa y sugeriría un acoplamiento mayor del que existe. Es una
**herramienta de la capa de metodología (sistema 4)**: alimenta el criterio
humano/agente de los roles CPS/CCO, no el código de los sistemas 1–3.

### Frontera entre repos (no negociable)

Megabrain es un **repositorio git independiente** (`Megabrain/.git` verificado),
no un submódulo ni un paquete. Reglas de acoplamiento:

1. **Una sola dirección, solo lectura.** DealPulseHub lee de Megabrain. Nunca
   escribe en `Megabrain/`, nunca al revés.
2. **Dependencia opcional.** Si `MEGABRAIN_PATH` no está o la ruta no existe, el
   script falla con error explicativo y `exit 1` — y *nada más del repo se rompe*.
3. **Prohibido en cualquier ruta automática:** no entra en `.github/workflows/ci.yml`,
   ni en `npm run build`, `test`, `prepublish` ni `penpot:pipeline`. Solo invocación
   manual (`npm run megabrain:expert -- <nombre>`).
4. **Prohibido vendorizar.** No copiar `AGENT.md`/`SOUL.md` al repo, ni como caché
   commiteada, ni como submódulo. Son ~1 MB en 58 expertos y Megabrain es su única
   fuente de verdad; una copia aquí sería un fork obsoleto con dos verdades.
5. **Ruta por `.env`, nunca hardcodeada.** `.env` ya está en `.gitignore`. Como el
   repo no tiene `.env.example`, la variable se documenta en el header del script,
   igual que `scripts/penpot-extract.js` documenta `PENPOT_API_KEY`.

### Cambios obligatorios sobre la propuesta de CPS

| # | Cambio | Por qué (verificado) |
|---|---|---|
| 1 | Leer el campo **`path:`** de cada entrada del índice, no reconstruir la ruta por convención | `AGENT-INDEX.yaml` ya trae `path: agents/persons/<X>/` en las 58 entradas de `minds:`, y el mapeo id→carpeta coincide 1:1 con el filesystem. El índice es la fuente autoritativa; reconstruir `id → NOMBRE_MAYUS` duplica una convención que el índice ya resuelve. La convención se mantiene **solo como fallback** cuando el id no está indexado. |
| 2 | **Contención de ruta obligatoria**: resolver la ruta final y abortar si no queda dentro de `<MEGABRAIN_PATH>/agents/persons/` | 🔒 El fallback por convención deriva la ruta del input del usuario. Sin esta verificación, un nombre como `../../../algo` convierte el script en lectura arbitraria de archivos, cuyo contenido además se vuelca a stdout y de ahí al contexto de un LLM. Severidad baja (local, un solo usuario), pero el costo del fix es una línea. |
| 3 | El bloque `minds:` termina en **la siguiente clave de nivel superior**, no en `cargo:` | Verificado en el archivo real: el orden es `minds:` (L28) → `conclave:` (L324) → `cargo:` (L339). Un regex que corte en `cargo:` se traga los 3 agentes de `conclave` como si fueran expertos. |

**Recomendado (no bloqueante):** modo `--list` (imprime los ids del índice) y flags
`--soul` / `--agent` para traer un solo archivo. Sin `--list`, descubrir los 58
nombres válidos obliga a abrir Megabrain a mano. Los flags importan porque el
experto más grande (`MIKE_FILSAIME`: 66 KB + 17 KB) son ~21k tokens en una sola
consulta; la media (~18 KB ≈ 4.5k tokens) sí es asumible por defecto.

### Confirmado sin cambios

- **Sin librería YAML.** Correcto: agregar una dependencia de producción para un
  parseo de una sección estable no se justifica. Se acepta el regex acotado.
- **Fallback por convención + aviso si falta `AGENT.md` o `SOUL.md`.** Correcto y
  necesario: el propio `AGENT-INDEX.yaml` advierte que `agent_index_updater.py`
  puede revertir correcciones manuales, así que el índice *puede* desincronizarse
  del disco. Un índice desactualizado debe degradar a aviso, no a fallo duro.
- **Nombre y namespace.** `megabrain:expert` es consistente con `penpot:*` /
  `figma:sync`. `process.argv.slice(2)` ya es patrón establecido en 10 scripts.
- **Estilo.** Seguir `scripts/penpot-extract.js`: shebang, header JSDoc con
  Requisitos/Uso, `require('dotenv').config()`, error de configuración con pasos
  concretos + `process.exit(1)`, `main()` al final.

**Siguiente paso:** `@dev` implementa. `@qa` valida especialmente el cambio 2
(contención de ruta) y el 3 (que `--list` / la resolución no devuelva agentes de
`conclave`).

---

## ✅ Estado de coherencia (post-auditoría 2026-08-10)

| Área | Antes | Después |
|---|---|---|
| eslint/ts-node/jest instalados | ❌ Faltaban | ✅ Instalados y verificados |
| tsconfig.json | ❌ No existía | ✅ Creado |
| `npm run build` | ❌ Fallaba (bug real en generador de tokens) | ✅ Compila limpio |
| Tests reales | ❌ 0 | ✅ 33 tests, 5 suites |
| URLs repo en package.json | ❌ Apuntaban a repo inexistente | ✅ Corregidas |
| server.js vs server.ts | ❌ Duplicados divergentes | ✅ Consolidado (server.ts único) |
| server-phase2/3/4.js | ❌ Huérfanos, sin script npm | ✅ Conectados (`api:phaseN`) |
| API oficial: server.ts vs server-phase4.js | ❌ Sin decidir | ✅ `server-phase4.js` es el oficial (`npm run api`); server.ts retirado a `api:legacy-v1` |
| test-phaseX.js mal nombrados | ❌ Sugerían tests reales | ✅ Renombrados a `demo-phaseX.js` |
| Bug workflow end-to-end (`demo:phase4`) | ❌ Crasheaba, status undefined | ✅ Corregido (3 bugs reales en cascada) |
| Vulnerabilidades Storybook | ❌ 21 moderadas (Storybook 7.x) | ✅ 3 (upgrade verificado a Storybook 8.x) |
| Node version en CI | ❌ Node 18 (incompatible con Storybook 8) | ✅ Node 20, `engines.node` actualizado |
| Este documento | ❌ No existía | ✅ Creado |
| Acceso a los 58 expertos de Megabrain | ❌ Manual, abriendo el otro repo a mano | 🟡 Diseño aprobado con cambios (`scripts/megabrain-expert.js`) — pendiente de `@dev`, ver 4️⃣.1 |

---

## 🔗 Documentos relacionados

- `PENPOT_MCP_PRODUCTION_PROTOCOL.md` (global) — sistema 3
- `ORGANIZATIONAL_STRUCTURE_DIVISIONAL.md` — sistema 4
- `docs/MEGABRAIN_VS_DEALPULSEHUB.md` — relación entre los dos repos (gobernanza) — contexto de 4️⃣.1
- `.ai/decision-log.md` — historial completo de decisiones y hallazgos de esta auditoría
