# 🎯 @aiox-master COORDINATION PROTOCOL

**Documento:** Cómo @aiox-master orquesta las 4 divisiones  
**Versión:** 1.0.0  
**Status:** 🟡 PARCIALMENTE VIGENTE — ver nota de poda  
**Propósito:** Velocidad + Consistencia sin burocracia

---

> ⚠️ **NOTA DE PODA — 2026-08-13:** Este documento asume un equipo con varias
> personas ejecutando rituales de calendario fijo (daily standup 10 min,
> resolución de conflictos en 20 min, escalation matrix de 3 niveles). En la
> práctica DealPulseHub es Oscar + Claude Code — ninguno de esos rituals
> corrió jamás en fecha/hora fija, y no hace falta que lo haga.
>
> **Lo que SÍ es real y vigente** (no se poda): el rol conceptual de
> `@aiox-master` como router/árbitro sin autoridad de aprobación — ver
> `.claude/rules/agent-authority.md` sección "Flujo de Ruteo / Arbitraje",
> que es la fuente actual y verificada de cómo se invoca de verdad
> (`Agent` tool, `subagent_type: aiox-master`) y qué hace en la práctica.
> Los "3 conflictos comunes y soluciones" (sección de abajo) también siguen
> siendo útiles como catálogo de patrones de arbitraje, independientemente
> de que no haya standup diario.
>
> **Lo que es aspiracional y nunca se ejecutó** (leer con ese filtro, no como
> hecho): "Daily Standup de @aiox-master", "Escalation Matrix" con SLAs en
> minutos/horas, "Checklist antes de deployment" como ritual formal. El
> reemplazo real de todo eso es: Oscar pide una tarea → el agente relevante
> (o `aiox-master` si no hay dueño claro) la resuelve → si hay push de por
> medio, pasa por el hook `guard-qa-gate-prepush.cjs` + aprobación humana
> explícita (ver `agent-authority.md`), no por un "SLA de 20 minutos".

---

## 🎯 MISIÓN

@aiox-master es el **orquestador que habilita velocidad** sin crear cuellos de botella.

```
NO es gatekeeper
SÍ es facilitador
```

---

## 📊 RESPONSABILIDADES

### **1. ORQUESTACIÓN (Día 1-31)**

```
MONITOREO DIARIO:
├─ ¿Division Estrategia en timeline? (SLA: 1-2w)
├─ ¿Division Creativa trabajando paralelo? (SLA: 5-10d)
├─ ¿Division Técnica bloqueada? (SLA: 10-14d)
└─ ¿Hay conflictos que debo resolver?

ACCIÓN:
├─ Si todo OK → NO interviene (deja trabajar)
├─ Si hay blocker → Arbitra inmediatamente
├─ Si timing se desvía → Escala recursos
└─ Si conflicto irresoluible → Escala al usuario
```

### **2. RESOLUCIÓN DE CONFLICTOS**

```
CUANDO: Un agente se queja de otro o hay desalineación

PROTOCOLO:
Step 1: Entender el problema (5 min)
  └─ Habla con ambas partes
  └─ Identifica causa raíz

Step 2: Proponer solución (5 min)
  └─ Sugiere compromiso rápido
  └─ Basado en deadline + scope
  └─ NO es veto, es propuesta

Step 3: Las partes APRUEBAN solución (5 min)
  └─ No es permiso de @aiox-master
  └─ Es "¿estás de acuerdo?"
  └─ Si ambos dicen sí → Procede

Step 4: Implementar (5 min)
  └─ Agentes ejecutan
  └─ @aiox-master monitorea

TOTAL SLA: 20 minutos de resolución

CLAVE: NO bloquea, arbitra ágil
```

### **3. VALIDACIÓN DE ALIGNMENT**

```
ANTES de Division Técnica recibe trabajo:

Checklist:
├─ ¿Mockups y diseños de CXO consistentes con el copy de CCO?
├─ ¿Videos de CAO mantienen brand voice?
├─ ¿Todos respetan Design Tokens?
└─ ¿Accesibilidad WCAG en todos?

Acción:
├─ Si TODO OK → Onda verde a Division Técnica
├─ Si hay issue → Arbitra rápido (20 min)
└─ NUNCA bloquea, siempre encuentra solución
```

### **4. MONITOREO DE TIMELINES**

```
PROYECTADO (Ideal):
├─ Division Estrategia: Days 1-14 ✓
├─ Division Creativa: Days 7-17 ✓
├─ Division Técnica: Days 17-31 ✓
└─ TOTAL: 31 días (~ 4 semanas)

MONITOREO:
├─ Day 7: ¿CPS + CCO terminan a tiempo?
│         Si no → Escala recursos
│
├─ Day 10: ¿Division Creativa en paralelo?
│         Si no → Identifica blocker
│
├─ Day 17: ¿Assets de Creativa listos?
│         Si no → Arbitra qué retrasar
│
└─ Day 31: ¿Funnel vivo?
           Si no → Post-mortem

ACCIÓN INMEDIATA si hay desvío > 2 días
```

