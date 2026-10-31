import { type Locator, type Page, test as base } from '@playwright/test';

export { expect } from '@playwright/test';

/*
 * Review flows act like a person: a visible cursor glides to each target,
 * typing has a rhythm, and every action leaves time for its animation to
 * settle before the next one starts.
 */
const BEFORE_ACTION_MS = 220;
const SETTLE_MS = 700;
const TYPE_DELAY_MS = 55;
/* Longer values (addresses) are typed faster so a step stays watchable. */
const LONG_VALUE = 24;
const LONG_TYPE_DELAY_MS = 18;

const cursors = new WeakMap<Page, { x: number; y: number }>();

function drawCursor() {
  const KEY = '__moments_cursor';
  const mount = () => {
    if (document.getElementById(KEY)) return;
    const saved = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    const el = document.createElement('div');
    el.id = KEY;
    el.innerHTML =
      '<svg width="22" height="26" viewBox="0 0 22 26"><path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.5 15 L17 15 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg><span></span>';
    Object.assign(el.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      zIndex: '2147483647',
      pointerEvents: 'none',
      transform: `translate(${saved?.x ?? -40}px, ${saved?.y ?? -40}px)`,
    });
    const ring = el.querySelector('span') as HTMLSpanElement;
    Object.assign(ring.style, {
      position: 'absolute',
      left: '-12px',
      top: '-12px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: 'rgba(0, 230, 100, 0.35)',
      transform: 'scale(0)',
      transition: 'transform 180ms ease-out, opacity 300ms ease-out',
      opacity: '0',
    });
    document.documentElement.appendChild(el);
    document.addEventListener(
      'mousemove',
      (event) => {
        el.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        sessionStorage.setItem(
          KEY,
          JSON.stringify({ x: event.clientX, y: event.clientY })
        );
      },
      true
    );
    document.addEventListener(
      'mousedown',
      () => {
        ring.style.transform = 'scale(1)';
        ring.style.opacity = '1';
      },
      true
    );
    document.addEventListener(
      'mouseup',
      () => {
        ring.style.transform = 'scale(1.6)';
        ring.style.opacity = '0';
        setTimeout(() => {
          ring.style.transform = 'scale(0)';
        }, 300);
      },
      true
    );
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
}

const ease = (t: number) => 1 - (1 - t) ** 3;

export async function glideTo(locator: Locator) {
  const page = locator.page();
  try {
    await locator.waitFor({ state: 'visible' });
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    if (!box) return;
    const to = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const from = cursors.get(page) ?? { x: to.x - 120, y: to.y + 160 };
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const frames = Math.round(Math.min(40, Math.max(14, distance / 12)));
    for (let i = 1; i <= frames; i++) {
      const t = ease(i / frames);
      await page.mouse.move(
        from.x + (to.x - from.x) * t,
        from.y + (to.y - from.y) * t
      );
      await page.waitForTimeout(16);
    }
    cursors.set(page, to);
    await page.waitForTimeout(BEFORE_ACTION_MS);
  } catch {
    // The action itself reports why the target is not usable.
  }
}

let installed = false;

function humanizeLocators(sample: Locator) {
  if (installed) return;
  installed = true;
  const proto = Object.getPrototypeOf(sample) as Locator;
  const { click, check, fill, pressSequentially, press } = proto;
  const settle = (locator: Locator) => locator.page().waitForTimeout(SETTLE_MS);

  proto.click = async function (this: Locator, ...args) {
    await glideTo(this);
    await click.apply(this, args);
    await settle(this);
  };
  proto.check = async function (this: Locator, ...args) {
    await glideTo(this);
    await check.apply(this, args);
    await settle(this);
  };
  proto.fill = async function (this: Locator, value, options) {
    await glideTo(this);
    await fill.call(this, '', options);
    const delay =
      value.length > LONG_VALUE ? LONG_TYPE_DELAY_MS : TYPE_DELAY_MS;
    await pressSequentially.call(this, value, { ...options, delay });
    await settle(this);
  };
  proto.pressSequentially = async function (this: Locator, text, options) {
    await glideTo(this);
    const delay = Math.max(
      options?.delay ?? 0,
      text.length > LONG_VALUE ? LONG_TYPE_DELAY_MS : TYPE_DELAY_MS
    );
    await pressSequentially.call(this, text, { ...options, delay });
    await settle(this);
  };
  proto.press = async function (this: Locator, ...args) {
    await press.apply(this, args);
    await settle(this);
  };
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(drawCursor);
    humanizeLocators(page.locator('html'));
    await use(page);
  },
});
