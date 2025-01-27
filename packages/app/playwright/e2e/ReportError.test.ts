import type { Browser, BrowserContext, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import { getByAriaLabel, hasText, reload, visit } from '../commons';
import { mockData } from '../mocks';

test.describe('ReportError', () => {
  let browser: Browser;
  let page: Page;
  let browserContext: BrowserContext;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    browserContext = await browser.newContext();
    page = await browserContext.newPage();
    await mockData(page);
  });

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async function getPageErrors(page: Page): Promise<any> {
    return await page.evaluate(async () => {
      const fuelDB = window.fuelDB;
      const errors = (await fuelDB?.errors?.toArray?.()) ?? [];
      return errors;
    });
  }

  test.beforeEach(async () => {
    await page.evaluate(async () => {
      await window.fuelDB.errors.clear();
    });
  });

  test('should show Error page when there is a unhandled js error in React', async () => {
    await visit(page, '/');
    await page.evaluate(() => {
      window.testCrash();
    });

    await hasText(page, /Unexpected error/i);

    // get errors from indexedDB
    const errors = await getPageErrors(page);
    expect(errors.length).toBeGreaterThan(0);

    await page.waitForTimeout(2000);
    // report error
    await getByAriaLabel(page, 'Send error reports').click();
    await expect(page.getByText(/Unexpected error/)).toHaveCount(0);

    await expect
      .poll(async () => (await getPageErrors(page)).length, {
        timeout: 10000,
      })
      .toBe(0);
  });

  test('should show Review Error in menu when there is a error in the database', async () => {
    await visit(page, '/');
    await page.evaluate(async () => {
      await window.fuelDB.errors.add({
        id: '12345',
        error: {
          name: 'React$ error',
          message: 'Test Error',
          stack: 'Line error 1',
        },
        extra: {
          timestamp: Date.now(),
          location: 'http://localhost:3000',
          pathname: '/',
          hash: '#',
          counts: 0,
        },
      });
    });

    await reload(page);
    await getByAriaLabel(page, 'Menu').click();
    const floatingButton = page.locator(`[data-key="hasErrors"]`);
    expect(floatingButton.isVisible).toBeTruthy();
  });

  test('should be able to ignore a error', async () => {
    await visit(page, '/');
    await page.evaluate(async () => {
      await window.fuelDB.errors.add({
        id: '12345',
        error: {
          name: 'React$ error',
          message: 'Test$ Error',
          stack: 'Line error 1',
        },
        extra: {
          timestamp: Date.now(),
          location: 'http://localhost:3000',
          pathname: '/',
          hash: '#',
          counts: 0,
        },
      });
    });
    await reload(page);
    await getByAriaLabel(page, 'Menu').click();
    page.locator(`[data-key="hasErrors"]`).click();
    await hasText(page, /Unexpected error/i);

    expect((await getPageErrors(page)).length).toBe(1);
    // report error
    await getByAriaLabel(page, 'Ignore error(s)').click();
    await expect(page.getByText(/Unexpected error/i)).toHaveCount(0);

    await expect
      .poll(async () => (await getPageErrors(page)).length, {
        timeout: 10000,
      })
      .toBe(1);
  });
  test('should be able to dismiss all errors', async () => {
    await visit(page, '/');
    await page.evaluate(async () => {
      await window.fuelDB.errors.add({
        id: '12345',
        error: {
          name: 'React$ error',
          message: 'Test Error',
          stack: 'Line error 1',
        },
        extra: {
          timestamp: Date.now(),
          location: 'http://localhost:3000',
          pathname: '/',
          hash: '#',
          counts: 0,
        },
      });
    });
    await reload(page);
    await getByAriaLabel(page, 'Menu').click();
    page.locator(`[data-key="hasErrors"]`).click();
    await hasText(page, /Unexpected error/i);

    // report error
    await getByAriaLabel(
      page,
      'Ignore and dismiss all errors permanently'
    ).click();
    await expect(page.getByText(/Unexpected error/i)).toHaveCount(0);

    await expect
      .poll(async () => (await getPageErrors(page)).length, {
        timeout: 10000,
      })
      .toBe(0);
  });
  test('should hide when the single error is dismissed', async () => {
    await visit(page, '/');
    await page.evaluate(async () => {
      await window.fuelDB.errors.add({
        id: '12345',
        error: {
          name: 'React$ error',
          message: 'Test Error',
          stack: 'Line error 1',
        },
        extra: {
          timestamp: Date.now(),
          location: 'http://localhost:3000',
          pathname: '/',
          hash: '#',
          counts: 0,
        },
      });
    });
    await reload(page);
    await getByAriaLabel(page, 'Menu').click();
    page.locator(`[data-key="hasErrors"]`).click();
    await hasText(page, /Unexpected error/i);

    // report error
    await getByAriaLabel(page, 'Dismiss error').click();
    await expect(page.getByText(/Unexpected error/i)).toHaveCount(0);

    await expect
      .poll(async () => (await getPageErrors(page)).length, {
        timeout: 10000,
      })
      .toBe(0);
  });
  test('should detect and capture global errors', async () => {
    await page.evaluate(async () => {
      console.error(new Error('New Error'));
    });
    await visit(page, '/');
    await reload(page);
    await getByAriaLabel(page, 'Menu').click();
    page.locator(`[data-key="hasErrors"]`).click();
    await hasText(page, /Unexpected error/i);

    const errorsAfterReporting = await getPageErrors(page);
    expect(errorsAfterReporting.length).toBe(1);
  });

  test('should deduplicate errors', async () => {
    await visit(page, '/');
    await page.evaluate(async () => {
      await window.fuelDB.errors.add({
        id: '12345',
        error: {
          name: 'React$ error',
          message: 'Test Error',
          stack: 'Line error 1',
        },
        extra: {
          timestamp: Date.now(),
          location: 'http://localhost:3000',
          pathname: '/',
          hash: '#',
          counts: 0,
        },
      });
      await window.fuelDB.errors.add({
        id: '123456',
        error: {
          name: 'React$ error',
          message: 'Test Error',
          stack: 'Line error 1',
        },
        extra: {
          timestamp: Date.now(),
          location: 'http://localhost:3000',
          pathname: '/',
          hash: '#',
          counts: 0,
        },
      });
    });
    await reload(page);
    await getByAriaLabel(page, 'Menu').click();
    page.locator(`[data-key="hasErrors"]`).click();
    await hasText(page, /Unexpected error/i);
    await reload(page);
    const errorsAfterReporting = await getPageErrors(page);
    expect(errorsAfterReporting.length).toBe(1);
  });
  test('should not show ignored errors', async () => {
    await visit(page, '/');

    await page.evaluate(async () => {
      await window.fuelDB.errors.add({
        id: '12345',
        error: {
          name: 'React Error',
          message: 'React Error',
          stack: 'Line error 1',
        },
        extra: {
          timestamp: Date.now(),
          location: 'http://localhost:3000',
          pathname: '/',
          hash: '#',
          counts: 0,
        },
      });
    });
    await expect
      .poll(
        async () => {
          return (await getPageErrors(page)).find(
            (e) => e.error.name === 'React Error'
          );
        },
        {
          timeout: 10000,
        }
      )
      .toBeUndefined();
  });
});
