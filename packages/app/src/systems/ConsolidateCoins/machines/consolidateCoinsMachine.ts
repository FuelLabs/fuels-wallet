import type { Account } from '@fuel-wallet/types';
import type {
  Coin,
  ScriptTransactionRequest,
  SubmitAllCallbackResponse,
} from 'fuels';
import {
  type InterpreterFrom,
  type StateFrom,
  assign,
  createMachine,
} from 'xstate';
import { AccountService } from '~/systems/Account';
import { NetworkService } from '~/systems/Network';
import { ConsolidateCoinsService } from '../services/consolidateCoins';

type MachineContext = {
  providerUrl: string;
  assetId: string;
  shouldConsolidate: boolean;
  account: Account | undefined;
  coins: Coin[];
  consolidation: {
    txs: ScriptTransactionRequest[];
    submitAll: () => Promise<SubmitAllCallbackResponse>;
  };
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
  createConsolidation: {
    data: {
      txs: ScriptTransactionRequest[];
      submitAll: () => Promise<SubmitAllCallbackResponse>;
    };
  };
  submitAll: {
    data: SubmitAllCallbackResponse;
  };
};

type MachineEvents = { type: 'CONSOLIDATE_COINS' } | { type: 'REFRESH' };

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
    initial: 'initializingProvider',
    context: {
      providerUrl: '',
      assetId: '',
      shouldConsolidate: false,
      account: undefined,
      coins: [],
      consolidation: {
        txs: [],
        submitAll: () => Promise.resolve({ txResponses: [], errors: [] }),
      },
    },
    states: {
      idle: {
        on: {
          REFRESH: {
            target: 'initializingProvider',
          },
        },
      },
      initializingProvider: {
        tags: ['loading'],
        invoke: {
          src: 'getProviderUrl',
          onDone: {
            actions: ['assignProviderUrl'],
            target: 'fetchingBaseAssetId',
          },
        },
      },
      fetchingBaseAssetId: {
        tags: ['loading'],
        invoke: {
          src: 'getBaseAssetId',
          onDone: {
            actions: ['assignBaseAssetId'],
            target: 'loadingAccount',
          },
        },
      },
      loadingAccount: {
        tags: ['loading'],
        invoke: {
          src: 'getAccount',
          onDone: {
            actions: ['assignAccount'],
            target: 'evaluatingConsolidationNeed',
          },
        },
      },
      evaluatingConsolidationNeed: {
        tags: ['loading'],
        invoke: {
          src: 'shouldConsolidate',
          onDone: [
            {
              actions: ['assignShouldConsolidate'],
              target: 'fetchingCoins',
              cond: 'shouldConsolidate',
            },
            {
              target: 'idle',
              actions: ['assignShouldNotConsolidate'],
            },
          ],
        },
      },
      fetchingCoins: {
        tags: ['loading'],
        invoke: {
          src: 'getAllCoins',
          onDone: {
            actions: ['assignCoins'],
            target: 'preparingConsolidation',
          },
        },
      },
      preparingConsolidation: {
        tags: ['loading'],
        invoke: {
          src: 'createConsolidation',
          onDone: {
            actions: ['assignConsolidation'],
            target: 'awaitingUserConfirmation',
          },
        },
      },
      awaitingUserConfirmation: {
        on: {
          CONSOLIDATE_COINS: {
            target: 'executingConsolidation',
          },
          REFRESH: {
            target: 'initializingProvider',
          },
        },
      },
      executingConsolidation: {
        tags: ['consolidating'],
        invoke: {
          src: 'submitAll',
          onDone: {
            actions: ['navigateToHome'],
            target: 'idle',
          },
          onError: {
            target: 'initializingProvider',
          },
        },
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
      assignShouldNotConsolidate: assign(() => ({
        shouldConsolidate: false,
      })),
      assignCoins: assign((_ctx, ev) => ({
        coins: ev.data,
      })),
      assignConsolidation: assign((_ctx, ev) => ({
        consolidation: {
          txs: ev.data.txs,
          submitAll: ev.data.submitAll,
        },
      })),
      navigateToHome: () => {
        // This will be configured in the component
      },
    },
    services: {
      getProviderUrl: async () => {
        console.log('getProviderUrl');
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
      createConsolidation: async (ctx) => {
        const consolidation = await ConsolidateCoinsService.createConsolidation(
          {
            providerUrl: ctx.providerUrl,
            account: ctx.account as Account,
            coins: ctx.coins,
          }
        );
        return consolidation;
      },
      submitAll: async (ctx) => {
        const submitAll = await ctx.consolidation.submitAll();
        return submitAll;
      },
    },
  }
);

export type ConsolidateCoinsMachine = typeof consolidateCoinsMachine;
export type ConsolidateCoinsMachineService =
  InterpreterFrom<ConsolidateCoinsMachine>;
export type ConsolidateCoinsMachineState = StateFrom<ConsolidateCoinsMachine>;
