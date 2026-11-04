import {
  type Locator,
  type Page,
  type PlaywrightTestOptions,
  test as base,
} from '@playwright/test';

export { expect } from '@playwright/test';

/*
 * Review flows act like a person: the app has finished loading and moving
 * before anything is touched, a visible cursor travels to each target and
 * presses beside its label, typing has a rhythm, and the result of every
 * action is left on screen long enough to read.
 */
const BEFORE_ACTION_MS = 240;
const PRESS_MS = 110;
const AFTER_ACTION_MS = 600;
const SETTLE_TIMEOUT_MS = 6000;
const TYPE_DELAY_MS = 55;
/* Longer values (addresses) are typed faster so a step stays watchable. */
const LONG_VALUE = 24;
const LONG_TYPE_DELAY_MS = 18;

const RECORD = Boolean(process.env.MOMENTS_VIDEO);

/** The extension popup. Flows that live in the popup run at its size. */
export const POPUP_WINDOW = { width: 350, height: 600 };

/** `test.use` for flows that happen in the popup. */
export const popupWindow: Partial<PlaywrightTestOptions> = {
  viewport: POPUP_WINDOW,
  ...(RECORD && {
    deviceScaleFactor: 2,
    video: {
      mode: 'on',
      size: { width: POPUP_WINDOW.width * 2, height: POPUP_WINDOW.height * 2 },
    },
  }),
};

/** Moves into the popup-sized window, as the wallet does after onboarding. */
export async function enterPopup(page: Page) {
  await page.setViewportSize(POPUP_WINDOW);
  await settle(page);
}

const cursors = new WeakMap<Page, { x: number; y: number }>();

function drawCursor() {
  const KEY = '__moments_cursor';
  const IDLE_MS = 4000;
  const mount = () => {
    if (document.getElementById(KEY)) return;
    const saved = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    const el = document.createElement('div');
    el.id = KEY;
    // An arrow for controls and an I-beam for text, crossfaded as the pointer
    // crosses from one to the other.
    el.innerHTML = `
      <span data-ring></span>
      <svg data-kind="arrow" width="22" height="26" viewBox="0 0 22 26"><path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.5 15 L17 15 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>
      <svg data-kind="ibeam" width="12" height="24" viewBox="0 0 12 24"><path d="M2 2 H10 M6 2 V22 M2 22 H10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M2 2 H10 M6 2 V22 M2 22 H10" fill="none" stroke="#111" stroke-width="1.6" stroke-linecap="round"/></svg>`;
    Object.assign(el.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      zIndex: '2147483647',
      pointerEvents: 'none',
      transition: 'opacity 400ms ease',
      transform: `translate(${saved?.x ?? -40}px, ${saved?.y ?? -40}px)`,
    });
    const ring = el.querySelector('[data-ring]') as HTMLSpanElement;
    const arrow = el.querySelector('[data-kind="arrow"]') as SVGElement;
    const ibeam = el.querySelector('[data-kind="ibeam"]') as SVGElement;
    Object.assign(ring.style, {
      position: 'absolute',
      left: '-13px',
      top: '-13px',
      width: '26px',
      height: '26px',
      borderRadius: '50%',
      background: 'rgba(0, 230, 100, 0.35)',
      transform: 'scale(0)',
      opacity: '0',
      transition: 'transform 180ms ease-out, opacity 320ms ease-out',
    });
    for (const shape of [arrow, ibeam]) {
      Object.assign(shape.style, {
        position: 'absolute',
        transition: 'opacity 120ms ease, transform 110ms ease-out',
        transformOrigin: '2px 2px',
      });
    }
    // The I-beam's hotspot is its middle, the arrow's is its tip.
    Object.assign(ibeam.style, { left: '-6px', top: '-12px', opacity: '0' });
    document.documentElement.appendChild(el);

    let idle: ReturnType<typeof setTimeout>;
    const wake = () => {
      el.style.opacity = '1';
      clearTimeout(idle);
      idle = setTimeout(() => {
        el.style.opacity = '0';
      }, IDLE_MS);
    };
    const setKind = (x: number, y: number) => {
      const hit = document.elementFromPoint(x, y);
      const isText = hit ? getComputedStyle(hit).cursor === 'text' : false;
      arrow.style.opacity = isText ? '0' : '1';
      ibeam.style.opacity = isText ? '1' : '0';
    };

    document.addEventListener(
      'mousemove',
      (event) => {
        el.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        setKind(event.clientX, event.clientY);
        wake();
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
        wake();
        arrow.style.transform = 'scale(0.86)';
        ring.style.transform = 'scale(1)';
        ring.style.opacity = '1';
      },
      true
    );
    document.addEventListener(
      'mouseup',
      () => {
        arrow.style.transform = 'scale(1)';
        ring.style.transform = 'scale(1.6)';
        ring.style.opacity = '0';
        setTimeout(() => {
          ring.style.transform = 'scale(0)';
        }, 320);
      },
      true
    );
    if (saved) wake();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
}

/**
 * Waits until the app has loaded and nothing on screen is still moving.
 * With `busy`, also waits out pending work (busy buttons); leave it off
 * after an action whose pending state is the thing to watch.
 */
