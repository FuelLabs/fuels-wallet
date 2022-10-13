import fileName from './pageScript?script&module';

const extensionId = chrome.runtime.id;

window.addEventListener('message', ({ data, origin }) => {
  if (origin === window.location.origin && data.id && !data.fromCRX) {
    chrome.runtime.sendMessage(data);
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  console.log(request, sender);
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
