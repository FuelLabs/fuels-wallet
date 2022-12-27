/* eslint-disable @typescript-eslint/consistent-type-imports */
import { BN, TransactionRequest } from 'fuels';
import { assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';

import { AccountService } from '~/systems/Account';
import { ASSET_MAP } from '~/systems/Asset';
import { FetchMachine } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { TxInputs, TxService } from '~/systems/Transaction/services';

export enum SendScreens {
  select,
  confirm,
  success,
  failed,
}

export type MachineContext = {
  fee?: BN;
};

type CreateReturn = {
  transactionRequest: TransactionRequest;
  providerUrl: string;
};

type MachineServices = {
  fetchFakeTx: {
    data: BN;
  };
  createTransactionRequest: {
    data: CreateReturn;
  };
};

type MachineEvents =
  | { type: 'RESET'; input: null }
  | { type: 'BACK'; input: null }
  | { type: 'CONFIRM'; input: TxInputs['isValidTransaction'] };

const IDLE_STATE = {
  on: {
    BACK: {
      actions: ['goToHome'],
    },
    CONFIRM: [
      { target: 'creatingTx', cond: 'isValidTransaction' },
      { target: 'invalid' },
    ],
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
    initial: 'fetchingFakeTx',
    states: {
      fetchingFakeTx: {
        tags: ['loading'],
        invoke: {
          src: 'fetchFakeTx',
          onDone: {
            target: 'idle',
            actions: ['assignInitialFee'],
          },
        },
      },
      idle: IDLE_STATE,
      invalid: IDLE_STATE,
      creatingTx: {
        tags: ['loading'],
        invoke: {
          src: 'createTransactionRequest',
          data: (_: MachineContext, { input }: MachineEvents) => ({ input }),
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['callTransactionRequest'],
              target: 'confirming',
            },
          ],
        },
      },
      confirming: {
        on: {
          BACK: {
            target: 'idle',
          },
        },
      },
    },
  },
  {
    guards: {
      isValidTransaction: (
        { fee }: MachineContext,
        { input }: MachineEvents
      ) => {
        if (!input?.asset) return false;
        const asset = ASSET_MAP[input.asset?.assetId];
        return TxService.isValidTransaction({ ...input, asset, fee });
      },
    },
    actions: {
      assignInitialFee: assign({
        fee: (_, ev) => ev.data,
      }),
    },
    services: {
      fetchFakeTx: FetchMachine.create<null, BN>({
        showError: false,
        async fetch() {
          return TxService.createFakeTx();
        },
      }),
      createTransactionRequest: FetchMachine.create<
        TxInputs['isValidTransaction'],
        CreateReturn | null
      >({
        showError: true,
        async fetch({ input }) {
          const to = input?.address;
          const assetId = input?.asset?.assetId;
          const { amount } = input || {};
          const network = await NetworkService.getSelectedNetwork();
          const wallet = await AccountService.getWalletLocked();

          if (!to || !assetId || !amount || !network?.url || !wallet) {
            throw new Error('Missing params for transaction request');
          }

          const tx = await TxService.createTransfer({ amount, assetId, to });
          const res = await TxService.fundTransaction({ wallet, tx });
          return {
            transactionRequest: res.request,
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
