import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { AccountService } from '~/systems/Account';
import { FetchMachine, assignErrorMessage } from '~/systems/Core';
import type { VaultInputs } from '~/systems/Vault';
import { VaultService } from '~/systems/Vault';

type MachineContext = {
  account?: Account;
  message?: string;
  address?: string;
  origin?: string;
  title?: string;
  favIconUrl?: string;
  error?: string;
  signedMessage?: string;
};

type MachineServices = {
  signMessage: {
    data: string;
  };
  fetchAccount: {
    data: Account;
  };
};

export type SignInputs = {
  start: {
    origin: string;
    title?: string;
    favIconUrl?: string;
    message: string;
    address: string;
  };
};

type MachineEvents =
  | {
      type: 'START';
      input: SignInputs['start'];
    }
  | { type: 'SIGN_MESSAGE' }
  | { type: 'REJECT' };

export const messageRequestMachine = createMachine(
  {
    predictableActionArguments: true,

    tsTypes: {} as import('./messageRequestMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'idle',
    context: {},
    states: {
      idle: {
        on: {
          START: {
            actions: ['assignSignData'],
            target: 'fetchingAccount',
          },
        },
      },
      fetchingAccount: {
        invoke: {
          src: 'fetchAccount',
          data: {
            input: (ctx: MachineContext) => ({ address: ctx.address }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['assignAccount'],
              target: 'reviewMessage',
            },
          ],
        },
      },
      reviewMessage: {
        on: {
          SIGN_MESSAGE: {
            target: 'signingMessage',
          },
          REJECT: {
            actions: [assignErrorMessage('Rejected request!')],
            target: 'failed',
          },
        },
      },
      signingMessage: {
        invoke: {
          src: 'signMessage',
          data: {
            input: (ctx: MachineContext) => ({
              message: ctx.message,
              address: ctx.address,
            }),
          },
          onDone: [
            FetchMachine.errorState('failed'),
            {
              actions: ['assignSignedMessage'],
              target: 'done',
            },
          ],
        },
      },
      done: {
        type: 'final',
      },
      failed: {},
    },
  },
  {
    delays: { TIMEOUT: 10000 },
    actions: {
      assignSignedMessage: assign({
        signedMessage: (_, ev) => ev.data,
      }),
      assignSignData: assign((ctx, ev) => ({
        ...ctx,
        message: ev.input.message,
        address: ev.input.address,
        origin: ev.input.origin,
        title: ev.input.title,
        favIconUrl: ev.input.favIconUrl,
      })),
      assignAccount: assign({
        account: (_, ev) => ev.data,
      }),
    },
    services: {
      signMessage: FetchMachine.create<VaultInputs['signMessage'], string>({
        showError: true,
        async fetch({ input }) {
          if (!input?.address || !input?.message) {
            throw new Error('Invalid network input');
          }
          return VaultService.signMessage(input);
        },
      }),
      fetchAccount: FetchMachine.create<{ address: string }, Account>({
        showError: true,
        async fetch({ input }) {
          if (!input?.address) {
            throw new Error('Invalid fetchAccount input');
          }
          return AccountService.fetchAccount({
            address: input.address,
          });
        },
      }),
    },
  }
);

export type MessageRequestMachine = typeof messageRequestMachine;
export type MessageRequestService = InterpreterFrom<
  typeof messageRequestMachine
>;
export type MessageRequestState = StateFrom<typeof messageRequestMachine>;
