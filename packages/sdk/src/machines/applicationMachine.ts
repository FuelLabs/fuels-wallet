/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Application } from '@fuels-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

type MachineContext = {
  application?: Application | null;
  isConnected: boolean;
  error?: unknown;
};

type MachineServices = {
  removeApplication: {
    data: boolean;
  };
  addApplication: {
    data: Application | null;
  };
  fetchApplication: {
    data: Application | null;
  };
  emitEvent: any;
};

export enum ExternalAppEvents {
  connect = 'connect',
  disconnect = 'disconnect',
}

export enum InternalAppEvents {
  authorize = 'authorize',
  reject = 'reject',
}

type MachineEvents =
  | { type: `${ExternalAppEvents.connect}`; data: Application }
  | { type: `${ExternalAppEvents.disconnect}`; data: Application }
  | { type: `${InternalAppEvents.authorize}`; data: Array<string> }
  | { type: `${InternalAppEvents.reject}`; data: void };

export function createApplicationMachine(services: any) {
  const applicationMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOkwHt9DMAXE9AVxu3ICdcAvMAQQAdeAxBEpgSBAG7kA1qLRY8hUhSpha9Ji3Zc+vBBPKZ0NXJQDaABgC6iUL3KxcxyjZAAPRADYATAGYSAVnMAdiCADmCAFlDQiI8ggBoQAE9EL3MAThJ07PS4rwigjxiARgiAXzLEuRwCYjJKajpGZjZOHn4BMFZWNhJeABsjADM2VBJqhTrlRvUWrXbdfUMnfAtrJBA7BxWXdwQPHz9AkPCgqJi4xJSEL1ysnOyIryD04NKKqowaxXqVWgFuABVAAqAAkAPIAJQAkgAtACiLi2jhM+F2qXMxRIcWKoQ85gixWKBy8Xn8V0QPlxJHMtMxcUOQWK-nS5UqIAmtSUDVUNAEkPhACl4QBhYFI+wo5wbPYHI7BMKRaKxBLJSkRfw0umlUJnQlPD4cr6TUgQXCwaa8oQiMT4SQycbGrkkM0Wnm0PR2gxGVFrCXbVHohCxUI00Is3yFdIhYkUhDFTEkCIPULpZ4+MnpQ2cxQCEXggByBdF4o2yJ2MsQTzjh3MAW1DJ8TI82aduYAItCAMr5osl-1StGV4NeOPFLxYum0oK3QmhHy6irs-DkCBwFw5qbumiQAcV0B7eceALpJteVNBfz+XWq66kvwPbLhjzRuJZ9mb03my20XdlyX7m4iBBOYx5RBEPj+F4RTzmE6Rjsy9Z0gUxSvvibKfPIzqsGAABWvJ-rYAGBsOMQRDSVITmEqEhEyNY+HWHhMXEV4+IS5gsj4rZYT8P5NBorTaPwe4kQe6pYtB-j4oUpJvv4t6pLqWq0gx5hsbqUTcd8W5-DQInSmJ8YhNiTJ4gSRIkmScZpH4U4ZBB6T+BmHFaSaLrftu+lDoZqGak544QcU6nhmEcavMp5hpCyTlPEErlcl5Qa4nGLZLkAA */
    createMachine(
      {
        // eslint-disable-next-line @typescript-eslint/consistent-type-imports
        tsTypes: {} as import('./applicationMachine.typegen').Typegen0,
        schema: {
          context: {} as MachineContext,
          services: {} as MachineServices,
          events: {} as MachineEvents,
        },
        context: {
          isConnected: false,
        },
        predictableActionArguments: true,
        id: '(machine)',
        initial: 'disconnected',
        states: {
          disconnected: {
            tags: ['emitEvent'],
            on: {
              [ExternalAppEvents.connect]: {
                actions: 'setApplication',
                target: '#(machine).connect',
              },
            },
          },
          connected: {
            tags: ['emitEvent'],
            on: {
              [ExternalAppEvents.disconnect]: {
                actions: 'setApplication',
                target: '#(machine).disconnect',
              },
            },
          },
          rejected: {
            tags: ['emitEvent'],
          },
          connect: {
            tags: 'connecting',
            initial: 'fetchAutorizedApp',
            states: {
              idle: {},
              fetchAutorizedApp: {
                invoke: {
                  src: 'fetchApplication',
                  onDone: [
                    {
                      cond: 'applicationConnected',
                      actions: ['setConnected'],
                      target: '#(machine).connected',
                    },
                    {
                      target: 'idle',
                    },
                  ],
                },
              },
              authorizeApp: {
                invoke: {
                  src: 'addApplication',
                  onDone: [
                    {
                      actions: ['setConnected'],
                      target: '#(machine).connected',
                    },
                  ],
                },
              },
            },
            on: {
              [InternalAppEvents.authorize]: {
                target: '.authorizeApp',
              },
              [InternalAppEvents.reject]: {
                target: 'rejected',
              },
            },
          },
          disconnect: {
            invoke: {
              src: 'removeApplication',
              onDone: [
                {
                  actions: 'setDisconnected',
                  target: 'disconnected',
                },
              ],
            },
            tags: 'disconnecting',
          },
        },
      },
      {
        actions: {
          setApplication: assign({
            application: (_, ev) => {
              return {
                accounts: ev.data.accounts || [],
                origin: ev.data.origin,
              };
            },
          }),
          setConnected: assign({
            isConnected: (_) => true,
            application: (_, ev) => {
              if (ev.data) {
                return ev.data;
              }
              return null;
            },
          }),
          setDisconnected: assign({
            isConnected: (_) => false,
          }),
        },
        services: {
          fetchApplication: async () => {
            return null;
          },
          addApplication: async (ctx, ev) => {
            if (ctx.application && Array.isArray(ev.data)) {
              return {
                origin: ctx.application.origin,
                accounts: ev.data || [],
              };
            }
            return null;
          },
          async removeApplication() {
            return true;
          },
          ...services,
        },
        guards: {
          applicationConnected: (_, ev) => {
            return !!((ev.data?.accounts.length || 0) >= 1);
          },
        },
      }
    );
  return applicationMachine;
}

const applicationMachineType = (
  true ? undefined : createApplicationMachine({})
)!;
export type ApplicationMachine = typeof applicationMachineType;
export type ApplicationMachineService = InterpreterFrom<
  typeof applicationMachineType
>;
export type ApplicationMachineState = StateFrom<typeof applicationMachineType>;
