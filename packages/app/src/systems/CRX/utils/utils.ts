import type { MessageSender } from '@fuel-wallet/types';

export function getTabIdFromPort(port: chrome.runtime.Port) {
  return port.sender?.tab?.id;
}

export function getTabIdFromSender(sender: MessageSender) {
  return sender?.tab?.id;
}

export function getTabFromSender(sender: MessageSender) {
  return sender?.tab as chrome.tabs.Tab;
}

export function getTabFromPort(port: chrome.runtime.Port) {
  return port.sender?.tab;
}

// Firefox gives each install a random moz-extension:// origin that does not contain the runtime id
export function isExtensionOrigin(origin?: string) {
  return !!origin && `${origin}/` === chrome.runtime.getURL('');
}
