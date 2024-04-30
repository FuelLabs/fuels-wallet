import { type BN, type TransactionRequest, bn } from 'fuels';
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
  maxFee?: BN;
  regularTip?: BN;
  fastTip?: BN;
  baseAssetId?: string;
  error?: string;
};

type EstimateInitialFeeReturn = {
  maxFee: BN;
  regularTip: BN;
  fastTip: BN;
  baseAssetId: string;
};

type CreateTransactionReturn = {
  transactionRequest: TransactionRequest;
  providerUrl: string;
  address: string;
  maxFee: BN;
  gasLimit: BN;
};

type MachineServices = {
  createTransactionRequest: {
    data: CreateTransactionReturn;
  };
  estimateInitialFee: {
    data: EstimateInitialFeeReturn;
  };
};

type MachineEvents =
  | { type: 'RESET'; input: null }
  | { type: 'BACK'; input: null }
  | { type: 'SET_DATA'; input: TxInputs['createTransfer'] }
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
    initial: 'estimatingInitialFee',
    states: {
      estimatingInitialFee: {
        invoke: {
          src: 'estimateInitialFee',
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'idle',
              actions: [assignError()],
            },
            {
              actions: ['assignInitialFee', 'assignBaseAssetId'],
              target: 'idle',
            },
          ],
        },
      },
      idle: IDLE_STATE,
      creatingTx: {
        invoke: {
          src: 'createTransactionRequest',
          data: (_ctx: MachineContext, { input }: MachineEvents) => ({
            input,
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
      assignInitialFee: assign((_, ev) => ({
        maxFee: ev.data.maxFee,
        regularTip: ev.data.regularTip,
        fastTip: ev.data.fastTip,
      })),
      assignBaseAssetId: assign((_ctx, ev) => ({
        baseAssetId: ev.data.baseAssetId,
      })),
      assignTransactionData: assign((_ctx, ev) => ({
        transactionRequest: ev.data.transactionRequest,
        providerUrl: ev.data.providerUrl,
        address: ev.data.address,
        maxFee: ev.data.maxFee,
        gasLimit: ev.data.gasLimit,
      })),
    },
    services: {
      estimateInitialFee: FetchMachine.create<never, EstimateInitialFeeReturn>({
        showError: false,
        maxAttempts: 1,
        async fetch() {
          const initialFees = await TxService.estimateInitialFee();
          return initialFees;
        },
      }),
      createTransactionRequest: FetchMachine.create<
        TxInputs['createTransfer'],
        CreateTransactionReturn | null
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
