import { useNavigate } from 'react-router-dom';

import { AccountList } from '../../components';
import { useAccounts } from '../../hooks';

import { Layout, Pages } from '~/systems/Core';

export const Accounts = () => {
  const navigate = useNavigate();
  const { accounts, isLoading, handlers } = useAccounts();

  return (
    <Layout title="Accounts" isLoading={isLoading}>
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />

      <Layout.Content>
        {accounts && (
          <AccountList accounts={accounts} onPress={handlers.selectAccount} />
        )}
      </Layout.Content>
    </Layout>
  );
};
