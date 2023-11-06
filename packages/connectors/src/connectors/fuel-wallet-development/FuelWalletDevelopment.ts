import type { ConnectorMetadata } from '@fuel-wallet/sdk-v2';

import { FuelWalletConnector } from '../fuel-wallet';

export class FuelWalletDevelopmentConnector extends FuelWalletConnector {
  name = 'Fuel Wallet Development';
  metadata: ConnectorMetadata = {
    image: '/connectors/fuel-wallet-dev.svg',
    install: {
      action: 'Install',
      description:
        'To connect your Fuel Wallet Development, install the browser extension.',
      link: 'https://chrome.google.com/webstore/detail/fuel-wallet-development/hcgmehahnlbhpilepakbdinkhhaackmc',
    },
  };
}
