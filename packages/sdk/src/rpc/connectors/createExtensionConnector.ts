import type { RPCConnector } from '../types';

export const createExtensionConnector = ({
  senderId,
}: {
  senderId: string;
}) => {
  const connector: RPCConnector<{ tabId: number }> = {
    postMessage: (request, params) => {
      if (!params?.tabId) return;
      chrome.tabs.sendMessage(params?.tabId, request);
    },
    setupListener: (onMessage) => {
      chrome.runtime.onMessage.addListener(async (request, sender) => {
        if (sender.id === senderId && sender.tab?.id) {
          onMessage(request, {
            tabId: sender.tab.id,
          });
        }
      });
    },
  };
  return connector;
};
