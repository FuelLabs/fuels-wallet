import { CommunicationProtocol } from '~/systems/CRX/background/services/CommunicationProtocol';
import { listenToGlobalErrors } from '~/systems/Core/utils/listenToGlobalErrors';
import { sendErrorToExtension } from './sendErrorToExtension';

export const communicationProtocol = new CommunicationProtocol();

listenToGlobalErrors((error) => {
  sendErrorToExtension(communicationProtocol, error);
});

export function errorBoundary<T extends () => ReturnType<T>>(
  cb: T
): ReturnType<T> {
  try {
    return cb();
  } catch (err) {
    sendErrorToExtension(communicationProtocol, err as Error);
    throw err;
  }
}
