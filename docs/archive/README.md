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

## Si necesitas algo de aquí

Estos archivos siguen siendo legibles y su historial de git se preservó
(`git mv`, no se borraron). Si una idea concreta de alguno sigue siendo
válida hoy, muévela a un documento activo en `.claude/rules/` con contexto
actualizado — no la resucites moviendo el archivo de vuelta tal cual.
