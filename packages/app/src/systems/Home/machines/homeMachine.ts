// eslint-disable @typescript-eslint/no-explicit-any
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { Account } from '~/systems/Account';
import { getBalances } from '~/systems/Account/services/account';
import type { Maybe } from '~/systems/Core';
import { db } from '~/systems/Core';

type MachineContext = {
  account?: Maybe<Account>;
  data?: Maybe<any>;
  error?: string;
};

type MachineServices = {
  getAccount: {
    data: Maybe<Account>;
  };
  getBalances: {
    data: Maybe<Account>;
  };
};

type MachineEvents =
  | { type: 'START_FAUCET'; data: any }


export const homeMachine = createMachine(
  {
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'loadingAccount',
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    states: {
      loadingAccount: {
        tags: ['loadingAccount', 'loading'],
        invoke: {
          src: 'getAccount',
          onDone: {
            actions: ['assignAccount'],
            target: 'loadingBalance',
          },
          onError: {
            actions: 'assignError',
            target: 'failed',
          },
        },
      },
      loadingBalance: {
        tags: ['loadingBalance', 'loading'],
        invoke: {
          src: 'getBalances',
          onDone: {
            actions: ['assignAccount'],
            target: 'idle',
          },
          onError: {
            actions: 'assignError',
            target: 'failed',
          },
        },
      },
      idle: {
      },
      failed: {
        entry: 'assignError',
      },
    }
  },
  {
    actions: {
      assignError: assign({
        error: (_, ev) => ev.data,
      }),
      assignAccount: assign({
        account: (_, ev) => ev.data,
      }),
    },
    services: {
      async getAccount() {
        const accounts = await db.getAccounts();
        return accounts[0];
      },
      async getBalances({ account }) {
        const balances = await getBalances(account?.publicKey);
        const newAccount = await db.setBalance({
          address: account?.address || '',
          balances,
          balanceSymbol: '$',
          balance: BigInt(0)
        });
        return newAccount;
      }
    }
  }
);

export type HomeMachine = typeof homeMachine;
export type HomeMachineService = InterpreterFrom<HomeMachine>;
export type HomeMachineState = StateFrom<HomeMachine>;
