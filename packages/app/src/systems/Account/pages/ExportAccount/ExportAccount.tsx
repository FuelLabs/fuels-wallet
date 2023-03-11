import { cssObj } from '@fuel-ui/css';
import { Box, Button, Card, Dialog, Stack, Text } from '@fuel-ui/react';
import { useEffect } from 'react';

import { AccountItem } from '../../components';
import { useAccounts } from '../../hooks';

export const ExportAccount = () => {
  const { accountToExport, exportedKey, handlers } = useAccounts();
  useEffect(() => {
    handlers.exportAccount({ address: accountToExport?.address || '' });
  }, []);

  return (
    <Box>
      <Dialog.Heading>Export Private Key</Dialog.Heading>
      <Dialog.Description as="div">
        {accountToExport && (
          <Stack gap="$4">
            <AccountItem account={accountToExport} />
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
          onPress={handlers.closeExportAccount}
        >
          Close
        </Button>
      </Dialog.Footer>
    </Box>
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
