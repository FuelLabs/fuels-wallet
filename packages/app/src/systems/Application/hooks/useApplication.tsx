import {
  BACKGROUND_SCRIPT_NAME,
  POPUP_SCRIPT_NAME,
} from '@fuels-wallet/sdk/src/config';
import { useInterpret, useSelector } from '@xstate/react';
import { JSONRPCServer } from 'json-rpc-2.0';
import { useCallback, useEffect } from 'react';
import { waitFor } from 'xstate/lib/waitFor';

import type { ApplicationMachineState } from '../machines';
import { ExternalAppEvents, applicationMachine } from '../machines';

import { EventTypes } from '~/systems/CRX/types';

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
      const server = new JSONRPCServer();
      const backgroundConnection = chrome.runtime.connect(chrome.runtime.id, {
        name: BACKGROUND_SCRIPT_NAME,
      });

      backgroundConnection.onMessage.addListener((message, port) => {
        if (message.target === POPUP_SCRIPT_NAME && message.data) {
          server.receive(message.data).then((response) => {
            console.log('--->>> send', {
              target: BACKGROUND_SCRIPT_NAME,
              type: EventTypes.response,
              data: response,
            });
            port.postMessage({
              target: BACKGROUND_SCRIPT_NAME,
              type: EventTypes.response,
              data: response,
            });
          });
        }
      });

      backgroundConnection.postMessage({
        target: BACKGROUND_SCRIPT_NAME,
        type: EventTypes.popup,
      });

      server.addMethod('requestAuthorization', async (params: any) => {
        const origin = params?.origin;
        if (origin) {
          applicationService.send(ExternalAppEvents.connect, {
            data: {
              origin,
            },
          });
          try {
            const app = await waitFor(
              applicationService,
              (state) => {
                return state.matches('connected');
              },
              {
                timeout: 60 * 1000 * 5,
              }
            );
            return !!app;
          } catch (err: any) {
            window.close();
            throw new Error('User didnt reject in under than 5 minutes');
          }
        }
        return false;
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
