import { useEffect, useState } from 'react';

export function useCurrentTab() {
  const [origin, setOrigin] = useState<string | undefined>();
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!chrome?.tabs) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      if (currentTab?.url) {
        const faviconUrl = currentTab.favIconUrl;
        setFaviconUrl(faviconUrl);

        try {
          const url = new URL(currentTab.url);
          const port = url.port ? `:${url.port}` : '';
          const result = `${url.protocol}//${url.hostname}${port}`;
          setOrigin(result);
        } catch (_e) {
          setOrigin(undefined);
        }
      }
    });
  }, []);

  return {
    origin,
    faviconUrl,
  };
}
