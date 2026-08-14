# 🚀 IMPLEMENTATION ROADMAP — SECUENCIAL (Sin pausas)

**Documento:** Plan de implementación paso a paso, en orden  
**Versión:** 1.0.0  
**Status:** 🟢 FASE 1 Y 2 EJECUTADAS (2026-08-07) — ver nota abajo  
**Opción:** OPCIÓN 1 (PENPOT Gratis + Automación 100%)  
**Tiempo total:** ~4-5 horas  
**Pausas:** NINGUNA (flujo continuo)

---

> ✅ **ACTUALIZACIÓN — 2026-08-07:** Fase 1 (setup Penpot) y Fase 2 (mockups)
> ya se ejecutaron, pero por una vía más eficiente que la descrita abajo:
> Penpot MCP (`execute_code`) en vez de crear cada mockup manualmente en la
> UI. Los 6 mockups viven en el archivo "Dealpulsehub" → página
> "Fase 2 - Mockups", más un Design System real (colores/tipografía/
> componentes) en la página "Design System". La Fase 3 (scripts Python de
> extracción) sigue sin implementar y probablemente ya no haga falta tal
> como está descrita — ver `PENPOT_AUTOMATION_SYSTEM_COMPLETE.md` (nota al
> inicio) y `C:\Users\Oscar\.claude\rules\PENPOT_MCP_PRODUCTION_PROTOCOL.md`
> para el flujo real y vigente.

---

## 📋 ROADMAP VISUAL

```
START (HOY)
    ↓
PHASE 1: Penpot Setup (30 min)
    ↓
PHASE 2: Create Mockups (2-3 horas)
    ↓
PHASE 3: Setup Automation (45 min)
    ↓
PHASE 4: Test & Go Live (30 min)
    ↓
END: 100% AUTOMATED SYSTEM LIVE
```

---

# ⏱️ PHASE 1: PENPOT SETUP (30 minutos)

## STEP 1.1: Sign up Penpot (5 min)

```
ACCIÓN:
1. Abre navegador → app.penpot.app
2. Click "Sign up"
3. Email: tu-email@dealpulsehub.com
4. Password: [crea contraseña fuerte]
5. Verify email (check inbox)
6. Click "Create workspace"
7. Workspace name: "DealPulseHub"
8. Done

✅ CHECKPOINT: Workspace creado
```

## STEP 1.2: Create folder structure (10 min)

```
EN PENPOT (dentro del workspace):

Crear estos PROJECTS:

PROJECT 1: "Mockups"
├─ File: "Product Boxes"
├─ File: "Order Bumps"
├─ File: "Downsells"
├─ File: "Tripwires"
├─ File: "Upsells"
└─ File: "Entregables"

PROJECT 2: "Design System"
├─ File: "Colors"
├─ File: "Typography"
├─ File: "Components"
├─ File: "Icons"
└─ File: "Tokens"

PROJECT 3: "Templates Library"
├─ File: "Email Templates"
├─ File: "Landing Sections"
├─ File: "Social Graphics"
└─ File: "Ad Creatives"

CÓMO CREAR:
1. Dashboard → New Project → Name
2. Dentro proyecto → New File → Name
3. Repetir para cada proyecto

✅ CHECKPOINT: Estructura lista
```

## STEP 1.3: Generate API token (15 min)

```
EN PENPOT DASHBOARD:

1. Click tu avatar (arriba derecha)
2. Settings → Profile
3. Buscar sección: "API Tokens"
4. Click "Generate new token"
5. Name: "DealPulseHub-Automation"
6. Expiration: "Never"
7. Permissions: 
   ☑ teams:read
   ☑ files:read
   ☑ files:write
   ☑ projects:read
8. Click "Generate"
9. COPY el token (aparece una sola vez)
10. GUARDAR EN LUGAR SEGURO

GUARDAR EN ARCHIVO SEGURO:
Crear archivo: ~/.env (en tu computadora)
Contenido:
```
PENPOT_API_KEY=paste-token-here
PENPOT_WORKSPACE_ID=find-in-url
PENPOT_WORKSPACE_NAME=DealPulseHub
```

OBTENER WORKSPACE ID:
1. Ir a Penpot dashboard
2. Click en workspace "DealPulseHub"
3. URL será: app.penpot.app/dashboard/workspace/[ID]
4. Copiar el [ID]

✅ CHECKPOINT: API token guardado seguro
```

