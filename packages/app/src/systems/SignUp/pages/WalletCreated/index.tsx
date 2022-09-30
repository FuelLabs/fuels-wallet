import { WalletCreated } from '../../components';

import { useAccounts } from '~/systems/Account';
import { Layout } from '~/systems/Core';

export const WalletCreatedPage = () => {
  const { account } = useAccounts();
  return (
    <Layout title="Create Wallet" isPublic>
      <WalletCreated account={account} />
    </Layout>
  );
};
