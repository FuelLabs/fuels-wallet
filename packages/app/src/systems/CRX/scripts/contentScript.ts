import {
  BACKGROUND_SCRIPT_NAME,
  CONTENT_SCRIPT_NAME,
  EventType,
  EVENT_MESSAGE,
  PAGE_SCRIPT_NAME,
} from '@fuels-wallet/sdk';
import type {
  FuelWeb3Request,
  FuelWeb3Event,
  FuelWeb3Response,
} from '@fuels-wallet/sdk';

import { EventTypes } from '../types';

import fileName from './pageScript?script&module';

const backgroundScriptConnection = chrome.runtime.connect(chrome.runtime.id, {
  name: BACKGROUND_SCRIPT_NAME,
});

backgroundScriptConnection.onMessage.addListener(
  (message: FuelWeb3Response | FuelWeb3Event) => {
    const shouldAcceptMessage = message.target === CONTENT_SCRIPT_NAME;

    if (shouldAcceptMessage) {
      onMessage(message);
    }
  }
);

function onMessage(message: FuelWeb3Response | FuelWeb3Event) {
  const postMessage = {
    ...message,
    target: PAGE_SCRIPT_NAME,
  };
  window.postMessage(postMessage, window.location.origin);
}

window.addEventListener(
  EVENT_MESSAGE,
  (message: MessageEvent<FuelWeb3Request>) => {
    const { data: event, origin } = message;
    if (
      origin === window.location.origin &&
      event.target === CONTENT_SCRIPT_NAME &&
      event.type === EventType.request
    ) {
      backgroundScriptConnection.postMessage({
        type: EventTypes.request,
        target: BACKGROUND_SCRIPT_NAME,
        request: event.request,
      });
    }
    return true;
  }
);

async function main() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(fileName);
  script.type = 'module';
  script.onload = () => {
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

main();
