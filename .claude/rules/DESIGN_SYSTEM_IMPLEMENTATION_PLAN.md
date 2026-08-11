# 🎨 PLAN DE IMPLEMENTACIÓN COMPLETO - DESIGN SYSTEM

**Proyecto:** DealPulseHub Design System Phase 4  
**Inicio:** 2026-08-06  
**Duración Total:** 10 días de trabajo (80 horas)  
**Objetivo:** Design System completo con Tokens + Componentes + Figma + Storybook  

---

## 📋 ROADMAP GENERAL

```
SEMANA 1 (5 días)
├─ Día 1-2: Setup Base + Design Tokens (20h)
├─ Día 3-4: Componentes Base (20h)
└─ Día 5: Storybook Completo (10h)

SEMANA 2 (5 días)
├─ Día 6-7: Figma Integration (15h)
├─ Día 8-9: Documentación + Ejemplos (15h)
└─ Día 10: QA + Optimización (5h)
```

---

# 🚀 FASE 1: SETUP BASE + DESIGN TOKENS (Días 1-2, 20 horas)

## DÍA 1: SETUP INICIAL

### 1.1 Crear estructura de carpetas
```bash
mkdir -p src/{components,tokens,styles,utils,hooks}
mkdir -p .storybook
mkdir -p docs/{tokens,components,guidelines}
mkdir -p figma
```

### 1.2 Actualizar package.json
```json
{
  "name": "dealpulsehub-design-system",
  "version": "1.0.0",
  "description": "DealPulseHub Design System - Components, Tokens, and Guidelines",
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build",
    "build-storybook": "npm run tokens:build && storybook build",
    "tokens:build": "node scripts/build-tokens.js",
    "tokens:watch": "node scripts/watch-tokens.js",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "figma:sync": "figma-tokens sync"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@storybook/react": "^7.0.0",
    "@storybook/addon-essentials": "^7.0.0",
    "@storybook/addon-interactions": "^7.0.0",
    "@figma-export/cli": "latest",
    "style-dictionary": "^3.8.0",
    "TypeScript": "^5.0.0"
  }
}
```

### 1.3 Instalar dependencias
```bash
npm install
```

---

## DÍA 2: DESIGN TOKENS

