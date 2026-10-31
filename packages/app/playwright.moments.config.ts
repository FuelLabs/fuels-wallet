import { defineConfig } from '@playwright/test';
import { playwrightConfig } from './playwright.config';

const VIEWPORT = { width: 1280, height: 720 };
const RECORD = Boolean(process.env.MOMENTS_VIDEO);
const recording = {
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  video: {
    mode: 'on',
    size: { width: VIEWPORT.width * 2, height: VIEWPORT.height * 2 },
  },
} as const;

/**
 * Review flows for the success moments. Meant to be watched in
 * `pnpm test:e2e:moments --ui`, not run in CI.
 */
export default defineConfig({
  ...playwrightConfig,
  testDir: 'playwright/moments/',
  testMatch: '**/*.spec.ts',
  testIgnore: [],
  outputDir: 'playwright-results/moments/',
  retries: 0,
  maxFailures: undefined,
  timeout: 240_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list', { printSteps: true }],
    ...(RECORD ? [['./playwright/moments/videoReporter.ts'] as [string]] : []),
  ],
  use: {
    ...playwrightConfig.use,
    actionTimeout: 10_000,
    trace: 'retain-on-failure',
  },
  projects: playwrightConfig.projects?.map((project) => ({
    ...project,
    use: { ...project.use, ...(RECORD && recording) },
  })),
});
