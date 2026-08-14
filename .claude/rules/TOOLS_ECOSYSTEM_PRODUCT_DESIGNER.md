# 🛠️ TOOLS ECOSYSTEM — @product-design-expert

**Documento:** Herramientas fáciles de integrar para @product-design-expert  
**Versión:** 1.0.0  
**Status:** 🟡 PREMISA SUPERADA (Figma → Penpot) — ver nota  
**Propósito:** Extraer diseños, templates, plugins, iconos, animaciones  
**Criterio:** FÁCIL DE CONFIGURAR (< 30 minutos setup)

---

> ⚠️ **NOTA — 2026-08-13:** Este documento asume un flujo de trabajo en **Figma**
> (marketplace de plugins instalables desde la UI, one-click imports, etc.). El
> proyecto ya no diseña en Figma — el flujo real y vigente es **Penpot MCP**
> (`execute_code` sobre la sesión del navegador), documentado en
> `C:\Users\Oscar\.claude\rules\PENPOT_MCP_PRODUCTION_PROTOCOL.md` (global).
> Penpot **no tiene marketplace de plugins como Figma** — nada de la sección 7
> ("Figma Plugins") se instala de la misma forma, y la mayoría de esos plugins
> simplemente no tienen equivalente 1:1 en Penpot hoy.
>
> Qué SÍ tiene equivalente real, verificado en producción:
> - **Fotos de stock** (Unsplash y similares) → `penpot.uploadMediaUrl(nombre, url)`
>   trae la imagen directo por código y la asigna como `fillImage` de un shape.
>   Verificado 2026-08-07 sobre mockups reales. Ver protocolo global, sección
>   "Importar imágenes reales por URL".
> - **Colores** (Color Hunt y similares) → no hace falta plugin en absoluto,
>   son valores hex directos en `shape.fills` vía código.
> - **Tipografía** (Google Fonts) → Penpot integra Google Fonts de forma nativa
>   en su selector de fuentes (no es específico de MCP); no se ha verificado
>   aún si `execute_code` puede fijar una fuente de Google Fonts que no esté ya
>   cargada en el proyecto.
>
> Qué NO tiene equivalente verificado (gap real, no asumir que "ya se resolvió"):
> - **Iconos** (Phosphor/Heroicons/Material) — no existe un flujo probado para
>   traer un SVG de icono e insertarlo como shape vía `execute_code`.
> - **Animaciones/motion** (Lottie/Rive/Framer Motion) — Penpot es una
>   herramienta de diseño estático; no aplica vía este canal.
> - **Ilustraciones** (Storyset) — mismo gap que iconos, sin flujo probado.
>
> El resto del documento (secciones 1-6, 8-10: templates, matriz de
> comparación, setup por fases) sigue siendo útil como **catálogo de recursos**
> (qué existe, qué licencia tiene) — solo la mecánica de instalación asume
> Figma y debe traducirse a "cómo lo traigo por código a Penpot" caso por caso,
> no asumirse automática.

---

## 📋 ÍNDICE

1. **Design Templates & Asset Libraries**
2. **Icon Systems**
3. **Animation & Motion Libraries**
4. **Color & Typography Tools**
5. **Stock Assets (Photos, Illustrations)**
6. **Integration Hubs (All-in-One)**
7. **Figma Plugins (Direct Integration)**
8. **API-Based Tools (Programmatic)**
9. **Comparison Matrix**
10. **Recommended Setup Stack**

---

## 🎨 1. DESIGN TEMPLATES & ASSET LIBRARIES

