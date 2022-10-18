import { ContentProxyConnection } from '@fuels-wallet/sdk';

import fileName from './pageScript?script&module';

ContentProxyConnection.start();

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
