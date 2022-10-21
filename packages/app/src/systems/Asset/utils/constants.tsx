import type { Asset } from '@fuels-wallet/types';

import { relativeUrl } from '~/systems/Core';

/**
 * TODO: change this for something automatic, this is here just for development purposes
 */
export const ASSET_MAP: Record<string, Asset> = {
  '0x0000000000000000000000000000000000000000000000000000000000000000': {
    assetId:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    name: 'Ethereum',
    symbol: 'ETH',
    imageUrl: relativeUrl('assets/eth.svg'),
  },
  '0xe90f62d5216f58ffaf19e6eba07f944cc2cd36f9800b89419d52b6927f53976701': {
    assetId:
      '0xe90f62d5216f58ffaf19e6eba07f944cc2cd36f9800b89419d52b6927f53976701',
    name: 'Dai',
    symbol: 'DAI',
    imageUrl: relativeUrl('assets/dai.svg'),
  },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': {
    assetId: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    name: 'Bitcoin',
    symbol: 'BTC',
    imageUrl: relativeUrl('assets/btc.svg'),
  },
};

export const ASSET_LIST = Object.values(ASSET_MAP);
