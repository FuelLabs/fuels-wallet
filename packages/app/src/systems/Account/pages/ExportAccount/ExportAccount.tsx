import { cssObj } from '@fuel-ui/css';
import {
  Button,
  Card,
  Copyable,
  Dialog,
  Text,
  Alert,
  Box,
  Tag,
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
          <Box.Stack gap="$4">
            <AccountItem account={account} />
            <Box.Centered>
              <Tag size="xs" color="accent" variant="ghost">
                Private Key:
              </Tag>
            </Box.Centered>
            <Card css={styles.exportedKey}>
              {exportedKey && (
                <Copyable value={exportedKey}>
                  <Text fontSize="xs">{exportedKey}</Text>
                </Copyable>
              )}
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
          </Box.Stack>
        )}
      </Dialog.Description>
      <Dialog.Footer>
        <Button variant="ghost" onPress={accountsHandlers.goToList}>
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
    padding: '$4',
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
