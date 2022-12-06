import { Button, Icon } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { MOCK_ACCOUNTS } from '../../__mocks__';
import { AccountList } from '../../components';
import { useAccount } from '../../hooks';

import { Layout, Pages } from '~/systems/Core';

export const Accounts = () => {
  const navigate = useNavigate();
  // TODO fix: change to grab multiple accounts
  const { account, isLoading } = useAccount();

  return (
    <Layout title="Accounts" isLoading={isLoading}>
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />

      <Layout.Content>
        {account && <AccountList accounts={MOCK_ACCOUNTS} />}
      </Layout.Content>
      <Layout.BottomBar>
        <Button
          arial-label="Add account"
          onPress={() => {
            console.log('FIXME');
          }}
          leftIcon={Icon.is('Plus')}
          variant="ghost"
        >
          Create account
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
};
