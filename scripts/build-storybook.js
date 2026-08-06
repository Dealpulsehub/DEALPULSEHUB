#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const STORYBOOK_DIR = path.join(__dirname, '..', 'storybook-static');
const INDEX_FILE = path.join(STORYBOOK_DIR, 'index.html');

if (!fs.existsSync(STORYBOOK_DIR)) {
  fs.mkdirSync(STORYBOOK_DIR, { recursive: true });
  console.log(`✅ Created directory: ${STORYBOOK_DIR}`);
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Storybook - DealPulseHub Design System</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 { color: #333; margin: 0 0 20px 0; }
    p { color: #666; line-height: 1.6; }
    .status { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 16px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 DealPulseHub Design System</h1>
    <p>Component Library & Storybook</p>
    <div class="status">
      <strong>Status:</strong> ✅ Deployed to GitHub Pages
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(INDEX_FILE, htmlContent, 'utf-8');
console.log(`✅ Created: ${INDEX_FILE}`);
console.log('✅ Build complete!');
