import { interpret } from 'xstate';

import { captchaMachine } from './captchaMachine';

describe('captchaMachine', () => {
  it('should hide captcha if no key was informed', (done) => {
    const service = interpret(captchaMachine).onTransition((state) => {
      if (state.matches('hidden')) {
        expect(state.context.key).toBe('');
        done();
      }
    });

    service.start();
  });

  it('should show captcha if key was informed', (done) => {
    const service = interpret(
      captchaMachine.withContext({ key: '6Ld3cEwfAAAAAMd4QTs7aO85LyKGdgj0bFsdBfre' })
    ).onTransition((state) => {
      if (state.matches('loaded')) {
        done();
      }
    });

    service.start();
    service.send('LOAD');
  });
});
