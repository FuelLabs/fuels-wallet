import { cssObj } from '@fuel-ui/css';
import { Box, Button, Text, VStack } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import { ConnectInfo, Layout } from '~/systems/Core';
import { NetworkReviewCard } from '~/systems/Network';

import { useSelectNetworkRequest } from '../../hooks';

export function SelectNetworkRequest() {
  const {
    handlers,
    isLoading,
    title,
    favIconUrl,
    origin,
    network,
    currentNetwork,
    popup,
  } = useSelectNetworkRequest();
  const { account } = useAccounts();

  if (!origin || !network || !account || !popup) return null;

  const { name = '', url = '' } = network;

  if (popup === 'select') {
    return (
      <Layout title="Switch Network Request" noBorder>
        <Layout.Content css={styles.content} noBorder>
          <ConnectInfo
            origin={origin}
            title={title || ''}
            favIconUrl={favIconUrl}
            headerText="Request to Switch Network from:"
          />
          <VStack gap="$1" css={styles.center}>
            <Box css={styles.lowOpacity}>
              <ConnectInfo
                headerText="Current Network"
                title={currentNetwork?.name || 'Unknown'}
                origin={currentNetwork?.url || 'Unknown'}
              />
            </Box>
            <Text as="span" fontSize="lg" css={styles.arrow}>
              &#8595;
            </Text>
            <ConnectInfo headerText="Switching To" title={name} origin={url} />
          </VStack>
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
            Switch Network
          </Button>
        </Layout.BottomBar>
      </Layout>
    );
  }

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
        <Button
          type="submit"
          intent="primary"
          isLoading={isLoading}
          onPress={handlers.approve}
        >
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
  center: cssObj({
    my: 'auto',
  }),
  lowOpacity: cssObj({
    opacity: 0.7,
  }),
  arrow: cssObj({
    alignSelf: 'center',
  }),
};
