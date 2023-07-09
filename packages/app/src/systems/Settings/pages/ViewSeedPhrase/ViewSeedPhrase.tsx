import { cssObj } from '@fuel-ui/css';
import { Box, Dialog } from '@fuel-ui/react';

import { DontShareAlert } from '../../components/DontShareAlert';
import { useExportVault } from '../../hooks';

import { Mnemonic, styles as coreStyles } from '~/systems/Core';
import { OverlayDialogTopbar, useOverlay } from '~/systems/Overlay';
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
      <OverlayDialogTopbar onClose={close}>Seed Phrase</OverlayDialogTopbar>
      <Dialog.Description as="div" css={coreStyles.content}>
        <Box.Flex gap="$4" direction="column" align="center">
          <Box css={styles.mnemonicWrapper}>
            <Mnemonic type="read" value={words} />
          </Box>
          <DontShareAlert />
        </Box.Flex>
      </Dialog.Description>
    </>
  );
}

const styles = {
  mnemonicWrapper: cssObj({
    width: '316px',
  }),
};
