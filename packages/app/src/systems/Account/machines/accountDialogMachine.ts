import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

export enum AccountScreen {
  list = 'list',
  add = 'add',
  logout = 'logout',
}

type MachineContext = {
  screen?: AccountScreen;
};

type MachineEvents =
  | { type: 'OPEN_MODAL'; input?: null }
  | { type: 'CLOSE_MODAL'; input?: null }
  | { type: 'GO_TO'; input?: AccountScreen };

export const accountDialogMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./accountDialogMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'closed',
    states: {
      closed: {
        on: {
          GO_TO: {
            target: 'opened',
            actions: ['setScreen'],
          },
        },
      },
      opened: {
        on: {
          CLOSE_MODAL: {
            target: 'closed',
            actions: ['clearScreen'],
          },
          GO_TO: {
            actions: ['setScreen'],
          },
        },
      },
    },
  },
  {
    actions: {
      setScreen: assign({
        screen: (_, e) => e.input,
      }),
      clearScreen: assign({
        screen: (_) => undefined,
      }),
    },
  }
);

export type AccountDialogMachine = typeof accountDialogMachine;
export type AccountDialogMachineService = InterpreterFrom<AccountDialogMachine>;
export type AccountDialogMachineState = StateFrom<AccountDialogMachine>;
