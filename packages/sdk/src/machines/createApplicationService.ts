import { v4 } from 'uuid';
import { interpret } from 'xstate';

import type { EventConnector } from '../events';
import { Events } from '../events';

import { applicationMachine } from './applicationMachine';

export type ApplicationServiceOptions = {
  connector: EventConnector;
};

export const createApplicationService = (
  options: ApplicationServiceOptions
) => {
  const events = new Events<any>({
    id: v4(),
    name: 'FuelWeb3',
    connector: options.connector,
  });
  const machine = applicationMachine.withContext({
    events,
    isConnected: false,
  });
  const service = interpret(machine);

  service.onTransition((state, event) => {
    events.send(state.value.toString(), event.data);
  });

  events.on('connect', () => {
    service.send('CONNECT');
  });

  // service.send('CONNECT');
  // service.send('DISCONNECT');

  return service.start();
};