### **Option 1: Figma Community (FREE)**
```
ASSET TYPES:
├─ 10,000+ free Figma templates
├─ UI kits (buttons, cards, forms)
├─ Landing page sections
├─ Mobile app screens
├─ Email templates
└─ Wireframes + mockups

SETUP TIME: 5 minutes
├─ Link Figma account
├─ Search "UI Kit" or "[Design Type]"
├─ Duplicate to workspace
├─ Done

COST: Free
INTEGRATION: Native in Figma
LEARNING CURVE: Easy (just search + duplicate)

PROS:
✅ 100% free
✅ Zero setup
✅ Can modify directly
✅ Community voting (quality indicator)

CONS:
❌ Variable quality
❌ Manual curation needed
❌ Can't automate

BEST FOR:
→ Landing page components
→ UI kits inspiration
→ Quick starting points
```

### **Option 2: Design.io (Paid)**
```
ASSET TYPES:
├─ 1000+ premium Figma templates
├─ Landing pages (complete)
├─ SaaS dashboards
├─ Mobile apps
├─ Email templates
└─ All high-quality

SETUP TIME: 10 minutes
├─ Create account (design.io)
├─ Browse + favorite templates
├─ One-click "Open in Figma"
├─ Duplicate to your workspace
├─ Customize

COST: $9-49/month (subscription)
INTEGRATION: One-click Figma
LEARNING CURVE: Very easy

PROS:
✅ Premium quality only
✅ One-click import to Figma
✅ Regular updates
✅ Curated collections by category

CONS:
❌ Monthly cost
❌ Limited free preview
❌ Can't batch import

BEST FOR:
→ Premium landing pages
→ Complete design systems
→ Time-saving when quality matters
```

### **Option 3: Crafts (FREE)**
```
ASSET TYPES:
├─ Free design templates (Figma)
├─ E-commerce pages
├─ Marketing sites
├─ Mobile screens
└─ Component libraries

SETUP TIME: 5 minutes
COST: Free
INTEGRATION: Direct Figma link

PROS:
✅ Free & quality
✅ No login needed
✅ Figma files direct
✅ Good for e-commerce

BEST FOR:
→ E-commerce mockups
→ Product showcase pages
```

---

## 🎯 2. ICON SYSTEMS

### **Option 1: Phosphor Icons (FREE)**
```
ASSET TYPES:
├─ 7,000+ icons (all styles)
├─ Same icon in 6 weights
├─ SVG + React + Figma
└─ Perfect for design systems

SETUP TIME: 5 minutes
├─ Figma plugin: "Phosphor Icons"
├─ Search icon name in Figma
├─ Drag + drop to canvas
├─ Done

COST: Free
INTEGRATION: Figma plugin (native)
LEARNING CURVE: Extremely easy

PROS:
✅ 7,000+ icons
✅ Consistent quality
✅ Multiple weights (light to bold)
✅ Free & fast
✅ No setup needed

CONS:
❌ Only icons (not full graphics)

BEST FOR:
→ Any project (universal)
→ Fastest icon integration
→ Consistent icon style
```

### **Option 2: Heroicons (FREE)**
```
ASSET TYPES:
├─ 600+ clean icons
├─ Outline + solid styles
├─ SVG + React
├─ Tailwind-friendly

SETUP TIME: 10 minutes
├─ Download icon set (Figma)
├─ Import to Figma components
├─ Create reusable component
├─ Use across projects

COST: Free
INTEGRATION: Manual import (easy)

PROS:
✅ Simple, clean icons
✅ Perfect for SaaS/apps
✅ Lightweight
✅ Free

CONS:
❌ Only 600 icons (smaller library)
❌ Manual Figma import

BEST FOR:
→ SaaS dashboards
→ Clean UI design
→ Tech-focused projects
```

### **Option 3: Feather Icons (FREE)**
```
ASSET TYPES:
├─ 287 simple, minimal icons
├─ SVG format
├─ Consistent 24x24px
└─ Perfect for web

SETUP TIME: 5 minutes
COST: Free
INTEGRATION: Figma plugin

PROS:
✅ Minimal design
✅ Perfect for dashboards
✅ Small file size

BEST FOR:
→ Minimal UI design
→ Dashboards
→ Web applications
```

