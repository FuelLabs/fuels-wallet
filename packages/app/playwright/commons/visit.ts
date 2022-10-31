import type { Page } from '@playwright/test';

export async function visit(page: Page, pathname: string) {
  const pageFinal = await page.goto(pathname);
  // Using waitUntil: 'networkidle' has interminent issues
  await page.waitForTimeout(500);
  return pageFinal;
}

export async function waitUrl(page: Page, pathname: string) {
  await page.waitForURL((url) => {
    return url.pathname.includes(pathname);
  });
}
