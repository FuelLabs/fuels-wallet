import { useEffect, useRef, useState } from 'react';
import { courier } from './courier';

const MAX_HOLD_MS = 2000;

type UseTxCourierInput = {
  isSending: boolean;
  isSuccess: boolean;
};

/**
 * Drives the courier from a transaction request. While `isHolding` is true
 * the caller keeps the review card on screen so the packet can be delivered
 * to the recipient before the confirmed card replaces it.
 */
export function useTxCourier({ isSending, isSuccess }: UseTxCourierInput) {
  const [isHolding, setHolding] = useState(false);
  const inFlight = useRef(false);

  useEffect(() => {
    if (isSending) {
      inFlight.current = courier.transit(
        courier.single('asset'),
        courier.single('to')
      );
      if (inFlight.current) setHolding(true);
      return;
    }
    if (!inFlight.current) return;
    inFlight.current = false;
    const landing = isSuccess ? courier.deliver() : courier.bounce();
    /* Never let a stalled animation keep the result off screen. */
    const release = setTimeout(() => setHolding(false), MAX_HOLD_MS);
    landing.finally(() => {
      clearTimeout(release);
      setHolding(false);
    });
  }, [isSending, isSuccess]);

  useEffect(() => () => courier.cancel(), []);

  return { isHolding };
}
