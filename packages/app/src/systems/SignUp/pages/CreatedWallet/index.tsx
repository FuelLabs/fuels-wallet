import { WalletCreated } from '../../components';

import { useAccounts } from '~/systems/Account';
import { Layout } from '~/systems/Core';

export const CreatedWallet = () => {
  const { account } = useAccounts();
  return (
    <Layout title="Wallet Created" isPublic>
      <WalletCreated account={account} />
    </Layout>
  );
};
