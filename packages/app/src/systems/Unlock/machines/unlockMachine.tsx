import { toast } from '@fuel-ui/react';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { CoreService } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core/machines';
import type { VaultInputs } from '~/systems/Vault';
import { VaultService } from '~/systems/Vault';

export type UnlockMachineContext = {
  error?: string;
  isUnlocked?: boolean;
};

type MachineServices = {
  unlock: {
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    data: void;
  };
  resetWallet: {
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    data: void;
  };
  checkLocked: {
    data: boolean;
  };
};

export type UnlockWalletEvent =
  | {
      type: 'UNLOCK_WALLET';
      input: VaultInputs['unlock'];
    }
  | {
      type: 'LOCK_WALLET';
    }
  | {
      type: 'RESET_WALLET';
    }
  | {
      type: 'CHECK_LOCK';
    };

export type UnlockMachineEvents = UnlockWalletEvent;
export type UnlockWalletReturn = MachineServices['unlock'];

export const unlockMachine = createMachine(
  {
    predictableActionArguments: true,

    tsTypes: {} as import('./unlockMachine.typegen').Typegen0,
    schema: {
      context: {} as UnlockMachineContext,
      services: {} as MachineServices,
      events: {} as UnlockMachineEvents,
    },
    context: {},
    id: '(machine)',
    initial: 'checkingLocked',
    states: {
      waitingPassword: {
        on: {
          UNLOCK_WALLET: {
            target: 'unlocking',
          },
          RESET_WALLET: {
            target: 'reseting',
          },
          CHECK_LOCK: {
            target: 'checkingLocked',
          },
        },
      },
      checkingLocked: {
        tags: ['loading'],
        invoke: {
          src: 'checkLocked',
          onDone: [
            {
              cond: 'isLocked',
              target: 'waitingPassword',
            },
            {
              target: 'unlocked',
            },
          ],
        },
      },
      reseting: {
        invoke: {
          src: 'resetWallet',
          onDone: [
            FetchMachine.errorState('checkingLocked'),
            {
              target: 'failed',
              actions: ['reload'],
            },
          ],
        },
      },
      locking: {
        invoke: {
          src: 'lock',
          onDone: [
            {
              target: 'checkingLocked',
            },
          ],
        },
      },
      unlocking: {
        tags: ['loading'],
        entry: ['cleanError'],
        invoke: {
          src: 'unlock',
          data: {
            input: (
              _: UnlockMachineContext,
              ev: Extract<UnlockMachineEvents, { type: 'UNLOCK_WALLET' }>
            ) => ev.input,
          },
          onDone: [
            FetchMachine.errorState('checkingLocked'),
            {
              target: 'checkingLocked',
            },
          ],
        },
      },
      failed: {},
      unlocked: {},
    },
    on: {
      LOCK_WALLET: {
        target: 'locking',
      },
      CHECK_LOCK: {
        target: 'checkingLocked',
      },
    },
  },
  {
    actions: {
      cleanError: assign({
        error: (_) => undefined,
      }),
    },
    guards: {
      isLocked: (_, ev) => ev.data,
    },
    services: {
      resetWallet: FetchMachine.create<void, void>({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          await CoreService.clear();
        },
      }),
      checkLocked: FetchMachine.create<void, boolean>({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          const isLocked = await VaultService.isLocked();
          return isLocked;
        },
      }),
      unlock: FetchMachine.create<VaultInputs['unlock'], void>({
        showError: false,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input || !input?.password) {
            throw new Error('Password is required to unlock wallet');
          }
          try {
            await VaultService.unlock(input);
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          } catch (err: any) {
            toast.error(err?.message || 'Invalid credentials.');
          }
        },
      }),
      lock: FetchMachine.create<void, void>({
        showError: false,
        maxAttempts: 1,
        async fetch() {
          await VaultService.lock();
        },
      }),
    },
  }
);

export type UnlockMachine = typeof unlockMachine;
export type UnlockMachineService = InterpreterFrom<typeof unlockMachine>;
export type UnlockMachineState = StateFrom<typeof unlockMachine>;
