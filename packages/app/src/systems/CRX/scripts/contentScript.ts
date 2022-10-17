import {
  BACKGROUND_SCRIPT_NAME,
  CONTENT_SCRIPT_NAME,
  EVENT_MESSAGE,
  PAGE_SCRIPT_NAME,
} from '@fuels-wallet/sdk';
import type { FuelMessage } from '@fuels-wallet/sdk';

import { EventTypes } from '../types';

import fileName from './pageScript?script&module';

const backgroundScriptConnection = chrome.runtime.connect(chrome.runtime.id, {
  name: BACKGROUND_SCRIPT_NAME,
});

backgroundScriptConnection.onMessage.addListener((message) => {
  if (message.target === CONTENT_SCRIPT_NAME && message.data) {
    sendMessage(message);
  }
});

function sendMessage(response: any) {
  let message: any = {
    target: PAGE_SCRIPT_NAME,
    request: response.data,
  };

  if (response.type === EventTypes.event) {
    message = {
      target: PAGE_SCRIPT_NAME,
      type: EventTypes.event,
      data: response.data,
    };
  }

  window.postMessage(message, window.location.origin);
}

window.addEventListener(
  EVENT_MESSAGE,
  (messageEvent: MessageEvent<FuelMessage>) => {
    if (
      messageEvent.origin === window.location.origin &&
      messageEvent.data.target === CONTENT_SCRIPT_NAME
    ) {
      backgroundScriptConnection.postMessage({
        type: EventTypes.request,
        ...messageEvent.data,
        target: BACKGROUND_SCRIPT_NAME,
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