---

## ✨ 3. ANIMATION & MOTION LIBRARIES

### **Option 1: Rive (FREE + PAID)**
```
ASSET TYPES:
├─ 1000+ free animations
├─ Customizable motion graphics
├─ Interactive animations
├─ Can export to Figma
└─ Real-time preview

SETUP TIME: 15 minutes
├─ Create Rive account (free)
├─ Browse animation library
├─ Customize (colors, timing)
├─ Export as .riv file
├─ Import to Figma/web

COST: Free (with paid options)
INTEGRATION: Export + Figma plugin

PROS:
✅ 1000+ animations free
✅ Highly customizable
✅ Web-ready (no video)
✅ Interactive capable
✅ Lightweight

CONS:
❌ Learning curve (Rive editor)
❌ Export workflow has steps

BEST FOR:
→ Interactive animations
→ Microinteractions
→ Lottie-style animations
→ Web animations
```

### **Option 2: LottieFiles (FREE + PAID)**
```
ASSET TYPES:
├─ 100,000+ Lottie animations
├─ JSON-based (ultra-lightweight)
├─ Can customize colors + speed
└─ Works in web + mobile

SETUP TIME: 10 minutes
├─ Browse LottieFiles.com
├─ Customize animation
├─ Download JSON
├─ Embed in project
├─ Or view in Figma preview

COST: Free (premium = $5/mo)
INTEGRATION: JSON file + embed

PROS:
✅ 100,000+ animations
✅ Tiny file size (JSON)
✅ Web-ready immediately
✅ Can customize in-browser

CONS:
❌ Not Figma-native (preview only)
❌ Requires web implementation

BEST FOR:
→ Web app animations
→ Loading states
→ Microinteractions
→ Mobile apps
```

### **Option 3: Framer Motion Docs (FREE)**
```
ASSET TYPES:
├─ React animation library
├─ Code-based animations
├─ Smooth transitions
└─ Interactive demos

SETUP TIME: 20 minutes
├─ npm install framer-motion
├─ Copy code examples
├─ Customize parameters
├─ Implement in React

COST: Free
INTEGRATION: Code library

PROS:
✅ Powerful + flexible
✅ Free
✅ Great for React projects
✅ Performance optimized

CONS:
❌ Requires coding
❌ Not visual (Figma integration hard)

BEST FOR:
→ React developers
→ Complex animations
→ Custom motion design
```

---

## 🎨 4. COLOR & TYPOGRAPHY TOOLS

### **Option 1: Color Hunt (FREE)**
```
ASSET TYPES:
├─ 10,000+ color palettes
├─ User-curated combinations
├─ Export to Figma/CSS/JSON
└─ Tagged by mood/style

SETUP TIME: 5 minutes
├─ Visit colorhunt.co
├─ Search by mood (Bold, Pastel, etc)
├─ Click "Export to Figma"
├─ Palette added to Figma
├─ Done

COST: Free
INTEGRATION: One-click Figma export

PROS:
✅ 10,000+ palettes
✅ One-click Figma export
✅ Curated by mood
✅ Community voting

CONS:
❌ Can't customize before import
❌ Limited to pre-made combos

BEST FOR:
→ Quick color inspiration
→ Color palette generation
→ Testing different moods
```

### **Option 2: Google Fonts (FREE)**
```
ASSET TYPES:
├─ 1400+ open-source fonts
├─ All weights + styles
├─ Web-optimized
└─ Free forever

SETUP TIME: 10 minutes
├─ Visit fonts.google.com
├─ Preview font in Figma
├─ Add to project (Figma plugin)
├─ Use in designs
├─ Done

COST: Free
INTEGRATION: Figma plugin native

PROS:
✅ 1400+ fonts free
✅ Web-optimized
✅ Figma integration native
✅ No licensing issues

CONS:
❌ Open-source only (not premium)
❌ Some font quality variable

BEST FOR:
→ Web projects
→ Any design (web-safe)
→ Zero licensing worries
```

