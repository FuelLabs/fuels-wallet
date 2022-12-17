/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { toast } from '@fuel-ui/react';
import type { Account, Asset } from '@fuel-wallet/types';
import {
  bn,
  BN,
  isBech32,
  NativeAssetId,
  TransactionRequest,
  TransactionResponse,
  WalletLocked,
  WalletUnlocked,
} from 'fuels';
import {
  assign,
  createMachine,
  InterpreterFrom,
  send,
  StateFrom,
} from 'xstate';

import { store } from '~/store';
import {
  AccountInputs,
  AccountService,
  UnlockMachine,
  unlockMachine,
  unlockMachineErrorAction,
  UnlockMachineEvents,
} from '~/systems/Account';
import { getBalance } from '~/systems/Account/utils/balance';
import { isEth } from '~/systems/Asset';
import { ChildrenMachine, FetchMachine } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { GroupedErrors } from '~/systems/Transaction';
import { TxService } from '~/systems/Transaction/services';

export enum SendScreens {
  unlocking,
  select,
  confirm,
}

export type MachineContext = {
  inputs?: {
    asset?: Asset;
    address?: string;
    amount?: BN;
    wallet?: WalletUnlocked;
    accountInfo?: TxAccountInfoReturn;
    gasFee?: BN;
  };
  response?: {
    fee?: BN;
    txRequest?: TransactionRequest;
    txApprove?: TransactionResponse;
  };
  errors?: {
    unlockError?: string;
    txRequestError?: GroupedErrors;
    txApproveError?: GroupedErrors;
    isAddressInvalid?: boolean;
  };
};

type Inputs = MachineContext['inputs'];

type TxRequestReturn = {
  fee: BN;
  txRequest: TransactionRequest;
};

type TxApproveReturn = {
  txApprove: TransactionResponse;
};

type TxAccountInfoReturn = {
  wallet: WalletLocked;
  account: Account;
};

type MachineServices = {
  fetchFakeTx: {
    data: BN;
  };
  fetchAccountInfo: {
    data: TxAccountInfoReturn;
  };
  unlock: {
    data: WalletUnlocked;
  };
  createTx: {
    data: TxRequestReturn;
  };
  sendTx: {
    data: TxApproveReturn;
  };
};

