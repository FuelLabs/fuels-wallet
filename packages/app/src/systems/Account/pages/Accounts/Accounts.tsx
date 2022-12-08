import { useNavigate } from 'react-router-dom';

import { AccountList } from '../../components';
import { useAccount } from '../../hooks';

import { Layout, Pages } from '~/systems/Core';

export const Accounts = () => {
  const navigate = useNavigate();
  // TODO fix: change to grab multiple accounts
  const { accounts, isLoading } = useAccount();

  return (
    <Layout title="Accounts" isLoading={isLoading}>
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />

      <Layout.Content>
        {accounts && <AccountList accounts={accounts} />}
      </Layout.Content>
    </Layout>
  );
};
