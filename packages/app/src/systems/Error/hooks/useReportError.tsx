import { Services, store } from '~/store';
import type { ReportErrorMachineState } from '../machines';

const selectors = {
  hasErrorsToReport(state: ReportErrorMachineState) {
    return state.context.hasErrors;
  },
  isLoadingSendOnce(state: ReportErrorMachineState) {
    return state.hasTag('loading');
  },
  errors(state: ReportErrorMachineState) {
    return state.context?.errors || [];
  },
};

export function useReportError() {
  const hasErrorsToReport = store.useSelector(
    Services.reportError,
    selectors.hasErrorsToReport
  );
  const isLoadingSendOnce = store.useSelector(
    Services.reportError,
    selectors.isLoadingSendOnce
  );
  const errors = store.useSelector(Services.reportError, selectors.errors);

  const reportErrors = () => {
    store.send(Services.reportError, { type: 'REPORT_ERRORS' });
  };

  const dismissAllErrors = () => {
    store.send(Services.reportError, { type: 'DISMISS_ERRORS' });
  };

  const reloadErrors = () => {
    store.send(Services.reportError, { type: 'CHECK_FOR_ERRORS' });
  };

  const dismissError = (key: string) => {
    store.send(Services.reportError, { type: 'DISMISS_ERROR', input: key });
  };

  return {
    hasErrorsToReport: !!hasErrorsToReport || !!errors.length,
    isLoadingSendOnce,
    errors,
    handlers: {
      reportErrors,
      dismissError,
      dismissAllErrors,
      reloadErrors,
    },
  };
}
