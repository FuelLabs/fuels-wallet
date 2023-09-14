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
            seedphrase and accounts.
          </Text>
          <Text css={styles.line}>
            Make sure you have securely backed up your Seed Phrase before
            removing the wallet.
          </Text>
          <Text css={styles.line}>
            If you have not backed up your Seed Phrase, you will lose access to
            your funds.
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
