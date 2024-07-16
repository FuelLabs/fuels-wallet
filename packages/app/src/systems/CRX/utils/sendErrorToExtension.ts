import { POPUP_SCRIPT_NAME } from '@fuel-wallet/types';
import { MessageTypes } from '@fuels/connectors';
import { JSONRPCClient, type JSONRPCRequest } from 'json-rpc-2.0';
import type { CommunicationProtocol } from '~/systems/CRX/background/services/CommunicationProtocol';
import { ReportErrorService } from '~/systems/Error/services/ReportErrorService';

export async function sendErrorToExtension(
  communicationProtocol: CommunicationProtocol,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: any
) {
  try {
    try {
      const sendRequest = async (rpcRequest: JSONRPCRequest) => {
        communicationProtocol.postMessage({
          type: MessageTypes.request,
          target: POPUP_SCRIPT_NAME,
          id: '0',
          request: rpcRequest,
        });
      };
      const client = new JSONRPCClient(sendRequest);
      await client.request('saveError', { error });
    } catch (_) {
      // If forwarding fails, save error directly
      await ReportErrorService.saveError({ error: error });
    }
    return;
  } catch (e) {
    // If popup service is not available, save error directly to indexedDB
    console.warn(
      'Failed to communicate error to extension, saving to indexedDB',
      e
    );
    ReportErrorService.saveError({ error });
  }
}
