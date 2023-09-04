import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Dialog } from '@fuel-ui/react';
import { Mnemonic, styles as coreStyles } from '~/systems/Core';
import { OverlayDialogTopbar, useOverlay } from '~/systems/Overlay';
import { UnlockCard } from '~/systems/Unlock';

import { useExportVault } from '../../hooks';

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
      <OverlayDialogTopbar onClose={close}>Seed Phrase</OverlayDialogTopbar>
      <Dialog.Description as="div" css={coreStyles.content}>
        <Box.Flex gap="$4" direction="column" align="center">
          <Box css={styles.mnemonicWrapper}>
            <Mnemonic type="read" value={words} />
          </Box>
          <Alert status="warning">
            <Alert.Description as="div">
              <Box css={styles.alertFirstLine}>
                DON&apos;T SHARE your Recovery Phrase. {'\n'}
                It provides access to all your accounts.
              </Box>
              Sharing or losing it may result in a permanent loss of funds.
            </Alert.Description>
          </Alert>
        </Box.Flex>
      </Dialog.Description>
    </>
  );
}

const styles = {
  mnemonicWrapper: cssObj({
    width: '316px',
  }),
  alertFirstLine: cssObj({
    mb: '$2',
  }),
};
