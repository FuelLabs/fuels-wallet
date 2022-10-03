import { rest } from 'msw';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type { FaucetMachineService, FaucetMachineState } from './faucetMachine';
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
  let service: FaucetMachineService;
  let state: FaucetMachineState;

  beforeEach(() => {
    service = interpret(
      faucetMachine.withContext({}).withConfig({
        actions: { sendFaucetSuccess() {} },
      })
    ).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
    state = service.getSnapshot();
  });

  it('should go idle if user don`t ask for faucet', async () => {
    expect(state.value).toBe('idle');
    expect(state.context.address).toBeUndefined();
    expect(state.context.captcha).toBeUndefined();
  });

  it('should faucet and go to last stage', async () => {
    const mock = {
      data: {
        address:
          'fuel1rfmv8mz274rd0ge6yhdpkr6vx04s0q635fmts4mpzzp47z96342s8c7yg9',
        captcha: '',
      },
    };

    service.send('START_FAUCET', mock);

    state = await waitFor(service, (state) => state.matches('done'));
    expect(state.context.address).toBe(mock.data.address);
  });
});
