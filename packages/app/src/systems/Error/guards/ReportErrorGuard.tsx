import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useReportError } from '../hooks';

import { store } from '~/store';

export function ReportErrorGuard() {
  const { reportErrorSilently, hasErrorsToReport } = useReportError();

  useEffect(() => {
    if (hasErrorsToReport) {
      if (reportErrorSilently) {
        store.reportErrorsSilently();
      }
      store.openViewReportErrors();
    }
  }, [hasErrorsToReport, reportErrorSilently]);

  return <Outlet />;
}
