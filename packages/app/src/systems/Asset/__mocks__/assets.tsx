import { ASSETS_LISTED } from 'assets-listed';
import type { BigNumberish } from 'fuels';
import { bn, NativeAssetId } from 'fuels';
import { graphql } from 'msw';

export const MOCK_ASSETS = ASSETS_LISTED.map((item) => ({
  ...item,
  amount: bn(14563943834),
}));

export const MOCK_ASSETS_AMOUNTS = ASSETS_LISTED.map((item, idx) => ({
  ...item,
  amount: bn(idx % 2 === 0 ? 14563943834 : -14563943834),
}));

export const MOCK_CUSTOM_ASSET = {
  assetId: '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d91',
  name: 'Custom',
  symbol: 'CUST',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  isCustom: true,
};

export const MOCK_ASSETS_NODE = [
  {
    node: {
      assetId: NativeAssetId,
      amount: bn(30000000000),
    },
  },
  {
    node: {
      assetId: ASSETS_LISTED[1].assetId,
      amount: bn(1500000000000),
    },
  },
  {
    node: {
      assetId: ASSETS_LISTED[2].assetId,
      amount: bn(120000000),
    },
  },
] as BalanceNode[];

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
