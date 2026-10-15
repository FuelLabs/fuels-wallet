import type { AssetData } from '@fuel-wallet/types';
import { db } from '~/systems/Core/utils/database';
import { Storage } from '~/systems/Core/utils/storage';
import { AssetService, LISTED_ASSETS_TTL } from './assets';

const makeAsset = (name: string, symbol: string, assetId: string) =>
  ({
    name,
    symbol,
    icon: `https://example.com/${symbol}.svg`,
    networks: [{ type: 'fuel', chainId: 9889, assetId, decimals: 9 }],
  }) as AssetData;

const LIST = [
  makeAsset('Ethereum', 'ETH', '0x01'),
  makeAsset('Fuel', 'FUEL', '0x02'),
  makeAsset('USDC', 'USDC', '0x03'),
];

function mockList(list: AssetData[], etag?: string) {
  return jest.spyOn(global, 'fetch').mockImplementation(
    async () =>
      new Response(JSON.stringify(list), {
        status: 200,
        headers: etag ? { etag } : {},
      })
  );
}

function spyWrites() {
  return {
    add: jest.spyOn(db.assets, 'add'),
    put: jest.spyOn(db.assets, 'put'),
    bulkPut: jest.spyOn(db.assets, 'bulkPut'),
    delete: jest.spyOn(db.assets, 'delete'),
  };
}

describe('AssetService.setListedAssets', () => {
  beforeEach(async () => {
    await db.assets.clear();
    Storage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('writes the list in one bulkPut on a cold start', async () => {
    const fetchSpy = mockList(LIST);
    const writes = spyWrites();

    await AssetService.setListedAssets();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(writes.bulkPut).toHaveBeenCalledTimes(1);
    expect(writes.add).not.toHaveBeenCalled();
    expect(writes.delete).not.toHaveBeenCalled();
    const stored = await db.assets.toArray();
    expect(stored).toHaveLength(3);
    expect(stored.every((a) => a.isCustom === false)).toBe(true);
  });

  it('skips the request and the writes within the TTL', async () => {
    const fetchSpy = mockList(LIST);
    await AssetService.setListedAssets();

    fetchSpy.mockClear();
    const writes = spyWrites();
    await AssetService.setListedAssets();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(writes.bulkPut).not.toHaveBeenCalled();
  });

  it('refetches after the TTL but skips writes when the list is unchanged', async () => {
    const now = Date.now();
    const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(now);
    const fetchSpy = mockList(LIST);
    await AssetService.setListedAssets();

    dateSpy.mockReturnValue(now + LISTED_ASSETS_TTL + 1);
    fetchSpy.mockClear();
    const writes = spyWrites();
    await AssetService.setListedAssets();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(writes.bulkPut).not.toHaveBeenCalled();
  });

  it('writes only the changed assets', async () => {
    const now = Date.now();
    const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(now);
    mockList(LIST);
    await AssetService.setListedAssets();

    jest.restoreAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(now + LISTED_ASSETS_TTL + 1);
    const changed = { ...LIST[1], icon: 'https://example.com/new.svg' };
    mockList([LIST[0], changed, LIST[2]]);
    const writes = spyWrites();
    await AssetService.setListedAssets();

    expect(writes.bulkPut).toHaveBeenCalledTimes(1);
    expect(writes.bulkPut.mock.calls[0][0]).toEqual([
      { ...changed, isCustom: false },
    ]);
    expect((await db.assets.get('Fuel'))?.icon).toBe(changed.icon);
    dateSpy.mockRestore();
  });

  it('skips parsing and writes when the ETag matches', async () => {
    const now = Date.now();
    const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(now);
    mockList(LIST, '"v1"');
    await AssetService.setListedAssets();

    dateSpy.mockReturnValue(now + LISTED_ASSETS_TTL + 1);
    const writes = spyWrites();
    const saveSpy = jest.spyOn(AssetService, 'saveListedAssets');
    await AssetService.setListedAssets();

    expect(saveSpy).not.toHaveBeenCalled();
    expect(writes.bulkPut).not.toHaveBeenCalled();
  });

  it('fetches again within the TTL when the listed assets are gone', async () => {
    const fetchSpy = mockList(LIST);
    await AssetService.setListedAssets();
    await db.assets.clear();

    fetchSpy.mockClear();
    await AssetService.setListedAssets();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(await db.assets.count()).toBe(3);
  });

  it('keeps custom assets and replaces a custom asset with the same name', async () => {
    const custom = {
      ...makeAsset('My Token', 'MTK', '0x09'),
      isCustom: true,
    };
    const shadowed = {
      ...makeAsset('USDC', 'USDC', '0x03'),
      isCustom: true,
    };
    await db.assets.bulkAdd([custom, shadowed]);
    mockList(LIST);

    await AssetService.setListedAssets();

    expect(await db.assets.get('My Token')).toEqual(custom);
    expect((await db.assets.get('USDC'))?.isCustom).toBe(false);
    expect(await db.assets.count()).toBe(4);
  });

  it('saves the other assets when a symbol is taken by a custom asset', async () => {
    const custom = {
      ...makeAsset('Fake Fuel', 'FUEL', '0x09'),
      isCustom: true,
    };
    await db.assets.add(custom);
    mockList(LIST);

    await expect(AssetService.setListedAssets()).rejects.toThrow('Fuel');

    expect(await db.assets.get('Ethereum')).toBeDefined();
    expect(await db.assets.get('USDC')).toBeDefined();
    expect(await db.assets.get('Fuel')).toBeUndefined();
    expect(await db.assets.get('Fake Fuel')).toEqual(custom);
  });
});
