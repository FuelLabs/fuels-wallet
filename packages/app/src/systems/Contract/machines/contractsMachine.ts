import type { Contract, EcosystemProject } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core';

import { EcosystemService } from '~/systems/Ecosystem/services/ecosystem';
import { ContractService } from '../services/contracts';

export type MachineContext = {
  contracts?: Contract[];
};

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
    },
    id: '(machine)',
    initial: 'fetching',
    states: {
      fetching: {
        invoke: {
          src: 'fetchProjects',
          onDone: [
            {
              target: 'failure',
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
          10000: 'fetching',
        },
      },
      success: {
        type: 'final',
      },
    },
  },
  {
    actions: {
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
