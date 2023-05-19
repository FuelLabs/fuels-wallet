import { ReportErrorsCard } from '../components/ReportErrorCard';
import { useReportError } from '../hooks';

import { Layout } from '~/systems/Core';

export function ReportErrorsPage() {
  const { handlers } = useReportError();

  return (
    <Layout title="Report Errors">
      <ReportErrorsCard
        onSendAlways={handlers.alwaysReportErrors}
        onClose={handlers.close}
        onDontSend={handlers.dontReportErrors}
        onSendOnce={handlers.reportErrorsOnce}
      />
    </Layout>
  );
}
