import { cssObj } from '@fuel-ui/css';
import {
  Button,
  Card,
  Copyable,
  Dialog,
  Link,
  Spinner,
  Stack,
  Text,
} from '@fuel-ui/react';


import { AccountItem } from '../../components';
import { useAccounts } from '../../hooks';
import { useExportAccount } from '../../hooks/useExportAccount';

import { UnlockCard } from '~/systems/Unlock';

export const ExportAccount = () => {
  const { handlers: accountsHandlers } = useAccounts();
  const {
    account,
    exportedKey,
    handlers,
    isWaitingPassword,
    isLoading,
    isFailed,
  } = useExportAccount();

  if (isWaitingPassword) {
    return (
      <UnlockCard
        onUnlock={(password) => {
          handlers.exportAccount(password);
        }}
        headerText="Confirm your Password"
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
              Using this Private Key, you can restore your account later. Make
              sure you store it safely.
            </Text>
            <Card css={styles.exportedKey}>
              <Card.Body>
                {isLoading && <Spinner />}
                {isFailed && (
                  <>
                    <Text fontSize="sm">
                      Failed to export. Invalid Credentials.
                    </Text>
                    <Link onClick={handlers.retry} aria-label="Retry Unlock">
                      Try again
                    </Link>
                  </>
                )}
                {exportedKey && (
                  <Copyable value={exportedKey}>
                    <Text fontSize="xs">{exportedKey}</Text>
                  </Copyable>
                )}
              </Card.Body>
            </Card>
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
};
