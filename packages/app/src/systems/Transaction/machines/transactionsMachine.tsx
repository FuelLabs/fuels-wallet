import type { Transaction } from 'fuels';
import { createMachine } from 'xstate';

type MachineContext = {
  walletAddress: string;
  txs: Transaction[];
  error?: string;
};

type MachineServices = {
  fetchTxs: {
    data: Transaction[];
  };
};

type MachineEvents = {
  type: 'reload';
};

export const transactionsMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./transactionsMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: 'FETCH ADDRESS TRANSACTIONS',
    initial: 'INITIAL STATE',
    states: {
      LOADING_ADDRESS_TXS: {
        invoke: {
          src: 'fetchTxs',
          onDone: [
            {
              target: 'ADDRESS_HAS_NO_TXS',
              cond: 'txsIsEmpty',
            },
            {
              target: 'ADDRESS_TXS',
            },
          ],
          onError: [
            {
              target: 'ERROR_DETAILS',
            },
          ],
        },
      },
      ADDRESS_HAS_NO_TXS: {},
      ERROR_DETAILS: {
        on: {
          reload: {
            target: 'LOADING_ADDRESS_TXS',
          },
        },
      },
      ADDRESS_TXS: {},
      'INITIAL STATE': {
        always: {
          target: 'LOADING_ADDRESS_TXS',
        },
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    guards: {},
    actions: {},
    services: {},
  }
);

export type TransactionsMachine = typeof transactionsMachine;
