import { v4 } from 'uuid';
import { interpret } from 'xstate';

import type { EventConnector, EventMessage } from '../events';
import { Events } from '../events';

import {
  createApplicationMachine,
  ExternalAppEvents,
} from './applicationMachine';

export type ApplicationServiceOptions = {
  connector: EventConnector;
  services?: any;
};

export const createApplicationService = (
  options: ApplicationServiceOptions
) => {
  const events = new Events<any>({
    id: v4(),
    name: 'FuelWeb3',
    connector: options.connector,
  });
  const machine = createApplicationMachine(options.services || {});
  const service = interpret(machine);

  service.onTransition((state, event) => {
    if (state.hasTag('emitEvent')) {
      events.send(state.value.toString(), event.data);
    }
  });

  Object.values(ExternalAppEvents).forEach((eventName) => {
    events.on(eventName, (_, eventMessage: EventMessage) => {
      service.send(eventName, { data: eventMessage });
    });
  });

  return service.start();
};
