import {
  type Account,
  type BytesLike,
  type Coin,
  type CursorPaginationArgs,
  RESOURCES_PAGE_SIZE_LIMIT,
} from 'fuels';

export type ConsolidateCoinsInputs = {
  constructor: {
    account: Account;
    assetId: string;
  };
  createBundles: {
    coins: Coin[];
  };
};

export class ConsolidateCoinsService {
  private readonly account: Account;
  private readonly assetId: BytesLike;

  constructor(input: ConsolidateCoinsInputs['constructor']) {
    this.account = input.account;
    this.assetId = input.assetId;
  }

  async getAllCoins() {
    const allCoins: Coin[] = [];
    const pagination: CursorPaginationArgs = {
      first: RESOURCES_PAGE_SIZE_LIMIT,
    };
    let hasMore = true;

    while (hasMore) {
      const { coins, pageInfo } = await this.account.getCoins(
        this.assetId,
        pagination
      );

      allCoins.push(...coins);
      hasMore = pageInfo.hasNextPage;
      pagination.after = pageInfo.endCursor;
    }

    return allCoins;
  }

  async createBundles(input: ConsolidateCoinsInputs['createBundles']) {
    const bundles = await this.account.assembleBaseAssetConsolidationTxs({
      coins: input.coins,
      mode: 'sequential',
    });

    return bundles;
  }
}
