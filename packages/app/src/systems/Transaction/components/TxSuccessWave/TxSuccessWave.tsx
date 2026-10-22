import { useReducedMotion } from 'framer-motion';
import { type CSSProperties, useEffect, useState } from 'react';

const COLS = 12;
const ROWS = 18;
const ORIGIN = { col: (COLS - 1) / 2, row: 1 };
const STEP_MS = 28;
const LIFETIME_MS = 1200;

const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const distance = Math.hypot(col - ORIGIN.col, row - ORIGIN.row);
  return Math.round(distance * STEP_MS);
});

/**
 * A one-shot ripple of brand squares that rolls out from the transaction
 * header when it confirms, then removes itself.
 */
export function TxSuccessWave() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), LIFETIME_MS);
    return () => clearTimeout(timer);
  }, []);

  if (reduced || !visible) return null;

  return (
    <div className="fuel-wave" aria-hidden>
      {CELLS.map((delay, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid
          key={i}
          style={{ '--fuel-wave-delay': `${delay}ms` } as CSSProperties}
        />
      ))}
    </div>
  );
}
