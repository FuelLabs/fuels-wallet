import type {
  AccountWithBalance,
  FuelProviderConfig,
} from '@fuel-wallet/types';
import type { BN, TransactionRequest, TransactionSummary } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { AccountService } from '~/systems/Account';
import { FetchMachine, assignErrorMessage, delay } from '~/systems/Core';
import NameSystemService from '~/systems/NameSystem/services/nameSystem';
import { getDomainByOperations } from '~/systems/NameSystem/utils/getDomainByOperations';
import { NetworkService } from '~/systems/Network';
import type { GroupedErrors, VMApiError } from '~/systems/Transaction';
import type { TxInputs } from '~/systems/Transaction/services';
import { TxService } from '~/systems/Transaction/services';

export enum TxRequestStatus {
  inactive = 'inactive',
  idle = 'idle',
  loading = 'loading',
  waitingApproval = 'waitingApproval',
  sending = 'sending',
  success = 'success',
  failed = 'failed',
}

type MachineContext = {
  input: {
    origin?: string;
    title?: string;
    favIconUrl?: string;
    isOriginRequired?: boolean;
    providerUrl?: string;
    providerConfig?: FuelProviderConfig;
    transactionRequest?: TransactionRequest;
    address?: string;
    account?: AccountWithBalance;
    tip?: BN;
    gasLimit?: BN;
    skipCustomFee?: boolean;
  };
  response?: {
    txSummarySimulated?: TransactionSummary;
    txSummaryExecuted?: TransactionSummary;
    proposedTxRequest?: TransactionRequest;
  };
  fees: {
    baseFee?: BN;
    regularTip?: BN;
    fastTip?: BN;
    maxGasLimit?: BN;
  };
  errors?: {
    txApproveError?: VMApiError;
    simulateTxErrors?: GroupedErrors;
  };
};

type PrepareFeeInputForSimulateTransactionReturn = {
  estimated: {
    regularTip: BN;
    fastTip: BN;
    maxGasLimit: BN;
  };
  account: AccountWithBalance;
};

type SimulateTransactionReturn = {
  baseFee?: BN;
  txSummary: TransactionSummary;
  simulateTxErrors?: GroupedErrors;
  proposedTxRequest?: TransactionRequest;
};

type MachineServices = {
  send: {
    data: TransactionSummary;
  };
  prepareFeeInputs: {
    data: PrepareFeeInputForSimulateTransactionReturn;
  };
  simulateTransaction: {
    data: SimulateTransactionReturn;
  };
};

type MachineEvents =
  | { type: 'START'; input?: TxInputs['request'] }
  | { type: 'SET_CUSTOM_FEES'; input: TxInputs['setCustomFees'] }
  | { type: 'RESET'; input?: null }
  | { type: 'APPROVE'; input?: null }
  | { type: 'REJECT'; input?: null }
  | { type: 'TRY_AGAIN'; input?: null }
  | { type: 'CLOSE'; input?: null };