### **Option 3: Adobe Fonts (PAID - Creative Cloud)**
```
ASSET TYPES:
├─ 20,000+ premium fonts
├─ Professional quality
├─ Typekit library
└─ Sync to Figma

SETUP TIME: 5 minutes (if CC subscriber)
├─ Link CC account to Figma
├─ Browse Adobe Fonts
├─ Activate font in CC
├─ Use in Figma (auto-syncs)
├─ Done

COST: $120/year (as part of CC)
INTEGRATION: Native Figma

PROS:
✅ 20,000+ premium fonts
✅ Professional quality
✅ Auto-sync to Figma
✅ Unlimited usage

CONS:
❌ Requires CC subscription
❌ Cost

BEST FOR:
→ Premium typography needs
→ Professional branding
→ Already CC subscribers
```

---

## 📸 5. STOCK ASSETS (Photos, Illustrations)

### **Option 1: Unsplash (FREE)**
```
ASSET TYPES:
├─ 1,000,000+ free photos
├─ High quality
├─ Creative Commons license
└─ No watermarks

SETUP TIME: 5 minutes
├─ Figma plugin: "Unsplash"
├─ Search within Figma
├─ Drag + drop image
├─ Done

COST: Free
INTEGRATION: Figma plugin native

PROS:
✅ 1,000,000+ photos
✅ Free forever
✅ Figma plugin native
✅ No watermarks

CONS:
❌ Limited control
❌ Random + community-driven

BEST FOR:
→ Hero images
→ Landing pages
→ Background photos
→ Quick mockups
```

### **Option 2: Pexels (FREE)**
```
ASSET TYPES:
├─ 500,000+ free photos
├─ No attribution needed
├─ High quality
└─ Download unlimited

SETUP TIME: 5 minutes
├─ Figma plugin: "Pexels"
├─ Search in Figma
├─ Insert image
├─ Done

COST: Free
INTEGRATION: Figma plugin

PROS:
✅ 500,000+ photos
✅ No attribution needed
✅ Figma integration

BEST FOR:
→ Any photo needs
→ Quick placeholder images
```

### **Option 3: Storyset (Illustrations - FREE/PAID)**
```
ASSET TYPES:
├─ 30,000+ editable illustrations
├─ Customizable colors/elements
├─ Export SVG + PNG
└─ Figma plugin

SETUP TIME: 10 minutes
├─ Figma plugin: "Storyset"
├─ Search illustration style
├─ Customize colors in Figma
├─ Export or embed
├─ Done

COST: Free (premium = $5/mo)
INTEGRATION: Figma plugin

PROS:
✅ 30,000+ illustrations
✅ Fully customizable in Figma
✅ Multiple styles
✅ Free version robust

CONS:
❌ Illustrations only (not photos)

BEST FOR:
→ Hero illustrations
→ Feature graphics
→ Onboarding screens
→ Marketing graphics
```

---

## 🔗 6. INTEGRATION HUBS (All-in-One)

### **Option 1: Design.io (Premium Hub)**
```
INCLUDES:
├─ Templates (1000+)
├─ Icons (5000+)
├─ Stock photos (500K+)
├─ Illustrations
├─ All integrated
└─ One-click import to Figma

SETUP TIME: 10 minutes total
├─ Create account
├─ Enable Figma integration
├─ Start importing
├─ Done

COST: $9-49/month
INTEGRATION: Figma native (one-click)

PROS:
✅ Everything in one place
✅ One-click Figma import
✅ Curated quality
✅ Time-saving

CONS:
❌ Monthly cost
❌ Not everything free

BEST FOR:
→ Comprehensive design workflow
→ Premium quality needed
→ Time is valuable
```

