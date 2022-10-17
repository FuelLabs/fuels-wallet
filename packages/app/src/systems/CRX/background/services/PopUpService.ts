import { POPUP_SCRIPT_NAME } from '@fuels-wallet/sdk';
import { JSONRPCClient } from 'json-rpc-2.0';

import type { CommunicationEvent } from '../../types';
import { EventTypes } from '../../types';
import {
  createPopUp,
  getPopUpId,
  getTabIdFromSender,
  showPopUp,
} from '../../utils';
import type { DefferPromise } from '../../utils/promise';
import { defferPromise } from '../../utils/promise';

import type { CommunicationProtocol } from './CommunicationProtocol';

import { CRXPages } from '~/systems/Core/types';

const popups = new Map<string, PopUpService>();

export class PopUpService {
  defferPromise: DefferPromise<PopUpService>;
  communicationProtocol: CommunicationProtocol;
  tabId: number | null = null;
  windowId: number | null = null;
  open: boolean = false;
  client?: JSONRPCClient;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
    this.defferPromise = defferPromise<PopUpService>();
  }

  setTimeout(delay = 5000) {
    setTimeout(() => {
      this.defferPromise.reject(new Error('PopUp not opened!'));
    }, delay);
  }

  async requestAuthorization(origin: string) {
    return this.client?.request('requestAuthorization', {
      origin,
    });
  }

  static async open(
    origin: string,
    communicationProtocol: CommunicationProtocol
  ) {
    const currentService = popups.get(origin);

    if (currentService) {
      const showPopupId = await showPopUp(currentService.windowId);
      if (showPopupId) return currentService;
    }

    const popupService = new PopUpService(communicationProtocol);
    popups.set(origin, popupService);
    const win = await createPopUp(origin, CRXPages.popup);
    popupService.windowId = win.id!;
    popupService.tabId = await getPopUpId(win.id);
    const handler = (event: CommunicationEvent) => {
      const tabId = getTabIdFromSender(event.sender);
      if (tabId === popupService.tabId) {
        popupService.communicationProtocol.off(EventTypes.popup, handler);
        popupService.open = true;
        popupService.client = new JSONRPCClient(async (rpcRequest) => {
          popupService.communicationProtocol.postMessage({
            type: EventTypes.request,
            target: POPUP_SCRIPT_NAME,
            id: event.id,
            data: rpcRequest,
          });
        });
        popupService.communicationProtocol.on(
          EventTypes.response,
          (cEvent: CommunicationEvent) => {
            if (cEvent.id === event.id && cEvent.message.data) {
              popupService.client?.receive(cEvent.message.data);
            }
          }
        );
        popupService.communicationProtocol.on(
          EventTypes.removeConnection,
          (id: string) => {
            if (id === event.id) {
              popupService.client?.rejectAllPendingRequests(
                'Request cancelled without explicity response!'
              );
            }
          }
        );
        popupService.defferPromise.resolve(popupService);
      }
    };
    popupService.communicationProtocol.on(EventTypes.popup, handler);
    popupService.setTimeout();

    return popupService.defferPromise.promise;
  }
}
