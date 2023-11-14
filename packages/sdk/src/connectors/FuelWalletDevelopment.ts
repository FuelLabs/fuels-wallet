import type { ConnectorMetadata } from '../types';

import { FuelWalletConnector } from './FuelWallet';

export class FuelWalletDevelopmentConnector extends FuelWalletConnector {
  metadata: ConnectorMetadata = {
    image: '/connectors/fuel-wallet-dev.svg',
    install: {
      action: 'Install',
      description:
        'To connect your Fuel Wallet Development, install the browser extension.',
      link: 'https://chrome.google.com/webstore/detail/fuel-wallet-development/hcgmehahnlbhpilepakbdinkhhaackmc',
    },
  };

  constructor() {
    super('Fuel Wallet Development');
  }
}
