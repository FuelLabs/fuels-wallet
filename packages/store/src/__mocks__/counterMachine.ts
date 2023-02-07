import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { StoreClass } from '../StoreClass';

import type { StoreMachines } from '.';

type CounterMachineType = 'manual' | 'automatic';

type MachineContext = {
  type?: 'manual' | 'automatic';
  count: number;
  incValue: number;
};

type MachineEvents =
  | {
      type: 'INCREMENT';
      input?: null;
    }
  | {
      type: 'DECREMENT';
      input?: null;
    }
  | {
      type: 'SET_TYPE';
      input: CounterMachineType;
    }
  | {
      type: 'RESET';
      input?: null;
    };

export const counterMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./counterMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          SET_TYPE: {
            target: 'automatic',
            actions: ['setType'],
          },
        },
      },
      automatic: {
        invoke: {
          src: () => (send) => {
            const interval = setInterval(() => send('INCREMENT'), 1000);
            return () => clearInterval(interval);
          },
        },
      },
    },
    on: {
      INCREMENT: {
        target: 'idle',
        actions: ['increment', 'log'],
      },
      DECREMENT: {
        target: 'idle',
        actions: ['decrement', 'log'],
      },
      RESET: {
        target: 'idle',
        actions: ['reset'],
      },
    },
  },
  {
    actions: {
      setType: assign({
        type: (_, event) => event.input,
      }),
      increment: assign({
        count: (context) => context.count + context.incValue,
      }),
      decrement: assign({
        count: (context) => context.count - context.incValue,
      }),
      reset: assign(({ incValue }) => ({
        incValue,
        count: 0,
      })),
      log: () => ({}),
    },
  }
);

export type CounterMachine = typeof counterMachine;
export type CounterMachineState = StateFrom<CounterMachine>;
export type CounterMachineService = InterpreterFrom<CounterMachine>;

export function counterHandlers(store: StoreClass<StoreMachines>) {
  return {
    increment() {
      store.send('counter', { type: 'INCREMENT' });
    },
    decrement() {
      store.send('counter', { type: 'DECREMENT' });
    },
    setCounterType(type: CounterMachineType) {
      store.send('counter', { type: 'SET_TYPE', input: type });
    },
    resetCounter() {
      store.send('counter', { type: 'RESET' });
    },
  };
}