export async function settle(page: Page, { busy = true } = {}) {
  try {
    await page.waitForFunction(
      (busy) => {
        if (document.readyState !== 'complete') return false;
        if (document.fonts.status !== 'loaded') return false;
        const onScreen = (el: Element) => {
          const r = el.getBoundingClientRect();
          return (
            r.width > 0 &&
            r.height > 0 &&
            r.bottom > 0 &&
            r.right > 0 &&
            r.top < innerHeight &&
            r.left < innerWidth
          );
        };
        const loading = document.querySelectorAll(
          busy
            ? '.fuel_ContentLoader, [aria-busy="true"]'
            : '.fuel_ContentLoader'
        );
        if ([...loading].some(onScreen)) return false;
        const cursor = document.getElementById('__moments_cursor');
        return document.getAnimations().every((animation) => {
          const target = (animation.effect as KeyframeEffect | null)?.target;
          if (target && cursor?.contains(target)) return true;
          if (
            animation.effect?.getTiming().iterations ===
            Number.POSITIVE_INFINITY
          )
            return true;
          return animation.playState !== 'running';
        });
      },
      busy,
      { polling: 100, timeout: SETTLE_TIMEOUT_MS }
    );
  } catch {
    // Something keeps moving; carry on rather than stall the flow.
  }
}

/* Travel: a soft departure, clear travel and a long soft arrival. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (a: number, b: number, t: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;
  return (x: number) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (at(x1, x2, mid) < x) lo = mid;
      else hi = mid;
    }
    return at(y1, y2, (lo + hi) / 2);
  };
}
const travel = cubicBezier(0.45, 0, 0.1, 1);

/**
 * Where the cursor rests on a target: inside it, but beside its label rather
 * than over the words. Falls back to the middle when that spot belongs to
 * something else (an icon button inside a field).
 */
async function aimAt(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) return null;
  const beside = { x: box.width * 0.85, y: box.height * 0.6 };
  const isOwn = await locator.evaluate(
    (el, p) => {
      const hit = document.elementFromPoint(p.x, p.y);
      return Boolean(hit && (el === hit || el.contains(hit)));
    },
    { x: box.x + beside.x, y: box.y + beside.y }
  );
  const position = isOwn ? beside : { x: box.width / 2, y: box.height / 2 };
  return { box, position };
}

/** Glides the cursor onto a target once the screen is still. Returns where it landed, relative to the target. */
export async function glideTo(locator: Locator) {
  const page = locator.page();
  try {
    await settle(page);
    await locator.waitFor({ state: 'visible' });
    await locator.scrollIntoViewIfNeeded();
    const aim = await aimAt(locator);
    if (!aim) return undefined;
    const { box, position } = aim;
    const to = { x: box.x + position.x, y: box.y + position.y };
    const from = cursors.get(page) ?? { x: to.x - 90, y: to.y + 140 };
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const duration = Math.min(950, Math.max(380, 260 + distance * 1.4));
    const frames = Math.round(duration / 16);
    for (let i = 1; i <= frames; i++) {
      const t = travel(i / frames);
      await page.mouse.move(
        from.x + (to.x - from.x) * t,
        from.y + (to.y - from.y) * t
      );
      await page.waitForTimeout(16);
    }
    cursors.set(page, to);
    await page.waitForTimeout(BEFORE_ACTION_MS);
    return position;
  } catch {
    // The action itself reports why the target is not usable.
    return undefined;
  }
}

async function afterAction(page: Page) {
  await page.waitForTimeout(AFTER_ACTION_MS);
  await settle(page, { busy: false });
}

let installed = false;

function humanizeLocators(sample: Locator) {
  if (installed) return;
  installed = true;
  const proto = Object.getPrototypeOf(sample) as Locator;
  const { click, check, fill, pressSequentially, press } = proto;
  const typingDelay = (text: string) =>
    text.length > LONG_VALUE ? LONG_TYPE_DELAY_MS : TYPE_DELAY_MS;

  proto.click = async function (this: Locator, options) {
    const position = await glideTo(this);
    await click.call(this, {
      delay: PRESS_MS,
      ...(position && { position }),
      ...options,
    });
    await afterAction(this.page());
  };
  proto.check = async function (this: Locator, options) {
    const position = await glideTo(this);
    await check.call(this, { ...(position && { position }), ...options });
    await afterAction(this.page());
  };
  proto.fill = async function (this: Locator, value, options) {
    await glideTo(this);
    await fill.call(this, '', options);
    await pressSequentially.call(this, value, {
      ...options,
      delay: typingDelay(value),
    });
    await afterAction(this.page());
  };
  proto.pressSequentially = async function (this: Locator, text, options) {
    await glideTo(this);
    await pressSequentially.call(this, text, {
      ...options,
      delay: Math.max(options?.delay ?? 0, typingDelay(text)),
    });
    await afterAction(this.page());
  };
  proto.press = async function (this: Locator, ...args) {
    await press.apply(this, args);
    await afterAction(this.page());
  };
}

export const test = base.extend({
  page: async ({ page }, use) => {
    // The headless shell has no `window.chrome`; desktop Chrome always does.
    await page.addInitScript(() => {
      const w = window as unknown as { chrome?: object };
      w.chrome ??= {};
    });
    await page.addInitScript(drawCursor);
    humanizeLocators(page.locator('html'));
    await use(page);
  },
});
