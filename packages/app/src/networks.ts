import type { NetworkData } from '@fuel-wallet/types';
import { CHAIN_IDS } from 'fuels';

export const DEFAULT_NETWORKS: Array<
  NetworkData & { faucetUrl?: string; bridgeUrl?: string; hidden?: boolean }
> = [
  {
    name: 'Ignition',
    url: 'https://mainnet.fuel.network/v1/graphql',
    chainId: CHAIN_IDS.fuel.mainnet,
    explorerUrl: 'https://app.fuel.network',
    bridgeUrl: 'https://app.fuel.network/bridge',
    isSelected: true,
  },
  {
    name: 'Fuel Sepolia Testnet',
    url: 'https://testnet.fuel.network/v1/graphql',
    chainId: CHAIN_IDS.fuel.testnet,
    explorerUrl: 'https://app-testnet.fuel.network',
    faucetUrl: 'https://faucet-testnet.fuel.network/',
    bridgeUrl: 'https://app-testnet.fuel.network/bridge',
    isSelected: false,
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
