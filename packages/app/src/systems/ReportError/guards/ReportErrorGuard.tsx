import { Outlet } from 'react-router-dom';

import { useReportError } from '../hooks';
import { ReportErrorsPage } from '../pages';

export function ReportErrorGuard() {
  const { reportErrorSilently, hasErrorsToReport } = useReportError();

  if (hasErrorsToReport && !reportErrorSilently) {
    return <ReportErrorsPage />;
  }

  return <Outlet />;
}
