export function getTabIdFromPort(port: chrome.runtime.Port) {
  return port.sender?.tab?.id;
}

export function getTabIdFromSender(sender: chrome.runtime.Port['sender']) {
  return sender?.tab?.id;
}

export function getTabFromSender(sender: chrome.runtime.Port['sender']) {
  return sender?.tab;
}

export function getTabFromPort(port: chrome.runtime.Port) {
  return port.sender?.tab;
}
