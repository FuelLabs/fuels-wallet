/**
 * The courier carries the asset being sent across screens: it lifts off the
 * Send form, lands in the review card, rides the connector down to the
 * recipient while the transaction is in flight, and is delivered (or returned)
 * when the network answers.
 *
 * It draws plain DOM nodes fixed above everything, so it is not bound to a
 * route, a dialog portal or a scroll container. Every step is a no-op when
 * there is nothing to carry or the user prefers reduced motion.
 */

type Point = { x: number; y: number };

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';
const PACKET = 10;
const ARRIVE_TIMEOUT_MS = 6000;

let chip: HTMLDivElement | null = null;
let chipAt: Point | null = null;
let packet: HTMLDivElement | null = null;
let route: Point[] = [];
let sourceEl: HTMLElement | null = null;
let assetEl: HTMLElement | null = null;
let toEl: HTMLElement | null = null;
let arriveTimer: ReturnType<typeof setTimeout> | undefined;
let transitRun: Promise<unknown> | null = null;

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function frame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function translate({ x, y }: Point, scale = 1) {
  return `translate(${x}px, ${y}px) scale(${scale})`;
}

/** Waits for an element to stop moving, e.g. while a dialog zooms in. */
async function settledRect(el: HTMLElement, timeout = 900) {
  let last = '';
  let same = 0;
  const start = performance.now();
  while (performance.now() - start < timeout) {
    await frame();
    if (!el.isConnected) return null;
    const r = el.getBoundingClientRect();
    const key = [r.left, r.top, r.width, r.height].map(Math.round).join();
    if (r.width > 0 && key === last) {
      if (++same >= 3) return r;
    } else {
      same = 0;
      last = key;
    }
  }
  return el.isConnected ? el.getBoundingClientRect() : null;
}

function iconCenter(el: HTMLElement): Point {
  const icon = el.querySelector('img, .fuel_Avatar, svg') ?? el;
  const r = icon.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function centerOf(el: HTMLElement): Point {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function buildChip(label: string, icon?: string) {
  const el = document.createElement('div');
  el.className = 'fuel-courier-chip';
  el.setAttribute('aria-hidden', 'true');
  const mark = document.createElement(icon ? 'img' : 'span');
  mark.className = 'fuel-courier-icon';
  if (icon) (mark as HTMLImageElement).src = icon;
  const text = document.createElement('span');
  text.textContent = label;
  el.append(mark, text);
  document.body.appendChild(el);
  return el;
}

function buildPacket() {
  const el = document.createElement('div');
  el.className = 'fuel-courier-packet';
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
  return el;
}

function packetPoint(p: Point): Point {
  return { x: p.x - PACKET / 2, y: p.y - PACKET / 2 };
}

function reveal(el: HTMLElement | null) {
  if (el) el.style.visibility = '';
}

function removeChip() {
  chip?.remove();
  chip = null;
  chipAt = null;
}

function removePacket() {
  packet?.remove();
  packet = null;
  route = [];
}

/** Lift the asset off the Send form. The element carries its own label. */
function depart(el: HTMLElement | null) {
  cancel();
  if (!el || prefersReducedMotion()) return;
  const label = el.dataset.courierLabel;
  if (!label) return;

  sourceEl = el;
  chip = buildChip(label, el.dataset.courierIcon || undefined);
  const r = el.getBoundingClientRect();
  const c = chip.getBoundingClientRect();
  const from = { x: r.left + 12, y: r.top + (r.height - c.height) / 2 };
  chipAt = { x: from.x, y: from.y - 10 };
  chip.animate(
    [
      { transform: translate(from), opacity: 0 },
      { transform: translate(chipAt, 1.06), opacity: 1 },
    ],
    { duration: 280, easing: EASE_OUT, fill: 'forwards' }
  );
  arriveTimer = setTimeout(cancel, ARRIVE_TIMEOUT_MS);
}

/** Land a lifted asset on the review card's amount row. */
async function arrive(target: HTMLElement) {
  if (!chip || !chipAt) return;
  clearTimeout(arriveTimer);
  const flying = chip;
  const start = chipAt;
  target.style.visibility = 'hidden';

  /* Whatever happens to the chip, the row must come back. */
  try {
    const rect = await settledRect(target);
    if (!rect || flying !== chip) return;
    const c = flying.getBoundingClientRect();
    const end = { x: rect.left, y: rect.top + (rect.height - c.height) / 2 };
    const peak = {
      x: (start.x + end.x) / 2,
      y: Math.min(start.y, end.y) - 48,
    };

    await flying.animate(
      [
        { transform: translate(start, 1.06) },
        { transform: translate(peak, 1.14), offset: 0.45 },
        { transform: translate(end, 1) },
      ],
      { duration: 640, easing: EASE_IN_OUT, fill: 'forwards' }
    ).finished;
  } catch {
    return;
  } finally {
    reveal(target);
  }

  target.animate([{ transform: 'scale(1.04)' }, { transform: 'scale(1)' }], {
    duration: 260,
    easing: EASE_OUT,
  });
  await flying.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 140,
    fill: 'forwards',
  }).finished;
  if (flying === chip) removeChip();
  sourceEl = null;
}