type MachineEvents =
  | { type: 'SET_ASSET'; input: Asset }
  | { type: 'SET_ADDRESS'; input: string }
  | { type: 'SET_AMOUNT'; input: BN }
  | { type: 'UNLOCK_WALLET'; input: AccountInputs['unlock'] }
  | { type: 'RESET'; input: null }
  | { type: 'BACK'; input: null }
  | { type: 'CONFIRM'; input: null };

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
        invoke: {
          src: 'fetchFakeTx',
          onDone: {
            target: 'idle',
            actions: 'assignInitialFee',
          },
        },
      },
      idle: {
        on: {
          BACK: {
            actions: ['goToHome'],
          },
          CONFIRM: {
            target: 'fetchingAccountInfo',
          },
        },
      },
      fetchingAccountInfo: {
        invoke: {
          src: 'fetchAccountInfo',
          onDone: [
            {
              target: 'invalid',
              cond: 'isInValidTransaction',
            },
            {
              actions: ['assignAccountInfo'],
              target: 'confirming',
            },
          ],
        },
      },
      invalid: {},
      confirming: {
        initial: 'creatingTx',
        on: {
          BACK: {
            target: 'idle',
          },
        },
        states: {
          creatingTx: {
            invoke: {
              src: 'createTx',
              data: (ctx: MachineContext) => ({
                input: {
                  ...ctx.inputs,
                  gasFee: ctx.response?.fee,
                },
              }),
              onDone: [
                {
                  target: 'idle',
                  actions: ['assignTxRequestError'],
                  cond: 'hasError',
                },
                {
                  actions: ['assignResponse'],
                  target: 'idle',
                },
              ],
            },
          },
          idle: {
            on: {
              CONFIRM: {
                target: 'unlocking',
              },
            },
          },
          unlocking: {
            invoke: {
              id: 'unlock',
              src: 'unlock',
              onDone: [
                unlockMachineErrorAction('unlocking', 'unlockError'),
                { target: 'sendingTx', actions: 'assignWallet' },
              ],
            },
            on: {
              UNLOCK_WALLET: {
                actions: [
                  send<MachineContext, UnlockMachineEvents>(
                    (_, ev) => ({ type: 'UNLOCK_WALLET', input: ev.input }),
                    { to: 'unlock' }
                  ),
                ],
              },
            },
          },
          sendingTx: {
            invoke: {
              src: 'sendTx',
              data: (ctx: MachineContext) => ({ input: ctx }),
              onDone: [
                {
                  target: 'idle',
                  actions: ['assignTxApproveError'],
                  cond: 'hasError',
                },
                {
                  actions: ['assignResponse'],
                  target: 'success',
                },
              ],
            },
          },
          success: {
            type: 'final',
            entry: ['notifyUpdateAccounts', 'showSuccessMessage', 'goToHome'],
          },
        },
      },
    },
    on: {
      SET_ASSET: {
        actions: ['assignAsset'],
        target: 'idle',
      },
      SET_ADDRESS: {
        actions: ['assignAddress', 'validateAddress'],
        target: 'idle',
      },
      SET_AMOUNT: {
        actions: ['assignAmount'],
        target: 'idle',
      },
      RESET: {
        actions: ['reset'],
        target: 'idle',
      },
    },
  },
  {
    actions: {
      reset: assign(() => ({})),
      assignInitialFee: assign({
        response: (ctx, ev) => ({ ...ctx.response, fee: ev.data }),
      }),
      assignAsset: assign({
        inputs: (ctx, ev) => ({ ...ctx.inputs, asset: ev.input }),
      }),
      assignAddress: assign({
        inputs: (ctx, ev) => ({ ...ctx.inputs, address: ev.input }),
      }),
      assignAmount: assign({
        inputs: (ctx, ev) => ({ ...ctx.inputs, amount: ev.input }),
      }),
      assignWallet: assign({
        inputs: (ctx, ev) => ({ ...ctx.inputs, wallet: ev.data }),
      }),
      assignResponse: assign({
        response: (ctx, ev) => ({ ...ctx.response, ...ev.data }),
      }),
      assignAccountInfo: assign({
        inputs: (ctx, ev) => ({ ...ctx.inputs, accountInfo: ev.data }),
      }),
      validateAddress: assign({
        errors: (ctx) => {
          let isAddressInvalid;
          try {
            const address = ctx.inputs?.address;
            isAddressInvalid = Boolean(address && !isBech32(address));
          } catch {
            isAddressInvalid = true;
          }
          return { ...ctx.errors, isAddressInvalid };
        },
      }),
      assignTxRequestError: assign({
        errors: (ctx, ev) => ({
          ...ctx.errors,
          txRequestError: (ev.data as any).error,
        }),
      }),
      assignTxApproveError: assign({
        errors: (ctx, ev) => ({
          ...ctx.errors,
          txApproveError: (ev.data as any).error,
        }),
      }),
      showSuccessMessage() {
        toast.success('Transaction sent successfully');
      },
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
    },
    guards: {
      hasError: FetchMachine.hasError as any,
      isInValidTransaction: (ctx, ev) => {
        if (!ev.data || !ctx.inputs?.asset || !ctx.response?.fee) {
          return true;
        }
        const assetBalance = getBalance(
          ev.data.account,
          ctx.inputs.asset?.assetId
        );
        let hasBalance = false;
        if (isEth(ctx.inputs.asset)) {
          hasBalance = assetBalance.gte(
            bn(ctx.inputs.amount).add(ctx.response.fee)
          );
        } else {
          const ethBalance = getBalance(ev.data.account, NativeAssetId);
          const hasAssetBalance = assetBalance.gte(bn(ctx.inputs.amount));
          const hasGasFeeBalance = ethBalance.gte(bn(ctx.response.fee));
          hasBalance = hasAssetBalance && hasGasFeeBalance;
        }
        return !hasBalance;
      },
    },
    services: {
      unlock: unlockMachine,
      fetchFakeTx: FetchMachine.create<null, BN>({
        showError: false,
        async fetch() {
          return TxService.createFakeTx();
        },
      }),
      fetchAccountInfo: FetchMachine.create<null, TxAccountInfoReturn>({
        showError: false,
        async fetch() {
          const selectedAccount = await AccountService.getSelectedAccount();
          const provier = await NetworkService.getSelectedNetwork();
          if (!provier || !selectedAccount) {
            throw new Error('Missing provider or account');
          }
          const account = await AccountService.fetchBalance({
            providerUrl: provier.url,
            account: selectedAccount,
          });
          const wallet = new WalletLocked(selectedAccount.address, provier.url);

          return { wallet, account };
        },
      }),
      createTx: FetchMachine.create<Inputs, TxRequestReturn>({
        showError: false,
        async fetch({ input = {} }) {
          const { asset, amount, address, accountInfo, gasFee } = input;
          if (!asset || !amount || !address || !accountInfo || !gasFee) {
            throw new Error('Missing params for transaction');
          }
          const wallet = accountInfo.wallet;
          const tx = await TxService.createTransfer({
            amount,
            assetId: asset.assetId,
            to: address,
          });
          const { txCost, request } = await TxService.fundTransaction(
            wallet,
            tx
          );
          return { fee: txCost.fee, txRequest: request };
        },
      }),
      sendTx: FetchMachine.create<MachineContext, TxApproveReturn>({
        showError: true,
        async fetch(params) {
          const { input } = params;
          const wallet = input?.inputs?.wallet;
          const txRequest = input?.response?.txRequest;

          if (!wallet || !txRequest) {
            throw new Error('Invalid approveTx input');
          }

          const providerUrl = wallet.provider.url;
          const txApprove = await TxService.send({
            wallet,
            providerUrl,
            tx: txRequest,
          });

          return { txApprove };
        },
      }),
    },
  }
);

export type SendMachine = typeof sendMachine;
export type SendMachineService = InterpreterFrom<SendMachine>;
export type SendMachineState = StateFrom<SendMachine> &
  ChildrenMachine<{
    unlock: UnlockMachine;
  }>;
