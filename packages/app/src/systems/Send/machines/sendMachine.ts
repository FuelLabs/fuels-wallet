/* eslint-disable @typescript-eslint/consistent-type-imports */
import { BN, BaseAssetId, Provider, TransactionRequest } from 'fuels';
import { assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';
import { AccountService } from '~/systems/Account';
import { FetchMachine, WalletLockedCustom, assignError } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { TxInputs, TxService } from '~/systems/Transaction/services';

export enum SendScreens {
  select,
  confirm,
  success,
  failed,
}

export type MachineContext = {
  transactionRequest?: TransactionRequest;
  providerUrl?: string;
  address?: string;
  fee?: BN;
  error?: string;
};

type CreateTransactionReturn = {
  transactionRequest: TransactionRequest;
  providerUrl: string;
  address: string;
  fee: BN;
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
      assignTransactionData: assign((_, ev) => ({
        transactionRequest: ev.data.transactionRequest,
        providerUrl: ev.data.providerUrl,
        address: ev.data.address,
        fee: ev.data.fee,
      })),
    },
    services: {
      createTransactionRequest: FetchMachine.create<
        TxInputs['isValidTransaction'],
        CreateTransactionReturn | null
      >({
        showError: false,
        maxAttempts: 1,
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
          try {
            const provider = await Provider.create(network.url);
            const wallet = new WalletLockedCustom(account.address, provider);
            const nativeBalance = await wallet.getBalance();
            const createOpts = {
              to,
              amount,
              assetId,
              provider: wallet.provider,
            };

            const transferRequest = await TxService.createTransfer(createOpts);
            let fee = new BN(0);

            // If transaction is native asset and amount is equal to balance
            // them we calculate the fee for the screen to reduce the input amount
            if (assetId === BaseAssetId && amount.eq(nativeBalance)) {
              const resources = await provider.getResourcesToSpend(
                wallet.address,
                [
                  {
                    assetId: BaseAssetId,
                    amount: nativeBalance,
                  },
                ]
              );
              transferRequest.addResources(resources);
              const { gasUsed, gasPrice, usedFee, minFee } =
                await provider.getTransactionCost(transferRequest);
              transferRequest.gasPrice = gasPrice;
              transferRequest.gasLimit = gasUsed;
              fee = usedFee.add(minFee);
            } else {
              const { requiredQuantities, gasPrice, gasUsed, usedFee, minFee } =
                await provider.getResourcesForTransaction(
                  wallet.address,
                  transferRequest
                );
              fee = usedFee.add(minFee);
              // If does not find ETH on the required coins add it before query resources
              // TODO: check why the getResourcesForTransaction from TS-SDK do not return
              // the ETH required on the requiredQuantities
              if (
                !requiredQuantities.find(
                  (quantity) => quantity.assetId === BaseAssetId
                )
              ) {
                requiredQuantities.push({
                  assetId: BaseAssetId,
                  amount: fee,
                });
              }
              const resources = await provider.getResourcesToSpend(
                wallet.address,
                requiredQuantities
              );
              transferRequest.gasPrice = gasPrice;
              transferRequest.gasLimit = gasUsed;
              transferRequest.addResources(resources);
            }

            return {
              fee,
              address: wallet.address.toString(),
              transactionRequest: transferRequest,
              providerUrl: network.url,
            };
          } catch (err) {
            if (err instanceof Error) {
              if (err.message.includes('not enough coins to fit the target')) {
                throw new Error('Insufficient funds to cover gas costs');
              }
            }
            throw err;
          }
        },
      }),
    },
  }
);

export type SendMachine = typeof sendMachine;
export type SendMachineService = InterpreterFrom<SendMachine>;
export type SendMachineState = StateFrom<SendMachine>;
