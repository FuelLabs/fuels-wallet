import type { BytesLike } from 'fuels';

import type { Asset, AssetWithInfo } from '../types';

import { ASSET_LIST, ASSET_MAP } from './constants';

export function getAssetInfoById<T>(id: BytesLike, rest: T): AssetWithInfo {
  return { ...ASSET_MAP[id.toString()], ...rest };
}

export function isEth(asset: Asset) {
  return ASSET_LIST[0].assetId === asset.assetId;
}