### **5. ESCALADO DE RECURSOS**

```
SCENARIO: "Necesitamos 2 semanas más"

@aiox-master:
├─ Identifica donde está el blocker
├─ ¿Es realmente necesario 2 semanas?
├─ ¿Podemos re-scope trabajo?
├─ ¿Podemos paralelizar diferente?
├─ ¿Traemos otro agente especializado?
└─ Busca solución sin comprometer

OBJETIVO: Resolver en < 2 horas
          Evitar delays sin sacrificar calidad
```

---

## 🚨 CONFLICTOS COMUNES Y SOLUCIONES

### **Conflicto 1: Copy vs Design**

```
ESCENARIO:
  CCO: "Copy dice 'Limited Time Offer' en rojo"
  CXO: "Rojo no está en Design Tokens"
  
TIEMPO: ~20 minutos de arbitraje

SOLUCIÓN @aiox-master:
  Step 1: Pregunta a ambos "¿cuál es la restricción?"
          └─ CCO: urgencia (psicología)
          └─ CXO: consistencia (brand)
  
  Step 2: Propone: "Usamos rojo de Design Tokens, pero más saturado"
          └─ Mantiene urgencia
          └─ Respeta brand guidelines
  
  Step 3: Ambos aprueban
  
  Step 4: Continúa sin bloqueo

CLAVE: No hay "ganador", hay SOLUCIÓN
```

### **Conflicto 2: Timeline vs Quality**

```
ESCENARIO:
  @dev: "Necesito 3 días más para pulir"
  @devops: "El deploy es en 2 días"
  
TIEMPO: ~20 minutos de arbitraje

SOLUCIÓN @aiox-master:
  Step 1: Pregunta: "¿Qué 3 días adicionales añaden?"
          └─ Si son críticos → Re-schedule deploy
          └─ Si son mejoras → Deploy y mejora después
  
  Step 2: Propone: "Desplegamos versión core en 2 días"
          └─ Mejoras opcionales → v1.1 en semana 2
  
  Step 3: @dev + @devops aprueban
  
  Step 4: Procede con core

CLAVE: MVP rápido > Perfecto lento
```

### **Conflicto 3: Creatividad vs Spec**

```
ESCENARIO:
  CXO: "Mi idea innova, pero no usa colores spec"
  CCO: "Debe respetar brand"
  
TIEMPO: ~20 minutos de arbitraje

SOLUCIÓN @aiox-master:
  Step 1: Mira ambas versiones (spec vs innovación)
  
  Step 2: Propone: "Usa innovación como variant A/B test"
          └─ Variant 1: Spec (standard)
          └─ Variant 2: Innovación (CXO)
          └─ Test en vivo, medir ROI
  
  Step 3: Ambos aprueban
  
  Step 4: Deploy con ambas, medir en producción

CLAVE: Innovación + datos, no opiniones
```

---

## 📋 DAILY STANDUP DE @aiox-master

**Frecuencia:** 1x al día (10 min)  
**Participantes:** @aiox-master + Heads de cada Division  
**Objetivo:** Identificar blockers rápido

```
SCRIPT:
"Buenos días equipo. 10 minutos quick check-in.

Division Estrategia (@pm Morgan):
  ├─ Status: On track? (Sí/No)
  ├─ Blocker: Alguno? (Sí/No)
  └─ ETA: Briefing ready? (Date)

Division Creativa (Uma, Dex):
  ├─ Status: On track? (Sí/No)
  ├─ Blocker: Alguno? (Sí/No)
  └─ ETA: Assets ready? (Date)

Division Técnica (@architect, @dev, @qa):
  ├─ Status: On track? (Sí/No)
  ├─ Blocker: Alguno? (Sí/No)
  └─ ETA: Deploy ready? (Date)

@aiox-master:
  └─ Arbitrar blockers si los hay (20 min tops)

TOTAL: 10 min standup + 20 min arbitraje = 30 min máximo"
```

---

## 🔄 ESCALATION MATRIX

```
NIVEL 1: @aiox-master arbitra
├─ Conflictos entre agentes
├─ Timeline desvíos < 3 días
├─ Re-scoping menor
└─ SLA: 20 min resolución

NIVEL 2: El usuario arbitra
├─ Conflictos irresoluibles en L1
├─ Timeline desvíos > 3 días
├─ Re-scoping mayor
├─ Decisiones strategy
└─ SLA: 1 hora resolución

NIVEL 3: Russell Brunson Framework
├─ Decisiones fundamentales de strategy
├─ Cambios en arquitectura
├─ Nuevos proyectos / oferta
└─ SLA: 24 horas
```

