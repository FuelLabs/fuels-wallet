import { useEffect, useState } from 'react';

interface UseOriginProps {
  url: string | undefined;
}

interface Origin {
  short: string;
  full: string;
}

const parseUrl = (url: string): Origin | undefined => {
  try {
    const { protocol, hostname, port } = new URL(url);
    const short = `${hostname}${port ? `:${port}` : ''}`;
    return {
      short,
      full: `${protocol}//${short}`,
    };
  } catch (_e) {
    return undefined;
  }
};

export const useOrigin = ({ url }: UseOriginProps) => {
  const [origin, setOrigin] = useState<Origin | undefined>();

  useEffect(() => {
    if (!url) return;
    const origin = parseUrl(url);
    setOrigin(origin);
  }, [url]);

  return origin;
};