export const transactionRequestMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./transactionRequestMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'idle',
    context: {
      input: {},
      fees: {},
    },
    states: {
      idle: {
        on: {
          START: [
            {
              cond: (_ctx, event) =>
                event.input?.skipCustomFee ||
                // has informed custom fees
                (event.input?.fees?.maxGasLimit != null &&
                  event.input?.fees?.fastTip != null &&
                  event.input?.fees?.regularTip != null),
              actions: ['assignTxRequestData'],
              target: 'simulatingTransaction',
            },
            {
              actions: ['assignTxRequestData'],
              target: 'simulatingTransactionEvaluatingFirstFees',
            },
          ],
        },
      },
      simulatingTransaction: {
        on: {
          SET_CUSTOM_FEES: {
            actions: ['assignCustomFees'],
            target: 'changingCustomFees',
          },
        },
        entry: ['openDialog'],
        tags: ['simulating'],
        invoke: {
          src: 'simulateTransaction',
          data: {
            input: (ctx: MachineContext) => ctx.input,
          },
          onDone: [
            {
              target: 'waitingApproval',
              actions: ['assignSimulateResult', 'assignSimulateTxErrors'],
            },
          ],
        },
      },
      simulatingTransactionLoading: {
        on: {
          SET_CUSTOM_FEES: {
            actions: ['assignCustomFees'],
            target: 'changingCustomFees',
          },
        },
        entry: ['openDialog'],
        tags: ['loading', 'simulating'],
        invoke: {
          src: 'simulateTransaction',
          data: {
            input: (ctx: MachineContext) => ctx.input,
          },
          onDone: [
            {
              target: 'waitingApproval',
              actions: ['assignSimulateResult', 'assignSimulateTxErrors'],
            },
          ],
        },
      },
      simulatingTransactionEvaluatingFirstFees: {
        entry: ['openDialog'],
        tags: ['simulating'],
        invoke: {
          src: 'simulateTransaction',
          data: {
            input: (ctx: MachineContext) => ctx.input,
          },
          onDone: [
            {
              target: 'prepareFeeInputs',
              actions: ['assignSimulateResult', 'assignSimulateTxErrors'],
            },
          ],
        },
      },
      prepareFeeInputs: {
        tags: ['loadingFees'],
        invoke: {
          src: 'prepareFeeInputs',
          data: {
            input: (ctx: MachineContext) => ({
              address: ctx.input.address,
              account: ctx.input.account,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['assignFeeInputForSimulate'],
              target: 'waitingApproval',
            },
          ],
        },
      },
      changingCustomFees: {
        tags: ['loading'],
        on: {
          SET_CUSTOM_FEES: {
            actions: ['assignCustomFees'],
            target: 'changingCustomFees',
          },
        },
        after: {
          1000: {
            target: 'simulatingTransactionLoading',
          },
        },
      },
      waitingApproval: {
        on: {
          APPROVE: {
            target: 'sendingTx',
          },
          REJECT: {
            actions: [assignErrorMessage('User rejected the transaction!')],
            target: 'failed',
          },
          SET_CUSTOM_FEES: {
            actions: ['assignCustomFees'],
            target: 'changingCustomFees',
          },
        },
      },
      sendingTx: {
        tags: ['loading'],
        invoke: {
          src: 'send',
          data: {
            input: (ctx: MachineContext) => ({
              ...ctx.input,
              transactionRequest: ctx.response?.proposedTxRequest,
            }),
          },
          onDone: [
            {
              target: 'failed',
              actions: ['assignTxApproveError'],
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignApprovedTx'],
              target: 'txSuccess',
            },
          ],
        },
      },
      txSuccess: {
        on: {
          CLOSE: {
            target: 'done',
          },
        },
      },
      txFailed: {
        on: {
          TRY_AGAIN: {
            target: 'waitingApproval',
          },
          CLOSE: {
            target: 'failed',
          },
          SET_CUSTOM_FEES: {
            actions: ['assignCustomFees'],
            target: 'changingCustomFees',
          },
        },
      },
      done: {
        type: 'final',
      },
      failed: {
        type: 'final',
      },
    },
    on: {
      RESET: {
        actions: ['reset'],
        target: 'idle',
      },
    },
  },
  {
    actions: {
      reset: assign(() => ({})),
      assignFeeInputForSimulate: assign((ctx, ev) => ({
        account: ev.data.account,
        fees: {
          ...ctx.fees,
          regularTip: ev.data.estimated.regularTip,
          fastTip: ev.data.estimated.fastTip,
          maxGasLimit: ev.data.estimated.maxGasLimit,
        },
      })),
      assignTxRequestData: assign({
        input: (ctx, ev) => {
          if (!ev.input?.providerConfig) {
            throw new Error('providerConfig is required');
          }
          if (!ev.input?.account?.address && !ev.input?.address) {
            throw new Error('account or address is required');
          }
          if (!ev.input?.transactionRequest) {
            throw new Error('transaction is required');
          }
          if (ctx.input.isOriginRequired && !ev.input?.origin) {
            throw new Error('origin is required');
          }

          return {
            ...ev.input,
          };
        },
        fees: (_ctx, ev) => {
          const { fees } = ev.input || {};
          return {
            baseFee: fees?.baseFee,
            regularTip: fees?.regularTip,
            fastTip: fees?.fastTip,
            maxGasLimit: fees?.maxGasLimit,
          };
        },
      }),
      assignCustomFees: assign({
        input: (ctx, ev) => {
          const { tip, gasLimit } = ev.input || {};

          return {
            ...ctx.input,
            tip,
            gasLimit,
            // clean possible previous initial txSummary coming from ts-sdk
            transactionSummary: undefined,
          };
        },
      }),
      assignApprovedTx: assign({
        response: (ctx, ev) => ({
          ...ctx.response,
          txSummaryExecuted: ev.data,
        }),
      }),
      assignSimulateResult: assign({
        response: (ctx, ev) => ({
          ...ctx.response,
          txSummarySimulated: ev.data.txSummary,
          proposedTxRequest: ev.data.proposedTxRequest,
        }),
        fees: (ctx, ev) => ({
          ...ctx.fees,
          baseFee: ev.data.baseFee ?? ctx.fees.baseFee,
        }),
      }),
      assignSimulateTxErrors: assign((ctx, ev) => {
        return {
          ...ctx,
          errors: {
            ...ctx.errors,
            simulateTxErrors: ev.data.simulateTxErrors,
          },
        };
      }),
      assignTxApproveError: assign((ctx, ev) => {
        return {
          ...ctx,
          errors: {
            ...ctx.errors,
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            txApproveError: (ev.data as any)?.error,
          },
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          error: (ev.data as any)?.error,
        };
      }),
    },
    services: {
      prepareFeeInputs: FetchMachine.create<
        { address?: string; account?: AccountWithBalance },
        {
          estimated: PrepareFeeInputForSimulateTransactionReturn['estimated'];
          account: AccountWithBalance;
        }
      >({
        showError: false,
        maxAttempts: 1,
        async fetch({ input }) {
          console.log('asd prepareFeeInputs', input);
          const [estimated, acc] = await Promise.all([
            TxService.estimateGasLimitAndDefaultTips(),
            input?.account ||
              AccountService.fetchAccount({
                address: input?.address as string,
              }).then(async (_account) => {
                const network = await NetworkService.getSelectedNetwork();
                return await AccountService.fetchBalance({
                  account: _account,
                  providerUrl: network?.url as string,
                });
              }),
          ]);
          return { estimated, account: acc };
        },
      }),
      simulateTransaction: FetchMachine.create<
        TxInputs['simulateTransaction'],
        SimulateTransactionReturn
      >({
        showError: false,
        async fetch({ input }) {
          console.log('asd simulateTransaction', input);
          if (!input?.transactionRequest) {
            throw new Error('Invalid simulateTransaction input');
          }

          const simulatedInfo = await TxService.simulateTransaction(input);

          const operationsWithDomain = await getDomainByOperations(
            simulatedInfo.txSummary.operations
          );

          return {
            ...simulatedInfo,
            txSummary: {
              ...simulatedInfo.txSummary,
              operations: operationsWithDomain,
            },
          };
        },
      }),
      send: FetchMachine.create<
        TxInputs['send'],
        MachineServices['send']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch(params) {
          console.log('asd send', params);
          const { input } = params;
          if (
            (!input?.account && !input?.address) ||
            !input?.transactionRequest ||
            (!input?.providerUrl && !input?.providerConfig)
          ) {
            throw new Error('Invalid approveTx input');
          }
          const txResponse = await TxService.send(input);
          const txSummary = await txResponse.getTransactionSummary();

          const operationsWithDomain = await getDomainByOperations(
            txSummary.operations
          );

          return {
            ...txSummary,
            operations: operationsWithDomain,
            // Adding 1 magical unit to match the fake unit that is added on TS SDK (.add(1))
            fee: txSummary.fee.add(1),
          };
        },
      }),
    },
  }
);

export type TransactionRequestMachine = typeof transactionRequestMachine;
export type TransactionRequestService =
  InterpreterFrom<TransactionRequestMachine>;
export type TransactionRequestState = StateFrom<TransactionRequestMachine>;
