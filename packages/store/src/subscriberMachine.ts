/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */

import type { InterpreterFrom, StateFrom } from 'xstate';
import { toObserver, createMachine, assign } from 'xstate';

import type { StateStorage } from './StateStorage';
import type { Machine, MachinesObj, Service } from './utils/types';

export type StoreServicesObj<T extends MachinesObj> = Record<
  keyof T,
  InterpreterFrom<Machine<T>>
>;

export type Subscriber = { unsubscribe: () => void };

export type StartListener = () => void;
export type StateListener<T extends MachinesObj> = (
  state: StateFrom<Machine<T>>
) => void;

export type SubscriberMachineContext<T extends MachinesObj> = {
  stateStorage: StateStorage<T>;
  onStartListeners: Set<StartListener>;
  onStateListeners: Map<keyof T, Set<StateListener<T>>>;
  subscribers: Subscriber[];
};

export type SubscriberMachineEvents<T extends MachinesObj> =
  | {
      type: 'SUBSCRIBE';
      input: { services: Record<keyof T, Service<T>> };
    }
  | {
      type: 'UNSUBSCRIBE';
      input?: null;
    };

export function createSubscriberMachine<T extends MachinesObj>() {
  return createMachine(
    {
      preserveActionOrder: true,
      predictableActionArguments: true,
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      tsTypes: {} as import('./storeMachine.typegen').Typegen0,
      schema: {
        context: {} as SubscriberMachineContext<T>,
        events: {} as SubscriberMachineEvents<T>,
      },
      id: '(machine)',
      initial: 'idle',
      states: {
        idle: {
          on: {
            /**
             * Subscribe to the store.
             */
            SUBSCRIBE: {
              actions: [
                'subscribeStateStorage',
                'subscribeStoreStart',
                'subscribeStatesChanges',
              ],
            },
            /**
             * Unsubscribe from the store.
             */
            UNSUBSCRIBE: {
              actions: ['unsubscribe'],
            },
          },
        },
      },
    },
    {
      actions: {
        /**
         * Subscribe to all services and save the state to the state storage.
         * Return an array of subscribers to be unsubscribed later.
         * @param Record<keyof T, Service<T>> services
         * @param StateStorage<T> stateStorage
         * @param Subscriber[] subscribers
         * @returns Subscriber[]
         */
        subscribeStateStorage: assign({
          subscribers: ({ stateStorage, subscribers = [] }, { input }) => {
            const services = input.services;
            const subs = Object.entries(services).map(([key, service]) => {
              const sub = service.subscribe(
                toObserver((state) => {
                  stateStorage.setStateOf(key, state as any);
                })
              );
              return {
                unsubscribe: () => {
                  sub.unsubscribe();
                },
              };
            });
            return subscribers.concat(subs);
          },
        }),
        /**
         * Subscribe to listeners attached to the store start event.
         * Return an array of subscribers to be unsubscribed later.
         * @param Set<StartListener> onStartListeners
         * @param Subscriber[] subscribers
         * @returns Subscriber[]
         */
        subscribeStoreStart: assign({
          subscribers: ({ onStartListeners, subscribers = [] }) => {
            const list = Array.from(onStartListeners.values());
            const subs = list.map((listener) => {
              listener();
              return {
                unsubscribe: () => {
                  onStartListeners.delete(listener);
                },
              };
            });
            return subscribers.concat(subs);
          },
        }),
        /**
         * Subscribe to listeners attached to the store state change event.
         * Return an array of subscribers to be unsubscribed later.
         * @param Record<string, Set<StateListener<T>>> onStateListeners
         * @param Record<keyof T, Service<T>> services
         * @param Subscriber[] subscribers
         * @returns Subscriber[]
         */
        subscribeStatesChanges: assign({
          subscribers: (ctx, { input }) => {
            const services = input.services;
            const { onStateListeners, subscribers = [] } = ctx;
            const subs = [] as Subscriber[];

            /* Iterate over all state listeners and subscribe to the service */
            for (const [key, listeners] of onStateListeners.entries()) {
              const service = services[key];
              if (!service || !listeners) continue;

              /* Subscribe to the service */
              const sub = service.subscribe(
                toObserver((state) =>
                  /* Iterate over all listeners and call them with the new state. */
                  listeners.forEach((listener) => {
                    listener(state);
                    /* Return a subscriber to be unsubscribed later. */
                    subs.push({
                      unsubscribe: () => listeners.delete(listener),
                    });
                  })
                )
              );

              /**
               * Push the unsubscribe of the service subscription also.
               * But adjusting it to be a Subscriber.
               */
              subs.push({
                unsubscribe: () => sub.unsubscribe(),
              });
            }
            return [...subscribers, ...subs];
          },
        }),
        /**
         * Unsuscribe all subscribers.
         * @param Subscriber[] subscribers
         * @returns Subscriber[]
         */
        unsubscribe: assign({
          subscribers: ({ subscribers = [] }) => {
            subscribers.forEach((sub) => sub.unsubscribe());
            return [];
          },
        }),
      },
    }
  );
}

export type SubscriberMachine<T extends MachinesObj> = ReturnType<
  typeof createSubscriberMachine<T>
>;
export type SubscriberMachineState<T extends MachinesObj> = StateFrom<
  SubscriberMachine<T>
>;
export type SubscriberMachineService<T extends MachinesObj> = InterpreterFrom<
  SubscriberMachine<T>
>;
