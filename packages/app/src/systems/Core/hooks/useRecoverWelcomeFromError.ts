import type { DatabaseRestartEvent } from '@fuel-wallet/types';
import { useLayoutEffect } from 'react';
import { IS_CRX } from '../../../config';

/**
 * @description This hook is used to detect and flag the welcome screen to be recovered from an error state.
 */
export function useRecoverWelcomeFromError() {
  useLayoutEffect(() => {
    const handleRestartEvent = async (message: DatabaseRestartEvent) => {
      const { type: eventType, payload } = message ?? {};
      const isErrorState =
        eventType === 'DB_EVENT' && payload.event === 'restarted';

      if (isErrorState) {
        chrome.storage.local.set({ shouldRecoverWelcomeFromError: true });
      }
    };

    if (IS_CRX) {
      chrome.runtime.onMessage.addListener(handleRestartEvent);
    }

    return () => {
      chrome.runtime.onMessage.removeListener(handleRestartEvent);
    };
  }, []);
}
