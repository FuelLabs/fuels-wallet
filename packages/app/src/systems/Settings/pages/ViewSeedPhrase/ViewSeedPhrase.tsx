import { cssObj } from '@fuel-ui/css';
import { Box, Button, Dialog, Alert, IconButton, Icon } from '@fuel-ui/react';

import { useExportVault } from '../../hooks';

import { Mnemonic } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';
import { UnlockCard } from '~/systems/Unlock';

export function ViewSeedPhrase() {
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
      <Dialog.Heading>
        Seed Phrase
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="intentsBase8" />}
          aria-label="Close unlock window"
          onPress={close}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <Box.Flex gap="$4" direction="column" align="center">
          <Box css={styles.mnemonicWrapper}>
            <Mnemonic type="read" value={words} />
          </Box>
          <Alert status="warning">
            <Alert.Description>
              DON&apos;T SHARE your Recovery Phrase. {'\n'}
              This phrase provides access to all your accounts. Sharing or
              losing it may result in a permanent loss of funds.
            </Alert.Description>
          </Alert>
        </Box.Flex>
      </Dialog.Description>
      <Dialog.Footer>
        <Button variant="ghost" onPress={() => close()}>
          Close
        </Button>
      </Dialog.Footer>
    </>
  );
}

const styles = {
  mnemonicWrapper: cssObj({
    width: '330px',
  }),
};
