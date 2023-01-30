import { POPUP_SCRIPT_NAME, MessageTypes } from '@fuel-wallet/types';
import type {
  FuelProviderConfig,
  ResponseMessage,
  UIEventMessage,
} from '@fuel-wallet/types';
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
import type { MessageInputs } from './types';

import { CRXPages } from '~/systems/Core/types';
import { NetworkService } from '~/systems/Network/services';

const popups = new Map<string, PopUpService>();

export class PopUpService {
  openingPromise: DeferPromise<PopUpService>;
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
    pathname: string,
    communicationProtocol: CommunicationProtocol
  ) => {
    const popupService = new PopUpService(communicationProtocol);

    // Set current instance to memory to avoid
    // Multiple instances
    popups.set(origin, popupService);

    const win = await createPopUp(origin, `${CRXPages.popup}#${pathname}`);
    popupService.tabId = await getPopUpId(win.id);
    popupService.windowId = win.id!;

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

  async sendTransaction(
    origin: string,
    provider: FuelProviderConfig,
    transaction: string
  ) {
    const selectedNetwork = await NetworkService.getSelectedNetwork();
    if (selectedNetwork?.url !== provider.url) {
      // TODO: Show for the user to add new network before
      // finishing the transaction
      // https://github.com/FuelLabs/fuels-wallet/issues/200
      throw new Error(
        [
          `${provider.url} is different from the user current network!`,
          'Request the user to add the new network. fuel.addNetwork([...]).',
        ].join('\n')
      );
    }
    return this.client.request('sendTransaction', {
      origin,
      transaction,
      provider,
    });
  }
}
