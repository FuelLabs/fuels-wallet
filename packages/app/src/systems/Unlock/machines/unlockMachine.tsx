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
    data: void;
  };
  resetWallet: {
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
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
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
          await VaultService.unlock(input);
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
