/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@fuel-ui/react';
import { assign, createMachine } from 'xstate';

export type FetchResponse<T> = T & {
  error?: unknown;
};

type MachineContext<I> = {
  input?: I;
  attempts?: number;
  error?: unknown;
};

type MachineServices<R> = {
  fetch: {
    data: R;
  };
};

export type CreateFetchMachineOpts<I, R> = {
  showError?: boolean;
  maxAttempts?: number;
  fetch: (ctx: MachineContext<I>) => Promise<R>;
};

const MAX_ATTEMPTS = 3;

export const FetchMachine = {
  hasError(_: any, ev: { data: { error?: any } }) {
    return Boolean(ev.data?.error);
  },

  create<Input, Result>(opts: CreateFetchMachineOpts<Input, Result>) {
    return createMachine(
      {
        predictableActionArguments: true,
        // eslint-disable-next-line @typescript-eslint/consistent-type-imports
        tsTypes: {} as import('./fetchMachine.typegen').Typegen0,
        schema: {
          context: {} as MachineContext<Input>,
          services: {} as MachineServices<Result>,
        },
        id: '(machine)',
        initial: 'loading',
        context: {
          attempts: 0,
        },
        states: {
          loading: {
            tags: ['loading'],
            entry: ['incrementAttempts'],
            invoke: {
              src: 'fetch',
              onDone: {
                target: 'success',
              },
              onError: [
                {
                  actions: ['assignError'],
                  target: 'failed',
                  cond: 'hasManyAttempts',
                },
                {
                  actions: ['logError'],
                  target: 'retrying',
                },
              ],
            },
          },
          retrying: {
            tags: ['loading'],
            after: {
              500: {
                target: 'loading',
              },
            },
          },
          failed: {
            entry: ['showError'],
            type: 'final',
            data: (ctx) => ({ error: ctx.error }),
          },
          success: {
            type: 'final',
            data: (_, ev) => ev.data,
          },
        },
      },
      {
        actions: {
          showError: (_, ev) => {
            if (!opts.showError) return;
            const error = ev.data as any;
            toast.error(error.message);
          },
          assignError: assign({
            error: (_, ev) => ev.data,
          }),
          logError: (_, ev: { data: any }) => {
            // eslint-disable-next-line no-console
            console.error(ev.data);
          },
          incrementAttempts: assign({
            attempts: (ctx) => (ctx.attempts ?? 0) + 1,
          }),
        },
        guards: {
          hasManyAttempts: (ctx) => {
            return Boolean(
              (ctx?.attempts ?? 0) >= (opts?.maxAttempts || MAX_ATTEMPTS)
            );
          },
        },
        services: {
          fetch: opts.fetch,
        },
      }
    );
  },
};
