import { rest } from 'msw';
import { interpret } from 'xstate';

import { faucetMachine } from './faucetMachine';

import { mockServer } from '~/mocks/server';

mockServer([
  rest.post('http://localhost:4041/dispense', (req, res, ctx) => {
    return res(
      ctx.json({
        status: 'Success',
        tokens: 500000000,
      })
    );
  }),
]);

describe('faucetMachine', () => {
  it('should go idle if user don`t ask for faucet', (done) => {
    const service = interpret(faucetMachine).onTransition((state) => {
      expect(state.matches('idle')).toBe(true);
      done();
    });

    service.start();
  });

  it('should show done feedback after faucet and before closing the popup', (done) => {
    const service = interpret(faucetMachine.withContext({})).onTransition((state) => {
      if (state.matches('showingDoneFeedback')) {
        done();
      }
    });

    service.start();
    service.send('START_FAUCET', {
      data: {
        address: 'fuel1rfmv8mz274rd0ge6yhdpkr6vx04s0q635fmts4mpzzp47z96342s8c7yg9',
        captcha: '',
      },
    });
  });
});
