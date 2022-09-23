import { toast } from '@fuel-ui/react';
import { assign, createMachine } from 'xstate';

export type FetchResponse<T> = T & {
  error?: unknown;
};

type MachineContext<I> = {
  input: I;
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

export class FetchMachine {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static hasError(_: any, ev: { data: { error?: any } }) {
    return Boolean(ev.data.error);
  }

  static create<Input, Result>(opts: CreateFetchMachineOpts<Input, Result>) {
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
            entry: ['incrementAttemps'],
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const error = ev.data as any;
            toast.error(error.message);
          },
          assignError: assign({
            error: (_, ev) => ev.data,
          }),
          incrementAttemps: assign({
            attempts: (ctx) => (ctx.attempts ?? 0) + 1,
          }),
        },
        guards: {
          hasManyAttempts: (ctx) => Boolean((ctx.attempts ?? 0) > 3),
        },
        services: {
          fetch: opts.fetch,
        },
      }
    );
  }
}
