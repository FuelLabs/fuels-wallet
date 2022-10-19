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

type CreateFetchMachineOpts<I, R> = {
  showError?: boolean;
  fetch: (ctx: MachineContext<I>) => Promise<R>;
};

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
                  target: 'retrying',
                },
              ],
            },
          },
          retrying: {
            tags: ['loading'],
            entry: ['logError', 'incrementAttempts'],
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
            return Boolean((ctx?.attempts ?? 0) > 3);
          },
        },
        services: {
          fetch: opts.fetch,
        },
      }
    );
  },
};
