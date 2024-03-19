import { toast } from '@fuel-ui/react';
import type { TransitionConfig } from 'xstate';
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
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  hasError(_: any, ev: { data: { error?: any } }) {
    return Boolean(ev.data?.error);
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  errorState(state: string): TransitionConfig<any, any> {
    return {
      cond: FetchMachine.hasError,
      target: state,
      actions: [
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        assign((ctx: any, ev: { data: { error?: any } }) => ({
          ...ctx,
          error: ev.data.error.message,
        })),
      ],
    };
  },

  create<Input, Result>(opts: CreateFetchMachineOpts<Input, Result>) {
    return createMachine(
      {
        predictableActionArguments: true,

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
            entry: ['assignError', 'showError'],
            type: 'final',
            data: (_ctx, ev) => ({ error: ev.data }),
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
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const error = ev.data as any;
            toast.error(error.message);
          },
          assignError: assign({
            error: (_, ev) => ev.data,
          }),
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          logError: (_, ev: { data: any }) => {
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
