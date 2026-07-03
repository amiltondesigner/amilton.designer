import { defineConfig } from "playwright/test";

/**
 * Smoke tests da Portfolio Experience — rodam contra o build de produção
 * (astro preview). `npm test` builda e sobe o servidor sozinho.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:4173",
  },
  webServer: {
    command: "npm run build && npm run preview -- --port 4173",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
