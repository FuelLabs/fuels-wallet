import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useReportError } from '../hooks';

import { store } from '~/store';

export function ReportErrorGuard() {
  const { hasErrorsToReport } = useReportError();

  useEffect(() => {
    if (hasErrorsToReport) {
      store.openViewReportErrors();
    }
  }, [hasErrorsToReport]);

  return <Outlet />;
}
