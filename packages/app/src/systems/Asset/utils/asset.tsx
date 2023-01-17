import type { AssetAmount } from '@fuel-wallet/types';
import type { BytesLike, CoinQuantity } from 'fuels';
import { NativeAssetId, hexlify } from 'fuels';

import { ASSET_MAP } from './constants';

export function getAssetInfoById<T>(id: BytesLike, rest: T): AssetAmount {
  return { ...ASSET_MAP[id.toString()], ...rest };
}

type CoinLike = {
  assetId?: BytesLike;
};

export function isEth(asset: BytesLike | CoinLike) {
  const assetId =
    typeof asset === 'string' ? asset : (asset as CoinQuantity).assetId;
  return NativeAssetId === hexlify(assetId);
}
