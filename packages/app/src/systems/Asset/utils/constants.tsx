import type { AssetWithInfo } from '../types';

import { relativeUrl } from '~/systems/Core';

/**
 * TODO: change this for something automatic, this is here just for development purposes
 */
export const ASSET_MAP: Record<string, AssetWithInfo> = {
  '0x0000000000000000000000000000000000000000000000000000000000000000': {
    assetId:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    name: 'Ethereum',
    symbol: 'ETH',
    imageUrl: relativeUrl('assets/eth.svg'),
  },
  '0x6b175474e89094c44da98b954eedeac495271d0f': {
    assetId: '0x6b175474e89094c44da98b954eedeac495271d0f',
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
