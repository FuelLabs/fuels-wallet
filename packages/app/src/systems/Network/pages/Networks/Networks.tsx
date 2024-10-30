import * as css from '@fuel-ui/css';
import { Button, CardList, Dialog, Icon } from '@fuel-ui/react';
import { DEFAULT_NETWORKS } from '~/networks';
import { coreStyles } from '~/systems/Core/styles';
import { NetworkItem, useNetworks } from '~/systems/Network';
import { OverlayDialogTopbar } from '~/systems/Overlay';

export const Networks = () => {
  const { networks, handlers } = useNetworks();

  return (
    <>
      <OverlayDialogTopbar onClose={handlers.closeDialog}>
        Networks
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.description}>
        <CardList gap="$4" isClickable>
          {networks.map((network) => {
            const isDefault = !!DEFAULT_NETWORKS.find(
              (n) => n.url === network?.url
            );
            return (
              <NetworkItem
                key={network.id}
                network={network}
                onUpdate={handlers.goToUpdate}
                onRemove={isDefault ? undefined : handlers.removeNetwork}
                onPress={handlers.selectNetwork}
              />
            );
          })}
        </CardList>
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          aria-label="Add network"
          onPress={handlers.openNetworksAdd}
          leftIcon={Icon.is('Plus')}
          variant="ghost"
        >
          Add new network
        </Button>
      </Dialog.Footer>
    </>
  );
};

const styles = {
  description: css.cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    overflowY: 'scroll !important',
    paddingLeft: '$4',
    flex: 1,
  }),
};
