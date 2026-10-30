import { useEffect, useRef } from 'react';
import { cx } from '../css';

// A cell is inked when its brightness falls below (rank + 0.5) / 16.
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (rank) => (rank + 0.5) / 16
);

export interface DitherImageProps {
  src: string;
  /** Cell size in CSS px; rounded to whole device pixels. */
  cell?: number;
  brightness?: number;
  contrast?: number;
  className?: string;
}

type Ink = 'shadows' | 'highlights';

function draw(
  canvas: HTMLCanvasElement,
  ink: Ink,
  image: HTMLImageElement,
  {
    cell,
    brightness,
    contrast,
  }: Required<Omit<DitherImageProps, 'src' | 'className'>>
) {
  const box = canvas.parentElement?.getBoundingClientRect();
  if (!box?.width || !box.height) return;
  const dpr = window.devicePixelRatio || 1;
  const cellPx = Math.max(1, Math.round(cell * dpr));
  const cols = Math.ceil((box.width * dpr) / cellPx);
  const rows = Math.ceil((box.height * dpr) / cellPx);
  canvas.width = cols;
  canvas.height = rows;
  canvas.style.width = `${(cols * cellPx) / dpr}px`;
  canvas.style.height = `${(rows * cellPx) / dpr}px`;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  ctx.imageSmoothingQuality = 'high';
  const scale = Math.max(cols / image.width, rows / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, (cols - w) / 2, (rows - h) / 2, w, h);

  const pixels = ctx.getImageData(0, 0, cols, rows);
  const d = pixels.data;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const luma =
        (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      // Near-black is the photo's empty field. Inking it lays a Bayer dot
      // grid under the subject.
      if (luma <= 0.06) {
        d[i + 3] = 0;
        continue;
      }
      const v = (luma - 0.5) * contrast + 0.5 + brightness;
      const shadow = v < BAYER4[(y & 3) * 4 + (x & 3)];
      const tone = ink === 'shadows' ? 0 : 255;
      d[i] = tone;
      d[i + 1] = tone;
      d[i + 2] = tone;
      d[i + 3] = shadow === (ink === 'shadows') ? 255 : 0;
    }
  }
  ctx.putImageData(pixels, 0, 0);
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
    const image = new Image();
    const redraw = () => {
      if (!image.complete || !image.naturalWidth) return;
      const settings = { cell, brightness, contrast };
      if (shadows.current) draw(shadows.current, 'shadows', image, settings);
      if (highlights.current) {
        draw(highlights.current, 'highlights', image, settings);
      }
    };
    image.onload = redraw;
    image.src = src;
    const observer = new ResizeObserver(redraw);
    observer.observe(parent);
    return () => {
      image.onload = null;
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
