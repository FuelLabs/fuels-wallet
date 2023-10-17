import type { BigNumberish } from 'fuels';
import { bn, BaseAssetId } from 'fuels';
import { graphql } from 'msw';
import { fuelAssets } from '~/systems/Core';

export const MOCK_ASSETS = fuelAssets.map((item) => ({
  ...item,
  amount: bn(14563943834),
}));

export const MOCK_CUSTOM_ASSET = {
  assetId: '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d90',
  name: 'New',
  symbol: 'NEW',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  isCustom: true,
};

export const MOCK_ASSETS_AMOUNTS = [
  ...fuelAssets.map((item, idx) => ({
    ...item,
    amount: bn(idx % 2 === 0 ? 14563943834 : -14563943834),
  })),
  MOCK_CUSTOM_ASSET,
];

export const MOCK_ASSETS_NODE = [
  {
    node: {
      assetId: BaseAssetId,
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
  return graphql.query('getBalances', (req, res, ctx) => {
    return res(ctx.data({ balances: { edges: nodes } }));
  });
}
