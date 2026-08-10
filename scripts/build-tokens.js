#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 Generando tokens...\n');

// Leer tokens.json
const tokensPath = path.join(__dirname, '../src/tokens/tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

// Generar TypeScript tokens
const generateTypescriptTokens = (tokens) => {
  let output = '// Generated from tokens.json - DO NOT EDIT MANUALLY\n\n';

  // Colors
  output += 'export const colors = {\n';
  Object.entries(tokens.colors).forEach(([category, values]) => {
    output += `  ${JSON.stringify(category)}: {\n`;
    Object.entries(values).forEach(([key, obj]) => {
      output += `    ${JSON.stringify(key)}: "${obj.value}",\n`;
    });
    output += '  },\n';
  });
  output += '} as const;\n\n';

  // Typography
  output += 'export const typography = {\n';
  Object.entries(tokens.typography).forEach(([category, values]) => {
    output += `  ${JSON.stringify(category)}: {\n`;
    Object.entries(values).forEach(([key, obj]) => {
      output += `    ${JSON.stringify(key)}: "${obj.value}",\n`;
    });
    output += '  },\n';
  });
  output += '} as const;\n\n';

  // Spacing
  output += 'export const spacing = {\n';
  Object.entries(tokens.spacing).forEach(([key, obj]) => {
    output += `  ${JSON.stringify(key)}: "${obj.value}",\n`;
  });
  output += '} as const;\n\n';

  // Border Radius
  output += 'export const borderRadius = {\n';
  Object.entries(tokens.borderRadius).forEach(([key, obj]) => {
    output += `  ${JSON.stringify(key)}: "${obj.value}",\n`;
  });
  output += '} as const;\n\n';

  // Shadows
  output += 'export const shadows = {\n';
  Object.entries(tokens.shadows).forEach(([key, obj]) => {
    output += `  ${JSON.stringify(key)}: "${obj.value}",\n`;
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
console.log('   📄 src/tokens/tokens.ts');
console.log('   🎨 src/styles/tokens.css');
console.log('');
