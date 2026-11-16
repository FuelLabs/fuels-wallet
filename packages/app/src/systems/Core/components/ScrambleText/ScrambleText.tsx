import { useReducedMotion } from 'framer-motion';
import { type CSSProperties, useEffect, useState } from 'react';

const HEX = '0123456789abcdef';

const SR_ONLY: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
};

function scramble(text: string, progress: number) {
  const settled = Math.floor(text.length * progress);
  return Array.from(text, (char, i) => {
    if (i < settled || !/[0-9a-f]/i.test(char)) return char;
    const next = HEX[Math.floor(Math.random() * HEX.length)];
    /* Keep checksum casing so the churn looks like the final hash. */
    return char === char.toUpperCase() ? next.toUpperCase() : next;
  }).join('');
}

export type ScrambleTextProps = {
  text: string;
  duration?: number;
};

/** Hex characters churn, then lock in left to right like a hash resolving. */
export function ScrambleText({ text, duration = 700 }: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(() =>
    reduced ? text : scramble(text, 0)
  );

  useEffect(() => {
    if (reduced) {
      setOutput(text);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setOutput(scramble(text, progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, duration, reduced]);

  return (
    <>
      <span aria-hidden>{output}</span>
      <span style={SR_ONLY}>{text}</span>
    </>
  );
}
