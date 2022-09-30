import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { VITE_FAUCET_RECAPTCHA_KEY } from '~/config';
import type { Maybe } from '~/systems/Core';

type MachineContext = {
  key?: string;
  captcha?: Maybe<string>;
  isLoaded?: boolean;
};

type MachineEvents = { type: 'LOAD' } | { type: 'SET_CAPTCHA'; data: string };

export const captchaMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOhzEwGsCoBiRUABwHtZcAXXZ-BkAD0QBaAEwBGAKwkAbDIAcATgAMi4YtFT5AFikAaEAE8ho0cJKbRsk4s0BmcbNkB2JwF8XetFjyFSAd3QcNAAyzOgQtEEA8gCCACK8LGyc3LwCCKI2imaq4o6a8vay4tp6hunCstIqDjbCjuKi2s5uHhg4BMQk-oH4UCFhtHyw7OjsYCToAGZjAE7IUsrKRLSe7T5dAZy9-RAJrIEpSPyIUqbamuI2jjbqp7nipUJi0pqajqLyTjayNpqyLSBVt5OuwZuh8EkuPgaINhqNxlNZshxEsVm1gaRQeDIdwaHscTwjmk-vISOIpA1nIonMIUTYbI90n8SKJqu8VMI7B8bACgR1SAAbUIQSC0ADKAFEACoAfQAwtEAApSuUACWi+IOhNAxNEjhIFXk9OEMlOd0cjMEFlJjikjmcxQUxgubncIHwzBF8COfPW5CoeKOiS1qSMsiywnk8jylxk1kU9UtYikBvUwlsilqC0jvPR-I2PT6ws1yW1xwQgjsJAKH3uzkcJqcugMiAkKfEtIksg05ikrjdvpBYIhWsDTH2pdDCFqlQyRXe8j1GRs8mbZUaplZkczYnEUdpua8+aFYUgJahU47ojJte0CaNCc0lr3JEzxijl0cq-q8kPa06kwBAKZ5BhOF5EogmSaGSrwLPU4YNKyFotggnIkEUHZcumHZ9tYf4YiQeAQCKZbBpOEEVh8WRSLYbwIbSNhSCYjLqKSPziLkvx9nk7w8gOebrBA3BgOehw6ogtJZAoDj7jRxTUgyKFWraJC2va3GWIuWiiPh-KiWWaQiCu0hyEoKhqD2a5PA4qanD8+56v8rpAA */
  createMachine(
    {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      tsTypes: {} as import('./captchaMachine.typegen').Typegen0,
      schema: { context: {} as MachineContext, events: {} as MachineEvents },
      context: { key: VITE_FAUCET_RECAPTCHA_KEY },
      predictableActionArguments: true,
      id: 'captchaMachine',
      initial: 'checking',
      states: {
        checking: {
          always: [
            {
              cond: (ctx) => Boolean(ctx.isLoaded),
              target: 'loaded',
            },
            {
              cond: (ctx) => Boolean(ctx.key),
              target: 'waitingLoad',
            },
            {
              target: 'hidden',
            },
          ],
        },
        waitingLoad: {
          after: {
            '60000': {
              cond: (ctx) => !ctx.isLoaded,
              target: 'failed',
            },
          },
          on: {
            LOAD: {
              actions: 'assignIsLoaded',
              target: 'transitioning',
            },
          },
        },
        transitioning: {
          after: {
            '500': {
              target: 'loaded',
            },
          },
        },
        loaded: {
          on: {
            SET_CAPTCHA: {
              actions: 'assignCaptcha',
              target: 'done',
            },
          },
        },
        failed: {
          type: 'final',
        },
        hidden: {
          type: 'final',
        },
        done: {
          type: 'final',
        },
      },
    },
    {
      actions: {
        assignCaptcha: assign({ captcha: (_, ev) => ev.data }),
        assignIsLoaded: assign({ isLoaded: (_) => true }),
      },
    }
  );

export type CaptchaMachine = typeof captchaMachine;
export type CaptchaMachineState = StateFrom<CaptchaMachine>;
export type CaptchaMachineService = InterpreterFrom<CaptchaMachine>;
