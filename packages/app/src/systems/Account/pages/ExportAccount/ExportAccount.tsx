import { cssObj } from '@fuel-ui/css';
import { Button, Card, Dialog, Stack, Text } from '@fuel-ui/react';

import { AccountItem } from '../../components';
import { useAccounts } from '../../hooks';
import { useExportAccount } from '../../hooks/useExportAccount';

export const ExportAccount = () => {
  const { handlers: accountsHandlers } = useAccounts();
  const { account, exportedKey } = useExportAccount();

  return (
    <>
      <Dialog.Heading>Export Private Key</Dialog.Heading>
      <Dialog.Description as="div">
        {account && (
          <Stack gap="$4">
            <AccountItem account={account} />
            <Text css={styles.keyHeaderText}>
              With this key, you can restore your account later. Make sure you
              store it safely.
            </Text>
            {exportedKey && (
              <Card css={styles.exportedKey}>
                <Card.Body>
                  <Text>{exportedKey}</Text>
                </Card.Body>
              </Card>
            )}
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
  }),
};
