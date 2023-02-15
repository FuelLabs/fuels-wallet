import type { BytesLike, CoinQuantity } from 'fuels';
import { NativeAssetId, hexlify } from 'fuels';

type CoinLike = {
  assetId?: BytesLike;
};

export function isEth(asset: BytesLike | CoinLike) {
  const assetId =
    typeof asset === 'string' ? asset : (asset as CoinQuantity).assetId;
  return NativeAssetId === hexlify(assetId);
}
