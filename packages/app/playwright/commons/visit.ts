import type { Page } from '@playwright/test';

export async function visit(page: Page, pathname: string) {
  // Ensure page is reloaded if already in the same page
  if (page.url().endsWith(pathname)) {
    await page.reload();
  }
  const pageFinal = await page.goto(`#${pathname}`);
  // Using waitUntil: 'networkidle' has interminent issues
  await page.waitForTimeout(1000);
  return pageFinal;
}

export async function waitUrl(page: Page, pathname: string) {
  await page.waitForURL((url) => {
    return url.href.includes(pathname);
  });
}

export async function reload(page: Page) {
  await page.reload();
  await page.waitForTimeout(1000);
  return page;
}
