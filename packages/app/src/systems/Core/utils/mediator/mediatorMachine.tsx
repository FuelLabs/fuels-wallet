/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InterpreterFrom, StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

export type Listener<T = any> = (data: T) => any;
type SubscriberMap = Map<string, Map<string, Listener>>;

type MachineContext = {
  subscribers: SubscriberMap;
};

type MachineEvents =
  | {
      type: "register";
      data: { id: string; event: string; listener: Listener };
    }
  | {
      type: "unregister";
      data: { id: string; event: string };
    }
  | {
      type: "send";
      name: string;
      data: any;
    };

export const mediatorMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import("./mediatorMachine.typegen").Typegen0,
    predictableActionArguments: true,
    id: "(machine)",
    initial: "idle",
    context: {
      subscribers: new Map() as SubscriberMap,
    },
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
    },
    states: {
      idle: {
        on: {
          register: {
            actions: "addSubscriber",
          },
          unregister: {
            actions: "removeSubscriber",
          },
          send: {
            actions: "runListeners",
          },
        },
      },
    },
  },
  {
    actions: {
      addSubscriber: assign({
        /**
         * This action will create like a map for each subscriber
         * something like that will be create
         *
         * Map[Events.increment]: {
         *   Map[id]: listener
         * }
         *
         * We need this structure in order to clean up the listeners when
         * some component in unmount
         */
        subscribers: (ctx, { data }) => {
          const oldMap = ctx.subscribers.get(data.event);
          if (oldMap) {
            oldMap.set(data.id, data.listener);
          } else {
            const map = new Map<string, Listener>();
            map.set(data.id, data.listener);
            ctx.subscribers.set(data.event, map);
          }
          return ctx.subscribers;
        },
      }),
      /**
       * Here is the action that removes the listener[id] in unmount
       */
      removeSubscriber: assign({
        subscribers: (ctx, { data }) => {
          const listeners = ctx.subscribers.get(data.event);
          listeners?.delete(data.id);
          return ctx.subscribers;
        },
      }),
      /**
       * This action is responsible to just run the listeners attached to the event
       */
      runListeners: async (ctx, ev) => {
        const listeners = ctx.subscribers.get(ev.name);
        if (!listeners) return;

        for (const listener of listeners.values()) {
          const res = listener?.(ev.data);
          res?.then && res.then(() => null);
        }
      },
    },
  }
);

export type MediatorMachine = typeof mediatorMachine;
export type MediatorMachineState = StateFrom<MediatorMachine>;
export type MediatorMachineService = InterpreterFrom<MediatorMachine>;
