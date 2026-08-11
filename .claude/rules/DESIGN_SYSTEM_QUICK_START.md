# 🚀 QUICK START - DESIGN SYSTEM

**Inicia aquí. Ejecuta estos pasos en orden.**

---

## ✅ STEP 1: Setup Inicial (15 minutos)

```bash
# 1. Crear carpetas
mkdir -p src/{components,tokens,styles,utils,hooks}
mkdir -p .storybook
mkdir -p docs/{tokens,components,guidelines}
mkdir -p figma
mkdir -p src/components/__tests__

# 2. Instalar dependencias adicionales
npm install \
  react react-dom \
  @storybook/react @storybook/addon-essentials @storybook/addon-interactions \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  style-dictionary \
  typescript @types/react @types/react-dom

npm install --save-dev \
  @types/node \
  jest ts-jest @types/jest \
  eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## ✅ STEP 2: Design Tokens (30 minutos)

**Crear estos archivos exactamente:**

### 2.1 `src/tokens/tokens.json`
```json
{
  "colors": {
    "primary": {
      "50": { "value": "#f3f4ff", "description": "Primary lightest" },
      "100": { "value": "#e8eaff", "description": "Primary very light" },
      "500": { "value": "#6366f1", "description": "Primary main" },
      "900": { "value": "#312e81", "description": "Primary darkest" }
    },
    "semantic": {
      "success": { "value": "#10b981", "description": "Success green" },
      "warning": { "value": "#f59e0b", "description": "Warning amber" },
      "error": { "value": "#ef4444", "description": "Error red" },
      "info": { "value": "#3b82f6", "description": "Info blue" }
    },
    "neutral": {
      "0": { "value": "#ffffff", "description": "White" },
      "50": { "value": "#f9fafb", "description": "Gray 50" },
      "900": { "value": "#111827", "description": "Gray 900" }
    }
  },
  "typography": {
    "fontFamily": {
      "sans": { "value": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto" },
      "mono": { "value": "'Fira Code', 'Courier New'" }
    },
    "fontSize": {
      "xs": { "value": "12px" },
      "sm": { "value": "14px" },
      "base": { "value": "16px" },
      "lg": { "value": "18px" },
      "xl": { "value": "20px" },
      "2xl": { "value": "24px" }
    },
    "fontWeight": {
      "regular": { "value": "400" },
      "medium": { "value": "500" },
      "semibold": { "value": "600" },
      "bold": { "value": "700" }
    }
  },
  "spacing": {
    "xs": { "value": "4px" },
    "sm": { "value": "8px" },
    "md": { "value": "16px" },
    "lg": { "value": "24px" },
    "xl": { "value": "32px" },
    "2xl": { "value": "48px" }
  },
  "borderRadius": {
    "none": { "value": "0px" },
    "sm": { "value": "4px" },
    "md": { "value": "8px" },
    "lg": { "value": "12px" },
    "xl": { "value": "16px" },
    "full": { "value": "9999px" }
  },
  "shadows": {
    "sm": { "value": "0 1px 2px 0 rgba(0,0,0,0.05)" },
    "md": { "value": "0 4px 6px -1px rgba(0,0,0,0.1)" },
    "lg": { "value": "0 10px 15px -3px rgba(0,0,0,0.1)" },
    "xl": { "value": "0 20px 25px -5px rgba(0,0,0,0.1)" }
  }
}
```

### 2.2 `scripts/build-tokens.js`
(Copiar del archivo completo en DESIGN_SYSTEM_IMPLEMENTATION_PLAN.md)

### 2.3 `src/styles/index.css`
```css
@import './tokens.css';
@import './reset.css';
@import './base.css';
```

### 2.4 Generar tokens
```bash
node scripts/build-tokens.js
```

---

## ✅ STEP 3: Componentes Base (1 hora)

Crear estos 5 archivos:

### 3.1 `src/components/Button.tsx`
(Copiar del archivo completo en DESIGN_SYSTEM_IMPLEMENTATION_PLAN.md)

### 3.2 `src/components/Card.tsx`
(Copiar del archivo completo)

### 3.3 `src/components/Typography.tsx`
(Copiar del archivo completo)

### 3.4 `src/components/Input.tsx`
(Copiar del archivo completo)

### 3.5 `src/components/Badge.tsx`
(Copiar del archivo completo)

### 3.6 `src/components/index.ts`
```typescript
export { Button } from './Button';
export { Card } from './Card';
export { Heading1, Heading2, Paragraph } from './Typography';
export { Input } from './Input';
export { Badge } from './Badge';
```

---

## ✅ STEP 4: Storybook (30 minutos)

### 4.1 `.storybook/main.ts`
(Copiar del archivo completo)

### 4.2 `.storybook/preview.ts`
(Copiar del archivo completo)

### 4.3 Stories
Crear:
- `src/components/Button.stories.tsx`
- `src/components/Card.stories.tsx`
- `src/components/Input.stories.tsx`
- `src/components/Badge.stories.tsx`

---

## ✅ STEP 5: Probar

```bash
# Generar tokens
npm run tokens:build

# Iniciar Storybook
npm run dev

# Acceder a: http://localhost:6006
```

---

## 📋 COMANDOS RÁPIDOS

```bash
# Dev
npm run dev                    # Iniciar Storybook

# Build
npm run build                  # Build Storybook
npm run tokens:build           # Generar tokens

# Testing
npm run test                   # Correr tests
npm run type-check             # TypeScript check

# Linting
npm run lint                   # ESLint

# Figma
npm run figma:sync             # Sincronizar tokens de Figma
```

---

## 🎯 DÍA 1 CHECKLIST

- [ ] Carpetas creadas
- [ ] Dependencias instaladas
- [ ] tokens.json creado
- [ ] build-tokens.js creado y ejecutado
- [ ] 5 componentes creados
- [ ] Storybook configurado
- [ ] npm run dev funciona
- [ ] http://localhost:6006 abierto

---

## 📚 DOCUMENTACIÓN COMPLETA

Todos los archivos detallados están en:
`.claude/rules/DESIGN_SYSTEM_IMPLEMENTATION_PLAN.md`

---

**¡Listo para empezar!** 🚀
