import * as css from '@fuel-ui/css';
import { Button, Dialog, Icon } from '@fuel-ui/react';
import { coreStyles } from '~/systems/Core/styles';
import { NetworkList, useNetworks } from '~/systems/Network';
import { OverlayDialogTopbar } from '~/systems/Overlay';

export const Networks = () => {
  const { networks, handlers } = useNetworks();

  return (
    <>
      <OverlayDialogTopbar onClose={handlers.closeDialog}>
        Networks
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.description}>
        <NetworkList
          networks={networks}
          onUpdate={handlers.goToUpdate}
          onClick={handlers.selectNetwork}
          {...(networks?.length > 1 && { onRemove: handlers.removeNetwork })}
        />
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          aria-label="Add network"
          onClick={handlers.openNetworksAdd}
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
