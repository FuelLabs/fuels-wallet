/**
 * TODO: change this for something automatic, this is here just for development purposes
 */
import type { Asset } from '@fuel-wallet/types';

import { relativeUrl } from '~/systems/Core/utils';

// When exporting Object.values from a file, the bundler for
// the chrome extension tries to bundle it as a window object
// failing the bundle. This way the bundler works fine.
export const ASSET_LIST: Array<Asset> = [
  {
    assetId:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    name: 'Ethereum',
    symbol: 'ETH',
    imageUrl: relativeUrl('assets/eth.svg'),
  },
  {
    assetId:
      '0xe90f62d5216f58ffaf19e6eba07f944cc2cd36f9800b89419d52b6927f53976701',
    name: 'Dai',
    symbol: 'DAI',
    imageUrl: relativeUrl('assets/dai.svg'),
  },
  {
    assetId: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    name: 'Bitcoin',
    symbol: 'BTC',
    imageUrl: relativeUrl('assets/btc.svg'),
  },
];

export const ASSET_MAP: Record<string, Asset> = {
  '0x0000000000000000000000000000000000000000000000000000000000000000':
    ASSET_LIST[0],
  '0xe90f62d5216f58ffaf19e6eba07f944cc2cd36f9800b89419d52b6927f53976701':
    ASSET_LIST[1],
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': ASSET_LIST[2],
};
