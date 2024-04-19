import { type BN, Provider, type TransactionRequest, bn } from 'fuels';
import {
  type InterpreterFrom,
  type StateFrom,
  assign,
  createMachine,
} from 'xstate';
import { AccountService } from '~/systems/Account';
import { FetchMachine, WalletLockedCustom, assignError } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { type TxInputs, TxService } from '~/systems/Transaction/services';

export enum SendScreens {
  select = 0,
  confirm = 1,
  success = 2,
  failed = 3,
}

export type MachineContext = {
  transactionRequest?: TransactionRequest;
  providerUrl?: string;
  address?: string;
  regularFee?: BN;
  fastFee?: BN;
  error?: string;
  currentFeeType?: 'regular' | 'fast' | 'custom';
};

type CreateTransactionReturn = {
  transactionRequest: TransactionRequest;
  providerUrl: string;
  address: string;
  regularFee: BN;
  fastFee: BN;
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
  | { type: 'CONFIRM'; input: null }
  | { type: 'USE_REGULAR_FEE'; input: null }
  | { type: 'USE_FAST_FEE'; input: null };

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
          USE_REGULAR_FEE: {
            actions: ['assignIsRegularFee'],
          },
          USE_FAST_FEE: {
            actions: ['assignIsFastFee'],
          },
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
      assignTransactionData: assign((ctx, ev) => ({
        transactionRequest: ev.data.transactionRequest,
        providerUrl: ev.data.providerUrl,
        address: ev.data.address,
        currentFeeType: !ctx.currentFeeType
          ? ('regular' as const)
          : ctx.currentFeeType,
        regularFee: ev.data.regularFee,
        fastFee: ev.data.fastFee,
      })),
      assignIsRegularFee: assign((ctx) => {
        const transactionRequest = ctx.transactionRequest;
        if (!transactionRequest) return ctx;

        transactionRequest.maxFee = ctx.regularFee;
        return {
          currentFeeType: 'regular' as const,
          transactionRequest,
        };
      }),
      assignIsFastFee: assign((ctx) => {
        const transactionRequest = ctx.transactionRequest;
        if (!transactionRequest) return ctx;

        transactionRequest.maxFee = ctx.fastFee;
        return {
          currentFeeType: 'fast' as const,
          transactionRequest,
        };
      }),
    },
    services: {
      createTransactionRequest: FetchMachine.create<
        TxInputs['isValidTransaction'],
        CreateTransactionReturn | null
      >({
        showError: false,
        maxAttempts: 1,
        async fetch({ input }) {
          const transfer = await TxService.createTransfer({
            to: input?.address,
            amount: input?.amount,
            assetId: input?.asset?.assetId,
          });

          return transfer;
        },
      }),
    },
  }
);

export type SendMachine = typeof sendMachine;
export type SendMachineService = InterpreterFrom<SendMachine>;
export type SendMachineState = StateFrom<SendMachine>;
