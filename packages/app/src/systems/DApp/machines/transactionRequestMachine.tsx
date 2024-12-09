import type { Account } from '@fuel-wallet/types';
import type { BN, TransactionRequest, TransactionSummary } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { AccountService } from '~/systems/Account';
import { FetchMachine, assignErrorMessage, delay } from '~/systems/Core';
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
    address?: string;
    isOriginRequired?: boolean;
    providerUrl?: string;
    transactionRequest?: TransactionRequest;
    account?: Account;
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

type EstimateDefaultTipsReturn = {
  regularTip: BN;
  fastTip: BN;
};

type EstimateGasLimitReturn = {
  maxGasLimit: BN;
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
  estimateDefaultTips: {
    data: EstimateDefaultTipsReturn;
  };
  estimateGasLimit: {
    data: EstimateGasLimitReturn;
  };
  simulateTransaction: {
    data: SimulateTransactionReturn;
  };
  fetchAccount: {
    data: Account;
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
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgCUBRAZQoBUBtABgF1FQAHAe1lwBddO+NiAAeiACwAmADQgAnogCskxQDoAjAHYAnIoBsi7YyONJ6gL7nZaLHkJFVuCABswJKrQCCZBi2FcefkFhMQRJAGY9DRVGU0lNQ3F1cQAOWQUEZTUtXQMjEzNLawwcAmJVOH4MfnwoAEl8Plx0ZwAxMDcIQTBHfAA3TgBrHptS+wrYKvQa+sb+FvawBAIBzGmBfCZmLf9uJuCkUUQ9FPVVRnETzRTGFMjtE-SldXDVSUZw2Mk9bV1fopAozs5QAZmBeGMoJ5MJhOABXfC8EhdQi9AbDVRAsoOMEQuxQmHwxHLfqcNZBTYsHaHAL7ISHULqJmSVSXYx6DnaSQpRSpJ4IU6s37aF6Re7clIArHjXGQ6GwhFIlE9FZDEYlYE48FywmKkmrdaCLb0dSsGl7CkhRBM9QstkPTnc3lpeRKcRqb6SLnxXl6dQpSRSjXY1Q8VBw5zrWq0ABO6HwsCwFOR3TRasxwfGYYjUagsfjicwFP1ZMNlO2fnNgQ2VoQ6j0mhZjbyH004nCvz0-MU4TO1z04R7eg+4iSgasgMz5QA7ugmrVPOx2DHOH0WiRPAAFTdkADyADUKNSOBaawzEO8UikNJp1EZR2OdN2DKojH7nQ3e8kg7YQ7P51CS4rmuzjkBQABSFAAMK+GaJ7VgcoChJe15aHeFyjraT6ugg4RmEKvzGIosSDrcP5jOUsBgPgEAEHmIgpqiqoYtKlHUbR0YiCW5IbMalbwXStYRHcqinColzqIoCTuvylwet84iaAkHwXIwSnkZqobsXRtAMcqaYsVODhUTROlcaqPFGlSpq7Ah9JIRe4QiWJvqSdJijdoo14Ng8jD1pIqSNpKE6sQ4vAiFQcIwnAsAkFBAAyu40MeIC0pa55hEpmispoBhSLovLJB5OFeYwGj6PWmhqbcvziBpIbha0c6uBAJC0GQACaAD6ngAOKeHUAByKVpWeDl1g2TbfIYrbtp2smCtyA7DuEmiRHokjjsUv7jI1zWQHFiXJfxqWnohRwTY2qjNjNq1zQ8-LvGVba-LaV6ueElgTvgnAQHAwihbZgkZQAtF2OEg2owrQzD2gpHo9XjE4rhA+l42SSyG3Ef5sTtv53apKoBh+qtXonKYCMhUZExTDMDRNAsHSo2NF2YddUk6JtWMPt2KjlcO2hrbEXIpHVVM7aC2r4vKRK8Mz52hCkcOqJ8lxtp8fnGJo3a2vzty2rE9ZeYjlG4OGkYzPmCZJizo0K9aSTXlI6E-JrZgE68a26P6vwdtokQmw4-4zIuy6ri08v2Rdd6Sa+Vzq22fngxkiiGK+SupP7Xp+YogdaaZnGR0Jm0skyjbfDotXhATLJvkygXJKtFjixRYURVFmAxUXGUKdlvYqKKnz6C6Kc3ETFUNtVSvaGL22t6oe24C13foxV5w8oLDZZWtI8SAkKs-D8qSDpE+iz5OEsOMqK8XdyRg3g8imGC8a3iN2OisowfpVQ8Nxts3c9NIgn2hAG+yE9CKRVraRQg9GDD35OEDs0QIHwwCloAM8MvrmCAA */
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
          START: {
            actions: ['assignTxRequestData'],
            target: 'estimatingInitialTips',
          },
        },
      },
      estimatingInitialTips: {
        tags: ['loading'],
        invoke: {
          src: 'estimateDefaultTips',
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['assignDefaultTips'],
              target: 'estimatingGasLimit',
            },
          ],
        },
      },
      estimatingGasLimit: {
        invoke: {
          src: 'estimateGasLimit',
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['assignGasLimit'],
              target: 'fetchingAccount',
            },
          ],
        },
      },
      fetchingAccount: {
        entry: ['openDialog'],
        tags: ['loading'],
        invoke: {
          src: 'fetchAccount',
          data: {
            input: (ctx: MachineContext) => ctx.input,
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['assignAccount'],
              target: 'simulatingTransaction',
            },
          ],
        },
      },
      simulatingTransaction: {
        tags: ['loading'],
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
            target: 'simulatingTransaction',
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
      SET_CUSTOM_FEES: {
        actions: ['assignCustomFees'],
        target: 'changingCustomFees',
      },
    },
  },
  {
    delays: { TIMEOUT: 1300 },
    actions: {
      reset: assign(() => ({})),
      assignDefaultTips: assign((ctx, ev) => ({
        fees: {
          ...ctx.fees,
          regularTip: ev.data.regularTip,
          fastTip: ev.data.fastTip,
        },
      })),
      assignGasLimit: assign((ctx, ev) => ({
        fees: {
          ...ctx.fees,
          maxGasLimit: ev.data.maxGasLimit,
        },
      })),
      assignAccount: assign({
        input: (ctx, ev) => ({
          ...ctx.input,
          account: ev.data,
        }),
      }),
      assignTxRequestData: assign({
        input: (ctx, ev) => {
          const {
            transactionRequest,
            origin,
            address,
            providerUrl,
            title,
            favIconUrl,
            skipCustomFee,
          } = ev.input || {};

          if (!providerUrl) {
            throw new Error('providerUrl is required');
          }
          if (!address) {
            throw new Error('address is required');
          }
          if (!transactionRequest) {
            throw new Error('transaction is required');
          }
          if (ctx.input.isOriginRequired && !origin) {
            throw new Error('origin is required');
          }

          return {
            transactionRequest,
            origin,
            address,
            providerUrl,
            title,
            favIconUrl,
            skipCustomFee,
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
      estimateDefaultTips: FetchMachine.create<
        never,
        EstimateDefaultTipsReturn
      >({
        showError: false,
        maxAttempts: 1,
        async fetch() {
          const defaultTips = await TxService.estimateDefaultTips();
          return defaultTips;
        },
      }),
      estimateGasLimit: FetchMachine.create<never, EstimateGasLimitReturn>({
        showError: false,
        maxAttempts: 1,
        async fetch() {
          const gasLimit = await TxService.estimateGasLimit();
          return gasLimit;
        },
      }),
      simulateTransaction: FetchMachine.create<
        TxInputs['simulateTransaction'],
        SimulateTransactionReturn
      >({
        showError: false,
        async fetch({ input }) {
          if (!input?.transactionRequest) {
            throw new Error('Invalid simulateTransaction input');
          }

          // Enforce a minimum delay to show the loading state
          // this creates a better experience for the user as the
          // screen doesn't flash between states
          await delay(600);

          const simulatedInfo = await TxService.simulateTransaction(input);
          return simulatedInfo;
        },
      }),
      send: FetchMachine.create<
        TxInputs['send'],
        MachineServices['send']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch(params) {
          const { input } = params;
          if (
            !input?.address ||
            !input?.transactionRequest ||
            !input?.providerUrl
          ) {
            throw new Error('Invalid approveTx input');
          }
          const txResponse = await TxService.send(input);
          const txSummary = await txResponse.getTransactionSummary();

          return {
            ...txSummary,
            // Adding 1 magical unit to match the fake unit that is added on TS SDK (.add(1))
            fee: txSummary.fee.add(1),
          };
        },
      }),
      fetchAccount: FetchMachine.create<
        { address: string; providerUrl: string },
        Account
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.address || !input?.providerUrl) {
            throw new Error('Invalid fetchAccount input');
          }
          const account = await AccountService.fetchAccount({
            address: input.address,
          });
          const accountWithBalances = await AccountService.fetchBalance({
            account,
            providerUrl: input.providerUrl,
          });

          return accountWithBalances;
        },
      }),
    },
  }
);

export type TransactionRequestMachine = typeof transactionRequestMachine;
export type TransactionRequestService =
  InterpreterFrom<TransactionRequestMachine>;
export type TransactionRequestState = StateFrom<TransactionRequestMachine>;
