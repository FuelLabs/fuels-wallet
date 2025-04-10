import { isValidDomain } from '@bako-id/sdk';
import { type Provider, isB256 } from 'fuels';
import {
  type InterpreterFrom,
  type StateFrom,
  assign,
  createMachine,
} from 'xstate';
import type { FetchResponse } from '~/systems/Core';
import NameSystemService from '~/systems/NameSystem/services/nameSystem';

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
  | { type: 'RESOLVE_ADDRESS'; address: string; chainId: number }
  | { type: 'RESOLVE_DOMAIN'; domain: string; chainId: number }
  | { type: 'SET_DOMAIN'; domain: string; chainId: number; address: string }
  | { type: 'TOGGLE_DROPDOWN'; open: boolean }
  | { type: 'RESET' }
  | { type: 'RETRY' };

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
          RESOLVE_ADDRESS: {
            target: 'loadingAddress',
            cond: 'isValidAddress',
            actions: 'resolveAddress',
          },
          RESOLVE_DOMAIN: {
            target: 'loadingDomain',
            cond: 'isValidDomain',
            actions: 'resolveDomain',
          },
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
      loadingAddress: {
        invoke: {
          src: 'resolveAddress',
          onDone: {
            target: 'idle',
            actions: 'setName',
          },
          onError: {
            target: 'errorAddress',
            actions: 'setError',
          },
        },
      },
      loadingDomain: {
        invoke: {
          src: 'resolverDomain',
          onDone: {
            target: 'idle',
            actions: 'setAddress',
          },
          onError: {
            target: 'errorDomain',
            actions: 'setError',
          },
        },
      },
      errorAddress: {
        on: {
          RETRY: 'loadingAddress',
        },
      },
      errorDomain: {
        on: {
          RETRY: 'loadingDomain',
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
    guards: {
      isValidAddress: (_, ev) => isB256(ev.address) && !!ev.chainId,
      isValidDomain: (_, e) => isValidDomain(e.domain),
    },
    actions: {
      resolveDomain: assign({
        name: (_, e) => e.domain,
        chainId: (_, e) => e.chainId,
      }),
      resolveAddress: assign({
        address: (_ctx, e) => e.address,
        chainId: (_, e) => e.chainId,
      }),
      setName: assign({
        name: (_, e) => String(e.data),
        error: () => null,
      }),
      setAddress: assign({
        address: (_, e) => String(e.data),
        isDropdownOpen: true,
        error: () => null,
      }),
      setError: assign({
        name: () => null,
        isDropdownOpen: false,
        error: (_, e) => String(e.data),
      }),
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
    services: {
      resolveAddress: async (context) => {
        if (context.chainId === null) {
          throw new Error('ChainId not available');
        }
        const { domain } = await NameSystemService.resolverAddress({
          address: context.address!,
          chainId: context.chainId,
        });
        return domain;
      },
      resolverDomain: async (context) => {
        if (context.chainId === null) {
          throw new Error('ChainId not available');
        }
        const { address } = await NameSystemService.resolverDomain({
          domain: context.name!,
          chainId: context.chainId,
        });
        return address;
      },
    },
  }
);

export type NameSystemRequestMachine = typeof nameSystemRequestMachine;
export type NameSystemRequestService =
  InterpreterFrom<NameSystemRequestMachine>;
export type NameSystemRequestState = StateFrom<NameSystemRequestMachine>;
