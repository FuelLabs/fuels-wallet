import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import { Layout, ConnectInfo } from '~/systems/Core';
import { NetworkReviewCard } from '~/systems/Network';

import { useAddNetworkRequest } from '../../hooks';

export function AddNetworkRequest() {
  const { handlers, title, favIconUrl, origin, network } =
    useAddNetworkRequest();
  const { account } = useAccounts();

  if (!origin || !network || !account) return null;

  const { name, url } = network;

  return (
    <Layout title="Add Network Request" noBorder>
      <Layout.Content css={styles.content} noBorder>
        <ConnectInfo
          origin={origin}
          title={title || ''}
          favIconUrl={favIconUrl}
          headerText="Request to Add Network from:"
        />
        <NetworkReviewCard
          headerText="Review the Network to be added:"
          name={name}
          url={url}
        />
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
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
    padding: '$4 !important',
  }),
};
