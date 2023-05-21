import { ReportErrorFrequency } from './types';

import type { Store } from '~/store';
import { Services } from '~/store';

export function reportErrorEvents(store: Store) {
  return {
    reportErrorsSilently() {
      store.send(Services.reportError, {
        type: 'REPORT_ERRORS',
        input: {
          frequency: ReportErrorFrequency.ALWAYS,
        },
      });
    },
  };
}
