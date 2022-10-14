import type { EventMessage } from '@fuels-wallet/sdk';
import {
  createExtensionPageConnector,
  createUUID,
  Events,
} from '@fuels-wallet/sdk';
import { useInterpret, useSelector } from '@xstate/react';
import { useCallback, useEffect } from 'react';

import type { ApplicationMachineState } from '../machines';
import { ExternalAppEvents, applicationMachine } from '../machines';

const selectors = {
  isConnecting: (state: ApplicationMachineState) => {
    return state.hasTag('connecting');
  },
};

export function useApplication() {
  const applicationService = useInterpret(() => applicationMachine);
  const isConnecting = useSelector(applicationService, selectors.isConnecting);

  useEffect(() => {
    async function init() {
      const currentId = (await chrome.tabs.getCurrent())!.id!;
      const targetId = Number(
        new URLSearchParams(window.location.search).get('targetId')
      );
      const events = new Events({
        connector: createExtensionPageConnector({
          tabId: targetId,
          senderId: chrome.runtime.id,
          namespace: String(currentId),
        }),
        id: createUUID(),
        name: 'FuelWeb3',
      });

      applicationService.onChange((state) => {
        events.send('state', state);
      });

      applicationService.onTransition((state, event) => {
        if (state.hasTag('emitEvent')) {
          events.send('state', state.context);
          events.send(
            state.value.toString(),
            state.context.error || event.data
          );
        }
      });

      Object.values(ExternalAppEvents).forEach((eventName) => {
        events.on(eventName, (_, eventMessage: EventMessage) => {
          applicationService.send(eventName, { data: eventMessage });
        });
      });
    }
    init();
  }, [applicationService]);

  const authorizeApplication = useCallback((accounts: Array<string>) => {
    applicationService.send({
      type: 'authorize',
      data: accounts,
    });
  }, []);

  return {
    isConnecting,
    authorizeApplication,
  };
}
