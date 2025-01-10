import { useEffect, useState } from 'react';

interface CurrentTab {
  url: string | undefined;
  title: string | undefined;
  faviconUrl: string | undefined;
}

export function useCurrentTab() {
  const [currentTab, setCurrentTab] = useState<CurrentTab | undefined>();

  useEffect(() => {
    if (!chrome?.tabs) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      setCurrentTab({
        url: currentTab?.url,
        title: currentTab?.title,
        faviconUrl: currentTab?.favIconUrl,
      });
    });
  }, []);

  return {
    currentTab,
  };
}
