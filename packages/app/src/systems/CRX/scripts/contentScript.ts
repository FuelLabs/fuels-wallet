import { ContentProxyConnection, MessageTypes } from '@fuel-wallet/sdk';

import fileName from './pageScript?script&module';

const contentProxyConnection = ContentProxyConnection.start();

async function main() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(fileName);
  script.type = 'module';
  script.onload = () => {
    console.log('fuel script loaded first time');
    setTimeout(() => {
      console.log('send event to doc');
      contentProxyConnection.postMessage({
        type: MessageTypes.event,
        events: [
          {
            event: 'fuelLoaded',
            params: [],
          },
        ],
        target: 'a',
      });
    }, 3000);
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}
main();
