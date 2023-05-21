import { ReportErrorsCard } from '../components/ReportErrorCard';
import { useReportError } from '../hooks';

import { Layout } from '~/systems/Core';

export function ReportErrorsPage() {
  const {
    handlers,
    isLoadingDontSend,
    isLoadingSendAlways,
    isLoadingSendOnce,
  } = useReportError();

  return (
    <Layout title="Report Errors">
      <ReportErrorsCard
        onSendAlways={handlers.alwaysReportErrors}
        onClose={handlers.close}
        onDontSend={handlers.dontReportErrors}
        onSendOnce={handlers.reportErrorsOnce}
        isLoadingDontSend={isLoadingDontSend}
        isLoadingSendAlways={isLoadingSendAlways}
        isLoadingSendOnce={isLoadingSendOnce}
      />
    </Layout>
  );
}
