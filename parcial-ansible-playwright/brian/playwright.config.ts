import baseConfig from '../../playwright-tests/playwright.config';

export default {
  ...baseConfig,
  testDir: './playwright',
  outputDir: './test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: './playwright-report', open: 'never' }],
  ],
  use: {
    ...baseConfig.use,
    baseURL: process.env.E2E_BASE_URL ?? 'https://TU_DOMINIO_REMOTO',
  },
  webServer: undefined,
};
