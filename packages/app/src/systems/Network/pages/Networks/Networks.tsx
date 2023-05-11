import { cssObj } from '@fuel-ui/css';
import { Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { coreStyles } from '~/systems/Core/styles';
import { NetworkList, useNetworks } from '~/systems/Network';

export const Networks = () => {
  const { networks, handlers } = useNetworks();

  return (
    <>
      <Dialog.Heading>
        Networks
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="intentsBase8" />}
          aria-label="Close networks modal"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div" css={styles.description}>
        <NetworkList
          networks={networks}
          onUpdate={handlers.goToUpdate}
          onPress={handlers.selectNetwork}
          {...(networks?.length > 1 && { onRemove: handlers.removeNetwork })}
        />
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
  description: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    flex: 1,
    padding: '$4',
  }),
};
