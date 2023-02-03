import { useState, useEffect } from 'react';

const globalWindow = typeof window !== 'undefined' ? window : ({} as Window);

console.log('useFuel file started');
export function useFuel() {
  console.log('first render of useFuel');
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [fuel, setFuel] = useState<Window['fuel']>(globalWindow.fuel);

  useEffect(() => {
    window.addEventListener('event', (data) => {
      console.log(`data`, data);
    });

    const timeout = setTimeout(() => {
      if (globalWindow.fuel) {
        setFuel(globalWindow.fuel);
      } else {
        setError('fuel not detected on the window!');
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return [fuel as NonNullable<Window['fuel']>, error, isLoading] as const;
}
