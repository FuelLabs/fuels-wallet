import fileName from './pageScript?script&module';

const extensionId = chrome.runtime.id;

window.addEventListener('message', ({ data, origin }) => {
  if (origin === window.location.origin && data.id && !data.fromCRX) {
    chrome.runtime.sendMessage(extensionId, data);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.id === extensionId && request.id) {
    window.postMessage(
      {
        // Avoid retrigger event when posting message
        fromCRX: true,
        ...request,
      },
      window.location.origin
    );
  }
  sendResponse();
});

async function main() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(fileName);
  script.type = 'module';
  script.onload = () => {
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

main();
