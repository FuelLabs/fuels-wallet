import type { Page } from '@playwright/test';

export async function visit(page: Page, pathname: string) {
  const pageFinal = await page.goto(pathname);
  // Wait for 100ms as the current wait for event networkidle
  // don't correct work on CI
  await page.waitForTimeout(1000);
  return pageFinal;
}

export async function waitUrl(page: Page, pathname: string) {
  await page.waitForURL((url) => {
    return url.pathname.includes(pathname);
  });
}
