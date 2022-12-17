/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ChainInfo } from 'fuels';
import { assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';

import { NetworkService } from '../services';

import type { FetchResponse } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  chainInfo?: ChainInfo;
};

type MachineServices = {
  fetchChainInfo: {
    data: FetchResponse<ChainInfo>;
  };
};

type MachineEvents = {
  type: 'FETCH_CHAIN_INFO';
  input: { providerUrl?: string };
};

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
        },
      },
      fetchingChainInfo: {
        tags: ['loading'],
        invoke: {
          src: 'fetchChainInfo',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
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
    },
    services: {
      fetchChainInfo: FetchMachine.create<{ providerUrl?: string }, ChainInfo>({
        showError: true,
        async fetch({ input }) {
          if (!input?.providerUrl) {
            throw new Error('No chain URL');
          }

          return NetworkService.getChainInfo(input.providerUrl);
        },
      }),
    },
  }
);

export type ChainInfoMachine = typeof chainInfoMachine;
export type ChainInfoMachineService = InterpreterFrom<ChainInfoMachine>;
export type ChainInfoMachineState = StateFrom<ChainInfoMachine>;
