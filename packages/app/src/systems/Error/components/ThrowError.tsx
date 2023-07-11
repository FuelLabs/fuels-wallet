import { useEffect, useState } from 'react';

const Crash = () => {
  throw new Error('Test Error');
};

export default function ThrowError() {
  const [crash, setCrash] = useState(false);

  useEffect(() => {
    window.addEventListener('crashReact', () => {
      setCrash(true);
    });

    return window.removeEventListener('crashReact', () => {});
  }, []);

  return <>{crash && <Crash />}</>;
}
