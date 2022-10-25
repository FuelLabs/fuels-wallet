import type { Page } from '@playwright/test';

export async function visit(page: Page, pathname: string) {
  return page.goto(pathname, {
    waitUntil: 'networkidle',
  });
}
