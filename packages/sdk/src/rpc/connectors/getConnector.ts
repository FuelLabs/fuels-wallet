import { createExtensionConnector } from './createExtensionConnector';
import { createWindowConnector } from './createWindowConnector';

export const getConnector = () => {
  if (typeof chrome === 'undefined') {
    return createExtensionConnector({
      senderId: chrome.runtime.id,
    });
  }
  return createWindowConnector({
    target: window,
    origin: window.location.origin,
  });
};
