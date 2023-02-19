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
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close networks modal"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description
        as="div"
        css={styles.description}
        data-has-scroll={Boolean((networks || []).length >= 6)}
      >
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
    ...coreStyles.scrollable('$gray3'),
    padding: '$4',
    flex: 1,

    '&[data-has-scroll="true"]': {
      padding: '$4 $2 $4 $4',
    },
  }),
};
