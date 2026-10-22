import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/* Last value shown per key, so a remounted screen rolls from where it was. */
const lastShown = new Map<string, number>();

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Rolls a number from its previous value to the new one, e.g. a balance
 * counting down after a send. Remembers values across remounts by `key`;
 * an empty key shows the value as is.
 */
export function useTweenedNumber(value: number, key: string, duration = 900) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(() => lastShown.get(key) ?? value);
  const shownRef = useRef(shown);
  const keyRef = useRef(key);

  useEffect(() => {
    /* A new key (another account, or done loading) starts from its own past. */
    const from =
      keyRef.current === key ? shownRef.current : (lastShown.get(key) ?? value);
    keyRef.current = key;
    if (key) lastShown.set(key, value);
    if (!key || reduced || from === value) {
      shownRef.current = value;
      setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const next = from + (value - from) * easeOut(t);
      shownRef.current = next;
      setShown(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, key, duration, reduced]);

  return shown;
}
