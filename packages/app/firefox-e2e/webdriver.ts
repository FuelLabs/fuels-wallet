// Minimal W3C WebDriver client for geckodriver. Playwright cannot load
// extensions in Firefox, and its BiDi driver cannot script moz-extension pages.
import { type ChildProcess, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';

const ELEMENT = 'element-6066-11e4-a52e-4f735466cecf';
const MAC_FIREFOX = '/Applications/Firefox.app/Contents/MacOS/firefox';

export type Element = { [ELEMENT]: string };
type Locator = { using: 'css selector' | 'xpath'; value: string };

export const css = (value: string): Locator => ({
  using: 'css selector',
  value,
});
export const xpath = (value: string): Locator => ({ using: 'xpath', value });
export const ariaLabel = (label: string) => css(`[aria-label="${label}"]`);
export const button = (text: string) =>
  xpath(
    `//button[contains(normalize-space(.), "${text}") or @aria-label="${text}"]`
  );
export const text = (value: string) =>
  xpath(
    `//*[contains(normalize-space(.), "${value}")][not(.//*[contains(normalize-space(.), "${value}")])]`
  );

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function freePort() {
  return new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.listen(0, () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

export class Firefox {
  private constructor(
    private readonly driver: ChildProcess,
    private readonly base: string
  ) {}

  static async launch({ headless = true } = {}) {
    const port = await freePort();
    // System access lets WebDriver script the wallet's moz-extension pages
    const driver = spawn(
      process.env.GECKODRIVER || 'geckodriver',
      ['--port', String(port), '--allow-system-access'],
      { stdio: process.env.DEBUG ? 'inherit' : 'ignore' }
    );
    const url = `http://127.0.0.1:${port}`;
    for (let i = 0; i < 50; i++) {
      const ready = await fetch(`${url}/status`)
        .then((res) => res.ok)
        .catch(() => false);
      if (ready) break;
      await sleep(200);
    }
    const binary =
      process.env.FIREFOX_BIN || (existsSync(MAC_FIREFOX) ? MAC_FIREFOX : '');
    const res = await fetch(`${url}/session`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        capabilities: {
          alwaysMatch: {
            browserName: 'firefox',
            'moz:firefoxOptions': {
              ...(binary && { binary }),
              args: headless ? ['-headless'] : [],
              prefs: { 'browser.dom.window.dump.enabled': true },
            },
          },
        },
      }),
    }).then((r) => r.json());
    if (!res.value?.sessionId) {
      driver.kill();
      throw new Error(`Could not start Firefox: ${JSON.stringify(res.value)}`);
    }
    return new Firefox(driver, `${url}/session/${res.value.sessionId}`);
  }

  private async call<T = unknown>(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    body?: unknown
  ): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      method,
      headers: { 'content-type': 'application/json' },
      signal: AbortSignal.timeout(60000),
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then((r) => r.json());
    if (res.value?.error) {
      throw new Error(`${res.value.error}: ${res.value.message}`);
    }
    return res.value as T;
  }

  /** Installs an unpacked extension as a temporary add-on, returns its id */
  installAddon(path: string) {
    return this.call<string>('POST', '/moz/addon/install', {
      path,
      temporary: true,
    });
  }

  /** Runs `script` in the browser chrome, with access to Firefox internals */
  async executeChrome<T = unknown>(script: string, ...args: unknown[]) {
    await this.call('POST', '/moz/context', { context: 'chrome' });
    try {
      return await this.execute<T>(script, ...args);
    } finally {
      await this.call('POST', '/moz/context', { context: 'content' });
    }
  }

  url() {
    return this.call<string>('GET', '/url');
  }

  goto(url: string) {
    return this.call('POST', '/url', { url });
  }

  handles() {
    return this.call<string[]>('GET', '/window/handles');
  }

  currentHandle() {
    return this.call<string>('GET', '/window');
  }

  switchTo(handle: string) {
    return this.call('POST', '/window', { handle });
  }

  async newTab(url: string) {
    const { handle } = await this.call<{ handle: string }>(
      'POST',
      '/window/new',
      { type: 'tab' }
    );
    await this.switchTo(handle);
    await this.goto(url);
    return handle;
  }

  closeWindow() {
    return this.call('DELETE', '/window');
  }

  /** Waits for a window opened after `before` was read, and switches to it */
  async waitNewWindow(before: string[], timeout = 15000) {
    const handle = await this.waitFor(async () => {
      const handles = await this.handles();
      return handles.find((h) => !before.includes(h));
    }, timeout);
    await this.switchTo(handle);
    return handle;
  }

  /** Switches to the first window whose url matches */
  async switchToUrl(match: RegExp, timeout = 15000) {
    return this.waitFor(async () => {
      for (const handle of await this.handles()) {
        await this.switchTo(handle);
        if (match.test(await this.url())) return handle;
      }
      return undefined;
    }, timeout);
  }

  execute<T = unknown>(script: string, ...args: unknown[]) {
    return this.call<T>('POST', '/execute/sync', { script, args });
  }

  /** Runs `script` with a `done` callback as its last argument */
  executeAsync<T = unknown>(script: string, ...args: unknown[]) {
    return this.call<T>('POST', '/execute/async', { script, args });
  }

  async find(locator: Locator, timeout = 15000) {
    return this.waitFor(
      () =>
        this.call<Element>('POST', '/element', locator).catch(() => undefined),
      timeout,
      `${locator.using} ${locator.value}`
    );
  }

  async click(locator: Locator, timeout = 15000) {
    const el = await this.find(locator, timeout);
    await this.waitFor(
      () =>
        this.call<boolean>('GET', `/element/${el[ELEMENT]}/enabled`).then(
          (enabled) => enabled || undefined
        ),
      timeout,
      `enabled ${locator.value}`
    );
    // Toasts can cover buttons, fall back to a script click
    await this.call('POST', `/element/${el[ELEMENT]}/click`, {}).catch(() =>
      this.execute('arguments[0].click()', el)
    );
  }

  async type(locator: Locator, value: string) {
    const el = await this.find(locator);
    await this.call('POST', `/element/${el[ELEMENT]}/value`, { text: value });
  }

  async bodyText() {
    return this.execute<string>('return document.body.innerText');
  }

  screenshot() {
    return this.call<string>('GET', '/screenshot');
  }

  async waitFor<T>(
    fn: () => Promise<T | undefined | null | false>,
    timeout = 15000,
    what = 'condition'
  ): Promise<T> {
    const end = Date.now() + timeout;
    for (;;) {
      const value = await fn();
      if (value) return value;
      if (Date.now() > end) throw new Error(`Timed out waiting for ${what}`);
      await sleep(250);
    }
  }

  async quit() {
    await this.call('DELETE', '').catch(() => {});
    this.driver.kill();
  }
}
