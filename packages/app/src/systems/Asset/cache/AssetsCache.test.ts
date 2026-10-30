import type { AssetData } from '@fuel-wallet/types';
import { CHAIN_IDS } from 'fuels';
import { db } from '~/systems/Core/utils/database';
import { AssetsCache, NOT_FOUND_TTL, assetDbKeyFactory } from './AssetsCache';

const CHAIN_ID = CHAIN_IDS.fuel.mainnet;
const SPAM_IDS = Array.from(
  { length: 50 },
  (_, i) => `0x${(i + 1).toString(16).padStart(64, '0')}`
);
const KNOWN_ID = `0x${'a'.repeat(64)}`;

function resetInstance() {
  // biome-ignore lint/suspicious/noExplicitAny: reset singleton to simulate a new popup
  (AssetsCache as any).instance = undefined;
}

function mockIndexer(
  handler: (assetId: string) => Response | Promise<Response>
) {
  return jest.spyOn(global, 'fetch').mockImplementation(async (url) => {
    const assetId = String(url).split('/assets/')[1];
    return handler(assetId);
  });
}

const notFound = () =>
  new Response(JSON.stringify({ message: 'Asset not found' }), {
    status: 404,
  });

describe('AssetsCache', () => {
  beforeEach(async () => {
    await db.indexedAssets.clear();
    resetInstance();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not call the indexer again for unknown assets within the TTL', async () => {
    const fetchSpy = mockIndexer(notFound);

    const first = await AssetsCache.fetchAllAssets(CHAIN_ID, SPAM_IDS);
    expect(fetchSpy).toHaveBeenCalledTimes(50);
    expect(first.get(SPAM_IDS[0])?.name).toBe('');
    expect(first.get(SPAM_IDS[0])).not.toHaveProperty('message');

    fetchSpy.mockClear();
    await AssetsCache.fetchAllAssets(CHAIN_ID, SPAM_IDS);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('reads unknown assets from IndexedDB in a new popup', async () => {
    const fetchSpy = mockIndexer(notFound);
    await AssetsCache.fetchAllAssets(CHAIN_ID, SPAM_IDS);
    await new Promise((r) => setTimeout(r, 50));

    const stored = await db.indexedAssets.get(
      assetDbKeyFactory(CHAIN_ID, SPAM_IDS[0])
    );
    expect(stored?.notFound).toBe(true);

    resetInstance();
    fetchSpy.mockClear();
    const putSpy = jest.spyOn(db.indexedAssets, 'put');
    await AssetsCache.fetchAllAssets(CHAIN_ID, SPAM_IDS);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(putSpy).not.toHaveBeenCalled();
  });

  it('refetches unknown assets after the TTL expires', async () => {
    const fetchSpy = mockIndexer(notFound);
    const now = Date.now();
    const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(now);
    await AssetsCache.fetchAllAssets(CHAIN_ID, [SPAM_IDS[0]]);

    dateSpy.mockReturnValue(now + NOT_FOUND_TTL + 1);
    fetchSpy.mockClear();
    await AssetsCache.fetchAllAssets(CHAIN_ID, [SPAM_IDS[0]]);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('does not cache failed indexer lookups as unknown', async () => {
    const fetchSpy = mockIndexer(() => new Response('', { status: 500 }));
    await AssetsCache.fetchAllAssets(CHAIN_ID, [SPAM_IDS[0]]);
    fetchSpy.mockClear();
    await AssetsCache.fetchAllAssets(CHAIN_ID, [SPAM_IDS[0]]);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('ignores the unknown entry once the asset exists locally', async () => {
    const fetchSpy = mockIndexer(notFound);
    const instance = AssetsCache.getInstance();
    await instance.getAsset({
      chainId: CHAIN_ID,
      assetId: KNOWN_ID,
      dbAssets: [],
    });

    const custom: AssetData = {
      name: 'Custom',
      symbol: 'CST',
      icon: '',
      isCustom: true,
      networks: [
        { type: 'fuel', chainId: CHAIN_ID, assetId: KNOWN_ID, decimals: 9 },
      ],
    };
    fetchSpy.mockClear();
    const asset = await instance.getAsset({
      chainId: CHAIN_ID,
      assetId: KNOWN_ID,
      dbAssets: [custom],
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(asset?.name).toBe('Custom');
  });

  it('keeps the 5 minute cache for named assets', async () => {
    const fetchSpy = mockIndexer(
      (assetId) =>
        new Response(
          JSON.stringify({ assetId, name: 'Named', symbol: 'NMD', decimals: 9 })
        )
    );
    const first = await AssetsCache.fetchAllAssets(CHAIN_ID, [KNOWN_ID]);
    expect(first.get(KNOWN_ID)?.name).toBe('Named');
    fetchSpy.mockClear();
    await AssetsCache.fetchAllAssets(CHAIN_ID, [KNOWN_ID]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
