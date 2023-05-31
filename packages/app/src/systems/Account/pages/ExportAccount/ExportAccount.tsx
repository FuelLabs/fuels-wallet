import { cssObj } from '@fuel-ui/css';
import { Card, Copyable, Dialog, Text, Box } from '@fuel-ui/react';

import { AccountItem } from '../../components';
import { useAccounts } from '../../hooks';
import { useExportAccount } from '../../hooks/useExportAccount';

import { OverlayDialogTopbar } from '~/systems/Overlay';
import { DontShareAlert } from '~/systems/Settings/components';
import { UnlockCard } from '~/systems/Unlock';

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
      <Dialog.Description as="div">
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
            <DontShareAlert css={styles.alert} />
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
};