### 2.1 Crear tokens.json
**Archivo:** `src/tokens/tokens.json`

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
      "sans": { "value": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto", "description": "System sans serif" },
      "mono": { "value": "'Fira Code', 'Courier New'", "description": "Monospace" }
    },
    "fontSize": {
      "xs": { "value": "12px", "description": "Extra small" },
      "sm": { "value": "14px", "description": "Small" },
      "base": { "value": "16px", "description": "Base size" },
      "lg": { "value": "18px", "description": "Large" },
      "xl": { "value": "20px", "description": "Extra large" },
      "2xl": { "value": "24px", "description": "2x Large" }
    },
    "fontWeight": {
      "regular": { "value": "400", "description": "Regular weight" },
      "medium": { "value": "500", "description": "Medium weight" },
      "semibold": { "value": "600", "description": "Semibold weight" },
      "bold": { "value": "700", "description": "Bold weight" }
    }
  },
  "spacing": {
    "xs": { "value": "4px", "description": "Extra small" },
    "sm": { "value": "8px", "description": "Small" },
    "md": { "value": "16px", "description": "Medium" },
    "lg": { "value": "24px", "description": "Large" },
    "xl": { "value": "32px", "description": "Extra large" },
    "2xl": { "value": "48px", "description": "2x Large" }
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

### 2.2 Crear build-tokens.js
**Archivo:** `scripts/build-tokens.js`

```javascript
const fs = require('fs');
const path = require('path');

// Leer tokens.json
const tokensPath = path.join(__dirname, '../src/tokens/tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

// Generar tokens.ts (TypeScript)
const generateTypescriptTokens = (tokens) => {
  let output = '// Generated from tokens.json - DO NOT EDIT MANUALLY\n\n';
  
  // Colors
  output += 'export const colors = {\n';
  Object.entries(tokens.colors).forEach(([category, values]) => {
    output += `  ${category}: {\n`;
    Object.entries(values).forEach(([key, obj]) => {
      output += `    ${key}: "${obj.value}",\n`;
    });
    output += '  },\n';
  });
  output += '} as const;\n\n';
  
  // Typography
  output += 'export const typography = {\n';
  Object.entries(tokens.typography).forEach(([category, values]) => {
    output += `  ${category}: {\n`;
    Object.entries(values).forEach(([key, obj]) => {
      output += `    ${key}: "${obj.value}",\n`;
    });
    output += '  },\n';
  });
  output += '} as const;\n\n';
  
  // Spacing
  output += 'export const spacing = {\n';
  Object.entries(tokens.spacing).forEach(([key, obj]) => {
    output += `  ${key}: "${obj.value}",\n`;
  });
  output += '} as const;\n\n';
  
  // Border Radius
  output += 'export const borderRadius = {\n';
  Object.entries(tokens.borderRadius).forEach(([key, obj]) => {
    output += `  ${key}: "${obj.value}",\n`;
  });
  output += '} as const;\n\n';
  
  // Shadows
  output += 'export const shadows = {\n';
  Object.entries(tokens.shadows).forEach(([key, obj]) => {
    output += `  ${key}: "${obj.value}",\n`;
  });
  output += '} as const;\n';
  
  return output;
};

// Generar CSS custom properties
const generateCSSTokens = (tokens) => {
  let output = ':root {\n';
  
  // Colors
  Object.entries(tokens.colors).forEach(([category, values]) => {
    Object.entries(values).forEach(([key, obj]) => {
      output += `  --color-${category}-${key}: ${obj.value};\n`;
    });
  });
  
  // Typography
  Object.entries(tokens.typography).forEach(([category, values]) => {
    Object.entries(values).forEach(([key, obj]) => {
      output += `  --${category}-${key}: ${obj.value};\n`;
    });
  });
  
  // Spacing
  Object.entries(tokens.spacing).forEach(([key, obj]) => {
    output += `  --spacing-${key}: ${obj.value};\n`;
  });
  
  // Border Radius
  Object.entries(tokens.borderRadius).forEach(([key, obj]) => {
    output += `  --radius-${key}: ${obj.value};\n`;
  });
  
  // Shadows
  Object.entries(tokens.shadows).forEach(([key, obj]) => {
    output += `  --shadow-${key}: ${obj.value};\n`;
  });
  
  output += '}\n';
  return output;
};

// Escribir archivos
const tsOutput = generateTypescriptTokens(tokens);
const cssOutput = generateCSSTokens(tokens);

fs.writeFileSync(path.join(__dirname, '../src/tokens/tokens.ts'), tsOutput);
fs.writeFileSync(path.join(__dirname, '../src/styles/tokens.css'), cssOutput);

console.log('✅ Tokens generados exitosamente');
console.log('   - src/tokens/tokens.ts');
console.log('   - src/styles/tokens.css');
```

### 2.3 Crear watch-tokens.js
**Archivo:** `scripts/watch-tokens.js`

```javascript
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const tokensPath = path.join(__dirname, '../src/tokens/tokens.json');

console.log('👀 Watching tokens.json for changes...');

fs.watchFile(tokensPath, () => {
  console.log('🔄 tokens.json changed, rebuilding...');
  spawn('node', [path.join(__dirname, 'build-tokens.js')]);
});
```

### 2.4 Estructura de estilos
**Archivo:** `src/styles/index.css`

```css
@import './tokens.css';
@import './reset.css';
@import './base.css';
```

**Archivo:** `src/styles/reset.css`
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--fontFamily-sans);
  font-size: var(--fontSize-base);
  line-height: 1.6;
  color: var(--color-neutral-900);
  background-color: var(--color-neutral-0);
}
```

**Archivo:** `src/styles/base.css`
```css
/* Base styles */
a {
  color: var(--color-primary-500);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  cursor: pointer;
  font-family: inherit;
}

input, textarea, select {
  font-family: inherit;
}
```

---

# 🎯 FASE 2: COMPONENTES BASE (Días 3-4, 20 horas)

## DÍA 3: COMPONENTES FUNDAMENTALES

### 3.1 Button Component
**Archivo:** `src/components/Button.tsx`

```typescript
import React from 'react';
import { colors, spacing, borderRadius } from '../tokens/tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  className = '',
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.neutral[0],
      border: `1px solid ${colors.primary[500]}`,
    },
    secondary: {
      backgroundColor: colors.neutral[100],
      color: colors.primary[500],
      border: `1px solid ${colors.primary[500]}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      border: `1px solid ${colors.primary[500]}`,
    },
  };

  const sizeStyles = {
    sm: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: '14px',
    },
    md: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: '16px',
    },
    lg: {
      padding: `${spacing.lg} ${spacing.xl}`,
      fontSize: '18px',
    },
  };

  const style = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    borderRadius: borderRadius.md,
    transition: 'all 0.2s ease-in-out',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <button
      style={style}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
};
```

### 3.2 Card Component
**Archivo:** `src/components/Card.tsx`

```typescript
import React from 'react';
import { borderRadius, shadows, spacing } from '../tokens/tokens';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const style = {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    padding: spacing.lg,
    transition: 'all 0.3s ease-in-out',
    cursor: onClick ? 'pointer' : 'default',
  };

  return (
    <div style={style} className={className} onClick={onClick}>
      {children}
    </div>
  );
};
```

### 3.3 Typography Components
**Archivo:** `src/components/Typography.tsx`

```typescript
import React from 'react';
import { typography, colors } from '../tokens/tokens';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading1: React.FC<TypographyProps> = ({ children, className }) => (
  <h1
    style={{
      fontSize: '32px',
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral[900],
    }}
    className={className}
  >
    {children}
  </h1>
);

export const Heading2: React.FC<TypographyProps> = ({ children, className }) => (
  <h2
    style={{
      fontSize: '28px',
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral[900],
    }}
    className={className}
  >
    {children}
  </h2>
);

export const Paragraph: React.FC<TypographyProps> = ({ children, className }) => (
  <p
    style={{
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.regular,
      color: colors.neutral[700],
      lineHeight: '1.6',
    }}
    className={className}
  >
    {children}
  </p>
);
```

### 3.4 Input Component
**Archivo:** `src/components/Input.tsx`

```typescript
import React from 'react';
import { colors, spacing, borderRadius, typography } from '../tokens/tokens';

interface InputProps {
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const style = {
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.sans,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.neutral[300]}`,
    backgroundColor: disabled ? colors.neutral[100] : colors.neutral[0],
    color: colors.neutral[900],
    transition: 'border-color 0.2s',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={style}
      className={className}
    />
  );
};
```

---

## DÍA 4: MÁS COMPONENTES + EXPORTS

### 4.1 Badge Component
**Archivo:** `src/components/Badge.tsx`

```typescript
import React from 'react';
import { colors, spacing, borderRadius, typography } from '../tokens/tokens';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary[100],
      color: colors.primary[700],
    },
    success: {
      backgroundColor: colors.semantic.success,
      color: colors.neutral[0],
    },
    warning: {
      backgroundColor: colors.semantic.warning,
      color: colors.neutral[0],
    },
    error: {
      backgroundColor: colors.semantic.error,
      color: colors.neutral[0],
    },
  };

  const style = {
    ...variantStyles[variant],
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    display: 'inline-block',
  };

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
};
```

### 4.2 Component Index
**Archivo:** `src/components/index.ts`

```typescript
export { Button } from './Button';
export { Card } from './Card';
export { Heading1, Heading2, Paragraph } from './Typography';
export { Input } from './Input';
export { Badge } from './Badge';
```

### 4.3 Tokens Index
**Archivo:** `src/tokens/index.ts`

```typescript
export { colors, typography, spacing, borderRadius, shadows } from './tokens';
```

### 4.4 Main index.ts
**Archivo:** `src/index.ts`

```typescript
// Components
export * from './components';