### **Option 2: Figma Ecosystem (Native Integration)**
```
INCLUDES:
├─ Figma Community (templates)
├─ Figma plugins (1000+)
├─ Figma fonts (integrated)
├─ File sharing + collaboration
└─ All native

SETUP TIME: 5 minutes
├─ Just start using Figma
├─ Browse Community tab
├─ Install plugins
├─ Done

COST: Part of Figma Pro ($12/mo)
INTEGRATION: 100% native

PROS:
✅ Everything in Figma
✅ No external tools needed
✅ Seamless workflow
✅ Native collaboration

CONS:
❌ Limited premium assets
❌ Community quality variable

BEST FOR:
→ Figma-first workflow
→ Collaboration-heavy
→ Integrated experience
```

---

## 🔌 7. FIGMA PLUGINS (Direct Integration)

### **Essential Plugins (All FREE or $0-10/month)**

| Plugin | Function | Setup Time | Cost |
|--------|----------|-----------|------|
| **Phosphor Icons** | 7,000 icons | 2 min | Free |
| **Unsplash** | Stock photos | 2 min | Free |
| **Google Fonts** | 1,400 fonts | 3 min | Free |
| **Color Hunt** | Color palettes | 3 min | Free |
| **Storyset** | Illustrations | 5 min | Free |
| **Lorem Ipsum** | Placeholder text | 2 min | Free |
| **LottieFiles** | Animations preview | 5 min | Free |
| **Remove BG** | Background removal | 3 min | Free |
| **Rive** | Motion graphics | 10 min | Free |
| **Figma to Code** | Developer handoff | 5 min | Free |
| **Instance Swapper** | Component variants fast | 2 min | Free |
| **Responsify** | Responsive design | 3 min | Free |

**TOTAL PLUGIN SETUP TIME: 45 minutes (one-time)**

---

## 💾 8. API-BASED TOOLS (Programmatic Access)

### **Option 1: Figma API (Programmatic)**
```
CAPABILITY:
├─ Extract design components programmatically
├─ Generate image files
├─ Create design variations
├─ Automate exports
└─ Build custom workflows

SETUP TIME: 30 minutes
├─ Create API token (Figma settings)
├─ Install Node.js client
├─ Write simple script
├─ Test extraction
├─ Done

COST: Free (with Figma account)
INTEGRATION: REST API

PROS:
✅ Full programmatic control
✅ Automate asset extraction
✅ Scalable for bulk work
✅ Free

CONS:
❌ Requires coding
❌ Technical setup needed

BEST FOR:
→ Bulk asset export
→ Automation workflows
→ Custom integrations
→ Junior who codes
```

### **Option 2: Unsplash API (Photos)**
```
CAPABILITY:
├─ Programmatic photo search
├─ Random photo generation
├─ Batch download
└─ Custom integrations

SETUP TIME: 20 minutes
├─ Create API key (unsplash.com)
├─ Test API call
├─ Integrate into workflow
├─ Done

COST: Free

BEST FOR:
→ Automated photo selection
→ Bulk mockups
→ Dynamic design generation
```

---

## 📊 9. COMPARISON MATRIX

```
TOOL                    | SETUP TIME | COST  | BEST FOR              | INTEGRATION
------------------------+------------+-------+-----------------------+------------------
Figma Community         | 5 min      | FREE  | Templates + inspiration| Native (search)
Design.io              | 10 min     | $9-49 | Premium templates     | One-click Figma
Phosphor Icons         | 5 min      | FREE  | Any icon needs        | Figma plugin
Google Fonts           | 10 min     | FREE  | Web typography        | Figma plugin
Color Hunt             | 5 min      | FREE  | Color palettes        | Figma export
Unsplash               | 5 min      | FREE  | Stock photos          | Figma plugin
Storyset               | 10 min     | FREE  | Illustrations         | Figma plugin
LottieFiles            | 10 min     | FREE  | Web animations        | JSON export
Rive                   | 15 min     | FREE  | Interactive motion    | Export .riv
Adobe Fonts            | 5 min      | $120y | Premium typography    | Native (CC)
Figma API              | 30 min     | FREE  | Automation/bulk       | REST API
Unsplash API           | 20 min     | FREE  | Photo automation      | REST API

RANKING BY EASE:
🥇 EASIEST (< 5 min):  Figma Community, Phosphor Icons, Color Hunt, Unsplash
🥈 EASY (5-15 min):    Google Fonts, Storyset, LottieFiles, Design.io
🥉 MEDIUM (15+ min):   Rive, Figma API, Adobe Fonts
```

