import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    // webpack 5 activa su soporte experimental nativo de TypeScript al
    // detectar tsconfig.json (agregado hoy) — esa feature no soporta
    // JSX/TSX. Lo desactivamos explícitamente para que siga usando
    // babel-loader (via babel.config.js), que sí maneja .tsx.
    if (config.experiments) {
      config.experiments.typescript = false;
    }
    return config;
  },
};

export default config;
