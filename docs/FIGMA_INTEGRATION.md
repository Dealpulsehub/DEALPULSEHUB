# 🎨 Figma Integration Guide

Guía para sincronizar tokens de Figma con tu Design System.

---

## 📋 Prerequisitos

1. **Figma Account** — https://figma.com
2. **Figma File** — Design System creado en Figma
3. **Figma API Token** — Generado desde Figma Settings

---

## 🔑 Paso 1: Generar Figma API Token

1. Ve a https://www.figma.com/settings
2. Dirígete a **Personal access tokens**
3. Haz click en **Generate new token**
4. Copia el token (no se mostrará de nuevo)

---

## ⚙️ Paso 2: Configurar figma-config.json

Edita `figma-config.json` con tus credenciales:

```json
{
  "figmaProjectId": "YOUR_FILE_ID",  // De la URL de Figma
  "figmaFile": "DealPulseHub Design System",
  "figmaToken": "YOUR_API_TOKEN",
  "outputPath": "./src/tokens/",
  "autoSync": true,
  "syncInterval": 3600
}
```

### Cómo obtener tu Figma File ID

En Figma, abre tu Design System file. La URL será:
```
https://www.figma.com/file/YOUR_FILE_ID_HERE/Design-System
```

Copia `YOUR_FILE_ID_HERE` → pásalo a `figmaProjectId`

---

## 🔐 Paso 3: Agregar Secret a GitHub

Si usas GitHub Actions (recomendado):

1. Ve a tu repo → **Settings → Secrets and variables → Actions**
2. Nuevo secret: `FIGMA_TOKEN`
3. Pega tu token de Figma
4. Guarda

---

## 🚀 Paso 4: Ejecutar Sync Manual

```bash
# Test manual
node scripts/figma-sync.js

# Esto descargará tokens de Figma
```

---

## 📅 Paso 5: Auto-Sync (Opcional)

El workflow GitHub Actions ejecutará automáticamente cada hora:
- Descarga tokens de Figma
- Compara con tokens locales
- Auto-commits cambios
- Pushea a `figma-sync` branch

**Workflow file:** `.github/workflows/figma-sync.yml`

---

## 🔗 Estructura de Tokens en Figma

Para que el sync funcione, organiza tus tokens en Figma así:

```
Colors
├── Primary
├── Secondary
├── Neutral
└── Semantic

Typography
├── Font Family
├── Font Size
└── Font Weight

Spacing
├── xs (4px)
├── sm (8px)
├── md (16px)
└── ... (etc)

Shadows
├── sm
├── md
└── lg
```

---

## ✅ Verificar Sincronización

Después de correr el sync:

```bash
ls -la src/tokens/figma-tokens.json
cat src/tokens/figma-tokens.json
```

Deberías ver los tokens descargados de Figma.

---

## 🐛 Troubleshooting

### "Token inválido"
- Verifica que copiaste el token completo
- Tokens expiran cada 12 meses en Figma
- Genera uno nuevo si es necesario

### "Proyecto no encontrado"
- Verifica que el `figmaProjectId` es correcto
- Asegúrate de que tienes acceso al archivo en Figma

### "No se sincroniza automáticamente"
- Verifica que el secret `FIGMA_TOKEN` está en GitHub
- Revisa los logs del workflow en Actions tab
- Ejecuta manualmente: `npm run figma:sync`

---

## 📚 Próximos Pasos

1. ✅ Configurar credenciales (Paso 1-3)
2. ✅ Ejecutar primer sync manual (Paso 4)
3. ✅ Verificar que los tokens se descargaron
4. ✅ Configurar auto-sync en GitHub Actions (Paso 5)

---

## 🔄 Flujo Completo

```
Diseñador edita tokens en Figma
         ↓
GitHub Actions deteca cambios (cada hora)
         ↓
Script descarga tokens via Figma API
         ↓
Compara con versión local
         ↓
Si hay cambios: auto-commit a rama figma-sync
         ↓
Crear PR automático o merge a main
         ↓
Design System actualizado en tu código
```

---

**¡Listo!** Tus tokens de Figma ahora se sincronizan automáticamente con tu Design System.
