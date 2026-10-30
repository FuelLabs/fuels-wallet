import { createProvider } from '@fuel-wallet/connections';
import type { Account } from '@fuel-wallet/types';
import {
  type Coin,
  type CursorPaginationArgs,
  RESOURCES_PAGE_SIZE_LIMIT,
  type ScriptTransactionRequest,
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
  submitConsolidation: {
    providerUrl: string;
    account: Account;
    txs: ScriptTransactionRequest[];
    onStep: (step: number, status: ConsolidationStepStatus) => void;
  };
};

export type ConsolidationStepStatus = 'pending' | 'sending' | 'done' | 'failed';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ConsolidateCoinsService {
  static async getBaseAssetId(
    input: ConsolidateCoinsInputs['getBaseAssetId']
  ): Promise<string> {
    const provider = await createProvider(input.providerUrl);
    const baseAssetId = await provider.getBaseAssetId();
    return baseAssetId;
  }

  static async shouldConsolidate(
    input: ConsolidateCoinsInputs['shouldConsolidate']
  ): Promise<boolean> {
    const provider = await createProvider(input.providerUrl);
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
    const provider = await createProvider(input.providerUrl);
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
    const provider = await createProvider(input.providerUrl);
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

  /** Sends each transaction in turn; a failed one does not stop the rest. */
  static async submitConsolidation(
    input: ConsolidateCoinsInputs['submitConsolidation']
  ) {
    const provider = await createProvider(input.providerUrl);
    const wallet = new WalletLockedCustom(input.account.address, provider);

    for (const [step, tx] of input.txs.entries()) {
      input.onStep(step, 'sending');
      try {
        const response = await wallet.sendTransaction(tx);
        await response.waitForResult();
        input.onStep(step, 'done');
      } catch {
        input.onStep(step, 'failed');
      }
    }
  }
}
