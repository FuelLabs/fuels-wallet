import { useEffect, useState } from 'react';

export function useCurrentTab() {
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!chrome?.tabs) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      setUrl(currentTab?.url);
    });
  }, []);

  return {
    url,
  };
}
