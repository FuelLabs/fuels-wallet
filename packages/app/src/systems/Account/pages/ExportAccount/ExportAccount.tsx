import { cssObj } from '@fuel-ui/css';
import {
  Button,
  Card,
  Copyable,
  Dialog,
  Stack,
  Text,
  Alert,
} from '@fuel-ui/react';

import { AccountItem } from '../../components';
import { useAccounts } from '../../hooks';
import { useExportAccount } from '../../hooks/useExportAccount';

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
      <Dialog.Heading>Export Private Key</Dialog.Heading>
      <Dialog.Description as="div">
        {account && (
          <Stack gap="$4">
            <AccountItem account={account} />
            <Text css={styles.keyHeaderText}>
              With this Private Key, you can restore your account later. Make
              sure you store it safely.
            </Text>
            <Card css={styles.exportedKey}>
              <Card.Body>
                {exportedKey && (
                  <Copyable value={exportedKey}>
                    <Text fontSize="xs">{exportedKey}</Text>
                  </Copyable>
                )}
              </Card.Body>
            </Card>
            <Alert status="warning" css={styles.alert}>
              <Alert.Description>
                <Text fontSize="xs" css={styles.alertDescription}>
                  DON&apos;T SHARE your Private Key. {'\n'}
                  This key provides access to your account. Sharing or losing it
                  may result in a permanent loss of funds.
                </Text>
              </Alert.Description>
            </Alert>
          </Stack>
        )}
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          color="gray"
          variant="ghost"
          onPress={accountsHandlers.goToList}
        >
          Close
        </Button>
      </Dialog.Footer>
    </>
  );
};

const styles = {
  keyHeaderText: cssObj({
    fontWeight: '$medium',
  }),
  exportedKey: cssObj({
    wordBreak: 'break-all',
    textAlign: 'center',
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
    fontWeight: '$bold',
  }),
};
