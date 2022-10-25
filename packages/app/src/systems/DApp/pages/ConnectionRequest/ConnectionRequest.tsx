import { cssObj } from '@fuel-ui/css';
import { Button, Card, Flex, Icon, Link, List, Text } from '@fuel-ui/react';
import { useCallback } from 'react';

import { useAccount } from '~/systems/Account';
import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import { ConnectInfo } from '~/systems/DApp';

const PERMISSION_LIST = [
  'View your wallet address',
  'Request transactions approval',
  'Request message signature',
  'Read your transactions history',
];
const NOT_ALLOWED_LIST = ['View your private keys'];

export function ConnectionRequest() {
  const { account, isLoading } = useAccount();
  const origin = 'dapp.com';
  const authorize = useCallback((accounts: Array<string>) => {
    // eslint-disable-next-line no-console
    console.log(accounts);
  }, []);

  if (!account) return null;

  return (
    <Layout title="Connection Request" isLoading={isLoading}>
      <Layout.TopBar type={TopBarType.external} />
      <Layout.Content css={styles.content}>
        <ConnectInfo origin={origin} account={account} />
        <Card css={styles.connectionDetails}>
          <Text as="h2" color="gray12" css={{ mb: '$2' }}>
            This site will be able to:
          </Text>
          <List icon={Icon.is('Check')} iconColor="accent9">
            {PERMISSION_LIST.map((permission) => (
              <List.Item css={styles.listItem} key={permission}>
                {permission}
              </List.Item>
            ))}
          </List>
          <List icon={Icon.is('X')} iconColor="red10">
            {NOT_ALLOWED_LIST.map((permission) => (
              <List.Item css={styles.listItem} key={permission}>
                {permission}
              </List.Item>
            ))}
          </List>
        </Card>
        <Flex css={{ flex: '1 0' }} justify="center" align={'flex-end'}>
          <Text fontSize="sm" as={'h2'} className="warning">
            Only connect with sites you trust.{' '}
            <Link href="#" color="accent11">
              Learn more
            </Link>
            .
          </Text>
        </Flex>
      </Layout.Content>
      <Layout.BottomBar>
        <Button color="gray" variant="ghost">
          Reject
        </Button>
        <Button
          type="submit"
          color="accent"
          onPress={() => authorize([account.address])}
        >
          Connect
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
}

const styles = {
  listItem: cssObj({
    fontSize: '$sm',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '$0',
    '& h2': {
      fontSize: '$sm',
    },
    '& a': {
      fontSize: '$sm',
      fontWeight: '$bold',
    },
  }),
  connectionDetails: cssObj({
    marginTop: '$4',
    px: '$3',
    paddingTop: '$2',
    paddingBottom: '$4',
  }),
};
