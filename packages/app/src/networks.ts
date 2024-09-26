import type { NetworkData } from '@fuel-wallet/types';
import { CHAIN_IDS } from 'fuels';
import {
  IS_DEVELOPMENT,
  IS_RELEASE,
  IS_TEST,
  VITE_EXPLORER_URL,
  VITE_FUEL_PROVIDER_URL,
} from './config';

export const DEFAULT_NETWORKS: Array<
  NetworkData & { faucetUrl?: string; bridgeUrl?: string }
> = [
  {
    name: 'Ignition',
    url: 'https://mainnet.fuel.network/v1/graphql',
    chainId: CHAIN_IDS.fuel.mainnet,
    explorerUrl: 'https://app.fuel.network',
    bridgeUrl: 'https://app.fuel.network/bridge',
    isSelected: IS_RELEASE,
  },
  {
    name: 'Fuel Sepolia Testnet',
    url: 'https://testnet.fuel.network/v1/graphql',
    chainId: CHAIN_IDS.fuel.testnet,
    explorerUrl: 'https://app-testnet.fuel.network',
    faucetUrl: 'https://faucet-testnet.fuel.network/',
    isSelected: !IS_RELEASE,
  },
  {
    name: 'Fuel Sepolia Devnet',
    url: 'https://devnet.fuel.network/v1/graphql',
    chainId: CHAIN_IDS.fuel.devnet,
    explorerUrl: 'https://app-devnet.fuel.network',
    faucetUrl: 'https://faucet-devnet.fuel.network/',
    isSelected: false,
  },
];

if (
  (IS_DEVELOPMENT || IS_TEST) &&
  !DEFAULT_NETWORKS.find((n) => n.url === VITE_FUEL_PROVIDER_URL)
) {
  DEFAULT_NETWORKS.push({
    name: 'Local',
    url: VITE_FUEL_PROVIDER_URL,
    chainId: CHAIN_IDS.fuel.testnet,
    explorerUrl: VITE_EXPLORER_URL,
    isSelected: false,
  });
}
