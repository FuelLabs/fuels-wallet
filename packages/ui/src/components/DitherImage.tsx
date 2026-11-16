import { useEffect, useRef } from 'react';
import { cx } from '../css';

// A cell is inked when its brightness falls below (rank + 0.5) / 16.
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (rank) => (rank + 0.5) / 16
);

const TWEEN_MS = 900;

/* Where each image last settled, so a remounted image develops from there. */
const lastBrightness = new Map<string, number>();

export interface DitherImageProps {
  src: string;
  /** Cell size in CSS px; rounded to whole device pixels. */
  cell?: number;
  /** Changes tween over 900ms, continuing across remounts of the same src. */
  brightness?: number;
  contrast?: number;
  className?: string;
}

type Ink = 'shadows' | 'highlights';

type Field = {
  cols: number;
  rows: number;
  /** Luma per cell, or -1 for the photo's empty field. */
  luma: Float32Array;
};

function measure(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  cell: number
): Field | null {
  const box = canvas.parentElement?.getBoundingClientRect();
  if (!box?.width || !box.height) return null;
  const dpr = window.devicePixelRatio || 1;
  const cellPx = Math.max(1, Math.round(cell * dpr));
  const cols = Math.ceil((box.width * dpr) / cellPx);
  const rows = Math.ceil((box.height * dpr) / cellPx);

  const scratch = document.createElement('canvas');
  scratch.width = cols;
  scratch.height = rows;
  const ctx = scratch.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.imageSmoothingQuality = 'high';
  const scale = Math.max(cols / image.width, rows / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, (cols - w) / 2, (rows - h) / 2, w, h);

  const d = ctx.getImageData(0, 0, cols, rows).data;
  const luma = new Float32Array(cols * rows);
  for (let i = 0; i < luma.length; i++) {
    const l =
      (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
    // Near-black is the photo's empty field. Inking it lays a Bayer dot
    // grid under the subject.
    luma[i] = l <= 0.06 ? -1 : l;
  }

  const size = (n: number) => `${(n * cellPx) / dpr}px`;
  const canvases = canvas.parentElement?.querySelectorAll('canvas') ?? [];
  for (const c of Array.from(canvases)) {
    c.width = cols;
    c.height = rows;
    c.style.width = size(cols);
    c.style.height = size(rows);
  }
  return { cols, rows, luma };
}

function paint(
  canvas: HTMLCanvasElement,
  ink: Ink,
  field: Field,
  brightness: number,
  contrast: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { cols, rows, luma } = field;
  const pixels = ctx.createImageData(cols, rows);
  const d = pixels.data;
  const tone = ink === 'shadows' ? 0 : 255;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const l = luma[i];
      if (l < 0) continue;
      const v = (l - 0.5) * contrast + 0.5 + brightness;
      const shadow = v < BAYER4[(y & 3) * 4 + (x & 3)];
      if (shadow !== (ink === 'shadows')) continue;
      d[i * 4] = tone;
      d[i * 4 + 1] = tone;
      d[i * 4 + 2] = tone;
      d[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 4;
}

export function DitherImage({
  src,
  cell = 1,
  brightness = 0,
  contrast = 1,
  className,
}: DitherImageProps) {
  const shadows = useRef<HTMLCanvasElement>(null);
  const highlights = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const parent = shadows.current?.parentElement;
    if (!parent) return;
    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const from = lastBrightness.get(src) ?? brightness;
    const start = performance.now();
    let field: Field | null = null;
    let frame = 0;

    const render = (value: number) => {
      if (!field) return;
      lastBrightness.set(src, value);
      if (shadows.current) {
        paint(shadows.current, 'shadows', field, value, contrast);
      }
      if (highlights.current) {
        paint(highlights.current, 'highlights', field, value, contrast);
      }
    };
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / TWEEN_MS);
      render(from + (brightness - from) * easeOut(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const image = new Image();
    const redraw = () => {
      if (!image.complete || !image.naturalWidth || !shadows.current) return;
      field = measure(shadows.current, image, cell);
      cancelAnimationFrame(frame);
      if (reduceMotion || from === brightness) render(brightness);
      else tick();
    };
    image.onload = redraw;
    image.src = src;
    const observer = new ResizeObserver(redraw);
    observer.observe(parent);
    return () => {
      image.onload = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [src, cell, brightness, contrast]);

  return (
    <>
      <canvas
        ref={shadows}
        aria-hidden
        data-ink="shadows"
        className={cx('fuel-dither', className)}
      />
      <canvas
        ref={highlights}
        aria-hidden
        data-ink="highlights"
        className={cx('fuel-dither', className)}
      />
    </>
  );
}
