/* eslint-disable @typescript-eslint/no-explicit-any */
// import { SERVICE_NAME } from 'src/config';
// import { getConnector, RPC } from 'src/rpc';
// import { v4 } from 'uuid';
import type { Events } from 'src/events';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

type MachineContext = {
  events: Events<any>;
  isConnected: boolean;
  error?: unknown;
};

type MachineServices = {
  removeApplication: any;
  addApplication: any;
};

type MachineEvents =
  | { type: 'CONNECT'; data: boolean }
  | { type: 'DISCONNECT'; data: null }
  | { type: 'AUTHORIZE'; data: null }
  | { type: 'REJECT'; data: null };

export const applicationMachine =
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
      predictableActionArguments: true,
      id: '(machine)',
      initial: 'disconnected',
      states: {
        disconnected: {},
        connected: {},
        rejected: {},
        connect: {
          tags: 'connecting',
          initial: 'idle',
          states: {
            idle: {},
            authorizeApp: {
              invoke: {
                src: 'addApplication',
                onDone: [
                  {
                    actions: 'setConnected',
                    target: '#(machine).connected',
                  },
                ],
                onError: [
                  {
                    target: '#(machine).rejected',
                  },
                ],
              },
            },
          },
          on: {
            AUTHORIZE: {
              target: '.authorizeApp',
            },
            REJECT: {
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
      on: {
        CONNECT: {
          target: '.connect',
          internal: false,
        },
        DISCONNECT: {
          target: '.disconnect',
          internal: false,
        },
      },
    },
    {
      actions: {
        setConnected: assign({
          isConnected: (_) => true,
        }),
        setDisconnected: assign({
          isConnected: (_) => false,
        }),
      },
      services: {
        async addApplication() {
          return true;
        },
        async removeApplication() {
          return true;
        },
      },
    }
  );

export type ApplicationMachine = typeof applicationMachine;
export type ApplicationMachineService = InterpreterFrom<
  typeof applicationMachine
>;
export type ApplicationMachineState = StateFrom<typeof applicationMachine>;
