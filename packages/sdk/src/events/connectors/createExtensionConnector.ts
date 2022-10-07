import type { EventConnector } from '../types';

export const createExtensionConnector = ({
  senderId,
}: {
  senderId: string;
}) => {
  const connector: EventConnector<{ tabId: number }> = {
    postMessage: (request) => {
      const tabId = request.metadata?.tabId;
      if (tabId) {
        chrome.tabs.sendMessage(tabId, request);
      }
    },
    setupListener: (onMessage) => {
      chrome.runtime.onMessage.addListener(async (request, sender) => {
        if (sender.id === senderId && sender.tab?.id) {
          onMessage({
            ...request,
            metadata: {
              tabId: sender.tab.id,
            },
          });
        }
      });
    },
  };
  return connector;
};
