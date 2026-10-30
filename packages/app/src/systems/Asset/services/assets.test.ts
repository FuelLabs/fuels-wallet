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

  it('throws on an error reply and does not cache it', async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockImplementation(
        async () => new Response(JSON.stringify(LIST), { status: 503 })
      );
    const writes = spyWrites();

    await expect(AssetService.setListedAssets()).rejects.toThrow('503');
    expect(writes.bulkPut).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
    const retrySpy = mockList(LIST);
    await AssetService.setListedAssets();
    expect(retrySpy).toHaveBeenCalledTimes(1);
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

describe('AssetService.validateAddAssets', () => {
  beforeEach(async () => {
    await db.assets.clear();
    await db.assets.bulkAdd(
      LIST.map((asset) => ({ ...asset, isCustom: false }))
    );
  });

  it('keeps only descriptive fields from a dApp asset', async () => {
    const [asset] = await AssetService.validateAddAssets([
      {
        ...makeAsset('My Token', 'MTK', '0x09'),
        verified: true,
        isCustom: false,
        rate: 1000,
        networks: [
          {
            type: 'fuel',
            chainId: 9889,
            assetId: '0x09',
            decimals: 9,
            verified: true,
            isCustom: false,
            rate: 1000,
          },
        ],
      } as unknown as AssetData,
    ]);

    expect(asset).toEqual(makeAsset('My Token', 'MTK', '0x09'));
  });

  it('rejects a new asset that reuses an asset id on the same chain', async () => {
    await expect(
      AssetService.validateAddAssets([makeAsset('Zzz USDC', 'ZUSDC', '0x03')])
    ).rejects.toThrow('Asset ID already exists');
  });

  it('rejects two new assets with the same asset id', async () => {
    await expect(
      AssetService.validateAddAssets([
        makeAsset('First Token', 'FIRST', '0x09'),
        makeAsset('Second Token', 'SECOND', '0x09'),
      ])
    ).rejects.toThrow('Asset ID already exists');
  });

  it('rejects an asset id taken on its chain when the same id is also on another chain', async () => {
    await db.assets.add({
      ...makeAsset('Wrapped ETH', 'WETH', '0x01'),
      networks: [{ type: 'fuel', chainId: 0, assetId: '0x01', decimals: 9 }],
      isCustom: true,
    } as AssetData);

    await expect(
      AssetService.validateAddAssets([makeAsset('Zzz ETH', 'ZETH', '0x01')])
    ).rejects.toThrow('Asset ID already exists');
  });

  it('rejects a listed asset network that reuses an id claimed earlier in the request', async () => {
    await expect(
      AssetService.validateAddAssets([
        makeAsset('First Token', 'FIRST', '0x09'),
        makeAsset('USDC', 'USDC', '0x09'),
      ])
    ).rejects.toThrow('already exists in wallet settings');
  });

  it('rejects a listed asset network that reuses a root level custom asset id', async () => {
    await db.assets.add({
      name: 'Old Custom',
      symbol: 'OLD',
      icon: '',
      assetId: '0x0a',
      networks: [],
      isCustom: true,
    } as unknown as AssetData);

    await expect(
      AssetService.validateAddAssets([
        {
          ...makeAsset('USDC', 'USDC', '0x0a'),
          networks: [
            { type: 'fuel', chainId: 0, assetId: '0x0a', decimals: 6 },
          ],
        } as AssetData,
      ])
    ).rejects.toThrow('already exists in wallet settings');
  });

  it('drops a used fuel id added to a listed asset with only ethereum networks', async () => {
    await db.assets.add({
      name: 'Bridged',
      symbol: 'BRG',
      icon: '',
      networks: [{ type: 'ethereum', chainId: 1, decimals: 18 }],
      isCustom: false,
    } as AssetData);
    const fresh = { type: 'fuel', chainId: 0, assetId: '0x0b', decimals: 9 };

    const [asset] = await AssetService.validateAddAssets([
      {
        name: 'Bridged',
        symbol: 'BRG',
        icon: '',
        networks: [
          { type: 'fuel', chainId: 9889, assetId: '0x02', decimals: 9 },
          fresh,
        ],
      } as AssetData,
    ]);

    expect(asset.networks).toEqual([fresh]);
  });

  it('drops a used ethereum address added to a listed asset with only fuel networks', async () => {
    await db.assets.add({
      name: 'Token On Ethereum',
      symbol: 'TOE',
      icon: '',
      networks: [
        { type: 'ethereum', chainId: 1, decimals: 18, address: '0xaa' },
      ],
      isCustom: false,
    } as AssetData);

    await expect(
      AssetService.validateAddAssets([
        {
          ...makeAsset('USDC', 'USDC', '0x03'),
          networks: [
            { type: 'ethereum', chainId: 1, decimals: 6, address: '0xaa' },
          ],
        } as AssetData,
      ])
    ).rejects.toThrow('already exists in wallet settings');
  });

  it('rejects a new asset with a known asset id at the root', async () => {
    await db.assets.add({
      ...makeAsset('Chain Zero', 'CZ', '0x0c'),
      networks: [{ type: 'fuel', chainId: 0, assetId: '0x0c', decimals: 9 }],
      isCustom: true,
    } as AssetData);

    await expect(
      AssetService.validateAddAssets([
        { ...makeAsset('Root Token', 'ROOT', '0x0d'), assetId: '0x0c' },
      ] as unknown as AssetData[])
    ).rejects.toThrow('Asset ID already exists');
  });

  it('rejects two new assets claiming the same id at the root and on a network', async () => {
    await expect(
      AssetService.validateAddAssets([
        {
          name: 'Root Token',
          symbol: 'ROOT',
          icon: '',
          assetId: '0x0e',
          networks: [],
        },
        {
          ...makeAsset('Network Token', 'NET', '0x0e'),
          networks: [
            { type: 'fuel', chainId: 0, assetId: '0x0e', decimals: 9 },
          ],
        },
      ] as unknown as AssetData[])
    ).rejects.toThrow('Asset ID already exists');
  });

  it('still adds an asset id that is listed on another chain', async () => {
    const asset = {
      ...makeAsset('Bridged USDC', 'BUSDC', '0x03'),
      networks: [{ type: 'fuel', chainId: 0, assetId: '0x03', decimals: 6 }],
    } as AssetData;

    await expect(AssetService.validateAddAssets([asset])).resolves.toEqual([
      asset,
    ]);
  });
});
