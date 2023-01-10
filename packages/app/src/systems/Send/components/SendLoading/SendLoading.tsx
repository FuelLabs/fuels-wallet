import { Layout } from '~/systems/Core';
import { TxContent } from '~/systems/Transaction';

export function SendLoading() {
  return (
    <Layout.Content>
      <TxContent.Loader />
    </Layout.Content>
  );
}
