import { Button, Icon } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { Layout, Pages } from '~/systems/Core';
import { NetworkList, NetworkScreen, useNetworks } from '~/systems/Network';

export function Networks() {
  const navigate = useNavigate();
  const { networks, isLoading, handlers } = useNetworks({
    type: NetworkScreen.list,
  });

  return (
    <Layout title="Networks" isLoading={isLoading}>
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        {networks && (
          <NetworkList
            networks={networks}
            onUpdate={handlers.goToUpdate}
            onPress={handlers.selectNetwork}
            {...(networks?.length > 1 && { onRemove: handlers.removeNetwork })}
          />
        )}
      </Layout.Content>
      <Layout.BottomBar>
        <Button
          aria-label="Add network"
          onPress={handlers.goToAdd}
          leftIcon={Icon.is('Plus')}
          variant="ghost"
        >
          Add new network
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
}