/**
 * The asset leaves its row as a packet and rides the connector down,
 * holding just above the recipient until the network answers.
 * Returns false when there is nothing to carry.
 */
function transit(asset: HTMLElement | null, to: HTMLElement | null) {
  if (!asset || !to || prefersReducedMotion()) return false;
  removeChip();
  removePacket();
  assetEl = asset;
  toEl = to;

  const start = iconCenter(asset);
  const target = centerOf(to);
  const toTop = to.getBoundingClientRect().top;
  route = [start, { x: target.x, y: start.y }, { x: target.x, y: toTop - 14 }];

  packet = buildPacket();
  asset.style.transition = 'opacity 300ms';
  asset.style.opacity = '0.35';

  const flying = packet;
  transitRun = flying
    .animate(
      [
        { transform: translate(packetPoint(route[0]), 0) },
        { transform: translate(packetPoint(route[0]), 1.4), offset: 0.18 },
        { transform: translate(packetPoint(route[1]), 1), offset: 0.5 },
        { transform: translate(packetPoint(route[2]), 1) },
      ],
      { duration: 900, easing: 'linear', fill: 'forwards' }
    )
    .finished.then(() => {
      if (flying === packet) flying.dataset.hold = 'true';
    })
    .catch(() => undefined);
  return true;
}

/** Lets a fast answer wait for the packet to reach the recipient first. */
async function landed() {
  await transitRun;
  transitRun = null;
}

/** Hand the packet to the recipient. */
async function deliver() {
  await landed();
  const flying = packet;
  const recipient = toEl;
  if (!flying || !recipient) return finish();
  delete flying.dataset.hold;
  const from = route[2] ?? centerOf(recipient);
  await flying.animate(
    [
      { transform: translate(packetPoint(from), 1) },
      { transform: translate(packetPoint(centerOf(recipient)), 0.2) },
    ],
    { duration: 260, easing: 'cubic-bezier(0.5, 0, 0.75, 0)', fill: 'forwards' }
  ).finished;
  removePacket();
  recipient.classList.add('fuel-courier-hit');
  await new Promise((resolve) => setTimeout(resolve, 380));
  recipient.classList.remove('fuel-courier-hit');
  finish();
}

/** The network said no: the packet rides back up to the sender. */
async function bounce() {
  await landed();
  const flying = packet;
  const asset = assetEl;
  if (!flying || route.length < 3) return finish();
  delete flying.dataset.hold;
  await flying.animate(
    [
      { transform: translate(packetPoint(route[2]), 1) },
      { transform: translate(packetPoint(route[1]), 1), offset: 0.5 },
      { transform: translate(packetPoint(route[0]), 0) },
    ],
    { duration: 600, easing: EASE_IN_OUT, fill: 'forwards' }
  ).finished;
  finish();
  asset?.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 320 }
  );
}

function finish() {
  transitRun = null;
  removePacket();
  if (assetEl) {
    assetEl.style.opacity = '';
    assetEl.style.transition = '';
  }
  assetEl = null;
  toEl = null;
}

/** Drop whatever is in the air and put every element back. */
function cancel() {
  clearTimeout(arriveTimer);
  if (chip && chipAt && sourceEl?.isConnected) {
    const flying = chip;
    flying
      .animate(
        [
          { transform: translate(chipAt, 1.06), opacity: 1 },
          {
            transform: translate({ x: chipAt.x, y: chipAt.y + 10 }),
            opacity: 0,
          },
        ],
        { duration: 200, easing: EASE_OUT, fill: 'forwards' }
      )
      .finished.then(() => flying.remove())
      .catch(() => flying.remove());
    chip = null;
    chipAt = null;
  } else {
    removeChip();
  }
  sourceEl = null;
  finish();
}

/** The one element matching a courier role, or null when ambiguous. */
function single(role: string) {
  const found = document.querySelectorAll<HTMLElement>(
    `[data-courier="${role}"]`
  );
  return found.length === 1 ? found[0] : null;
}

export const courier = {
  depart,
  arrive,
  transit,
  deliver,
  bounce,
  cancel,
  single,
  get isCarrying() {
    return !!chip;
  },
};