---

# 🎨 PHASE 2: CREATE MOCKUPS (2-3 horas)

## STEP 2.1: Crear primer mockup (30 min)

```
PROYECTO: "Mockups"
FILE: "Product Boxes"

CREAR MOCKUP BÁSICO:
1. Abre file "Product Boxes"
2. Board → New board
3. Nombre: "Premium Product Box"
4. Tamaño: 400x500px
5. Color background: #FFFFFF

ELEMENTOS BÁSICOS:
1. Añade shapes:
   ├─ Rectangle (background)
   ├─ Image placeholder (product)
   ├─ Text (headline)
   ├─ Text (description)
   ├─ Text (price)
   └─ Button (CTA)

2. Colores (usar Design System):
   - Primary: #6366F1
   - Text: #111827
   - Button: #EF4444

3. Fonts (Google Fonts integradas):
   - Headline: Inter Bold 32px
   - Body: Inter Regular 16px
   - Button: Inter Semibold 16px

4. Save (Ctrl+S)

✅ CHECKPOINT: Primer mockup creado
```

## STEP 2.2: Crear mockups restantes (1.5 horas)

```
REPETIR PROCESO para cada mockup:

FILE: "Order Bumps"
├─ Board: "Order Bump Card" (400x300px)
├─ Header (red background #EF4444)
├─ Content area
└─ CTA button

FILE: "Downsells"
├─ Board: "Downsell Modal" (700x600px)
├─ Soft colors (blue background #E0E7FF)
├─ Rescue messaging
└─ CTA button

FILE: "Tripwires"
├─ Board: "Tripwire Full-Screen" (1200x800px)
├─ Red + Yellow urgency colors
├─ Countdown timer visual
├─ Bold CTA button

FILE: "Upsells"
├─ Board: "Upsell Card" (400x350px)
├─ Premium colors (purple #7C3AED)
├─ Value stack visual
└─ CTA button

FILE: "Entregables"
├─ Board: "Ebook Mockup" (400x500px)
├─ Board: "Certificate" (600x400px)
├─ Board: "Dashboard Preview" (1200x700px)

CADA MOCKUP:
1. Create board
2. Add elements (shapes, text, images)
3. Apply colors from Design System
4. Apply typography from Design System
5. Save (Ctrl+S)

TIEMPO: ~15 min por mockup
TOTAL: 6 mockups × 15 min = 90 min = 1.5 horas

✅ CHECKPOINT: Todos los mockups creados y guardados
```

## STEP 2.3: Create Design System (30 min)

```
PROJECT: "Design System"

FILE: "Colors"
├─ Create board: "Primary Colors"
│  ├─ Rectangle #6366F1 (label: Primary-500)
│  ├─ Rectangle #4F46E5 (label: Primary-600)
│  └─ Rectangle #3730A3 (label: Primary-700)
│
├─ Create board: "Semantic Colors"
│  ├─ Rectangle #EF4444 (label: Error)
│  ├─ Rectangle #10B981 (label: Success)
│  └─ Rectangle #F59E0B (label: Warning)
│
└─ Create board: "Neutrals"
   ├─ Rectangle #FFFFFF (label: White)
   ├─ Rectangle #F9FAFB (label: Gray-50)
   └─ Rectangle #111827 (label: Gray-900)

FILE: "Typography"
├─ Create board: "Font Sizes"
│  ├─ Text "Headline 32px" → 32px bold
│  ├─ Text "Body 16px" → 16px regular
│  └─ Text "Label 12px" → 12px medium
│
└─ Create board: "Font Weights"
   ├─ Text "Regular" → 400
   ├─ Text "Medium" → 500
   ├─ Text "Semibold" → 600
   └─ Text "Bold" → 700

FILE: "Components"
├─ Create components for reuse:
│  ├─ Button Primary
│  ├─ Button Secondary
│  ├─ Card
│  └─ Badge

FILE: "Tokens"
├─ Create visual reference:
│  ├─ Spacing scale (8, 16, 24, 32, 48px)
│  ├─ Border radius (4, 8, 12, 16px)
│  └─ Shadows (3 levels)

TIEMPO: 30 min

✅ CHECKPOINT: Design System creado
```

---

# ⚙️ PHASE 3: SETUP AUTOMATION (45 minutos)

## STEP 3.1: Crear scripts Python (20 min)

