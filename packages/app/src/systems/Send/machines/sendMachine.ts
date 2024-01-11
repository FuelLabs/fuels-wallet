/* eslint-disable @typescript-eslint/consistent-type-imports */
import { BN, Provider, TransactionRequest } from 'fuels';
import { assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';
import { AccountService } from '~/systems/Account';
import { FetchMachine, assignError } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { TxInputs, TxService } from '~/systems/Transaction/services';

export enum SendScreens {
  select,
  confirm,
  success,
  failed,
}

export type MachineContext = {
  transactionRequest?: TransactionRequest;
  providerUrl?: string;
  address?: string;
  fee?: BN;
  error?: string;
};

type CreateTransactionReturn = {
  transactionRequest: TransactionRequest;
  providerUrl: string;
  address: string;
  fee: BN;
};

type MachineServices = {
  createTransactionRequest: {
    data: CreateTransactionReturn;
  };
};

type MachineEvents =
  | { type: 'RESET'; input: null }
  | { type: 'BACK'; input: null }
  | { type: 'SET_DATA'; input: TxInputs['isValidTransaction'] }
  | { type: 'CONFIRM'; input: null };

const IDLE_STATE = {
  tags: ['selecting'],
  on: {
    BACK: {
      actions: ['goToHome'],
    },
  },
};

export const sendMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./sendMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
      services: {} as MachineServices,
    },
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: IDLE_STATE,
      creatingTx: {
        invoke: {
          src: 'createTransactionRequest',
          data: (_: MachineContext, { input }: MachineEvents) => ({ input }),
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'idle',
              actions: [assignError()],
            },
            {
              actions: ['assignTransactionData'],
              target: 'readyToSend',
            },
          ],
        },
      },
      readyToSend: {
        on: {
          CONFIRM: { actions: ['callTransactionRequest'] },
        },
      },
    },
    on: {
      BACK: {
        target: 'idle',
      },
      SET_DATA: { target: 'creatingTx' },
    },
  },
  {
    actions: {
      assignTransactionData: assign((_, ev) => ({
        transactionRequest: ev.data.transactionRequest,
        providerUrl: ev.data.providerUrl,
        address: ev.data.address,
        fee: ev.data.fee,
      })),
    },
    services: {
      createTransactionRequest: FetchMachine.create<
        TxInputs['isValidTransaction'],
        CreateTransactionReturn | null
      >({
        showError: false,
        maxAttempts: 1,
        async fetch({ input }) {
          const to = input?.address;
          const assetId = input?.asset?.assetId;
          const { amount } = input || {};
          const [network, account] = await Promise.all([
            NetworkService.getSelectedNetwork(),
            AccountService.getCurrentAccount(),
          ]);

          if (!to || !assetId || !amount || !network?.url || !account) {
            throw new Error('Missing params for transaction request');
          }

          const provider = await Provider.create(network.url);
          const transferRequest = await TxService.createTransfer({
            to,
            amount,
            assetId,
            provider,
          });
          const { fee, transactionRequest } =
            await TxService.resolveTransferCosts({
              account,
              transferRequest,
              amount,
              assetId,
              provider,
            });

          return {
            fee,
            transactionRequest,
            address: account.address,
            providerUrl: network.url,
          };
        },
      }),
    },
  }
);

export type SendMachine = typeof sendMachine;
export type SendMachineService = InterpreterFrom<SendMachine>;
export type SendMachineState = StateFrom<SendMachine>;
