import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import { ConnectInfo, Layout } from '~/systems/Core';
import { NetworkReviewCard } from '~/systems/Network';

import { useSelectNetworkRequest } from '../../hooks';

export function SelectNetworkRequest() {
  const { handlers, isLoading, title, favIconUrl, origin, network, popup } =
    useSelectNetworkRequest();
  const { account } = useAccounts();

  if (!origin || !network || !account || !popup) return null;

  const { name = '', url = '' } = network;
  const action = popup === 'add' ? 'Add' : 'Select';

  return (
    <Layout title={`${action} Network Request`} noBorder>
      <Layout.Content css={styles.content} noBorder>
        <ConnectInfo
          origin={origin}
          title={title || ''}
          favIconUrl={favIconUrl}
          headerText={`Request to ${action} Network from:`}
        />
        <NetworkReviewCard
          headerText={`Review the Network to be ${action}:`}
          name={name}
          url={url}
        />
      </Layout.Content>
      <Layout.BottomBar>
        <Button variant="ghost" onPress={handlers.reject}>
          Reject
        </Button>
        <Button
          type="submit"
          intent="primary"
          isLoading={isLoading}
          onPress={handlers.approve}
        >
          {action} Network
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
