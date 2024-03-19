import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Card, Copyable, Dialog, Text } from '@fuel-ui/react';
import { styles as coreStyles } from '~/systems/Core';
import { OverlayDialogTopbar } from '~/systems/Overlay';
import { UnlockCard } from '~/systems/Unlock';

import { AccountItem } from '../../components';
import { useAccounts } from '../../hooks';
import { useExportAccount } from '../../hooks/useExportAccount';

export const ExportAccount = () => {
  const { handlers: accountsHandlers } = useAccounts();
  const { account, exportedKey, handlers, error, isUnlockOpened, isLoading } =
    useExportAccount();

  if (isUnlockOpened) {
    return (
      <UnlockCard
        onUnlock={(password) => {
          handlers.exportAccount(password);
        }}
        headerText="Confirm your Password"
        onClose={accountsHandlers.goToList}
        unlockError={error}
        isLoading={isLoading}
      />
    );
  }

  return (
    <>
      <OverlayDialogTopbar onClose={accountsHandlers.goToList}>
        Export Private Key
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={coreStyles.content}>
        {account && (
          <Box.Stack gap="$4">
            <AccountItem account={account} />
            <Card>
              <Card.Header space="compact">Private key</Card.Header>
              <Card.Body css={styles.body}>
                {exportedKey && (
                  <Copyable value={exportedKey}>
                    <Text>{exportedKey}</Text>
                  </Copyable>
                )}
              </Card.Body>
            </Card>
            <Alert status="warning" css={styles.alert}>
              <Alert.Description as="div">
                <Text css={styles.alertFirstLine}>
                  DON&apos;T SHARE your Private Key. {'\n'}
                  It provides access to {account.name}.
                </Text>
                Sharing or losing it may result in a permanent loss of funds for
                this account.
              </Alert.Description>
            </Alert>
          </Box.Stack>
        )}
      </Dialog.Description>
    </>
  );
};

const styles = {
  keyHeaderText: cssObj({
    fontWeight: '$normal',
  }),
  body: cssObj({
    wordBreak: 'break-all',
    py: '$2',
  }),
  alert: cssObj({
    '& .fuel_alert--content': {
      gap: '$1',
    },
    ' & .fuel_heading': {
      fontSize: '$sm',
    },
  }),
  alertDescription: cssObj({
    fontWeight: '$normal',
  }),
  alertFirstLine: cssObj({
    mb: '$2',
  }),
};
