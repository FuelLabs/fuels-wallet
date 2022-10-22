import { toast } from '@fuel-ui/react';
import type { Wallet } from 'fuels';
import type { StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { TxInputs } from '../services';
import { TxService } from '../services';
import type {
  Transaction,
  TxRequest,
  TxResponse,
  TxSimulateResult,
} from '../types';
import { TxStatus, TxType } from '../types';

import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  tx?: Transaction;
  wallet?: Wallet;
  simulateResult?: TxSimulateResult;
  txResponse?: TxResponse;
};

type MachineServices = {
  fetching: {
    data: Transaction | undefined;
  };
  simulate: {
    data: TxSimulateResult | undefined;
  };
  approve: {
    data: TxResponse;
  };
  replace: {
    data: Transaction | undefined;
  };
};

type MachineEvents =
  | {
      type: 'SIMULATE';
      input?: null;
    }
  | {
      type: 'APPROVE';
      input?: null;
    }
  | {
      type: 'GET_TRANSACTION';
      input: TxInputs['get'] & { wallet: Wallet };
    };

export const txMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./txMachine.typegen').Typegen0,
    id: '(machine)',
    initial: 'idle',
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    states: {
      idle: {
        on: {
          GET_TRANSACTION: {
            actions: ['assignWallet'],
            target: 'fetching',
          },
          SIMULATE: {
            target: 'simulating',
          },
          APPROVE: {
            target: 'approving',
          },
        },
      },
      fetching: {
        tags: 'loading',
        invoke: {
          src: 'fetching',
          data: {
            input: (_ctx: MachineContext, ev: MachineEvents) => ev.input?.id,
          },
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              target: 'simulating',
              cond: 'isTxRequest',
              actions: ['assignTx'],
            },
            {
              target: 'idle',
              actions: ['assignTx'],
            },
          ],
        },
      },
      simulating: {
        tags: 'loading',
        invoke: {
          src: 'simulate',
          data: {
            input: (ctx: MachineContext) => ctx,
          },
          onDone: [
            { target: 'idle', cond: FetchMachine.hasError },
            { target: 'idle', actions: ['assignSimulateResult'] },
          ],
        },
      },
      approving: {
        tags: 'loading',
        invoke: {
          src: 'approve',
          data: {
            input: (ctx: MachineContext) => ctx,
          },
          onDone: [
            { target: 'idle', cond: FetchMachine.hasError },
            { target: 'replacing', actions: ['assignTxResponse'] },
          ],
        },
      },
      replacing: {
        tags: 'loading',
        invoke: {
          src: 'replace',
          data: {
            input: (ctx: MachineContext) => ctx,
          },
          onDone: [
            { target: 'idle', cond: FetchMachine.hasError },
            { target: 'sent', actions: ['showSuccessMsg', 'assignTx'] },
          ],
        },
      },
      sent: {},
    },
  },
  {
    actions: {
      assignWallet: assign({
        wallet: (_, ev) => ev.input?.wallet,
      }),
      assignTx: assign((ctx, ev) => ({
        ...ctx,
        tx: ev.data,
      })),
      assignSimulateResult: assign({
        simulateResult: (_, ev) => ev.data,
      }),
      assignTxResponse: assign({
        txResponse: (_, ev) => ev.data,
      }),
      showSuccessMsg: () => {
        toast.success('Transaction send successfully!');
      },
    },
    services: {
      fetching: FetchMachine.create<string, Transaction | undefined>({
        showError: true,
        async fetch({ input: id }) {
          if (!id) {
            throw new Error('Invalid transaction request');
          }
          return TxService.get({ id });
        },
      }),
      simulate: FetchMachine.create<MachineContext, TxSimulateResult>({
        showError: true,
        async fetch({ input }) {
          if (!input?.tx?.data || !input.wallet) {
            throw new Error('Invalid transaction request');
          }
          return TxService.simulate({
            tx: input.tx.data as TxRequest,
            wallet: input.wallet,
          });
        },
      }),
      approve: FetchMachine.create<MachineContext, TxResponse>({
        showError: true,
        async fetch({ input }) {
          if (!input?.tx?.data || !input.wallet) {
            throw new Error('Invalid transaction request');
          }
          return TxService.send({
            tx: input.tx?.data as TxRequest,
            wallet: input.wallet,
          });
        },
      }),
      replace: FetchMachine.create<MachineContext, Transaction | undefined>({
        showError: true,
        async fetch({ input }) {
          if (!input?.tx?.id || !input?.txResponse) {
            throw new Error('Invalid transaction request');
          }
          await TxService.remove({ id: input.tx.id });
          return TxService.add({
            data: input.txResponse,
            type: TxType.response,
            status: TxStatus.pending,
          });
        },
      }),
    },
    guards: {
      isTxRequest: (_, ev) => {
        return ev.data?.type === TxType.request;
      },
    },
  }
);

export type TxMachine = typeof txMachine;
export type TxMachineState = StateFrom<TxMachine>;
