# 📦 Publicar en NPM

Guía paso a paso para publicar @dealpulsehub/design-system en NPM.

## Requisitos

1. **Cuenta en NPM**
   - Crear en https://www.npmjs.com
   - Verificar email

2. **Node.js y npm**
   ```bash
   node --version  # >= 16.0.0
   npm --version   # >= 7.0.0
   ```

3. **Git configurado**
   ```bash
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu@email.com"
   ```

## Pasos de Publicación

### 1. Preparar

```bash
# Verificar código
npm run type-check
npm run build
npm run lint

# Tests (si existen)
npm test
```

### 2. Actualizar Versión

```bash
# Automático (recommended)
npm version patch      # 1.0.0 → 1.0.1 (fixes)
npm version minor      # 1.0.0 → 1.1.0 (features)
npm version major      # 1.0.0 → 2.0.0 (breaking changes)

# Manual
# Editar version en package.json
```

### 3. Actualizar CHANGELOG

```bash
# Agregar cambios en CHANGELOG.md
# Seguir semantic versioning
```

### 4. Commit y Tag

```bash
git add .
git commit -m "chore: release v1.0.0"
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

### 5. Login en NPM

```bash
npm login
# Ingresar usuario, password, email
# Recibirás OTP en email
```

### 6. Publicar

```bash
npm publish
```

### 7. Verificar

```bash
npm view @dealpulsehub/design-system
npm info @dealpulsehub/design-system
```

## Instalación por Usuarios

```bash
npm install @dealpulsehub/design-system
```

```tsx
import { Button, Card, colors } from '@dealpulsehub/design-system';

<Button variant="primary">Click me</Button>
```

## Actualizar Versión Posterior

```bash
# 1. Hacer cambios
# 2. npm version minor
# 3. npm publish
# 4. git push && git push --tags
```

## Troubleshooting

### "You do not have permission to publish this package"
- Verificar que estés logueado: `npm whoami`
- Verificar que seas owner del paquete en NPM

### "Package already published"
- Incrementar versión primero
- O usar `npm publish --force` (cuidado!)

### "403 Forbidden"
- Verificar npm login
- Verificar permisos en NPM
- Si es scoped (@dealpulsehub), verificar que sea "public"

## Best Practices

✅ Seguir semantic versioning
✅ Actualizar CHANGELOG siempre
✅ Hacer git tags para cada versión
✅ Documentar breaking changes
✅ Probar instalación antes de publicar
✅ Mantener package.json actualizado

## Scripts Útiles

```bash
# Ver que se va a publicar
npm publish --dry-run

# Ver archivos que se incluirán
npm pack

# Descargar y probar versión publicada
npm install @dealpulsehub/design-system@latest
```

---

**Para más info: https://docs.npmjs.com/cli/publish**
