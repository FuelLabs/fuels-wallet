import type { Account } from '@fuel-wallet/types';
import {
  type Coin,
  type CursorPaginationArgs,
  Provider,
  RESOURCES_PAGE_SIZE_LIMIT,
  Wallet,
} from 'fuels';
import { WalletLockedCustom } from '~/systems/Core';

export type ConsolidateCoinsInputs = {
  getBaseAssetId: {
    providerUrl: string;
  };
  shouldConsolidate: {
    providerUrl: string;
    account: Account;
    assetId: string;
  };
  getAllCoins: {
    providerUrl: string;
    account: Account;
    assetId: string;
  };
  createConsolidation: {
    providerUrl: string;
    account: Account;
    coins: Coin[];
  };
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ConsolidateCoinsService {
  static async getBaseAssetId(
    input: ConsolidateCoinsInputs['getBaseAssetId']
  ): Promise<string> {
    const provider = new Provider(input.providerUrl);
    const baseAssetId = await provider.getBaseAssetId();
    return baseAssetId;
  }

  static async shouldConsolidate(
    input: ConsolidateCoinsInputs['shouldConsolidate']
  ): Promise<boolean> {
    const provider = new Provider(input.providerUrl);
    const chain = await provider.getChain();

    const wallet = Wallet.fromAddress(input.account.address, provider);

    const maxInputs = chain.consensusParameters.txParameters.maxInputs;

    const { pageInfo } = await wallet.getCoins(input.assetId, {
      first: maxInputs.toNumber(),
    });

    return pageInfo.hasNextPage;
  }

  static async getAllCoins(
    input: ConsolidateCoinsInputs['getAllCoins']
  ): Promise<Coin[]> {
    const provider = new Provider(input.providerUrl);
    const wallet = Wallet.fromAddress(input.account.address, provider);

    const allCoins: Coin[] = [];
    const pagination: CursorPaginationArgs = {
      first: RESOURCES_PAGE_SIZE_LIMIT,
    };
    let hasMore = true;

    while (hasMore) {
      const { coins, pageInfo } = await wallet.getCoins(
        input.assetId,
        pagination
      );

      allCoins.push(...coins);
      hasMore = pageInfo.hasNextPage;
      pagination.after = pageInfo.endCursor;
    }

    return allCoins;
  }

  static async createConsolidation(
    input: ConsolidateCoinsInputs['createConsolidation']
  ) {
    const provider = new Provider(input.providerUrl);
    const feePayerAccount = new WalletLockedCustom(
      input.account.address,
      provider
    );

    const consolidation =
      await feePayerAccount.assembleBaseAssetConsolidationTxs({
        coins: input.coins,
        mode: 'sequential',
      });

    return consolidation;
  }
}
