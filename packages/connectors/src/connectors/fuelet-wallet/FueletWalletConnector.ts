import type { ConnectorMetadata } from '@fuel-wallet/sdk-v2';

import { FuelWalletConnector } from '../fuel-wallet';

export class FueletWalletConnector extends FuelWalletConnector {
  name = 'Fuelet Wallet';
  metadata: ConnectorMetadata = {
    image: {
      light: '/connectors/fuelet-light.svg',
      dark: '/connectors/fuelet-dark.svg',
    },
    install: {
      action: 'Install',
      description: 'Install Fuelet Wallet in order to connect it.',
      link: 'https://fuelet.app/download/',
    },
  };
}
