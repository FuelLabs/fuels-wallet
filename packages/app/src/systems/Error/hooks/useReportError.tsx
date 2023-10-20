import { useMachine, useSelector } from '@xstate/react';

import { reportErrorMachine, type ReportErrorMachineState } from '../machines';

const selectors = {
  hasErrorsToReport(state: ReportErrorMachineState) {
    return state.context.hasErrors;
  },
  isLoadingSendOnce(state: ReportErrorMachineState) {
    return state.hasTag('loading');
  },
  errors(state: ReportErrorMachineState) {
    const errors = state.context?.errors || [];
    return errors.map((error) => JSON.stringify(error, null, 2)).join('\n');
  },
};

export function useReportError() {
  const [state, send, service] = useMachine(() =>
    reportErrorMachine.withConfig({
      actions: {
        reload: () => {
          window.location.reload();
        },
      },
    })
  );

  const hasErrorsToReport = useSelector(service, selectors.hasErrorsToReport);
  const isLoadingSendOnce = useSelector(service, selectors.isLoadingSendOnce);

  const errors = useSelector(service, selectors.errors);

  const reportErrors = () => {
    send('REPORT_ERRORS');
  };

  const ignoreErrors = () => {
    send('IGNORE_ERRORS');
  };

  const close = () => {
    ignoreErrors();
  };

  return {
    hasErrorsToReport,
    isLoadingSendOnce,
    state,
    errors,
    handlers: {
      reportErrors,
      ignoreErrors,
      close,
    },
  };
}
