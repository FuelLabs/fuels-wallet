import { ContentProxyConnection } from '@fuel-wallet/sdk';
import { WALLET_NAME } from '~/config';

import fileName from './pageScript?script&module';

ContentProxyConnection.start(WALLET_NAME);

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
