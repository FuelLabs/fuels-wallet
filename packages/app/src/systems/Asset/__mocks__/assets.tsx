import type { AssetData, NetworkData } from '@fuel-wallet/types';
import { type BNInput, type BigNumberish, assets, bn } from 'fuels';
import { graphql } from 'msw';
import { uniqueId } from 'xstate/lib/utils';

export const MOCK_NETWORK: NetworkData = {
  id: uniqueId(),
  chainId: 0,
  name: 'Another',
  url: 'https://testnet.fuel.network/v1/graphql',
};

export const MOCK_FUEL_ASSETS = assets
  .map((asset) => {
    const fuelNetworkAsset = asset.networks.find(
      (n) => n.type === 'fuel' && n.chainId === MOCK_NETWORK.chainId
    );

    if (!fuelNetworkAsset) return undefined;

    const data: AssetData = {
      ...asset,
      networks: [fuelNetworkAsset],
    };
    return data;
  })
  .filter((v) => !!v);

export const MOCK_ASSETS = MOCK_FUEL_ASSETS.map((item) => ({
  ...item,
  amount: bn(14563943834),
})) as Array<AssetData & { amount?: BNInput }>;

// BaseAssetId replacement
export const MOCK_BASE_ASSET_ID =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const MOCK_CUSTOM_ASSET = {
  assetId: '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d90',
  name: 'New',
  symbol: 'NEW',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  isCustom: true,
};

export const MOCK_ASSETS_AMOUNTS = [
  ...MOCK_FUEL_ASSETS.map((item, idx) => ({
    ...item,
    amount: bn(idx % 2 === 0 ? 14563943834 : -14563943834),
  })),
  MOCK_CUSTOM_ASSET,
];

export const MOCK_ASSETS_NODE = [
  {
    node: {
      assetId: MOCK_BASE_ASSET_ID,
      amount: bn(30000000000),
    },
  },
] as BalanceNode[];

export const MOCK_UNKNOWN_ASSET = {
  assetId: '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d91',
};

export const MOCK_UNKNOWN_ASSETS_AMOUNT = [
  {
    ...MOCK_UNKNOWN_ASSET,
    amount: bn(30000000000),
  },
];

export const MOCK_MIXED_ASSETS_AMOUNTS = [
  ...MOCK_ASSETS_AMOUNTS,
  ...MOCK_UNKNOWN_ASSETS_AMOUNT,
];

type BalanceNode = {
  node: {
    assetId: string;
    amount: BigNumberish;
  };
};

export function mockBalancesOnGraphQL(nodes: BalanceNode[] = MOCK_ASSETS_NODE) {
  return graphql.query('getBalances', (_req, res, ctx) => {
    return res(ctx.data({ balances: { edges: nodes } }));
  });
}
