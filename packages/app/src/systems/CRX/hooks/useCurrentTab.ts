import { useEffect, useState } from 'react';

export function useCurrentTab() {
  const [origin, setOrigin] = useState<string | undefined>();
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!chrome?.tabs) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      setFaviconUrl(currentTab?.favIconUrl);
      setOrigin(currentTab?.url);
    });
  }, []);

  return {
    origin,
    faviconUrl,
  };
}
