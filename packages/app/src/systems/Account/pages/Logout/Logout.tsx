import { cssObj } from '@fuel-ui/css';
import { Button, Card, Dialog, Icon, Text } from '@fuel-ui/react';
import { styles as rootStyles } from '~/systems/Core';
import { OverlayDialogTopbar } from '~/systems/Overlay';

import { useAccounts } from '../../hooks';

export const Logout = () => {
  const { isLoading, handlers } = useAccounts();

  return (
    <>
      <OverlayDialogTopbar onClose={handlers.closeDialog}>
        Logout
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={rootStyles.content}>
        <Card css={styles.card}>
          <Text
            as="h2"
            color="intentsBase12"
            leftIcon={
              <Icon icon={Icon.is('AlertTriangle')} color="intentsWarning12" />
            }
            css={styles.line}
          >
            IMPORTANT
          </Text>
          <Text css={styles.line}>
            This action will remove all data from this device, including your
            seed phrase and accounts.
          </Text>
          <Text css={styles.line}>
            Please ensure you have securely backed up your seed phrase before
            removing the wallet.
          </Text>
          <Text css={styles.line}>
            If you have not backed up your seed phrase, you will permanently
            lose access to your funds.
          </Text>
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

const styles = {
  card: {
    padding: '$4',
  },
  line: cssObj({
    mb: '$2',
    color: '$intentsBase11',
  }),
};
