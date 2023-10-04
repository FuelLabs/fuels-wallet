import { useAccounts } from '~/systems/Account';
import { Layout } from '~/systems/Core';

import { WalletCreated } from '../../components';

export const CreatedWallet = () => {
  const { account } = useAccounts();
  return (
    <Layout title="Wallet Created" isPublic>
      <WalletCreated account={account} />
    </Layout>
  );
};
