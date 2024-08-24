import { CommunicationProtocol } from '~/systems/CRX/background/services/CommunicationProtocol';
import { listenToGlobalErrors } from '~/systems/Core/utils/listenToGlobalErrors';
import { ReportErrorService } from '~/systems/Error/services/ReportErrorService';

export const communicationProtocol = new CommunicationProtocol();

listenToGlobalErrors((error) => {
  ReportErrorService.saveError(error);
});

export function errorBoundary<T extends () => ReturnType<T>>(
  cb: T
): ReturnType<T> {
  try {
    return cb();
  } catch (err) {
    ReportErrorService.saveError(err as Error);
    throw err;
  }
}
