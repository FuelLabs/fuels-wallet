import { interpret } from 'xstate';

import { faucetMachine } from './faucetMachine';

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
        address: 'fuel1a298g66nj7tac33trs0039uzlpx7tar30038gs7cr6gqln268csq9yssrl',
        captcha: '',
      },
    });
  });
});
