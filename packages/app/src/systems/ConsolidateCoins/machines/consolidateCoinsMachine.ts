import { createActorContext } from '@xstate/react';
import type { Account, Coin } from 'fuels';
import {
  type InterpreterFrom,
  type StateFrom,
  assign,
  createMachine,
} from 'xstate';

export type MachineContext = {
  // Add your context properties here
};

type MachineServices = {
  // Add your services here
};

type MachineEvents =
  // Add your events here
  { type: 'START' };

export const consolidateCoinsMachine = createMachine(
  {
    predictableActionArguments: true,
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
      services: {} as MachineServices,
    },
    id: 'consolidateCoins',
    initial: 'idle',
    context: {},
    states: {
      idle: {
        tags: ['idle'],
        // Add your states here
      },
    },
  },
  {
    guards: {
      // Add your guards here
    },
    actions: {
      // Add your actions here
    },
    services: {
      // Add your services here
    },
  }
);

export type ConsolidateCoinsMachine = typeof consolidateCoinsMachine;
export type ConsolidateCoinsService = InterpreterFrom<ConsolidateCoinsMachine>;
export type ConsolidateCoinsMachineState = StateFrom<ConsolidateCoinsMachine>;
