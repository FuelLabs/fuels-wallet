import { cssObj } from '@fuel-ui/css';
import { Box, Button, Card, Copyable, Dialog, Text } from '@fuel-ui/react';

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
            <Text css={styles.keyHeaderText}>
              Using this Private Key, you can restore your account later. Make
              sure you store it safely.
            </Text>
            <Card css={styles.exportedKey}>
              {exportedKey && (
                <Copyable value={exportedKey}>
                  <Text fontSize="xs">{exportedKey}</Text>
                </Copyable>
              )}
            </Card>
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
};
