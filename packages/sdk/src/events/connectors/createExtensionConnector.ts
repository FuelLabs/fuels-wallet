import type { EventConnector } from '../types';

export const createExtensionConnector = ({
  senderId,
}: {
  senderId: string;
}) => {
  let metadata: { tabId: number } | null = null;
  const connector: EventConnector<{ tabId: number }> = {
    postMessage: (request) => {
      const tabId = metadata?.tabId;
      if (tabId) {
        chrome.tabs.sendMessage(tabId, request);
      }
    },
    setupListener: (onMessage) => {
      chrome.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
          if (sender.id === senderId && sender.tab?.id) {
            metadata = {
              tabId: sender.tab.id,
            };
            onMessage({
              ...request,
              origin: sender.origin,
              metadata: {
                tabId: sender.tab.id,
              },
            });
          }
          sendResponse();
        }
      );
    },
  };
  return connector;
};
