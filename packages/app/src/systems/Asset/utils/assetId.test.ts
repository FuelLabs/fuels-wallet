import type { AssetData } from '@fuel-wallet/types';
import { getFuelAssetByAssetId } from './assetId';

const CHAIN_ID = 9889;
const makeAsset = (name: string, assetId: string, chainId = CHAIN_ID) =>
  ({
    name,
    symbol: name.toUpperCase(),
    icon: '',
    networks: [{ type: 'fuel', chainId, assetId, decimals: 9 }],
  }) as AssetData;

describe('getFuelAssetByAssetId', () => {
  const assets = [
    makeAsset('one', '0x01'),
    makeAsset('two', '0x02'),
    makeAsset('other-chain', '0x03', 0),
  ];

  it('finds the asset for the chain', async () => {
    const asset = await getFuelAssetByAssetId({
      assets,
      assetId: '0x02',
      chainId: CHAIN_ID,
    });
    expect(asset).toMatchObject({ name: 'two', assetId: '0x02', decimals: 9 });
    expect(asset).not.toHaveProperty('networks');
  });

  it('returns an unknown asset when the id is on another chain', async () => {
    const asset = await getFuelAssetByAssetId({
      assets,
      assetId: '0x03',
      chainId: CHAIN_ID,
    });
    expect(asset).toMatchObject({ name: '', assetId: '0x03' });
  });

  it('returns the last match, like the previous lookup', async () => {
    const asset = await getFuelAssetByAssetId({
      assets: [...assets, makeAsset('dup', '0x01')],
      assetId: '0x01',
      chainId: CHAIN_ID,
    });
    expect(asset.name).toBe('dup');
  });
});
