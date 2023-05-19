import type { ReportErrorMachineState } from '../machines';

import { store, Services } from '~/store';

const selectors = {
  hasErrorsToReport(state: ReportErrorMachineState) {
    console.log(state);
    return state.context.hasErrors;
  },
  isLoading(state: ReportErrorMachineState) {
    return state.hasTag('loading');
  },
};

export function useReportError() {
  const hasErrorsToReport = store.useSelector(
    Services.reportError,
    selectors.hasErrorsToReport
  );
  const isLoading = store.useSelector(
    Services.reportError,
    selectors.isLoading
  );

  const reportErrorsOnce = () => {
    console.log('reportErrorsOnce');
  };

  const alwaysReportErrors = () => {
    console.log('alwaysReportErrors');
  };

  const dontReportErrors = () => {
    console.log('dontReportErrors');
  };

  const close = () => {
    console.log('close');
  };

  return {
    hasErrorsToReport,
    isLoading,
    handlers: {
      reportErrorsOnce,
      alwaysReportErrors,
      dontReportErrors,
      close,
    },
  };
}
