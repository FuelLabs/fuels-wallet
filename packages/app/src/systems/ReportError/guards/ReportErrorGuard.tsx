import { Outlet } from 'react-router-dom';

import { useReportError } from '../hooks';
import { ReportErrorsPage } from '../pages';

export function ReportErrorGuard() {
  const { hasErrorsToReport } = useReportError();

  console.log({
    hasErrorsToReport,
  });

  if (hasErrorsToReport) {
    return <ReportErrorsPage />;
  }

  return <Outlet />;
}
