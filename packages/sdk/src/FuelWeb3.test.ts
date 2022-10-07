// import { waitFor } from 'xstate/lib/waitFor';

import FuelWeb3 from './FuelWeb3';
import { createMemoryConnector } from './events';
import { createApplicationService } from './machines/createApplicationService';

// const state =

describe('Test FuelWeb3 SDK', () => {
  it('Should request connect', async () => {
    const fuelWeb3 = new FuelWeb3({
      connector: createMemoryConnector('web', 'machine'),
    });

    const appService = createApplicationService({
      connector: createMemoryConnector('machine', 'web'),
    });

    expect(appService.machine.context.isConnected).toBeFalsy();

    appService.onTransition((state) => {
      if (state.matches('connect.idle')) {
        appService.send('AUTHORIZE');
      }
    });

    const connected = await fuelWeb3.connect();

    expect(connected).toBeTruthy();
  });
});
