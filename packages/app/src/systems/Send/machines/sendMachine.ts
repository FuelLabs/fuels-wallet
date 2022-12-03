/* eslint-disable @typescript-eslint/consistent-type-imports */
import { toast } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/types';
import {
  BN,
  ScriptTransactionRequest,
  TransactionResponse,
  WalletUnlocked,
} from 'fuels';
import { createMachine, InterpreterFrom, send, StateFrom } from 'xstate';

import {
  AccountInputs,
  UnlockMachine,
  unlockMachine,
  unlockMachineErrorAction,
  UnlockMachineEvents,
} from '~/systems/Account';
import {
  assignWithData,
  assignWithInput,
  assignErrors,
  ChildrenMachine,
  FetchMachine,
  resetContext,
} from '~/systems/Core';
import { GroupedErrors } from '~/systems/Transaction';
import { TxService } from '~/systems/Transaction/services';

export enum SendScreens {
  unlocking,
  select,
  confirm,
}

type MachineContext = {
  inputs?: {
    asset?: Asset;
    address?: string;
    amount?: BN;
    wallet?: WalletUnlocked;
  };
  response?: {
    fee?: BN;
    txRequest?: ScriptTransactionRequest;
    txApprove?: TransactionResponse;
  };
  errors?: {
    unlockError?: string;
    txRequestError?: GroupedErrors;
    txApproveError?: GroupedErrors;
  };
};

type Inputs = MachineContext['inputs'];

type TxRequestReturn = {
  fee: BN;
  txRequest: ScriptTransactionRequest;
};

type TxApproveReturn = {
  txApprove: TransactionResponse;
};

type MachineServices = {
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
    initial: 'unlocking',
    states: {
      unlocking: {
        invoke: {
          id: 'unlock',
          src: 'unlock',
          data: (_: MachineContext, ev: MachineEvents) => ev.input,
          onDone: [
            unlockMachineErrorAction('unlocking', 'unlockError'),
            { target: 'idle', actions: 'assignWallet' },
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
      idle: {
        initial: 'checking',
        on: {
          BACK: {
            actions: ['goToHome'],
          },
        },
        states: {
          checking: {
            always: [{ target: 'delay', cond: 'canCalcFee' }],
          },
          delay: {
            after: {
              600: 'creatingTx',
            },
          },
          creatingTx: {
            invoke: {
              src: 'createTx',
              data: (ctx: MachineContext) => ({ input: ctx.inputs }),
              onDone: [
                {
                  target: 'failed',
                  actions: ['assignTxRequestError'],
                  cond: FetchMachine.hasError,
                },
                {
                  actions: ['assignTxRequest'],
                  target: 'waitingConfirm',
                },
              ],
            },
          },
          waitingConfirm: {
            on: {
              CONFIRM: {
                target: '#(machine).confirming',
              },
            },
          },
          failed: {
            type: 'final',
          },
        },
      },
      confirming: {
        initial: 'idle',
        on: {
          BACK: {
            target: 'idle.waitingConfirm',
          },
        },
        states: {
          idle: {
            on: {
              CONFIRM: {
                target: 'sendingTx',
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
                  cond: FetchMachine.hasError,
                },
                {
                  actions: ['assignTxApprove'],
                  target: 'success',
                },
              ],
            },
          },
          success: {
            type: 'final',
            entry: ['showSuccessMessage', 'goToHome'],
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
        actions: ['assignAddress'],
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
      reset: resetContext(),
      assignAsset: assignWithInput('inputs.asset'),
      assignAddress: assignWithInput('inputs.address'),
      assignAmount: assignWithInput('inputs.amount'),
      assignWallet: assignWithData('inputs.wallet'),
      assignTxRequest: assignWithData('response', true),
      assignTxApprove: assignWithData('response', true),
      assignTxRequestError: assignErrors('txRequestError'),
      assignTxApproveError: assignErrors('txApproveError'),
      showSuccessMessage() {
        toast.success('Transaction sent successfully');
      },
    },
    guards: {
      canCalcFee(ctx) {
        const { address, asset, amount } = ctx.inputs || {};
        return Boolean(address && asset && amount?.gt(0));
      },
    },
    services: {
      unlock: unlockMachine,
      createTx: FetchMachine.create<Inputs, TxRequestReturn>({
        showError: false,
        async fetch({ input = {} }) {
          const { wallet, asset, amount, address } = input;
          if (!wallet || !asset || !amount || !address) {
            throw new Error('Missing params for transaction');
          }

          const providerUrl = wallet.provider.url;
          const gasPrice = await TxService.fetchGasPrice({ providerUrl });
          const tx = await TxService.createTransfer({
            amount,
            wallet,
            assetId: asset.assetId,
            dest: address,
          });

          tx.gasPrice = gasPrice;
          const fee = await TxService.calculateFee({ tx, providerUrl });
          return { fee, txRequest: tx };
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
