import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect on the client side
    if (typeof window !== 'undefined') {
      router.push('/docs/install');
    }
  }, [router]);

  return null;
}
