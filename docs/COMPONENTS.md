# 📦 Guía Completa de Componentes

Documentación detallada de todos los componentes en DealPulseHub Design System.

## Button

El componente más versátil para interacciones.

### Props
- `variant`: 'primary' | 'secondary' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: boolean (default: false)
- `onClick`: () => void
- `children`: React.ReactNode (required)

### Variantes
- **Primary** — Para acciones principales (azul)
- **Secondary** — Para acciones secundarias (gris)
- **Ghost** — Sin fondo, solo borde

### Ejemplo
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

## Card

Contenedor flexible para agrupar contenido.

### Props
- `children`: React.ReactNode (required)
- `onClick`: () => void (optional)

### Ejemplo
```tsx
<Card>
  <h2>Card Title</h2>
  <p>Card content here</p>
</Card>
```

## Input

Campo de entrada para distintos tipos de datos.

### Props
- `type`: 'text' | 'email' | 'password' | 'number' (default: 'text')
- `placeholder`: string
- `value`: string
- `onChange`: (e) => void
- `disabled`: boolean (default: false)

### Tipos Soportados
- text
- email
- password
- number

### Ejemplo
```tsx
<Input 
  type="email" 
  placeholder="Enter email..."
  onChange={(e) => setEmail(e.target.value)}
/>
```

## Badge

Etiqueta pequeña para estados y categorías.

### Props
- `variant`: 'primary' | 'success' | 'warning' | 'error' (default: 'primary')
- `children`: React.ReactNode (required)

### Variantes
- **Primary** — Azul (información)
- **Success** — Verde (éxito)
- **Warning** — Naranja (advertencia)
- **Error** — Rojo (error)

### Ejemplo
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
```

## Typography

Componentes para estructura de texto.

### Componentes
- `Heading1` — 32px, Bold
- `Heading2` — 24px, Bold
- `Paragraph` — 16px, Regular

### Ejemplo
```tsx
<Heading1>Main Title</Heading1>
<Heading2>Subtitle</Heading2>
<Paragraph>Body text</Paragraph>
```

---

Ver README.md para más información.
