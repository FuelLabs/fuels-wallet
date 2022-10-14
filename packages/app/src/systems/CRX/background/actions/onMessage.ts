import type { EventMessage } from '@fuels-wallet/sdk';
import {
  createUUID,
  Events,
  createExtensionConnector,
} from '@fuels-wallet/sdk';

import { getPopUp, showPopUp } from '../../utils';

import { ApplicationService } from '~/systems/Application/services';
import { CRXPages } from '~/systems/Core/types';

const queue: Array<EventMessage<any>> = [];

let lastTime: any;
async function startQueue() {
  clearTimeout(lastTime);
  const queueLength = queue.length;
  if (queueLength) {
    const messageBody = queue.pop();
    if (messageBody) {
      try {
        await chrome.runtime.sendMessage(chrome.runtime.id, messageBody);
      } catch (err) {
        queue.push(messageBody);
      }
    }
  }
  lastTime = setTimeout(() => startQueue(), 100);
}

startQueue();

const events = new Events({
  id: createUUID(),
  name: 'FuelWeb3',
  connector: createExtensionConnector({
    senderId: chrome.runtime.id,
  }),
  interceptor: async (message, send) => {
    if (['connect', 'disconnect', 'accounts'].includes(message.event)) {
      return true;
    }

    const app = await ApplicationService.getApplication(message.origin);

    if (!app) {
      send('error', {
        message: 'Application not connected!',
      });
      return false;
    }

    const win = await showPopUp(message.origin, CRXPages.popup);

    const tabId = await getPopUp(win.id);
    if (tabId) {
      const messageBody = {
        namespace: String(tabId),
        ...message,
      };
      queue.push(messageBody);
    }

    return true;
  },
});

events.on('connect', async (_, request: EventMessage<{ tabId: number }>) => {
  const app = await ApplicationService.getApplication(request.origin);
  if (app) {
    events.send('connected', app);
  } else {
    const win = await showPopUp(
      request.origin,
      `${CRXPages.popup}?targetId=${request.metadata?.tabId}`
    );
    const tabId = await getPopUp(win.id);
    if (tabId) {
      const messageBody = {
        namespace: String(tabId),
        ...request,
      };
      queue.push(messageBody);
    }
  }
});

events.on('disconnect', async (_, request: EventMessage) => {
  await ApplicationService.removeApplication(request.origin);
  events.send('disconnected', true);
});

events.on('accounts', async (_, request: EventMessage) => {
  const app = await ApplicationService.getApplication(request.origin);
  const accounts = app?.accounts || [];
  events.send('accounts:return', accounts);
});
