import { POPUP_SCRIPT_NAME } from '@fuel-wallet/types';
import { MessageTypes } from '@fuels/connectors';
import type { ResponseMessage, UIEventMessage } from '@fuels/connectors';
import type { JSONRPCRequest } from 'json-rpc-2.0';
import { JSONRPCClient } from 'json-rpc-2.0';
import { CRXPages } from '~/systems/Core/types';
import type { DeferPromise } from '~/systems/Core/utils/promise';
import { deferPromise } from '~/systems/Core/utils/promise';
import { uniqueId } from '~/systems/Core/utils/string';

import {
  closePopUp,
  createPopUp,
  getTabFromSender,
  showPopUp,
} from '../../utils';

import { ReportErrorService } from '~/systems/Error/services/ReportErrorService';
import type { CommunicationProtocol } from './CommunicationProtocol';
import type { MessageInputs } from './types';

const popups = new Map<string, PopUpService>();

export class PopUpService {
  openingPromise: DeferPromise<PopUpService>;
  session: string | null = null;
  tabId: number | null = null;
  windowId: number | null = null;
  tab: chrome.tabs.Tab | null = null;
  eventId?: string;
  client: JSONRPCClient;
  readonly communicationProtocol: CommunicationProtocol;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
    this.openingPromise = deferPromise<PopUpService>();
    this.client = new JSONRPCClient(this.sendRequest);
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
      // Close popup on rejecting connection
      closePopUp(this.tabId);
      // Reject all pending requests
      this.client.rejectAllPendingRequests(
        'Request cancelled without user response!'
      );
    }
  };

  sendRequest = async (rpcRequest: JSONRPCRequest) => {
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
    if (this.session === message.session && message.ready && message.sender) {
      const tab = getTabFromSender(message.sender);
      this.tab = tab!;
      this.tabId = tab?.id!;
      this.eventId = message.id;
      this.openingPromise.resolve(this);
    }
  };

  static async getCurrent(origin: string) {
    const currentService = popups.get(origin);

    if (currentService) {
      const showPopupId = await showPopUp({
        tabId: currentService.tabId!,
        windowId: currentService.windowId!,
      });
      if (showPopupId) return currentService;
    }

    return null;
  }

  static create = async (
    origin: string,
    pathname: string,
    communicationProtocol: CommunicationProtocol
  ) => {
    const session = uniqueId(4);
    const popupService = new PopUpService(communicationProtocol);

    // Set current instance to memory to avoid
    // Multiple instances
    popups.set(origin, popupService);

    const windowId = await createPopUp(
      `${CRXPages.popup}?s=${session}#${pathname}`
    );

    popupService.session = session;
    popupService.windowId = windowId!;

    return popupService;
  };

  static open = async (
    origin: string,
    pathname: string,
    communicationProtocol: CommunicationProtocol
  ) => {
    let popupService = await this.getCurrent(origin);

    if (!popupService) {
      popupService = await PopUpService.create(
        origin,
        pathname,
        communicationProtocol
      );
    }

    return popupService.openingPromise.promise;
  };

  // UI exposed methods
  async requestConnection(input: MessageInputs['requestConnection']) {
    return this.client.request('requestConnection', input);
  }

  async signMessage(input: MessageInputs['signMessage']) {
    return this.client.request('signMessage', input);
  }

  async sendTransaction(input: MessageInputs['sendTransaction']) {
    return this.client.request('sendTransaction', input);
  }

  async addAssets(input: MessageInputs['addAssets']) {
    return this.client.request('addAssets', input);
  }

  async selectNetwork(input: MessageInputs['selectNetwork']) {
    return this.client.request('selectNetwork', input);
  }

  async addNetwork(input: MessageInputs['addNetwork']) {
    return this.client.request('addNetwork', input);
  }

  // Forward to extension side
  async captureError(error: Error) {
    try {
      await this.client.request('saveError', { error });
    } catch (_) {
      // If forwarding fails, save error directly
      await ReportErrorService.saveError(error);
    }
  }
}
