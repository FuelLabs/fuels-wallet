import { v4 } from 'uuid';

import FuelWeb3 from './FuelWeb3';
import { createMemoryConnector } from './events';
import { InternalAppEvents } from './machines/applicationMachine';
import { createApplicationService } from './machines/createApplicationService';

const MOCK_APP = {
  origin: 'web.com',
  accounts: ['fuel13su2k9dd54tdn6tqatwcczasldnzh6t2m5yz39vvs8vtr5rjmp2qznhfyq'],
};
const MACHINE_NAME = 'machine.com';

function createConnector() {
  const instance = v4();
  const fuelWeb3Connector = createMemoryConnector(
    instance,
    MOCK_APP.origin,
    MACHINE_NAME
  );
  const appConnector = createMemoryConnector(
    instance,
    MACHINE_NAME,
    MOCK_APP.origin
  );

  return {
    fuelWeb3Connector,
    appConnector,
  };
}

describe('Test FuelWeb3 SDK', () => {
  it('Should request connect', async () => {
    const { fuelWeb3Connector, appConnector } = createConnector();
    const fuelWeb3 = new FuelWeb3({
      connector: fuelWeb3Connector,
    });
    const appService = createApplicationService({
      connector: appConnector,
    });
    expect(appService.getSnapshot().context.isConnected).toBeFalsy();

    appService.onTransition((state) => {
      if (state.matches('connect.idle')) {
        appService.send(InternalAppEvents.authorize, {
          data: MOCK_APP.accounts,
        });
      }
    });

    const connected = await fuelWeb3.connect();

    expect(connected).toEqual(MOCK_APP);
    expect(appService.getSnapshot().context.isConnected).toBeTruthy();
  });

  it('Should be connected', async () => {
    const { fuelWeb3Connector, appConnector } = createConnector();
    const fuelWeb3 = new FuelWeb3({
      connector: fuelWeb3Connector,
    });
    const appService = createApplicationService({
      connector: appConnector,
      services: {
        fetchApplication: async () => {
          return MOCK_APP;
        },
      },
    });
    expect(appService.getSnapshot().context.isConnected).toBeFalsy();

    const connected = await fuelWeb3.connect();

    expect(connected).toEqual(MOCK_APP);
    expect(appService.getSnapshot().context.isConnected).toBeTruthy();
  });
});
