import { MessageTypes, POPUP_SCRIPT_NAME } from '@fuel-wallet/types';
import type { ResponseMessage, UIEventMessage } from '@fuel-wallet/types';
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
import type { MessageInputs, PopUpServiceInputs } from './types';

const popups = new Map<string, PopUpService>();

export class PopUpService {
  openingPromise: DeferPromise<PopUpService> | undefined;
  session: string | null = null;
  tabId: number | null = null;
  windowId: number | null = null;
  tab: chrome.tabs.Tab | null = null;
  eventId?: string;
  client: JSONRPCClient;
  readonly communicationProtocol: CommunicationProtocol;
  private timeoutId: NodeJS.Timeout | null = null;
  private origin: string;

  constructor(communicationProtocol: CommunicationProtocol, origin: string) {
    // Bind methods to ensure correct `this` context
    this.onUIEvent = this.onUIEvent.bind(this);
    this.onResponse = this.onResponse.bind(this);
    this.rejectOpeningPromise = this.rejectOpeningPromise.bind(this);
    this.resolveOpeningPromise = this.resolveOpeningPromise.bind(this);

    this.origin = origin;
    this.communicationProtocol = communicationProtocol;
    this.openingPromise = deferPromise<PopUpService>();
    this.setTimeout();
    this.client = new JSONRPCClient(this.sendRequest);
    this.setupUIListeners();
  }

  rejectOpeningPromise(message = 'PopUp not opened!') {
    if (this.openingPromise) {
      this.clearTimeout();
      this.openingPromise?.reject(new Error(message));
      this.openingPromise = undefined;
      closePopUp(this.tabId!);
    }
  }

  resolveOpeningPromise<T extends PopUpService>(resolver: T) {
    if (this.openingPromise) {
      this.clearTimeout();
      this.openingPromise?.resolve(resolver);
      this.openingPromise = undefined;
    }
  }

  setTimeout(delay = 5000) {
    this.timeoutId = setTimeout(() => {
      this.rejectOpeningPromise('PopUp timed out waiting for event');
    }, delay);
  }

  clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
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

  removeUIListeners() {
    this.communicationProtocol.off(MessageTypes.uiEvent, this.onUIEvent);
    this.communicationProtocol.off(MessageTypes.response, this.onResponse);
    this.communicationProtocol.off(
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
      this.resolveOpeningPromise(this);
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
    const popupService = new PopUpService(communicationProtocol, origin);

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

    if (!popupService.openingPromise?.promise) {
      throw new Error('PopUp has no opening promise');
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

  async selectNetwork(input: PopUpServiceInputs['selectNetwork']) {
    return this.client.request('selectNetwork', input);
  }

  async addNetwork(input: PopUpServiceInputs['addNetwork']) {
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

  destroy() {
    this.clearTimeout();
    this.removeUIListeners();
    this.client.rejectAllPendingRequests('Service is being cleaned up');
    popups.delete(this.origin);
    closePopUp(this.tabId!);
  }

  static destroyAll() {
    for (const popup of popups.values()) {
      popup.destroy();
    }
  }
}
