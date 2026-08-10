# 🎨 DealPulseHub

Repositorio con **4 sistemas relacionados**: un Design System React publicable, un backend
de orquestación multi-agente ("Sistema Antigravity"), integración de producción de mockups
vía Penpot MCP, y la metodología divisional que gobierna cómo se decide el trabajo.

> 🗺️ **Mapa completo de los 4 sistemas:** [`docs/ARCHITECTURE_MAP.md`](docs/ARCHITECTURE_MAP.md)
> — léelo primero si vas a trabajar en este repo por primera vez.

---

## 1️⃣ Design System (React + TypeScript)

Sistema de diseño moderno, type-safe, con tokens automatizados. Construido con **React 18**,
**TypeScript 5**, y tokens de diseño centralizados.

### ✨ Features

- ✅ **5 Componentes React** — Type-safe y totalmente customizables
- ✅ **28+ Design Tokens** — Sistema de diseño centralizado
- ✅ **Auto-generated** — Tokens TypeScript + CSS automáticos
- ✅ **Figma Sync** — Sincronización automática cada hora
- ✅ **33 tests automatizados** (Jest + Testing Library)
- ✅ **Publicado en npm** como [`@dealpulsehub/design-system`](https://www.npmjs.com/package/@dealpulsehub/design-system)

### 🚀 Quick Start

```bash
npm install
npm run dev          # Storybook interactivo en localhost:6006
npm test             # 33 tests, 5 suites
npm run build        # Compila TypeScript + genera tokens
```

Abre `demo.html` en tu navegador para un showcase visual sin instalar nada.

### 📦 Componentes Disponibles

#### Button
```tsx
<Button variant="primary" size="md">Click me</Button>
```
**Variantes:** primary | secondary | ghost — **Tamaños:** sm | md | lg

#### Card
```tsx
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

#### Input
```tsx
<Input type="email" placeholder="Enter email..." />
```
**Tipos:** text | email | password | number

#### Badge
```tsx
<Badge variant="success">Active</Badge>
```
**Variantes:** primary | success | warning | error

#### Typography
```tsx
<Heading1>Main Title</Heading1>
<Heading2>Subtitle</Heading2>
<Paragraph>Body text</Paragraph>
```

También incluye componentes de animación (`AnimatedHero`, `FadeInText`, `ParallaxSection`,
`ScrollReveal`, `LottieAnimation`) basados en `framer-motion` / `lottie-react` / `react-intersection-observer`.

### 🎨 Design Tokens

```tsx
import { colors, spacing, typography, borderRadius, shadows } from './src/tokens';

colors.primary[500]      // #6366f1
colors.semantic.success  // #10b981
spacing.xs                // 4px
spacing.md                // 16px
typography.fontSize.base  // 16px
borderRadius.md            // 8px
shadows.md                  // 0 4px 6px -1px rgba(0,0,0,0.1)
```

---

## 2️⃣ Sistema Antigravity (backend de orquestación de agentes)

Backend interno (`src/orchestration/`, `src/quality/`, `src/security/`, `src/clients/`,
`src/integration/`, `src/metrics/`, `src/audit/`) que coordina tareas entre agentes GRAVX/AIOX,
valida calidad, audita decisiones y gestiona clientes/proyectos.

```bash
npm run api             # API oficial (Fase 4 completa) — 40+ endpoints (bridge/security/clients/workflow)
npm run dev:api         # Igual que arriba (alias para desarrollo)
npm run api:legacy-v1   # Prototipo Fase 1 (task queue simple, sin Antigravity) — solo referencia
npm run demo:phase4     # Demo del workflow end-to-end (console.log, no es un test)
```

Detalle completo, incluyendo qué endpoints expone cada fase y un bug conocido pendiente
de arreglar en el workflow end-to-end: ver `docs/ARCHITECTURE_MAP.md` sección 2.

---

## 3️⃣ Penpot MCP (producción de mockups vía IA)

Integración con Penpot para crear mockups de campaña (product boxes, order bumps, tripwires,
etc.) programáticamente vía Claude + MCP, más un script de extracción REST de respaldo.

```bash
npm run penpot:extract   # Extrae/exporta assets vía API REST (requiere PENPOT_API_KEY en .env)
```

Protocolo completo (setup, helpers de código, neuro-auditoría de contraste WCAG):
`C:\Users\Oscar\.claude\rules\PENPOT_MCP_PRODUCTION_PROTOCOL.md` (global, aplica a cualquier proyecto).

---

## 4️⃣ Metodología (Opción C Divisional)

Framework de decisión (roles CPS/CCO/CXO/CAO, gates de aprobación, autonomía por división)
que gobierna cómo se ejecuta el trabajo sobre los 3 sistemas de código de arriba.
Ver `.claude/rules/ORGANIZATIONAL_STRUCTURE_DIVISIONAL.md`.

---

## 📁 Estructura de Carpetas (real, no simplificada)

```
DealPulseHub/
├── src/
│   ├── components/          # Design System — componentes + tests + stories
│   ├── tokens/               # tokens.json (fuente) → tokens.ts / tokens.css (generados)
│   ├── styles/
│   ├── hooks/                 # useAnimation, etc.
│   ├── api/                    # server-phase4.js (API oficial) + server.ts (Fase 1, referencia)
│   ├── orchestration/       # Sistema Antigravity
│   ├── quality/
│   ├── security/
│   ├── clients/
│   ├── integration/
│   ├── metrics/
│   └── audit/
├── scripts/
│   ├── build-tokens.js      # Generador de tokens (JSON → TS/CSS)
│   ├── figma-sync.js         # Figma → tokens (dirección: Figma → código)
│   └── penpot-extract.js    # Penpot → assets (extracción REST)
├── .github/workflows/       # deploy-storybook.yml, figma-sync.yml
├── docs/                        # Documentación detallada por tema
├── .claude/rules/             # Metodología y protocolos internos (no trackeado en git)
├── jest.config.js, tsconfig.json, eslint.config.js
└── package.json
```

## 🛠️ Scripts Disponibles (completo)

```bash
# Design System
npm run dev              # Storybook
npm run build             # tsc + build-tokens
npm run build-tokens      # Regenerar tokens.ts/css desde tokens.json
npm run build-storybook  # Build estático de Storybook
npm test                    # Jest (33 tests)
npm run test:watch
npm run test:coverage
npm run type-check       # tsc --noEmit
npm run lint                # ESLint

# Backend Antigravity
npm run api | dev:api                        # API oficial (Fase 4 completa)
npm run api:legacy-v1                        # Prototipo Fase 1 (solo referencia histórica)
npm run api:phase2 | api:phase3              # Incrementos intermedios (referencia)
npm run demo:phase2 | demo:phase3 | demo:phase4  # Demos (no son tests)
npm run cli | dev:cli                        # CLI

# Integraciones
npm run figma:sync         # Figma → tokens
npm run penpot:extract    # Penpot → assets
```

## 🔄 Figma Integration

**Auto-sync cada hora** vía GitHub Actions — los cambios en Figma se sincronizan a `src/tokens/figma-tokens.json`.

Setup: token en `.env` como `FIGMA_TOKEN` (local) o Secret de GitHub `FIGMA_TOKEN` (CI) — **nunca en `figma-config.json`** (ese archivo solo debe tener el placeholder `SET_VIA_ENV_FIGMA_TOKEN`).

Ver [`docs/FIGMA_INTEGRATION.md`](docs/FIGMA_INTEGRATION.md)

## 📚 Documentación Completa

- [**Architecture Map**](docs/ARCHITECTURE_MAP.md) — los 4 sistemas explicados
- [**Componentes**](docs/COMPONENTS.md) — Guía detallada
- [**Tokens**](docs/TOKENS.md) — Sistema de diseño
- [**Best Practices**](docs/BEST_PRACTICES.md) — Patrones recomendados
- [**Ejemplos Avanzados**](docs/ADVANCED_EXAMPLES.md) — Casos de uso
- [**Figma Integration**](docs/FIGMA_INTEGRATION.md) — Sync automático
- [**NPM Publishing**](docs/NPM_PUBLISHING.md) — Checklist usado para la publicación v1.0.0
- [**Contributing**](docs/CONTRIBUTING.md) — Cómo contribuir

## 🔐 Type Safety

100% type-safe con TypeScript (`npm run type-check` pasa limpio):

```tsx
<Button variant="invalid">Text</Button>  // ❌ Error de tipo: variante inválida
<Button>Text</Button>                     // ❌ Error de tipo: falta prop requerido
```

## 📦 Usar en Otra Aplicación

```bash
npm install ./path/to/DealPulseHub
```

```tsx
import { Button, Card, colors } from '@dealpulsehub/design-system';
```

## 🚀 Próximos Pasos

- [x] Publicación a npm (`@dealpulsehub/design-system@1.0.0`) — publicado 2026-08-10
- [x] Bug de `demo:phase4` (workflow end-to-end) — corregido 2026-08-10
- [x] `server-phase4.js` es la API oficial (`npm run api`) — decidido 2026-08-10
- [x] Upgrade mayor de Storybook (7→8) — completado, 21→3 vulnerabilidades
- [ ] Agregar más componentes (Modal, Dropdown, Alert)
- [ ] Temas (Light/Dark mode)
- [ ] Cerrar las 3 vulnerabilidades restantes (cadena `@storybook/addon-actions` → `uuid`, sin fix disponible aún)

## 📝 License

MIT © DealPulseHub

## 📞 Support

- 📧 Email: contact@dealpulsehub.net
- 🌐 Website: www.dealpulsehub.net
- 📖 Docs: `docs/` + `docs/ARCHITECTURE_MAP.md`
