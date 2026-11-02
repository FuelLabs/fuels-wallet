import type { Contract, EcosystemProject } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core';

import { EcosystemService } from '~/systems/Ecosystem/services/ecosystem';
import { ContractService } from '../services/contracts';

export type MachineContext = {
  contracts?: Contract[];
  attempts?: number;
};

type MachineEvents = { type: 'FETCH' };

const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY = 10_000;

type MachineServices = {
  fetchProjects: {
    data: EcosystemProject[];
  };
};

export const contractsMachine = createMachine(
  {
    predictableActionArguments: true,

    tsTypes: {} as import('./contractsMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    context: {
      attempts: 0,
    },
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          FETCH: 'fetching',
        },
      },
      fetching: {
        entry: ['incrementAttempts'],
        invoke: {
          src: 'fetchProjects',
          onDone: [
            {
              target: 'failure',
              cond: 'canRetry',
            },
            {
              target: 'failed',
              cond: FetchMachine.hasError,
            },
            {
              target: 'success',
              actions: ['assignContracts'],
            },
          ],
        },
      },
      failure: {
        after: {
          RETRY_DELAY: 'fetching',
        },
      },
      failed: {},
      success: {},
    },
  },
  {
    delays: {
      RETRY_DELAY: (ctx) =>
        RETRY_BASE_DELAY * 2 ** Math.max((ctx.attempts ?? 1) - 1, 0),
    },
    guards: {
      canRetry: (ctx, ev) =>
        Boolean((ev.data as { error?: unknown })?.error) &&
        (ctx.attempts ?? 0) < MAX_ATTEMPTS,
    },
    actions: {
      incrementAttempts: assign({
        attempts: (ctx) => (ctx.attempts ?? 0) + 1,
      }),
      assignContracts: assign({
        contracts: (_, ev) => {
          return ContractService.formatContractsFromEcosystem(ev.data);
        },
      }),
    },
    services: {
      fetchProjects: FetchMachine.create<
        null,
        MachineServices['fetchProjects']['data']
      >({
        showError: false,
        maxAttempts: 1,
        async fetch() {
          return EcosystemService.fetchProjects();
        },
      }),
    },
  }
);

export type ContractsMachine = typeof contractsMachine;
export type ContractsMachineState = StateFrom<ContractsMachine>;
export type ContractsMachineService = InterpreterFrom<ContractsMachine>;
