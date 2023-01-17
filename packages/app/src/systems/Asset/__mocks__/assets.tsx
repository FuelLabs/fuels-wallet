import type { BigNumberish } from 'fuels';
import { bn, NativeAssetId } from 'fuels';
import { graphql } from 'msw';

import { ASSET_LIST } from '../utils';

export const MOCK_ASSETS = ASSET_LIST.map((item) => ({
  assetId: item.assetId,
  amount: bn(14563943834),
}));

export const MOCK_ASSETS_AMOUNTS = ASSET_LIST.map((item, idx) => ({
  assetId: item.assetId,
  amount: bn(idx % 2 === 0 ? 14563943834 : -14563943834),
}));

export const MOCK_ASSETS_NODE = [
  {
    node: {
      assetId: NativeAssetId,
      amount: bn(30000000000),
    },
  },
  {
    node: {
      assetId: ASSET_LIST[1].assetId,
      amount: bn(1500000000000),
    },
  },
  {
    node: {
      assetId: ASSET_LIST[2].assetId,
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
