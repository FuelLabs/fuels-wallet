import type { Coin, AssetAmount } from '@fuels-wallet/types';
import type { BytesLike } from 'fuels';

import { ASSET_LIST, ASSET_MAP } from './constants';

export function getAssetInfoById<T>(id: BytesLike, rest: T): AssetAmount {
  return { ...ASSET_MAP[id.toString()], ...rest };
}

export function isEth(asset: Coin) {
  return ASSET_LIST[0].assetId === asset.assetId;
}
