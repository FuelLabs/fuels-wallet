import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type {
  CaptchaMachineService,
  CaptchaMachineState,
} from './captchaMachine';
import { captchaMachine } from './captchaMachine';

describe('captchaMachine', () => {
  let service: CaptchaMachineService;
  let state: CaptchaMachineState;

  beforeEach(() => {
    service = interpret(captchaMachine.withContext({})).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
    state = service.getSnapshot();
  });

  it('should hide captcha if no key was informed', async () => {
    state = await waitFor(service, (state) => state.matches('hidden'));
    expect(state.context.key).toBeUndefined();
  });

  it('should show captcha if key was informed', async () => {
    const machine = captchaMachine.withContext({
      key: '6Ld3cEwfAAAAAMd4QTs7aO85LyKGdgj0bFsdBfre',
    });
    service = interpret(machine).start();
    state = service.getSnapshot();
    expect(state.value).toBe('waitingLoad');

    service.send('LOAD');
    state = await waitFor(service, (state) => state.matches('loaded'));
    expect(state.context.isLoaded).toBe(true);
  });
});
