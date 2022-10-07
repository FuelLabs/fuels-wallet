import { interpret } from 'xstate';
// import { waitFor } from 'xstate/lib/waitFor';

import type { ApplicationMachineService } from './applicationMachine';
import { applicationMachine } from './applicationMachine';

describe('Application Machine', () => {
  let service: ApplicationMachineService;

  beforeEach(() => {
    const machine = applicationMachine.withContext({
      isConnected: false,
    });
    service = interpret(machine).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('Application request connection', async () => {
    // const state = await waitFor(service, (state) => state.matches('done'));
    // const { data } = state.context;
    // expect(data).toEqual(MOCK_ACCOUNT);
  });
});
