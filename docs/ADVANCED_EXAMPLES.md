# 🚀 Ejemplos Avanzados

Patrones y técnicas avanzadas con DealPulseHub Design System.

## 1. Crear Componente Personalizado con Tokens

```tsx
import { colors, spacing, borderRadius } from './src/tokens';

interface AlertProps {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const Alert: React.FC<AlertProps> = ({ title, message, type }) => {
  const colors_map = {
    info: { bg: colors.semantic.info, text: white },
    success: { bg: colors.semantic.success, text: white },
    warning: { bg: colors.semantic.warning, text: white },
    error: { bg: colors.semantic.error, text: white },
  };

  const { bg, text } = colors_map[type];

  return (
    <div style={{
      backgroundColor: bg,
      color: text,
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
    }}>
      <strong>{title}</strong>
      <p style={{ marginTop: spacing.sm }}>{message}</p>
    </div>
  );
};
```

## 2. Responsive Grid with Cards

```tsx
import { Card, Heading2 } from './src/components';
import { spacing } from './src/tokens';

const items = [
  { id: 1, title: 'Item 1', description: 'Description 1' },
  { id: 2, title: 'Item 2', description: 'Description 2' },
  { id: 3, title: 'Item 3', description: 'Description 3' },
];

export const ItemGrid = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.lg,
  }}>
    {items.map(item => (
      <Card key={item.id}>
        <Heading2>{item.title}</Heading2>
        <p>{item.description}</p>
      </Card>
    ))}
  </div>
);
```

## 3. Form with Validation

```tsx
import { useState } from 'react';
import { Button, Input, Badge } from './src/components';

export const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    if (!email || !message) {
      setStatus('error');
      return;
    }
    
    // Send form...
    setStatus('success');
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <Input 
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea 
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '8px' }}
      />
      <Button variant="primary" onClick={handleSubmit}>
        Send
      </Button>
      
      {status === 'success' && <Badge variant="success">Sent!</Badge>}
      {status === 'error' && <Badge variant="error">Please fill all fields</Badge>}
    </div>
  );
};
```

## 4. Theme Wrapper

```tsx
import { colors } from './src/tokens';

interface ThemeWrapperProps {
  variant: 'light' | 'dark';
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ variant, children }) => {
  const bgColor = variant === 'light' ? colors.neutral[0] : colors.neutral[900];
  const textColor = variant === 'light' ? colors.neutral[900] : colors.neutral[0];

  return (
    <div style={{
      backgroundColor: bgColor,
      color: textColor,
      padding: '20px',
      minHeight: '100vh',
    }}>
      {children}
    </div>
  );
};
```

## 5. Custom Hook para Tokens

```tsx
import { colors, spacing, typography } from './src/tokens';

export const useToken = (type: 'color' | 'spacing' | 'typography', key: string) => {
  switch (type) {
    case 'color':
      return colors[key] || '#000';
    case 'spacing':
      return spacing[key] || '0';
    case 'typography':
      return typography[key] || {};
    default:
      return null;
  }
};

// Usage
const primaryColor = useToken('color', 'primary.500');
const padding = useToken('spacing', 'md');
```

## 6. Compound Components Pattern

```tsx
import { Card, Button, Heading2 } from './src/components';
import { spacing } from './src/tokens';

export const Dialog = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Card style={{ maxWidth: '500px' }}>
      {children}
    </Card>
  </div>
);

Dialog.Title = ({ children }: { children: React.ReactNode }) => (
  <Heading2>{children}</Heading2>
);

Dialog.Body = ({ children }: { children: React.ReactNode }) => (
  <div style={{ margin: spacing.md }}>
    {children}
  </div>
);

Dialog.Actions = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'flex-end', marginTop: spacing.lg }}>
    {children}
  </div>
);

// Usage
<Dialog>
  <Dialog.Title>Confirm Action</Dialog.Title>
  <Dialog.Body>Are you sure?</Dialog.Body>
  <Dialog.Actions>
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Dialog.Actions>
</Dialog>
```

## 7. Extender Componentes

```tsx
import { Button } from './src/components';
import { colors } from './src/tokens';

export const IconButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ icon, onClick }) => (
  <Button 
    variant="ghost" 
    onClick={onClick}
    style={{
      width: '40px',
      height: '40px',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {icon}
  </Button>
);
```

---

**Para más ejemplos, consulta docs/COMPONENTS.md**