```
EN TU COMPUTADORA:

Crear carpeta:
mkdir ~/dealpulsehub-automation
cd ~/dealpulsehub-automation

Crear archivo: extract_penpot.py
─────────────────────────────────
Copiar contenido del SCRIPT 1 (ver PENPOT_AUTOMATION_SYSTEM_COMPLETE.md)
Save como: ~/dealpulsehub-automation/extract_penpot.py

Crear archivo: generate_variations.py
─────────────────────────────────
Copiar contenido del SCRIPT 2
Save como: ~/dealpulsehub-automation/generate_variations.py

Crear archivo: generate_specs.py
─────────────────────────────────
Copiar contenido del SCRIPT 3
Save como: ~/dealpulsehub-automation/generate_specs.py

Crear archivo: create_pr.py
─────────────────────────────────
Copiar contenido del SCRIPT 4
Save como: ~/dealpulsehub-automation/create_pr.py

✅ CHECKPOINT: Scripts creados
```

## STEP 3.2: Install dependencies (10 min)

```bash
# En terminal:

cd ~/dealpulsehub-automation

# Install Python packages
pip install requests pillow

# Test import
python3 -c "import requests; import PIL; print('✅ Dependencies OK')"

✅ CHECKPOINT: Dependencias instaladas
```

## STEP 3.3: Test automation locally (15 min)

```bash
# En terminal:

cd ~/dealpulsehub-automation

# Set environment variables
export PENPOT_API_KEY="your-api-token-here"
export PENPOT_WORKSPACE_ID="your-workspace-id-here"

# Test Script 1: Extract
python3 extract_penpot.py

# Resultado esperado:
# ✅ Exported: ProductBox.png
# ✅ Exported: ProductBox.svg
# ... (para cada mockup)

# Test Script 2: Generate variations
python3 generate_variations.py

# Resultado esperado:
# ✅ Generated variant: [nombre]
# ... (variaciones creadas)

# Test Script 3: Generate specs
python3 generate_specs.py

# Resultado esperado:
# ✅ Generated spec: [nombre]_specs.json
# ... (specs creadas)

# If all ✅: Continue to Phase 4
# If ❌: Check error messages and fix

✅ CHECKPOINT: Scripts testeados localmente
```

---

# 🎯 PHASE 4: CI/CD & GO LIVE (30 minutos)

## STEP 4.1: Setup GitHub Actions (15 min)

```
EN TU REPOSITORIO GITHUB:

1. Crear carpeta: .github/workflows/
   mkdir -p .github/workflows/

2. Crear archivo: .github/workflows/penpot-automation.yml
   Copiar contenido del workflow (ver PENPOT_AUTOMATION_SYSTEM_COMPLETE.md)

3. Commit y push:
   git add .github/workflows/penpot-automation.yml
   git add scripts/
   git commit -m "chore: setup Penpot automation pipeline"
   git push origin main

✅ CHECKPOINT: Workflow code en GitHub
```

## STEP 4.2: Configure GitHub Secrets (10 min)

```
EN GITHUB (repo settings):

1. Ir a: Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Añadir:

SECRET 1: PENPOT_API_KEY
   Name: PENPOT_API_KEY
   Value: [paste-tu-api-token]
   Click "Add secret"

SECRET 2: GITHUB_TOKEN
   Name: GITHUB_TOKEN
   Value: [GitHub genera automáticamente]

SECRET 3 (opcional): SLACK_WEBHOOK_URL
   Name: SLACK_WEBHOOK_URL
   Value: [tu-slack-webhook-url]
   Click "Add secret"

✅ CHECKPOINT: Secrets configurados
```

## STEP 4.3: Test GitHub Actions (5 min)

```
EN GITHUB (Actions tab):

1. Go to: Actions tab
2. Find workflow: "Penpot Daily Automation"
3. Click "Run workflow"
4. Click "Run workflow" (confirmar)
5. Esperar 1-2 minutos a que complete

RESULTADO ESPERADO:
✅ extract step: PASSED
✅ variations step: PASSED
✅ specs step: PASSED
✅ commit step: PASSED
✅ PR step: PASSED
✅ notification step: PASSED

Si todo ✅: SISTEMA LISTO

Si hay ❌: Check logs y fix errors

✅ CHECKPOINT: GitHub Actions testeado
```

---

# 🎉 FINAL VERIFICATION (Antes de considerar "LISTO")

