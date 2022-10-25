import type { Page } from '@playwright/test';

export async function visit(page: Page, pathname: string) {
  const pageFinal = await page.goto(pathname, {
    waitUntil: 'networkidle',
  });
  return pageFinal;
}

export async function waitUrl(page: Page, pathname: string) {
  await page.waitForURL((url) => {
    return url.pathname.includes(pathname);
  });
}
