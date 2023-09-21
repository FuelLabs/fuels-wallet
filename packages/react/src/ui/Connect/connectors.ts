import type { Connector, ConnectorList } from '../../types';

export const FUEL_WALLET_CONNECTOR: Connector = {
  name: 'Fuel Wallet',
  image: '/connectors/fuel-wallet.svg',
  connector: 'Fuel Wallet',
  install: {
    action: 'Install',
    description: 'To connect your Fuel Wallet, install the browser extension.',
    link: 'https://chrome.google.com/webstore/detail/fuel-wallet/dldjpboieedgcmpkchcjcbijingjcgok',
  },
  installed: false,
};

export const FUEL_WALLET_DEVELOPMENT_CONNECTOR: Connector = {
  name: 'Fuel Wallet Development',
  image: '/connectors/fuel-wallet-dev.svg',
  connector: 'Fuel Wallet Development',
  install: {
    action: 'Install',
    description:
      'To connect your Fuel Wallet Development, install the browser extension.',
    link: 'https://chrome.google.com/webstore/detail/fuel-wallet-development/hcgmehahnlbhpilepakbdinkhhaackmc',
  },
  installed: false,
};

export const FUELET_CONNECTOR: Connector = {
  name: 'Fuelet',
  image: {
    light: '/connectors/fuelet-light.svg',
    dark: '/connectors/fuelet-dark.svg',
  },
  connector: 'Fuelet',
  install: {
    action: 'Install',
    description: 'To connect your Fuelet, install the browser extension.',
    link: 'https://chrome.google.com/webstore/detail/fuelet-wallet-fuel/bifidjkcdpgfnlbcjpdkdcnbiooooblg',
  },
  installed: false,
};

export const DEFAULT_CONNECTORS: ConnectorList = [
  FUEL_WALLET_CONNECTOR,
  FUEL_WALLET_DEVELOPMENT_CONNECTOR,
  FUELET_CONNECTOR,
];
