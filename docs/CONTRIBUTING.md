# 🤝 Guía de Contribución

Cómo contribuir a DealPulseHub Design System.

## Primeros Pasos

1. Fork el repositorio
2. Clona tu fork
3. Instala: npm install
4. Crea una rama: git checkout -b feature/tu-feature

## Crear Componente

1. Crear archivo en src/components/NewComponent.tsx
2. Implementar con TypeScript
3. Exportar en src/components/index.ts
4. Crear story en src/components/NewComponent.stories.tsx
5. Documentar en docs/COMPONENTS.md

## Modificar Tokens

1. Editar src/tokens/tokens.json
2. Ejecutar: npm run build-tokens
3. Verificar archivos generados

## Commits

Usa conventional commits:
- feat: agregar nuevo componente
- fix: corregir styles
- docs: actualizar documentación
- chore: actualizar dependencias

## Pull Request

1. Push a tu rama
2. Crea un PR con descripción clara
3. Espera review
4. Merge cuando sea aprobado

---

¡Gracias por contribuir! 💜
