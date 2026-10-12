import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:4300', deviceScaleFactor: 1 },
  webServer: {
    command: 'npx ng serve showcase --port 4300',
    url: 'http://localhost:4300',
    reuseExistingServer: !process.env['CI'],
  },
});
