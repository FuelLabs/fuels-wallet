import { cssObj } from '@fuel-ui/css';
import { Box, Button, Flex, Dialog, Text, Alert } from '@fuel-ui/react';

import { useExportVault } from '../../hooks';

import { Mnemonic } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';
import { UnlockCard } from '~/systems/Unlock';

export function ViewRecoveryPhrase() {
  const { close } = useOverlay();
  const { handlers, error, isUnlockOpened, isLoading, words } =
    useExportVault();

  if (isUnlockOpened) {
    return (
      <UnlockCard
        onUnlock={(password) => {
          handlers.exportVault(password);
        }}
        headerText="Confirm your Password"
        onClose={() => close()}
        unlockError={error}
        isLoading={isLoading}
      />
    );
  }

  return (
    <>
      <Dialog.Heading>Recovery Phrase</Dialog.Heading>
      <Dialog.Description as="div">
        <Flex gap="$4" direction="column" align="center">
          <Box css={styles.mnemonicWrapper}>
            <Mnemonic type="read" value={words} />
          </Box>
          <Alert status="warning" css={styles.alert}>
            <Alert.Description>
              <Text fontSize="xs" css={styles.alertDescription}>
                Do not share your Recovery Phrase. {'\n'}
                The recovery phrase, provide access to all your accounts sharing
                or losing it may result in permanent loss of funds.
              </Text>
            </Alert.Description>
          </Alert>
        </Flex>
      </Dialog.Description>
      <Dialog.Footer>
        <Button color="gray" variant="ghost" onPress={() => close()}>
          Close
        </Button>
      </Dialog.Footer>
    </>
  );
}

const styles = {
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
  mnemonicWrapper: cssObj({
    width: '330px',
  }),
};
