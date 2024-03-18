import type { MessageSender } from '@fuels/connectors';

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
