import type { Account } from '@fuel-wallet/types';
import type { Coin, ScriptTransactionRequest } from 'fuels';
import { assign, createMachine } from 'xstate';
import { AccountService } from '~/systems/Account';
import { NetworkService } from '~/systems/Network';
import { ConsolidateCoinsService } from '../services/consolidateCoins';

type MachineContext = {
  providerUrl: string;
  assetId: string;
  shouldConsolidate: boolean;
  account: Account | undefined;
  coins: Coin[];
  txs: ScriptTransactionRequest[];
};

type MachineServices = {
  getProviderUrl: {
    data: string;
  };
  getBaseAssetId: {
    data: string;
  };
  getAccount: {
    data: Account;
  };
  shouldConsolidate: {
    data: boolean;
  };
  getAllCoins: {
    data: Coin[];
  };
  createBundles: {
    data: ScriptTransactionRequest[];
  };
};

type MachineEvents = { type: 'START' } | { type: 'CANCEL' };

export const consolidateCoinsMachine = createMachine(
  {
    tsTypes: {} as import('./consolidateCoinsMachine.typegen').Typegen0,
    predictableActionArguments: true,
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
      services: {} as MachineServices,
    },
    id: 'consolidateCoins',
    initial: 'getProviderUrl',
    context: {
      providerUrl: '',
      assetId: '',
      shouldConsolidate: false,
      account: undefined,
      coins: [],
      txs: [],
    },
    states: {
      getProviderUrl: {
        tags: ['loading'],
        invoke: {
          src: 'getProviderUrl',
          onDone: {
            actions: ['assignProviderUrl'],
            target: 'getBaseAssetId',
          },
        },
      },
      getBaseAssetId: {
        tags: ['loading'],
        invoke: {
          src: 'getBaseAssetId',
          onDone: {
            actions: ['assignBaseAssetId'],
            target: 'getAccount',
          },
        },
      },
      getAccount: {
        tags: ['loading'],
        invoke: {
          src: 'getAccount',
          onDone: {
            actions: ['assignAccount'],
            target: 'checkShouldConsolidate',
          },
        },
      },
      checkShouldConsolidate: {
        tags: ['loading'],
        invoke: {
          src: 'shouldConsolidate',
          onDone: [
            {
              actions: ['assignShouldConsolidate'],
              target: 'getAllCoins',
              cond: 'shouldConsolidate',
            },
            {
              target: 'success',
            },
          ],
        },
      },
      getAllCoins: {
        tags: ['loading'],
        invoke: {
          src: 'getAllCoins',
          onDone: {
            actions: ['assignCoins'],
            target: 'createBundles',
          },
        },
      },
      createBundles: {
        tags: ['loading'],
        invoke: {
          src: 'createBundles',
          onDone: {
            actions: ['assignBundles'],
            target: 'success',
          },
        },
      },
      success: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      shouldConsolidate: (_, ev) => ev.data,
    },
    actions: {
      assignProviderUrl: assign((_ctx, ev) => ({
        providerUrl: ev.data,
      })),
      assignBaseAssetId: assign((_ctx, ev) => ({
        assetId: ev.data,
      })),
      assignAccount: assign((_ctx, ev) => ({
        account: ev.data,
      })),
      assignShouldConsolidate: assign((_ctx, ev) => ({
        shouldConsolidate: ev.data,
      })),
      assignCoins: assign((_ctx, ev) => ({
        coins: ev.data,
      })),
      assignBundles: assign((_ctx, ev) => ({
        txs: ev.data,
      })),
    },
    services: {
      getProviderUrl: async () => {
        const selectedNetwork = await NetworkService.getSelectedNetwork();
        if (!selectedNetwork) {
          throw new Error('No network selected');
        }
        return selectedNetwork.url;
      },
      getBaseAssetId: async (ctx) => {
        const baseAssetId = await ConsolidateCoinsService.getBaseAssetId({
          providerUrl: ctx.providerUrl,
        });
        return baseAssetId;
      },
      getAccount: async () => {
        const account = await AccountService.getCurrentAccount();
        if (!account) {
          throw new Error('No account found');
        }
        return account;
      },
      shouldConsolidate: async (ctx) => {
        const shouldConsolidate =
          await ConsolidateCoinsService.shouldConsolidate({
            providerUrl: ctx.providerUrl,
            account: ctx.account as Account,
            assetId: ctx.assetId,
          });

        return shouldConsolidate;
      },
      getAllCoins: async (ctx) => {
        const account = ctx.account as Account;
        const coins = await ConsolidateCoinsService.getAllCoins({
          providerUrl: ctx.providerUrl,
          account,
          assetId: ctx.assetId,
        });
        return coins;
      },
      createBundles: async (ctx) => {
        const bundles = await ConsolidateCoinsService.createBundles({
          providerUrl: ctx.providerUrl,
          account: ctx.account as Account,
          coins: ctx.coins,
        });
        return bundles.txs;
      },
    },
  }
);
