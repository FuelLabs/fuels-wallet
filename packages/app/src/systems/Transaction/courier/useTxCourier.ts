import { useEffect, useRef, useState } from 'react';
import { courier } from './courier';

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
    landing.finally(() => setHolding(false));
  }, [isSending, isSuccess]);

  useEffect(() => () => courier.cancel(), []);

  return { isHolding };
}