---

## 🚀 10. RECOMMENDED SETUP STACK FOR @product-design-expert

### **Phase 1: Day 1 (Minimum Setup — 30 minutes)**

```
INSTALL IMMEDIATELY:
├─ ✅ Phosphor Icons (Figma plugin) — 2 min
├─ ✅ Unsplash (Figma plugin) — 2 min
├─ ✅ Google Fonts (Figma plugin) — 3 min
├─ ✅ Color Hunt (Figma plugin) — 3 min
├─ ✅ Storyset (Figma plugin) — 5 min
├─ ✅ LottieFiles (browse/download) — 5 min
├─ ✅ Figma Community (bookmark) — 2 min
└─ ✅ Remove BG (Figma plugin) — 3 min

TOTAL TIME: 25 minutes
COST: $0
RESULT: Full design toolkit ready

WHAT @specialist CAN DO:
✓ Use 7,000+ icons instantly
✓ Insert 1,000,000+ stock photos
✓ Access 1,400+ fonts
✓ Generate color palettes
✓ Add 30,000+ illustrations
✓ Preview 100,000+ animations
✓ Remove image backgrounds
✓ Browse 10,000+ templates
```

### **Phase 2: Week 1 (Enhanced — add 20 minutes)**

```
ADD THESE:
├─ ✅ Rive animation editor — 15 min (setup account + explore)
├─ ✅ Design.io subscription ($9/mo) — 5 min (bookmark)
└─ ✅ Figma API knowledge (bookmark docs) — 0 min (for later)

NEW CAPABILITIES:
✓ 1,000+ interactive animations
✓ 1,000+ premium templates (auto-import)
✓ Batch export workflows (future)
```

### **Phase 3: Month 1 (If Needed — Optional)**

```
ONLY IF AUTOMATING:
├─ Figma API setup (30 min)
├─ Custom script for bulk exports
└─ Unsplash API integration

ROI: Only for 100+ assets/month
```

---

## ⚡ QUICK START (Copy-Paste)

### **Install These Figma Plugins (In Order):**

1. **Search "Phosphor Icons"** → Install → Ready
2. **Search "Unsplash"** → Install → Ready
3. **Search "Google Fonts"** → Install → Ready
4. **Search "Color Hunt"** → Install → Ready
5. **Search "Storyset"** → Install → Ready
6. **Search "Remove BG"** → Install → Ready

**Time: 15 minutes | Cost: $0 | Setup difficulty: Easy**

### **Bookmark These (Free):**

- LottieFiles.com (animations)
- Figma Community (templates)
- ColorHunt.co (colors)
- Rive.app (motion graphics)

**Time: 2 minutes | Cost: $0**

### **Optional (Month 1):**

- Design.io ($9/mo) if speed/quality critical
- Adobe Fonts ($10/mo if CC) if premium typography needed

---

## 🎯 MONTHLY COST SCENARIOS

### **Scenario 1: Free Setup (Recommended for start)**
```
Figma Pro:              $12/month
Plugins:                $0
Stock assets:           $0
Icons/fonts/colors:     $0
───────────────────────────────
TOTAL:                  $12/month per @specialist
(Junior also $12 after W9)
```

