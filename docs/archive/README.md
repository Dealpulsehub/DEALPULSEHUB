# Archivo — documentos retirados de carga automática

**Creado:** 2026-08-13, como acción directa de la auditoría operativa
"Sala de Máquinas" (ver `docs/ARCHITECTURE_MAP.md` y `.ai/decision-log.md`
para el detalle completo del hallazgo).

## Por qué existen estos archivos aquí y no en `.claude/rules/`

Todo archivo `.md` dentro de `.claude/rules/` se inyecta completo como
"project instructions" en **cada mensaje de cada sesión** de Claude Code en
este repo, sin importar si la tarea del turno tiene algo que ver con su
contenido. Los 6 documentos movidos aquí compartían dos problemas:

1. **Describían un equipo humano que nunca existió.** CPS/CCO/CXO/CAO como
   personas contratadas distintas, un junior designer, presupuestos
   mensuales de $2,000–$4,000, reuniones 1:1, standups diarios, canales de
   Slack, cronogramas de "Día 1 / Día 2" con horas exactas. La realidad
   operativa de DealPulseHub es Oscar + Claude — estos documentos nunca se
   corrigieron para reflejarlo (a diferencia de
   `.claude/rules/HYBRID_DESIGN_STRATEGY_IMPLEMENTATION.md`, que sí tiene una
   nota de corrección explícita fechada 2026-08-07 y por eso se queda en
   `.claude/rules/`).
2. **Eran narrativa histórica de un momento puntual (2026-08-07), no reglas
   operativas activas.** Ninguno describe cómo debe comportarse un agente
   hoy; describen qué se planeó hacer esa semana.

El sexto documento, `ADS_CAROUSELS_NEURO_COMPLETE_SYSTEM.md`, se archivó por
una razón distinta: es pseudocódigo Python que el propio texto admite que
"nunca se implementó" — no hay mecanismo real detrás, solo la promesa de uno.

## Contenido de esta carpeta

| Archivo | Por qué se archivó |
|---|---|
| `LAUNCH_PLAN_THIS_WEEK.md` | Cronograma hora-por-hora de una semana de 2026-08-07 para un equipo de 8+ personas. Nunca ejecutado tal cual. |
| `COMMUNICATION_PLAN_DIVISIONAL_LAUNCH.md` | Guiones de email/reunión para anunciar la estructura divisional a un equipo que no existe. |
| `COMUNICACION_AL_EQUIPO_FASE_1.md` | Duplica el propósito del anterior con otro cronograma de la misma semana. |
| `ESTADO_PROYECTO_AUGUST_7.md` | Checkpoint de estado de un solo día (2026-08-07), redactado como si fuera vigente indefinidamente. |
| `FASE_1_START_AHORA.md` | Guía paso a paso de setup de Penpot ya completada — el setup real ocurrió y quedó documentado en `PENPOT_MCP_PRODUCTION_PROTOCOL.md` (global). |
| `ADS_CAROUSELS_NEURO_COMPLETE_SYSTEM.md` | Sistema de auditoría neuro de ads en pseudocódigo Python, nunca implementado. |

### Segunda ola — retiro de `@product-design-expert` y la capa narrativa GRAVX (2026-08-14)

Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle completo de esta decisión
(`@architect`, aprobada por el usuario).

