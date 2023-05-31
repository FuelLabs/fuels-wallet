import { ReportErrorFrequency } from '@fuel-wallet/types';
import { useMachine, useSelector } from '@xstate/react';

import { reportErrorMachine, type ReportErrorMachineState } from '../machines';

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
};

export function useReportError() {
  const [reportErrorFrequency, setReportErrorFrequency] =
    useStorageItem<ReportErrorFrequency>(
      REPORT_ERROR_FREQUENCY_KEY,
      ReportErrorFrequency.ONCE
    );
  const [state, send, service] = useMachine(() =>
    reportErrorMachine
      .withConfig({
        actions: {
          reload: () => {
            window.location.reload();
          },
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

  const reportErrorsOnce = () => {
    setReportErrorFrequency(ReportErrorFrequency.ONCE);
    send('REPORT_ERRORS', {
      input: { frequency: ReportErrorFrequency.ONCE },
    });
  };

  const alwaysReportErrors = () => {
    setReportErrorFrequency(ReportErrorFrequency.ALWAYS);
    send('REPORT_ERRORS', {
      input: { frequency: ReportErrorFrequency.ALWAYS },
    });
  };

  const dontReportErrors = () => {
    setReportErrorFrequency(ReportErrorFrequency.DONT);
    send('REPORT_ERRORS', {
      input: { frequency: ReportErrorFrequency.DONT },
    });
  };

  const close = () => {
    dontReportErrors();
  };

  return {
    hasErrorsToReport,
    isLoadingDontSend,
    isLoadingSendAlways,
    isLoadingSendOnce,
    state,
    handlers: {
      reportErrorsOnce,
      alwaysReportErrors,
      dontReportErrors,
      close,
    },
  };
}
