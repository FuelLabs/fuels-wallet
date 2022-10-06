import { WalletCreated } from '../../components';

import { useAccount } from '~/systems/Account';
import { Layout } from '~/systems/Core';

export const WalletCreatedPage = () => {
  const { account } = useAccount();
  return (
    <Layout title="Create Wallet" isPublic>
      <WalletCreated account={account} />
    </Layout>
  );
};
