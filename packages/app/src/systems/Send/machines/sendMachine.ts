import type { BN, TransactionRequest } from 'fuels';
import {
  type InterpreterFrom,
  type StateFrom,
  assign,
  createMachine,
} from 'xstate';
import { FetchMachine, assignError } from '~/systems/Core';
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
  baseFee?: BN;
  regularTip?: BN;
  fastTip?: BN;
  gasLimit?: BN;
  maxGasLimit?: BN;
  input?: TxInputs['createTransfer'];
  error?: string;
};

type EstimateGasLimitAndDefaultTipsReturn = {
  regularTip: BN;
  fastTip: BN;
  maxGasLimit: BN;
};

type CreateTransactionReturn = {
  baseFee?: BN;
  gasLimit?: BN;
  transactionRequest?: TransactionRequest;
  providerUrl: string;
  address: string;
};

type MachineServices = {
  createTransactionRequest: {
    data: CreateTransactionReturn;
  };
  estimatingGasLimitAndDefaultTips: {
    data: EstimateGasLimitAndDefaultTipsReturn;
  };
};

type MachineEvents =
  | { type: 'RESET'; input: null }
  | { type: 'BACK'; input: null }
  | { type: 'SET_INPUT'; input: TxInputs['createTransfer'] }
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
    initial: 'estimatingGasLimitAndDefaultTips',
    states: {
      estimatingGasLimitAndDefaultTips: {
        invoke: {
          src: 'estimatingGasLimitAndDefaultTips',
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'idle',
              actions: [assignError()],
            },
            {
              actions: ['assignGasLimitAndDefaultTips'],
              target: 'idle',
            },
          ],
        },
      },
      idle: IDLE_STATE,
      creatingTx: {
        invoke: {
          src: 'createTransactionRequest',
          data: (ctx: MachineContext) => ({
            input: ctx.input,
          }),
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
      changingInput: {
        on: {
          SET_INPUT: {
            actions: ['assignInput'],
            target: 'changingInput',
          },
        },
        after: {
          1000: {
            target: 'creatingTx',
          },
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
        actions: ['goToHome'],
        target: 'idle',
      },
      SET_INPUT: { actions: ['assignInput'], target: 'changingInput' },
    },
  },
  {
    actions: {
      assignGasLimitAndDefaultTips: assign((_ctx, ev) => ({
        regularTip: ev.data.regularTip,
        fastTip: ev.data.fastTip,
        maxGasLimit: ev.data.maxGasLimit,
        error: undefined,
      })),
      assignInput: assign((_ctx, ev) => ({
        input: ev.input,
      })),
      assignTransactionData: assign((ctx, ev) => ({
        transactionRequest: ev.data.transactionRequest,
        providerUrl: ev.data.providerUrl,
        address: ev.data.address,
        baseFee: ev.data.baseFee ?? ctx.baseFee,
        gasLimit: ev.data.gasLimit ?? ctx.gasLimit,
        error: undefined,
      })),
    },
    services: {
      estimatingGasLimitAndDefaultTips: FetchMachine.create<
        never,
        EstimateGasLimitAndDefaultTipsReturn
      >({
        showError: false,
        maxAttempts: 1,
        async fetch() {
          const estimated = await TxService.estimateGasLimitAndDefaultTips();
          return estimated;
        },
      }),
      createTransactionRequest: FetchMachine.create<
        TxInputs['createTransfer'],
        CreateTransactionReturn
      >({
        showError: false,
        maxAttempts: 1,
        async fetch({ input }) {
          const transfer = await TxService.createTransfer(input);
          return transfer;
        },
      }),
    },
  }
);

export type SendMachine = typeof sendMachine;
export type SendMachineService = InterpreterFrom<SendMachine>;
export type SendMachineState = StateFrom<SendMachine>;