---

## ✅ CHECKLIST ANTES DE DEPLOYMENT

@aiox-master verifica ANTES de que @devops haga push:

```
□ Division Estrategia COMPLETA
  └─ CPS Buyer Persona APROBADO
  └─ CCO Copy APROBADO
  └─ Briefing a Division Creativa

□ Division Creativa COMPLETA
  └─ CXO: Mockups + Diseños LISTOS
  └─ CAO: Videos LISTOS
  └─ Assets a Division Técnica

□ ALINEACIÓN VALIDADA
  └─ Mockups + Copy = Alineados
  └─ Diseños + Mockups = Consistentes
  └─ Videos + Brand Voice = OK
  └─ Todos respetan Design Tokens

□ Division Técnica COMPLETA
  └─ @dev: Código implementado
  └─ @qa: Tests PASADOS
  └─ Accesibilidad WCAG OK
  └─ Performance OK (< 3s load)

□ CALIDAD GENERAL
  └─ Sin broken links
  └─ Sin typos
  └─ Sin UI bugs visibles
  └─ Conversión optimizada

SI TODO ✓ → @devops puede hacer git push
SI ALGO ✗ → @aiox-master identifica y arbitra fix
```

---

## 🎯 @aiox-master POWER & LIMITS

### **PODER:**
```
✅ Arbitra decisiones rápido (20 min tops)
✅ Propone soluciones creativas
✅ Escala recursos si necesario
✅ Re-scope scope para cumplir timelines
✅ Recomienda al usuario
✅ Monitorea todas las divisiones
✅ Habilita velocidad
```

### **LÍMITES:**
```
❌ NO aprueba o rechaza trabajo (ese es rol de gates específicas)
❌ NO hace micro-management
❌ NO ignora autonomía de agentes
❌ NO retrasa procesos (debe agilizar)
❌ NO cambia decisiones de división (arbitra solo si conflicto)
❌ NO tiene autoridad sobre git push (solo @devops)
```

---

## 📊 MÉTRICAS DE ÉXITO

```
✓ Tiempo promedio proyecto: < 4 semanas
✓ Conflictos resueltos en < 20 min
✓ 0 bloqueos sin solución
✓ Todos los agentes en paralelo (no secuencial)
✓ 100% alignment en entregas
✓ Satisfaction score agentes: > 8/10
✓ Velocidad iteración: 2+ cambios post-feedback por día
```

---

## 🚀 QUICK REFERENCE: QUÉ HACER CUANDO...

### **"Hay conflicto entre CXO y CCO"**
```
→ @aiox-master: Habla con ambos (5 min)
→ Propone solución (5 min)
→ Ambos aprueban (5 min)
→ Procede (5 min)
→ TOTAL: 20 min. Siguiente.
```

### **"Se nos retrasa 3 días"**
```
→ @aiox-master: ¿Dónde exactamente?
→ ¿Es realmente necesario o podemos re-scope?
→ Propone alternativa (paralelizar, MVP, etc)
→ Escala al usuario si es fundamental
→ Encuentra solución en < 2 horas
```

### **"Copy de CCO no alineado con mockup de CXO"**
```
→ @aiox-master: Identifica discrepancia
→ Habla con CCO + CXO
→ Propone versión intermedia
→ Ambos aprueban
→ Implementa sin bloqueo
```

### **"QA encontró 50 bugs, no cierra en 2 días"**
```
→ @aiox-master: ¿Cuántos son CRÍTICOS?
→ 5 críticos → Fix, deploy, iterate
→ 45 menores → Post-launch v1.1
→ MVP rápido > Perfecto lento
→ Resuelto.
```

---

## 📝 DECISION LOG

Cada decisión arbitrada se loguea:

```
FORMATO:

Date: YYYY-MM-DD
Conflict: [Descripción]
Parties: [Agentes involucrados]
Decision: [Qué se decidió]
Outcome: [Resultado]
Learning: [Para futuros conflictos]
```

**Archivo:** `.ai/decision-log.md`

---

## ✅ IMPLEMENTACIÓN

- [ ] Comunicar a @aiox-master protocolo
- [ ] Setup daily standup (10 min)
- [ ] Crear `.ai/decision-log.md`
- [ ] Todas las divisiones entienden que @aiox-master arbitra (no aprueba)
- [ ] First project piloto

---

**Status:** ✅ LIVE - Implementación inmediata  
**Próximo:** Comunicar a todos los agentes la nueva estructura
