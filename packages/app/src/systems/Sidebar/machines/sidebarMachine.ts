import type { InterpreterFrom } from 'xstate';
import { createMachine } from 'xstate';

export enum SideBarActionTypes {
  TOGGLE = 'TOGGLE',
}

export enum SideBarStateValues {
  Minimized = 'minimized',
  Expanded = 'expanded',
}

export const sidebarMachine = createMachine<
  unknown,
  { type: SideBarActionTypes },
  {
    context: unknown;
    value: SideBarStateValues;
  }
>({
  predictableActionArguments: true,
  initial: 'minimized' as SideBarStateValues,
  states: {
    [SideBarStateValues.Expanded]: {
      on: {
        [SideBarActionTypes.TOGGLE]: {
          target: SideBarStateValues.Minimized,
        },
      },
    },
    [SideBarStateValues.Minimized]: {
      on: {
        [SideBarActionTypes.TOGGLE]: {
          target: SideBarStateValues.Expanded,
        },
      },
    },
  },
  id: 'sideBar',
});

export type SidebarMachine = typeof sidebarMachine;
export type SideBarMachineService = InterpreterFrom<SidebarMachine>;
