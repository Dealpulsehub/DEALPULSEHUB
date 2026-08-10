# ✅ Best Practices

Patrones recomendados para usar DealPulseHub Design System.

## 1. Usar Tokens Siempre

❌ **AVOID:**
```tsx
<div style={{ color: '#6366f1', padding: '16px' }}>
  Content
</div>
```

✅ **DO:**
```tsx
import { colors, spacing } from './src/tokens';

<div style={{ color: colors.primary[500], padding: spacing.md }}>
  Content
</div>
```

## 2. Type Safety

❌ **AVOID:**
```tsx
const MyButton = ({ variant }) => (
  <Button variant={variant}>Click</Button>
);
```

✅ **DO:**
```tsx
import { Button } from './src/components';

interface MyButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
}

const MyButton: React.FC<MyButtonProps> = ({ variant }) => (
  <Button variant={variant}>Click</Button>
);
```

## 3. Reutilizar Componentes

❌ **AVOID:**
```tsx
<div style={{ borderRadius: '8px', boxShadow: '...' }}>
  Custom Card
</div>
```

✅ **DO:**
```tsx
import { Card } from './src/components';

<Card>
  Reusable Card
</Card>
```

## 4. Responsive Design

```tsx
const containerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: spacing.lg,
};

<div style={containerStyle}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

## 5. Combinar Componentes

```tsx
// Form completo
<Card>
  <Heading2>Login</Heading2>
  <Input type="email" placeholder="Email" />
  <Input type="password" placeholder="Password" />
  <Button variant="primary">Sign In</Button>
</Card>
```

## 6. Mantener Consistencia

- Usa siempre los mismos componentes
- No modifiques estilos base
- Usa tokens para valores consistentes
- Documenta componentes personalizados

## 7. Performance

- Importa solo lo que necesitas
- Usa memo() para componentes costosos
- Evita re-renders innecesarios

## 8. Accessibility (A11y)

- Usa etiquetas semánticas HTML
- Proporciona alt text para imágenes
- Asegura contraste de color suficiente
- Prueba con screen readers

---

**Para más información, consulta docs/ADVANCED_EXAMPLES.md**
