import { Button, Card, Dialog, Icon, Text } from '@fuel-ui/react';

import { useAccounts } from '../../hooks';

import { styles } from '~/systems/Core';
import { OverlayDialogTopbar } from '~/systems/Overlay';

export const Logout = () => {
  const { isLoading, handlers } = useAccounts();

  return (
    <>
      <OverlayDialogTopbar onClose={handlers.closeDialog}>
        Logout
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.content}>
        <Card css={{ padding: '$4' }}>
          <Text
            as="h2"
            color="intentsBase12"
            leftIcon={
              <Icon icon={Icon.is('AlertTriangle')} color="intentsWarning12" />
            }
            css={{ mb: '$4' }}
          >
            IMPORTANT
          </Text>
          <Text color="intentsBase11" css={{ mb: '$2' }}>
            This action will remove all data from this device, including your
            seedphrase and accounts.
          </Text>
          <Text color="intentsBase11" css={{ mb: '$2' }}>
            Make sure you have securely backed up your Seed Phrase before
            removing the wallet.
          </Text>
          <Text color="intentsBase11" css={{ mb: '$2' }}>
            If you have not backed up your Seed Phrase, you will lose access to
            your funds.
          </Text>
          <Text color="intentsBase11" css={{ mb: '$2' }}></Text>
        </Card>
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          aria-label="Logout"
          onPress={handlers.logout}
          isLoading={isLoading}
          isDisabled={isLoading}
          variant="ghost"
          intent="error"
        >
          Logout
        </Button>
      </Dialog.Footer>
    </>
  );
};
