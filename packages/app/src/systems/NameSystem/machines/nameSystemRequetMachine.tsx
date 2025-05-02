import {
  type InterpreterFrom,
  type StateFrom,
  assign,
  createMachine,
} from 'xstate';
import type { FetchResponse } from '~/systems/Core';

type MachineContext = {
  address: null | string;
  chainId: null | number;
  name: null | string;
  error: null | string;
  isDropdownOpen: boolean;
};

type MachineService = {
  addressResolver: { data: FetchResponse<string> };
  domainResolver: { data: FetchResponse<string> };
};

type MachineEvents =
  | { type: 'SET_DOMAIN'; domain: string; chainId: number; address: string }
  | { type: 'TOGGLE_DROPDOWN'; open: boolean }
  | { type: 'RESET' };

export const nameSystemRequestMachine = createMachine(
  {
    id: '(machine)',
    initial: 'idle',
    tsTypes: {} as import('./nameSystemRequetMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineService,
      events: {} as MachineEvents,
    },
    states: {
      idle: {
        on: {
          RESET: {
            actions: 'reset',
          },
          TOGGLE_DROPDOWN: {
            actions: 'toggleDropdown',
          },
          SET_DOMAIN: {
            actions: 'setDomain',
          },
        },
      },
    },
    context: {
      address: null,
      error: null,
      name: null,
      chainId: null,
      isDropdownOpen: false,
    },
  },
  {
    actions: {
      reset: assign({
        name: null,
        address: null,
        isDropdownOpen: false,
      }),
      toggleDropdown: assign({
        isDropdownOpen: (_, e) => e.open,
      }),
      setDomain: assign({
        name: (_, e) => e.domain,
        chainId: (_, e) => e.chainId,
        isDropdownOpen: true,
        address: (_, e) => e.address,
      }),
    },
  }
);

export type NameSystemRequestMachine = typeof nameSystemRequestMachine;
export type NameSystemRequestService =
  InterpreterFrom<NameSystemRequestMachine>;
export type NameSystemRequestState = StateFrom<NameSystemRequestMachine>;