```
CHECKLIST FINAL:

✅ Penpot workspace creado
✅ 6 mockups en Penpot (Product Box, Order Bump, Downsell, Tripwire, Upsell, Entregables)
✅ Design System creado (Colors, Typography, Components, Tokens)
✅ API token generado y guardado seguro
✅ 4 scripts Python creados localmente
✅ Scripts testeados y funcionando
✅ GitHub Actions workflow configurado
✅ Secrets guardados en GitHub
✅ Workflow testeado manualmente

Si TODO ✅ → SISTEMA 100% OPERACIONAL

Si hay ❌ en algo → Ver TROUBLESHOOTING section
```

---

# 🔄 DAILY OPERATION (Después de go-live)

```
CADA DÍA a las 09:00 AM (automático):

1. GitHub Actions runs
   ├─ Extrae mockups de Penpot
   ├─ Genera variaciones
   ├─ Genera specs JSON
   └─ Crea PR para @dev

2. PR aparece en GitHub
   ├─ Asignado a @dev
   ├─ Tags: #design #auto
   └─ Con specs completas

3. @dev recibe notificación
   ├─ Via GitHub
   ├─ Via email
   └─ Via Slack (si configurado)

4. @dev implementa desde specs

RESULTADO:
→ Cero delays
→ Cero manual work
→ Specs siempre fresh
→ @dev siempre updated
```

---

# ⚡ TROUBLESHOOTING (Si algo falla)

```
PROBLEMA 1: API connection fails
├─ Check: PENPOT_API_KEY válido
├─ Check: Token no expirado
├─ Fix: Regenerar token en Penpot Settings
└─ Retry: python3 extract_penpot.py

PROBLEMA 2: PNG export corrupted
├─ Check: Mockup está bien en Penpot
├─ Fix: Re-save mockup en Penpot
├─ Retry: python3 extract_penpot.py

PROBLEMA 3: GitHub workflow fails
├─ Check: Secrets están configurados
├─ Check: GitHub token es válido
├─ Fix: Regenerar token en GitHub Settings
└─ Retry: Manual run desde Actions tab

PROBLEMA 4: PR not created
├─ Check: GITHUB_TOKEN tiene permisos
├─ Check: Rama 'design/auto-exports' existe
├─ Fix: git push origin design/auto-exports (crear rama)
└─ Retry: Manual run

PROBLEMA 5: No Slack notification
├─ Check: SLACK_WEBHOOK_URL válido
├─ Fix: Regenrar webhook en Slack
└─ Retry: Manual run
```

---

# 📊 SUCCESS STATE (When complete)

```
🟢 SYSTEM LIVE & OPERATIONAL

✅ Penpot connected via API
✅ 4 automation scripts running
✅ GitHub Actions firing daily
✅ Mockups auto-extracting
✅ Specs auto-generating
✅ PRs auto-creating for @dev
✅ Zero manual intervention
✅ @dev receiving specs daily

METRICS:
├─ Extraction success: 100%
├─ Spec accuracy: 99%+
├─ Time from design to PR: < 5 min
├─ Manual work required: 0%
├─ Developer satisfaction: 9+/10

🚀 READY FOR PRODUCTION
```

---

## 📝 TIME BREAKDOWN

```
PHASE 1 (Penpot Setup):      30 min
PHASE 2 (Create Mockups):    2-3 hours
PHASE 3 (Automation Setup):  45 min
PHASE 4 (CI/CD & Go Live):   30 min
───────────────────────────────────
TOTAL TIME:                  4-5 hours

RECOMMENDED SCHEDULE:
Day 1 (morning): Phase 1 + Phase 2.1 (30 min + 30 min)
Day 1 (afternoon): Phase 2.2 + Phase 2.3 (1.5 hours + 30 min)
Day 2 (morning): Phase 3 + Phase 4 (45 min + 30 min)

GO LIVE: Day 2 by afternoon
```

---

## 🎯 NEXT ACTION

```
👉 START NOW: PHASE 1 (Penpot Setup)

1. Abre navegador
2. app.penpot.app
3. Sign up
4. Create workspace "DealPulseHub"
5. Continue with STEP 1.2

⏱️ Tiempo esperado para Phase 1: 30 minutos
```

---

**Status:** 🔴 EJECUTAR AHORA  
**Fase actual:** FASE 1 (30 min)  
**No hay decisiones pendientes**  
**Documentación completa**  

