import type { WalletUnlocked } from '@fuel-ts/wallet';
import type { WalletManager } from '@fuel-ts/wallet-manager';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { AccountService } from '~/systems/Account/services';
import type { AccountInputs } from '~/systems/Account/services';
import type { Maybe } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core/machines/fetchMachine';

export enum UnlockType {
  wallet = 'wallet',
  vault = 'vault',
}

export type UnlockHandlers = {
  onCancel?: () => void;
  onSuccess?: (ctx: UnlockMachineContext) => void;
  onError?: (error: Error) => void;
};

export type UnlockInput = UnlockHandlers & {
  type?: keyof typeof UnlockType;
};

export type UnlockResponse = {
  error?: string;
  wallet?: Maybe<WalletUnlocked>;
  manager?: Maybe<WalletManager>;
};

type UnlockServiceReturn = Omit<UnlockResponse, 'error'>;

export type UnlockMachineContext = {
  input?: UnlockInput;
  response?: UnlockResponse;
};

type MachineServices = {
  unlock: {
    data: WalletUnlocked | WalletManager;
  };
};

type InternalEvents =
  | {
      type: 'UNLOCK';
      input: Pick<AccountInputs['unlock'], 'password'>;
    }
  | {
      type: 'OPEN_UNLOCK';
      input: UnlockInput;
    }
  | {
      type: 'CLOSE_UNLOCK';
      input?: null;
    }
  | {
      type: 'RESET_UNLOCK';
      input?: null;
    };

export const unlockMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./unlockMachine.typegen').Typegen0,
    schema: {
      context: {} as UnlockMachineContext,
      services: {} as MachineServices,
      events: {} as InternalEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'closed',
    states: {
      closed: {
        on: {
          OPEN_UNLOCK: {
            target: 'waitingPassword',
            actions: ['assignInput'],
          },
        },
      },
      waitingPassword: {
        tags: ['opened'],
        on: {
          UNLOCK: {
            target: 'unlocking',
          },
          CLOSE_UNLOCK: {
            actions: ['resetInput', 'onCancel'],
            target: 'closed',
          },
        },
      },
      unlocking: {
        tags: ['loading', 'opened'],
        invoke: {
          src: 'unlock',
          data: {
            input: (_: UnlockMachineContext, ev: InternalEvents) => ev.input,
          },
          onDone: [
            {
              actions: ['assignError', 'onError'],
              target: 'closed',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignResponse', 'onSuccess'],
              target: 'unlocked',
            },
          ],
        },
      },
      unlocked: {
        on: {
          OPEN_UNLOCK: {
            actions: ['bypassHandlers'],
          },
          RESET_UNLOCK: {
            actions: ['reset'],
            target: 'closed',
          },
        },
      },
    },
  },
  {
    actions: {
      reset: assign(() => ({})),
      assignError: assign({
        response: (_, ev) => ({
          error: (ev.data as unknown as Error).message,
        }),
      }),
      assignResponse: assign({
        response: (_, ev) => ev.data as UnlockResponse,
      }),
      assignInput: assign({
        input: (_, ev) => ev.input,
      }),
      resetInput: assign({
        input: (_) => undefined,
      }),
      onCancel: ({ input }) => {
        input?.onCancel?.();
      },
      onSuccess: (ctx) => {
        ctx.input?.onSuccess?.(ctx);
      },
      onError: ({ input }, ev) => {
        input?.onError?.(ev.data as unknown as Error);
      },
      bypassHandlers(ctx, ev) {
        ev.input?.onSuccess?.(ctx);
      },
    },
    services: {
      unlock: FetchMachine.create<AccountInputs['unlock'], UnlockServiceReturn>(
        {
          showError: false,
          maxAttempts: 1,
          async fetch({ input }) {
            if (!input?.password) {
              throw new Error('Password is required to unlock wallet');
            }
            return AccountService.unlock(input);
          },
        }
      ),
    },
  }
);

export type UnlockMachine = typeof unlockMachine;
export type UnlockMachineService = InterpreterFrom<typeof unlockMachine>;
export type UnlockMachineState = StateFrom<typeof unlockMachine>;
