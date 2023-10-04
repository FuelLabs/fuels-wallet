/* eslint-disable @typescript-eslint/consistent-type-imports */
import { BN, Provider, TransactionRequest } from 'fuels';
import { assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';
import { AccountService } from '~/systems/Account';
import { FetchMachine, WalletLockedCustom } from '~/systems/Core';
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
  tags: ['selecting'],
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
        tags: ['isLoadingInitialFee'],
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
              target: 'idle',
            },
          ],
        },
      },
    },
    on: {
      BACK: {
        target: 'idle',
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
        return TxService.isValidTransaction({ ...input, fee });
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
          const { txResult } = await TxService.createFakeTx();
          return txResult.fee;
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
          const [network, account] = await Promise.all([
            NetworkService.getSelectedNetwork(),
            AccountService.getCurrentAccount(),
          ]);

          if (!to || !assetId || !amount || !network?.url || !account) {
            throw new Error('Missing params for transaction request');
          }
          const provider = await Provider.create(network.url);
          const wallet = new WalletLockedCustom(account.address, provider);
          const createOpts = { to, amount, assetId, provider: wallet.provider };
          const transactionRequest = await TxService.fundTransaction({
            transactionRequest: await TxService.createTransfer(createOpts),
            wallet,
          });

          return {
            address: wallet.address.toString(),
            transactionRequest,
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
