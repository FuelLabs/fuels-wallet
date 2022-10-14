import type { EventConnector } from '../types';

export const createExtensionPageConnector = ({
  senderId,
  tabId,
  namespace,
}: {
  tabId: number;
  senderId: string;
  namespace?: string;
}) => {
  const connector: EventConnector = {
    postMessage: (request) => {
      chrome.tabs.sendMessage(tabId, {
        namespace,
        ...request,
      });
    },
    setupListener: (onMessage) => {
      chrome.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
          if (
            sender.id === senderId &&
            request.namespace &&
            request.namespace === namespace
          ) {
            onMessage(request);
          }
          sendResponse();
        }
      );
    },
  };
  return connector;
};
