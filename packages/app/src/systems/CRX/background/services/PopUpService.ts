import type { ResponseMessage, UIEventMessage } from '@fuels-wallet/sdk';
import { POPUP_SCRIPT_NAME, MessageTypes } from '@fuels-wallet/sdk';
import { JSONRPCClient } from 'json-rpc-2.0';

import {
  createPopUp,
  getPopUpId,
  getTabIdFromSender,
  showPopUp,
} from '../../utils';
import type { DeferPromise } from '../../utils/promise';
import { deferPromise } from '../../utils/promise';

import type { CommunicationProtocol } from './CommunicationProtocol';

import { CRXPages } from '~/systems/Core/types';

const popups = new Map<string, PopUpService>();

export class PopUpService {
  openingPromise: DeferPromise<PopUpService>;
  tabId: number | null = null;
  windowId: number | null = null;
  eventId?: string;
  client: JSONRPCClient;

  constructor(readonly communicationProtocol: CommunicationProtocol) {
    this.openingPromise = deferPromise<PopUpService>();
    this.client = new JSONRPCClient(async (rpcRequest) => {
      if (this.eventId) {
        this.communicationProtocol.postMessage({
          type: MessageTypes.request,
          target: POPUP_SCRIPT_NAME,
          id: this.eventId,
          request: rpcRequest,
        });
      } else {
        throw new Error('UI not connected!');
      }
    });
    this.setupUIListeners();
    this.setTimeout();
  }

  setTimeout(delay = 5000) {
    setTimeout(() => {
      this.openingPromise.reject(new Error('PopUp not opened!'));
    }, delay);
  }

  rejectAllRequests = (id: string) => {
    if (id === this.eventId) {
      this.client.rejectAllPendingRequests(
        'Request cancelled without explicity response!'
      );
    }
  };

  onResponse = (cEvent: ResponseMessage) => {
    if (cEvent.id === this.eventId && cEvent.response) {
      this.client.receive(cEvent.response);
    }
  };

  setupUIListeners() {
    this.communicationProtocol.once(MessageTypes.uiEvent, this.onUIEvent);
    this.communicationProtocol.on(MessageTypes.response, this.onResponse);
    this.communicationProtocol.on(
      MessageTypes.removeConnection,
      this.rejectAllRequests
    );
  }

  onUIEvent = (message: UIEventMessage) => {
    const tabId = getTabIdFromSender(message.sender);
    if (tabId === this.tabId && message.ready) {
      this.eventId = message.id;
      this.openingPromise.resolve(this);
    }
  };

  static async getCurrent(origin: string) {
    const currentService = popups.get(origin);

    if (currentService) {
      const showPopupId = await showPopUp(currentService.windowId);
      if (showPopupId) return currentService;
    }

    return null;
  }

  static create = async (
    origin: string,
    communicationProtocol: CommunicationProtocol
  ) => {
    const popupService = new PopUpService(communicationProtocol);

    // Set current instance to memory to avoid
    // Multiple instances
    popups.set(origin, popupService);

    const win = await createPopUp(origin, CRXPages.popup);
    popupService.tabId = await getPopUpId(win.id);
    popupService.windowId = win.id!;

    return popupService;
  };

  static open = async (
    origin: string,
    communicationProtocol: CommunicationProtocol
  ) => {
    let popupService = await this.getCurrent(origin);

    if (!popupService) {
      popupService = await PopUpService.create(origin, communicationProtocol);
    }

    return popupService.openingPromise.promise;
  };

  // UI exposed methods
  async requestAuthorization(origin: string) {
    return this.client.request('requestAuthorization', { origin });
  }
}
