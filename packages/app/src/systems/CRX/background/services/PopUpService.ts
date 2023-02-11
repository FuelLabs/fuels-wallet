import { POPUP_SCRIPT_NAME, MessageTypes } from '@fuel-wallet/types';
import type { ResponseMessage, UIEventMessage } from '@fuel-wallet/types';
import { JSONRPCClient } from 'json-rpc-2.0';

import { createPopUp, getTabIdFromSender, showPopUp } from '../../utils';
import type { DeferPromise } from '../../utils/promise';
import { deferPromise } from '../../utils/promise';

import type { CommunicationProtocol } from './CommunicationProtocol';
import type { MessageInputs } from './types';

import { CRXPages } from '~/systems/Core/types';
import { uniqueId } from '~/systems/Core/utils/string';
import { NetworkService } from '~/systems/Network/services';

const popups = new Map<string, PopUpService>();

export class PopUpService {
  openingPromise: DeferPromise<PopUpService>;
  session: string | null = null;
  tabId: number | null = null;
  windowId: number | null = null;
  eventId?: string;
  client: JSONRPCClient;
  readonly communicationProtocol: CommunicationProtocol;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
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
    if (this.session === message.session && message.ready) {
      const tabId = getTabIdFromSender(message.sender);
      this.tabId = tabId!;
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
  async requestConnection(origin: string) {
    return this.client.request('requestConnection', { origin });
  }

  async signMessage(input: MessageInputs['signMessage']) {
    return this.client.request('signMessage', input);
  }

  async sendTransaction(input: MessageInputs['sendTransaction']) {
    const selectedNetwork = await NetworkService.getSelectedNetwork();
    if (selectedNetwork?.url !== input.provider.url) {
      // TODO: Show for the user to add new network before
      // finishing the transaction
      // https://github.com/FuelLabs/fuels-wallet/issues/200
      throw new Error(
        [
          `${input.provider.url} is different from the user current network!`,
          'Request the user to add the new network. fuel.addNetwork([...]).',
        ].join('\n')
      );
    }
    return this.client.request('sendTransaction', input);
  }

  async addAsset(input: MessageInputs['addAsset']) {
    return this.client.request('addAsset', input);
  }
}