// Tokens
export * from './tokens';

// Styles
import './styles/index.css';
```

---

# 📚 FASE 3: STORYBOOK (Día 5, 10 horas)

## 5.1 Configuración de Storybook
**Archivo:** `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

**Archivo:** `.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

## 5.2 Button Stories
**Archivo:** `src/components/Button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Click me',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Click me',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
```

## 5.3 Card Stories
**Archivo:** `src/components/Card.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Heading2, Paragraph } from './Typography';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <Heading2>Card Title</Heading2>
        <Paragraph>This is a card component with some content inside.</Paragraph>
      </div>
    ),
  },
};

export const WithCustomContent: Story = {
  render: () => (
    <Card style={{ maxWidth: '400px' }}>
      <Heading2>Featured Component</Heading2>
      <Paragraph>
        Cards are versatile containers for grouping related information and actions.
      </Paragraph>
    </Card>
  ),
};
```

## 5.4 Input Stories
**Archivo:** `src/components/Input.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email...',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    disabled: true,
  },
};
```

## 5.5 Tokens Documentation
**Archivo:** `src/tokens/Tokens.stories.tsx`

```typescript
import type { Meta } from '@storybook/react';
import { colors, spacing, typography, borderRadius } from './tokens';

const meta = {
  title: 'Tokens/Colors',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

export const ColorPalette = () => (
  <div style={{ padding: '20px' }}>
    <h2>Color Palette</h2>
    {Object.entries(colors).map(([category, values]) => (
      <div key={category} style={{ marginBottom: '30px' }}>
        <h3>{category}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
          {Object.entries(values).map(([key, obj]: any) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: '80px',
                  backgroundColor: obj.value,
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: '1px solid #ccc',
                }}
              />
              <small>{key}</small>
              <br />
              <small style={{ color: '#666', fontSize: '10px' }}>{obj.value}</small>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
```

---

# 🎨 FASE 4: FIGMA INTEGRATION (Días 6-7, 15 horas)

## 6.1 Figma Config
**Archivo:** `figma-config.json`

```json
{
  "figmaProjectId": "YOUR_FIGMA_PROJECT_ID",
  "figmaFile": "Design System",
  "figmaToken": "YOUR_FIGMA_TOKEN",
  "outputPath": "./src/tokens/",
  "modes": {
    "light": "Light Mode",
    "dark": "Dark Mode"
  },
  "autoSync": true,
  "syncInterval": 3600,
  "figmaTokens": {
    "colors": "Colors",
    "typography": "Typography",
    "spacing": "Spacing"
  }
}
```

## 6.2 Figma Sync Script
**Archivo:** `scripts/figma-sync.js`

```javascript
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync('figma-config.json', 'utf-8'));

async function syncFigmaTokens() {
  try {
    console.log('🔄 Syncing Figma tokens...');

    const response = await axios.get(
      `https://api.figma.com/v1/files/${config.figmaProjectId}`,
      {
        headers: {
          'X-Figma-Token': config.figmaToken,
        },
      }
    );

    // Procesar tokens de Figma
    const figmaTokens = extractTokens(response.data);

    // Guardar tokens
    const outputPath = path.join(config.outputPath, 'figma-tokens.json');
    fs.writeFileSync(outputPath, JSON.stringify(figmaTokens, null, 2));

    console.log('✅ Figma tokens synced successfully');
    console.log(`📝 Saved to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error syncing Figma tokens:', error.message);
  }
}

function extractTokens(figmaData) {
  // Lógica para extraer tokens de Figma
  // Esto es un placeholder - requiere análisis de la estructura de Figma
  return {
    colors: {},
    typography: {},
    spacing: {},
  };
}

// Ejecutar
syncFigmaTokens();

// Auto-sync si está habilitado
if (config.autoSync) {
  setInterval(syncFigmaTokens, config.syncInterval * 1000);
}
```

## 6.3 GitHub Actions para Figma Sync
**Archivo:** `.github/workflows/figma-sync.yml`

```yaml
name: Sync Figma Tokens

on:
  schedule:
    - cron: '0 * * * *'  # Cada hora
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Sync Figma tokens
        run: node scripts/figma-sync.js
        env:
          FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}

      - name: Commit changes
        run: |
          git config user.name "figma-bot"
          git config user.email "figma-sync@github.com"
          git add src/tokens/figma-tokens.json
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: sync Figma tokens"

      - name: Push changes
        run: git push
```

---

# 📖 FASE 5: DOCUMENTACIÓN (Días 8-9, 15 horas)

## 7.1 README del Design System
**Archivo:** `docs/README.md`

```markdown
# 🎨 DealPulseHub Design System

## Overview

Design System completo con componentes reutilizables, tokens de diseño, y documentación interactiva en Storybook.

### Features
- ✅ Design Tokens (Colores, Tipografía, Espaciado)
- ✅ Componentes React reutilizables
- ✅ Storybook para documentación interactiva
- ✅ Sincronización con Figma
- ✅ CSS custom properties
- ✅ TypeScript full support
- ✅ Accesibilidad (A11y)

## Estructura

```
src/
├── components/      # Componentes React
├── tokens/         # Design tokens
├── styles/         # Estilos globales
├── hooks/          # Custom React hooks
└── utils/          # Utilidades

.storybook/         # Configuración de Storybook
docs/               # Documentación
figma/              # Configuración de Figma
```

## Quick Start

```bash
# Instalar dependencias
npm install

# Desarrollo con Storybook
npm run dev

# Build Storybook
npm run build

# Sincronizar tokens de Figma
npm run figma:sync
```

## Componentes Disponibles

- Button
- Card
- Input
- Badge
- Typography (Heading1, Heading2, Paragraph)

## Tokens

### Colores
- Primary, Secondary, Neutral
- Semantic (Success, Warning, Error, Info)

### Tipografía
- Font Family
- Font Size
- Font Weight

### Espaciado
- xs (4px) → 2xl (48px)

### Border Radius
- none, sm, md, lg, xl, full

### Shadows
- sm, md, lg, xl
```

## 7.2 Componentes Documentation
**Archivo:** `docs/components/COMPONENTS.md`

```markdown
# Components Guide

## Button

### Props
- `variant`: 'primary' | 'secondary' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: boolean
- `onClick`: function
- `children`: ReactNode

### Usage
```tsx
import { Button } from '@dealpulsehub/design-system';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

## Card

### Props
- `children`: ReactNode (required)
- `onClick`: function (optional)

### Usage
```tsx
import { Card } from '@dealpulsehub/design-system';

<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

## Input

### Props
- `type`: 'text' | 'email' | 'password' | 'number'
- `placeholder`: string
- `value`: string
- `onChange`: function
- `disabled`: boolean

### Usage
```tsx
import { Input } from '@dealpulsehub/design-system';

<Input
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```
```

## 7.3 Tokens Documentation
**Archivo:** `docs/tokens/TOKENS.md`

```markdown
# Design Tokens

## Color System

### Primary Colors
- Primary 50: #f3f4ff (Lightest)
- Primary 500: #6366f1 (Main)
- Primary 900: #312e81 (Darkest)

### Semantic Colors
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444
- Info: #3b82f6

## Typography Scale

### Font Families
- Sans: System sans serif
- Mono: Fira Code / Courier New

### Font Sizes
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing Scale

All values follow an 8px grid system:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Border Radius

- none: 0px
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px (rounded)
```

---

# ✅ FASE 6: QA + OPTIMIZACIÓN (Día 10, 5 horas)

## 8.1 Testing Setup
**Archivo:** `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
```

## 8.2 Sample Test
**Archivo:** `src/components/__tests__/Button.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## 8.3 Build & Deployment
**Archivo:** `.github/workflows/design-system-publish.yml`

```yaml
name: Publish Design System

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - '.storybook/**'
      - 'package.json'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build tokens
        run: npm run tokens:build

      - name: Build Storybook
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
          cname: false
```

---

## 📊 TIMELINE RESUMEN

```
Día 1-2:  Design Tokens              ✅ (20h)
Día 3-4:  Componentes Base           ✅ (20h)
Día 5:    Storybook                  ✅ (10h)
Día 6-7:  Figma Integration          ✅ (15h)
Día 8-9:  Documentación              ✅ (15h)
Día 10:   QA + Optimización          ✅ (5h)

TOTAL: 80 horas de trabajo
```

---

## 🎯 CHECKLIST FINAL

- [ ] Estructura de carpetas creada
- [ ] Design Tokens definidos (JSON)
- [ ] Tokens generados (TS + CSS)
- [ ] Componentes base implementados (5+)
- [ ] Storybook configurado
- [ ] Stories creadas para todos los componentes
- [ ] Figma integration setup
- [ ] Auto-sync workflow activo
- [ ] Documentación completa
- [ ] Tests unitarios
- [ ] GitHub Pages deployment
- [ ] README actualizado

---

**Status:** 🟢 PLAN LISTO PARA IMPLEMENTACIÓN  
**Próximo paso:** Empezar Día 1 con setup inicial
