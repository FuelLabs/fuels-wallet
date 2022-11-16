import type {
  BN,
  TransactionRequest,
  TransactionResponse,
  WalletUnlocked,
} from 'fuels';
import { calculateTransactionFee, Provider } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { send } from 'xstate/lib/actions';

import type { UnlockMachine, UnlockMachineEvents } from './unlockMachine';
import { unlockMachineErrorAction, unlockMachine } from './unlockMachine';

import type { AccountInputs } from '~/systems/Account';
import type { ChildrenMachine } from '~/systems/Core';
import { assignErrorMessage, FetchMachine } from '~/systems/Core';
import type { VMApiError } from '~/systems/Transaction';

type MachineContext = {
  unlockError?: string;
  tx?: TransactionRequest;
  origin?: string;
  providerUrl?: string;
  error?: string;
  fee?: BN;
  approvedTx?: TransactionResponse;
  txDryRunError?: VMApiError;
  txApproveError?: VMApiError;
};

type MachineServices = {
  sendTransaction: {
    data: TransactionResponse;
  };
  calculateFee: {
    data: BN;
  };
  fetchGasPrice: {
    data: BN;
  };
};

type MachineEvents =
  | {
      type: 'START_REQUEST';
      input?: {
        tx: TransactionRequest;
        origin: string;
        providerUrl: string;
      };
    }
  | {
      type: 'APPROVE';
      input?: void;
    }
  | {
      type: 'REJECT';
      input?: void;
    }
  | { type: 'UNLOCK_WALLET'; input: AccountInputs['unlock'] }
  | { type: 'CLOSE_UNLOCK'; input?: void };

export const transactionMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./transactionMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          START_REQUEST: {
            actions: ['assignTxRequestData'],
            target: 'settingGasPrice',
          },
        },
      },
      settingGasPrice: {
        invoke: {
          src: 'fetchGasPrice',
          data: (ctx: MachineContext) => ({
            input: { tx: ctx.tx, providerUrl: ctx.providerUrl },
          }),
          onDone: [
            {
              target: 'calculatingGas',
              actions: ['assignGasPrice'],
            },
          ],
        },
      },
      calculatingGas: {
        invoke: {
          src: 'calculateFee',
          data: (ctx: MachineContext) => ({
            input: { tx: ctx.tx, providerUrl: ctx.providerUrl },
          }),
          onDone: [
            {
              actions: ['assignTxDryRunError'],
              target: 'failed',
              cond: FetchMachine.hasError,
            },
            {
              target: 'waitingApproval',
              actions: ['assignFee'],
            },
          ],
        },
      },
      waitingApproval: {
        on: {
          APPROVE: 'unlocking',
        },
      },
      unlocking: {
        invoke: {
          id: 'unlock',
          src: unlockMachine,
          data: (
            _: MachineContext,
            ev: Extract<MachineEvents, { type: 'UNLOCK_WALLET' }>
          ) => ev.input,
          onDone: [
            unlockMachineErrorAction('unlocking', 'unlockError'),
            {
              target: 'sendingTx',
            },
          ],
        },
        on: {
          UNLOCK_WALLET: {
            // send to the child machine
            actions: [
              send<MachineContext, UnlockMachineEvents>(
                (_, ev) => ({
                  type: 'UNLOCK_WALLET',
                  input: ev.input,
                }),
                { to: 'unlock' }
              ),
            ],
          },
          CLOSE_UNLOCK: {
            target: 'waitingApproval',
          },
        },
      },
      sendingTx: {
        invoke: {
          src: 'sendTransaction',
          data: {
            input: (_: MachineContext, ev: { data: WalletUnlocked }) => {
              return { tx: _.tx, wallet: ev.data, providerUrl: _.providerUrl };
            },
          },
          onDone: [
            {
              target: 'failed',
              actions: ['assignTransactionRequestError'],
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignApprovedTx'],
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
    on: {
      REJECT: {
        actions: [assignErrorMessage('User rejected the transaction!')],
        target: 'failed',
      },
    },
  },
  {
    actions: {
      assignTxRequestData: assign((_, ev) => {
        const { tx, origin, providerUrl } = ev.input || {};

        if (!providerUrl) {
          throw new Error('providerUrl is required');
        }
        if (!tx) {
          throw new Error('transaction is required');
        }
        if (!origin) {
          throw new Error('origin is required');
        }

        return {
          tx,
          origin,
          providerUrl,
        };
      }),
      assignGasPrice: assign((ctx, ev) => {
        if (!ctx.tx) {
          throw new Error('Transaction is required');
        }

        ctx.tx.gasPrice = ev.data;

        return ctx;
      }),
      assignApprovedTx: assign({
        approvedTx: (_, ev) => ev.data,
      }),
      assignTxDryRunError: assign({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        txDryRunError: (_, ev: any) => ev.data.error,
      }),
      assignTransactionRequestError: assign({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        txApproveError: (_, ev: any) => ev.data.error,
      }),
      assignFee: assign({
        fee: (_, ev) => ev.data,
      }),
    },
    services: {
      sendTransaction: FetchMachine.create<
        {
          tx: TransactionRequest;
          wallet: WalletUnlocked;
          providerUrl?: string;
        },
        MachineServices['sendTransaction']['data']
      >({
        showError: true,
        async fetch(params) {
          const { input } = params;
          if (!input?.wallet || !input?.tx) {
            throw new Error('Invalid approveTx input');
          }

          input.wallet.provider = new Provider(input.providerUrl || '');
          const transactionResponse = await input?.wallet.sendTransaction(
            input.tx
          );

          return transactionResponse;
        },
      }),
      calculateFee: FetchMachine.create<
        { tx: TransactionRequest; providerUrl?: string },
        MachineServices['calculateFee']['data']
      >({
        showError: false,
        async fetch({ input }) {
          if (!input?.tx) {
            throw new Error('Invalid calculateFee input');
          }

          const provider = new Provider(input.providerUrl || '');
          const { receipts } = await provider.call(input.tx);

          const { fee } = calculateTransactionFee({
            receipts,
            gasPrice: input.tx.gasPrice,
          });

          return fee;
        },
      }),
      fetchGasPrice: FetchMachine.create<
        { providerUrl?: string },
        MachineServices['fetchGasPrice']['data']
      >({
        showError: false,
        async fetch({ input }) {
          if (!input?.providerUrl) {
            throw new Error('providerUrl is required');
          }
          const provider = new Provider(input.providerUrl || '');
          const { minGasPrice } = await provider.getNodeInfo();
          return minGasPrice;
        },
      }),
    },
  }
);

export type TransactionMachine = typeof transactionMachine;
export type TransactionMachineService = InterpreterFrom<
  typeof transactionMachine
>;
export type TransactionMachineState = StateFrom<typeof transactionMachine> &
  ChildrenMachine<{
    unlock: UnlockMachine;
  }>;
