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
        address: 'fuel1rfmv8mz274rd0ge6yhdpkr6vx04s0q635fmts4mpzzp47z96342s8c7yg9',
        captcha:
          '03AIIukzi19UPnXoPApWK700VWImMxuXljUWSE4YZXpPZoVx2NFHsy712RMtzPVHy47mHcstbwXdud3Z8tP2mdzPcdOB2BCj7usfQ8_P7mkfCYHpQYh3A5zYz5Ki837eFcuI74XUftdtfgaTox7r1H14H4Rvg8_zomDN30yNr1e7',
      },
    });
  });
});
