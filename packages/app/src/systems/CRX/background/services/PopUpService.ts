import { POPUP_SCRIPT_NAME } from '@fuels-wallet/sdk';
import { JSONRPCClient } from 'json-rpc-2.0';

import type { CommunicationEvent } from '../../types';
import { EventTypes } from '../../types';
import { getPopUpId, getTabIdFromSender, showPopUp } from '../../utils';
import type { DefferPromise } from '../../utils/promise';
import { defferPromise } from '../../utils/promise';

import type { CommunicationProtocol } from './CommunicationProtocol';

import { CRXPages } from '~/systems/Core/types';

export class PopUpService {
  defferPromise: DefferPromise<PopUpService>;
  communicationProtocol: CommunicationProtocol;
  id: number | null = null;
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
    const popupService = new PopUpService(communicationProtocol);
    const win = await showPopUp(origin, CRXPages.popup);
    const popId = await getPopUpId(win.id);
    const handler = (event: CommunicationEvent) => {
      const tabId = getTabIdFromSender(event.sender);
      if (tabId === popupService.id) {
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
            console.log('response popup', event.message);
            if (cEvent.id === event.id && event.message.data) {
              popupService.client?.receive(event.message.data);
            }
          }
        );
        // popupService.communicationProtocol.on(
        //   EventTypes.removeConnection,
        //   (id: string) => {
        //     if (id === event.id) {
        //       popupService.client?.rejectAllPendingRequests(
        //         'User closed connection request!'
        //       );
        //     }
        //   }
        // );
        popupService.defferPromise.resolve(popupService);
      }
    };

    popupService.id = popId;
    popupService.communicationProtocol.on(EventTypes.popup, handler);
    popupService.setTimeout();

    return popupService.defferPromise.promise;
  }
}