### **Scenario 2: Premium Setup (Recommended if speed critical)**
```
Figma Pro:              $12/month
Design.io:             $9/month (templates + curated)
Adobe Fonts:           $10/month (premium typography)
Plugins:                $0
───────────────────────────────
TOTAL:                  $31/month per specialist
```

### **Scenario 3: Enterprise Setup (Full automation)**
```
Figma Pro:              $12/month
Design.io:             $9/month
Adobe Fonts:           $10/month
Rive Pro:              $0 (free for individuals)
API calls:              $0
───────────────────────────────
TOTAL:                  $31/month per specialist
+ Custom dev (one-time): $500-1000
```

---

## ✅ IMPLEMENTATION CHECKLIST

### **Week 1 Setup:**
```
☐ Day 1 (30 min total):
  ☐ Install 6 Figma plugins (15 min)
  ☐ Bookmark free resources (2 min)
  ☐ Test one icon insertion (3 min)
  ☐ Test one photo insertion (3 min)
  ☐ Test one font addition (3 min)
  ☐ Create test file (5 min)

☐ Day 2-5 (as needed):
  ☐ Explore LottieFiles (if animation needed)
  ☐ Create Rive account (if interactive motion needed)
  ☐ Add Design.io subscription (if premium templates needed)
  ☐ Bookmark Figma API docs (for junior in Month 2)

RESULT: Fully equipped for 95% of design work
```

---

## 🎓 TRAINING @product-design-expert

### **Day 1 Onboarding (30 min):**
```
1. Install all 6 plugins together (15 min)
2. Walk through each plugin (1 min each):
   - Phosphor Icons: Search "star" → Insert
   - Unsplash: Search "product" → Insert photo
   - Google Fonts: Search "Roboto" → Apply
   - Color Hunt: View palettes
   - Storyset: Search "success" → Insert illustration
   - Remove BG: Upload image → Remove background
3. Create one test design using all 6 (5 min)
4. Save + share test file (2 min)
```

### **Day 2-5 Deep Dive (as needed):**
```
- Rive: 2 preset animations (if needed)
- LottieFiles: Browse 5 animation styles (if needed)
- Design.io: Import one template (if premium)
- Figma Community: Duplicate one template (if free)
```

---

## 📞 SUPPORT & HELP

### **For Each Tool:**

| Tool | Help Resource | Time |
|------|---------------|------|
| Figma Plugins | Built-in "?" button | 2 min |
| Phosphor Icons | phosphoricons.com | docs |
| Unsplash | unsplash.com/developers | docs |
| Google Fonts | fonts.google.com | docs |
| Color Hunt | YouTube: "Color Hunt tutorial" | 5 min |
| Storyset | Figma plugin help tab | 3 min |
| LottieFiles | lottiefiles.com/featured | browse |
| Rive | rive.app/tutorials | docs |
| Design.io | design.io/help | docs |

---

## 🏆 FINAL RECOMMENDATION

**FOR @product-design-expert (Start):**

```
✅ INSTALL DAY 1 (30 minutes, $0/month):
   1. Phosphor Icons plugin
   2. Unsplash plugin
   3. Google Fonts plugin
   4. Color Hunt plugin
   5. Storyset plugin
   6. Remove BG plugin

✅ BOOKMARK (5 minutes):
   - LottieFiles.com
   - Figma Community
   - ColorHunt.co
   - Rive.app

✅ OPTIONAL (Month 1, $9-31/month):
   - Design.io (if speed/quality critical)
   - Adobe Fonts (if premium typography needed)
   - Rive Pro (if many custom animations)

RESULT:
→ Fully equipped for all design types
→ 95% of asset needs covered
→ $12/month (Figma Pro only)
→ Setup: 30 minutes
→ Complexity: Very easy
```

---

**Status:** ✅ READY TO IMPLEMENT  
**Total First-Day Setup:** 30 minutes  
**Monthly Cost:** $12 (Figma Pro only)  
**ROI:** Thousands of assets at fingertips  

