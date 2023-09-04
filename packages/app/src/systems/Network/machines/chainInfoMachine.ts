/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ChainInfo } from 'fuels';
import { assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';
import type { FetchResponse } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';

import { NetworkInputs, NetworkService } from '../services';

type MachineContext = {
  chainInfo?: ChainInfo;
  error?: string;
};

type MachineServices = {
  fetchChainInfo: {
    data: FetchResponse<ChainInfo>;
  };
};

type MachineEvents =
  | {
      type: 'FETCH_CHAIN_INFO';
      input: { providerUrl?: string };
    }
  | { type: 'CLEAR_CHAIN_INFO'; input: null };

export const chainInfoMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./chainInfoMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          FETCH_CHAIN_INFO: [
            {
              target: 'fetchingChainInfo',
            },
          ],
          CLEAR_CHAIN_INFO: [
            {
              actions: ['clearChainInfo'],
            },
          ],
        },
      },
      fetchingChainInfo: {
        tags: ['loading'],
        entry: ['clearChainInfo', 'clearError'],
        invoke: {
          src: 'fetchChainInfo',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              actions: ['assignError'],
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignChainInfo'],
              target: 'idle',
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      assignChainInfo: assign({
        chainInfo: (ctx, ev) => ev.data,
      }),
      clearChainInfo: assign({
        chainInfo: undefined,
      }),
      assignError: assign({
        error: (_, ev) => (ev.data.error as Error).message,
      }),
      clearError: assign({
        error: (_) => undefined,
      }),
    },
    services: {
      fetchChainInfo: FetchMachine.create<
        NetworkInputs['getChainInfo'],
        ChainInfo
      >({
        showError: false,
        async fetch({ input }) {
          if (!input?.providerUrl) {
            throw new Error('No chain URL');
          }

          return NetworkService.getChainInfo(input);
        },
      }),
    },
  }
);

export type ChainInfoMachine = typeof chainInfoMachine;
export type ChainInfoMachineService = InterpreterFrom<ChainInfoMachine>;
export type ChainInfoMachineState = StateFrom<ChainInfoMachine>;
