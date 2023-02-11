import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { Overlays } from '../types';

export type OverlayKeys = keyof typeof Overlays;

type MachineContext = {
  overlay?: Overlays;
};

type MachineEvents =
  | { type: 'OPEN'; input: OverlayKeys }
  | { type: 'CLOSE'; input?: null };

export const overlayMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./overlayMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'closed',
    states: {
      closed: {},
      opened: {
        on: {
          CLOSE: {
            actions: ['close'],
            target: 'closed',
          },
        },
      },
    },
    on: {
      OPEN: {
        actions: ['open'],
        target: 'opened',
      },
    },
  },
  {
    actions: {
      open: assign({
        overlay: (_, e) => Overlays[e.input],
      }),
      close: assign({
        overlay: (_) => undefined,
      }),
    },
  }
);

export type OverlayMachine = typeof overlayMachine;
export type OverlayMachineService = InterpreterFrom<OverlayMachine>;
export type OverlayMachineState = StateFrom<OverlayMachine>;
