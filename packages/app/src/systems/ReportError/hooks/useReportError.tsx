import { useMachine, useSelector } from '@xstate/react';

import { reportErrorMachine, type ReportErrorMachineState } from '../machines';
import { ReportErrorFrequency } from '../types';

import { REPORT_ERROR_FREQUENCY_KEY } from '~/config';
import { useStorageItem } from '~/systems/Core/hooks/useStorage';

const selectors = {
  hasErrorsToReport(state: ReportErrorMachineState) {
    return state.context.hasErrors;
  },
  isLoadingSendOnce(state: ReportErrorMachineState) {
    return (
      state.hasTag('loading') &&
      state.context.frequency === ReportErrorFrequency.ONCE
    );
  },
  isLoadingSendAlways(state: ReportErrorMachineState) {
    return (
      state.hasTag('loading') &&
      state.context.frequency === ReportErrorFrequency.ALWAYS
    );
  },
  isLoadingDontSend(state: ReportErrorMachineState) {
    return (
      state.hasTag('loading') &&
      state.context.frequency === ReportErrorFrequency.DONT
    );
  },
  reportErrorSilently(state: ReportErrorMachineState) {
    return (
      state.context.hasErrors &&
      state.context.frequency === ReportErrorFrequency.ALWAYS
    );
  },
};

export function useReportError() {
  const [reportErrorFrequency, setReportErrorFrequency] =
    useStorageItem<ReportErrorFrequency>(
      REPORT_ERROR_FREQUENCY_KEY,
      ReportErrorFrequency.ONCE
    );
  const [, store, service] = useMachine(() =>
    reportErrorMachine
      .withConfig({
        actions: {
          reload: () => window.location.reload(),
        },
      })
      .withContext({
        frequency: reportErrorFrequency || ReportErrorFrequency.ONCE,
      })
  );

  const hasErrorsToReport = useSelector(service, selectors.hasErrorsToReport);
  const isLoadingSendOnce = useSelector(service, selectors.isLoadingSendOnce);
  const isLoadingSendAlways = useSelector(
    service,
    selectors.isLoadingSendAlways
  );
  const isLoadingDontSend = useSelector(service, selectors.isLoadingDontSend);
  const reportErrorSilently = useSelector(
    service,
    selectors.reportErrorSilently
  );

  const reportErrorsOnce = () => {
    // eslint-disable-next-line no-console
    console.log('reportErrorsOnce');
  };

  const alwaysReportErrors = () => {
    // eslint-disable-next-line no-console
    console.log('alwaysReportErrors');
  };

  const dontReportErrors = () => {
    setReportErrorFrequency(ReportErrorFrequency.DONT);
    service.send('REPORT_ERRORS', {
      input: { frequency: ReportErrorFrequency.DONT },
    });
  };

  const close = () => {
    dontReportErrors();
  };

  return {
    hasErrorsToReport,
    reportErrorSilently,
    isLoadingDontSend,
    isLoadingSendAlways,
    isLoadingSendOnce,
    store,
    handlers: {
      reportErrorsOnce,
      alwaysReportErrors,
      dontReportErrors,
      close,
    },
  };
}
