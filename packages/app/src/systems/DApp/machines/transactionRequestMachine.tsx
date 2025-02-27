import type { Account, AccountWithBalance } from '@fuel-wallet/types';
import type { BN, TransactionRequest, TransactionSummary } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { AccountService } from '~/systems/Account';
import { FetchMachine, assignErrorMessage, delay } from '~/systems/Core';
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
    transactionRequest?: TransactionRequest;
    address?: string;
    account?: AccountWithBalance;
    tip?: BN;
    gasLimit?: BN;
    skipCustomFee?: boolean;
    isPrepareOnly?: boolean;
  };
  response?: {
    txSummarySimulated?: TransactionSummary;
    txSummaryExecuted?: TransactionSummary;
    proposedTxRequest?: TransactionRequest;
    preparedTransaction?: TransactionRequest;
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

type PrepareInputForSimulateTransactionReturn = {
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
  prepareInputForSimulateTransaction: {
    data: PrepareInputForSimulateTransactionReturn;
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
          START: [
            {
              cond: (_ctx, event) =>
                event.input?.fees?.maxGasLimit != null &&
                event.input?.fees?.fastTip != null &&
                event.input?.fees?.regularTip != null,
              actions: ['assignTxRequestData'],
              target: 'simulatingTransaction',
            },
            {
              actions: ['assignTxRequestData'],
              target: 'prepareInputForSimulateTransaction',
            },
          ],
        },
      },
      prepareInputForSimulateTransaction: {
        tags: ['loading'],
        invoke: {
          src: 'prepareInputForSimulateTransaction',
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
              actions: ['assignPreflightData'],
              target: 'simulatingTransaction',
            },
          ],
        },
      },
      simulatingTransaction: {
        entry: ['openDialog'],
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
          APPROVE: [
            {
              cond: (ctx) => {
                const isPrepareOnly = !!ctx.input.isPrepareOnly;
                return isPrepareOnly;
              },
              target: 'preparingTx',
            },
            {
              target: 'sendingTx',
            },
          ],
          REJECT: {
            actions: [assignErrorMessage('User rejected the transaction!')],
            target: 'failed',
          },
        },
      },
      preparingTx: {
        tags: ['loading'],
        entry: [
          () => {},
          assign({
            response: (ctx) => {
              return {
                ...ctx.response,
                preparedTransaction: ctx.response?.proposedTxRequest,
              };
            },
          }),
        ],
        after: {
          100: 'txSuccess',
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
        entry: () => {},
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
    actions: {
      reset: assign(() => ({})),
      assignPreflightData: assign((ctx, ev) => ({
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
          const {
            transactionRequest,
            origin,
            providerUrl,
            title,
            favIconUrl,
            skipCustomFee,
            account,
            address,
            fees,
            isPrepareOnly,
          } = ev.input || {};

          if (!providerUrl) {
            throw new Error('providerUrl is required');
          }
          if (!account?.address && !address) {
            throw new Error('account or address is required');
          }
          if (!transactionRequest) {
            throw new Error('transaction is required');
          }
          if (ctx.input.isOriginRequired && !origin) {
            throw new Error('origin is required');
          }

          const result = {
            transactionRequest,
            origin,
            account,
            address,
            providerUrl,
            title,
            favIconUrl,
            skipCustomFee,
            isPrepareOnly,
            fees,
          };

          return result;
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
      prepareInputForSimulateTransaction: FetchMachine.create<
        { address?: string; account?: AccountWithBalance },
        {
          estimated: PrepareInputForSimulateTransactionReturn['estimated'];
          account: AccountWithBalance;
        }
      >({
        showError: false,
        maxAttempts: 1,
        async fetch({ input }) {
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
          if (!input?.transactionRequest) {
            throw new Error('Invalid simulateTransaction input');
          }

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
            (!input?.account && !input?.address) ||
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
    },
  }
);

export type TransactionRequestMachine = typeof transactionRequestMachine;
export type TransactionRequestService =
  InterpreterFrom<TransactionRequestMachine>;
export type TransactionRequestState = StateFrom<TransactionRequestMachine>;
