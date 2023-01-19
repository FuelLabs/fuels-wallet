import { Button, Card, Icon, Text } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { useAccounts } from '../../hooks';

import { Layout, Pages } from '~/systems/Core';

export const Logout = () => {
  const navigate = useNavigate();
  const { isLoading, handlers } = useAccounts();

  return (
    <Layout title="Logout" isLoading={isLoading}>
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        <Card css={{ padding: '$4' }}>
          <Text
            as="h2"
            color="gray12"
            leftIcon={<Icon icon={Icon.is('Warning')} color="yellow12" />}
            css={{ mb: '$4' }}
          >
            IMPORTANT
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}>
            This action will remove all data from this device, including your
            seedphrase and accounts.
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}>
            Make sure you have securely backed up your seed phrase before
            removing the wallet.
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}>
            If you have not backed up your seed phrase, you will lose access to
            your funds.
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}></Text>
        </Card>
      </Layout.Content>
      <Layout.BottomBar>
        <Button
          aria-label="Logout"
          onPress={handlers.logout}
          isLoading={isLoading}
          isDisabled={isLoading}
          variant="ghost"
          color="red"
        >
          Logout
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
};
