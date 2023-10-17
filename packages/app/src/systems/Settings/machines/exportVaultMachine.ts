import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core';
import type { VaultInputs } from '~/systems/Vault';
import { VaultService } from '~/systems/Vault';

type MachineServices = {
  exportVault: {
    data: string[];
  };
};

type MachineContext = {
  words: string[];
  error?: string;
};

type MachineEvents = {
  type: 'EXPORT_VAULT';
  input: Omit<VaultInputs['exportVault'], 'vaultId'>;
};

export const exportVaultMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./exportVaultMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: 'exportSeedPhraseMachine',
    initial: 'waitingPassword',
    context: {
      words: [],
    },
    states: {
      waitingPassword: {
        tags: ['unlockOpened'],
        on: {
          EXPORT_VAULT: {
            target: 'exportingVault',
          },
        },
      },
      exportingVault: {
        tags: ['loading', 'unlockOpened'],
        entry: ['clearError'],
        invoke: {
          src: 'exportVault',
          data: {
            input: (
              _: MachineContext,
              ev: Extract<MachineEvents, { type: 'EXPORT_VAULT' }>,
            ) => ({
              password: ev.input.password,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              actions: ['assignError'],
              target: 'waitingPassword',
            },
            {
              actions: ['assignWords'],
              target: 'done',
            },
          ],
        },
      },
      done: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      assignWords: assign({
        words: (_, ev) => ev.data,
      }),
      assignError: assign({
        error: 'Invalid password',
      }),
      clearError: assign({
        error: () => undefined,
      }),
    },
    services: {
      exportVault: FetchMachine.create<VaultInputs['exportVault'], string[]>({
        showError: true,
        maxAttempts: 1,
        fetch: async ({ input }) => {
          if (!input?.password) {
            throw new Error('Password is required to export Vault!');
          }
          const secret = await VaultService.exportVault({
            ...input,
            // TODO change once we add multiple vault management
            // https://github.com/FuelLabs/fuels-wallet/issues/562
            vaultId: 0,
          });
          return secret.split(' ');
        },
      }),
    },
  },
);

export type ExportVaultMachine = typeof exportVaultMachine;
export type ExportVaultMachineService = InterpreterFrom<
  typeof exportVaultMachine
>;
export type ExportVaultMachineState = StateFrom<typeof exportVaultMachine>;
