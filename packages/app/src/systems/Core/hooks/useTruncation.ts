import { useEffect, useRef, useState } from 'react';

interface UseTruncationReturn {
  ref: React.RefObject<HTMLElement>;
  isTruncated: boolean;
  open: boolean | undefined;
}

export function useTruncation<T extends HTMLElement>(): UseTruncationReturn {
  const ref = useRef<T>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, []);

  // Enable tooltip only if text is truncated
  const open = isTruncated ? undefined : false;

  return { ref, isTruncated, open };
}
