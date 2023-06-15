import { cssObj } from '@fuel-ui/css';
import { Button, Card, Text } from '@fuel-ui/react';

import { useAddNetworkRequest } from '../../hooks';

import { useAccounts } from '~/systems/Account';
import { Layout, ConnectInfo } from '~/systems/Core';

export function AddNetworkRequest() {
  const { handlers, title, favIconUrl, origin, network } =
    useAddNetworkRequest();
  const { account } = useAccounts();

  if (!origin || !network || !account) return null;

  return (
    <Layout title="Add Network Request" noBorder>
      <Layout.Content css={styles.content} noBorder>
        <ConnectInfo
          origin={origin}
          title={title || ''}
          favIconUrl={favIconUrl}
          headerText="Request to Add Network from:"
        />
        <Card css={styles.card} gap="$0">
          <Card.Header space="compact">
            Review the Network to be added:
          </Card.Header>
          <Card.Body css={styles.cardContentSection}>
            <Text as="h2" fontSize="lg" color="intentsBase12">
              {network.name}
            </Text>
            <Text fontSize="sm">{network.url}</Text>
          </Card.Body>
        </Card>
      </Layout.Content>
      <Layout.BottomBar>
        <Button variant="ghost" onPress={handlers.reject}>
          Reject
        </Button>
        <Button type="submit" intent="primary" onPress={handlers.approve}>
          Add Network
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
}

const styles = {
  title: cssObj({
    m: '$4',
    mt: '$8',
    textAlign: 'center',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
    padding: '$4 !important',

    '& h2': {
      fontSize: '$sm',
    },
    '& a': {
      fontSize: '$sm',
      fontWeight: '$normal',
    },
  }),
  card: cssObj({
    boxSizing: 'border-box',
  }),
  cardContentSection: cssObj({
    py: '$2',
  }),
};