| Archivo | Por qué se archivó |
|---|---|
| `PRODUCT_DESIGN_EXPERT_COMPLETE_SPECIFICATION.md` | Especifica un agente (`@product-design-expert`) que nunca se implementó — sin archivo en `.claude/agents/`, ausente de `.claude/agents.yaml`. Su scope completo ya lo cubre `aiox-ux` (ver `docs/ARCHITECTURE_MAP.md` § 5️⃣). |
| `PRODUCT_DESIGN_EXPERT_EXPANDED_SCOPE.md` | Especifica un agente (`@product-design-expert`) que nunca se implementó — sin archivo en `.claude/agents/`, ausente de `.claude/agents.yaml`. Su scope completo ya lo cubre `aiox-ux` (ver `docs/ARCHITECTURE_MAP.md` § 5️⃣). |
| `PRODUCT_DESIGN_EXPERT_INTEGRATED_SCOPE.md` | Especifica un agente (`@product-design-expert`) que nunca se implementó — sin archivo en `.claude/agents/`, ausente de `.claude/agents.yaml`. Su scope completo ya lo cubre `aiox-ux` (ver `docs/ARCHITECTURE_MAP.md` § 5️⃣). |
| `PRODUCT_DESIGN_EXPERT_TEMPLATES_PROMPTS.md` | Especifica un agente (`@product-design-expert`) que nunca se implementó — sin archivo en `.claude/agents/`, ausente de `.claude/agents.yaml`. Su scope completo ya lo cubre `aiox-ux` (ver `docs/ARCHITECTURE_MAP.md` § 5️⃣). |
| `PRODUCT_DESIGN_EXPERT_TOOLKIT.md` | Especifica un agente (`@product-design-expert`) que nunca se implementó — sin archivo en `.claude/agents/`, ausente de `.claude/agents.yaml`. Su scope completo ya lo cubre `aiox-ux` (ver `docs/ARCHITECTURE_MAP.md` § 5️⃣). |
| `HYBRID_DESIGN_STRATEGY_IMPLEMENTATION.md` | Plan de contratación de un designer humano + junior para un rol (`@product-design-expert`) que nunca existió como agente. |
| `ORGANIZATIONAL_STRUCTURE_DIVISIONAL.md` | Org-chart y reglas de autonomía de la capa narrativa GRAVX, origen de `@product-design-expert` como rol separado. Superado por `agent-authority.md`, verificable contra `.claude/agents.yaml`. |
| `DIVISION_AUTONOMY_CHARTER.md` | Org-chart y reglas de autonomía de la capa narrativa GRAVX, origen de `@product-design-expert` como rol separado. Superado por `agent-authority.md`, verificable contra `.claude/agents.yaml`. |
| `ALTERNATIVAS_A_FIGMA_FREE_LOW_COST.md` | Catálogo de herramientas dirigido al rol retirado; premisa Figma muerta (Penpot no tiene marketplace de plugins equivalente). Contenido con vigencia real (licencias, gaps de Penpot) rescatado a `docs/ARCHITECTURE_MAP.md` § 5️⃣ antes de archivar. |
| `GITHUB_RESOURCES_AVAILABLE.md` | Catálogo de herramientas dirigido al rol retirado; premisa Figma muerta (Penpot no tiene marketplace de plugins equivalente). Contenido con vigencia real (licencias, gaps de Penpot) rescatado a `docs/ARCHITECTURE_MAP.md` § 5️⃣ antes de archivar. |
| `TOOLS_ECOSYSTEM_PRODUCT_DESIGNER.md` | Catálogo de herramientas dirigido al rol retirado; premisa Figma muerta (Penpot no tiene marketplace de plugins equivalente). Contenido con vigencia real (licencias, gaps de Penpot) rescatado a `docs/ARCHITECTURE_MAP.md` § 5️⃣ antes de archivar. |
| `IMPLEMENTATION_ROADMAP_SEQUENTIAL.md` | Su propia nota ya admitía estar mayormente superado por el pipeline Node real (`scripts/penpot-*.js`). |
| `ANALISIS_INTEGRAL_ARQUITECTURA.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `CHECKLIST_IMPLEMENTACION_FASE_4.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `FASE_1_COMPLETADA.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `FASE_2_COMPLETADA.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `FASE_3_COMPLETADA.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `FASE_4_COMPLETADA.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `INDICE_COMPLETO_AUDITORIA.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `MODELO_DE_NEGOCIO_AGENCIA_PREMIUM.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `QUICK_START_FINAL.txt` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `REPORTE_FINAL_AUDITORIA.txt` | Además de ser snapshot de sesión, literalmente escribe "AUDITOR: @aiox-master (Director General)", conflando el agente real con el rol narrativo retirado. |
| `RESUMEN_EJECUTIVO_AUDITORIA.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `RESUMEN_EJECUTIVO_SISTEMA_COMPLETO.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `ROADMAP_COMPLETO_A_D.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `SESION_COMPLETADA.txt` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `SISTEMA_ABC_LISTO.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `SISTEMA_COMPLETO_AUTOMATIZADO.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |
| `SISTEMA_COMPLETO_ESTADO_FINAL.md` | Snapshot narrativo de una sola sesión (6-7 agosto 2026), nunca documentación viva. Ver `docs/ARCHITECTURE_MAP.md` § 5️⃣ para el detalle de la limpieza. |

## Si necesitas algo de aquí

Estos archivos siguen siendo legibles y su historial de git se preservó
(`git mv`, no se borraron). Si una idea concreta de alguno sigue siendo
válida hoy, muévela a un documento activo en `.claude/rules/` con contexto
actualizado — no la resucites moviendo el archivo de vuelta tal cual.
