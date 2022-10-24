export function getTabIdFromPort(port: chrome.runtime.Port) {
  return port.sender?.tab?.id;
}

export function getTabIdFromSender(sender: chrome.runtime.Port['sender']) {
  return sender?.tab?.id;
}
