import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Dialog, Text } from '@fuel-ui/react';
import { useCurrentAccount } from '~/systems/Account/hooks/useCurrentAccount';
import { Mnemonic, styles as coreStyles } from '~/systems/Core';
import { OverlayDialogTopbar, useOverlay } from '~/systems/Overlay';
import { UnlockCard } from '~/systems/Unlock';

import { useExportVault } from '../../hooks';

export function ViewSeedPhrase() {
  const { close } = useOverlay();
  const { account } = useCurrentAccount();
  const { handlers, error, isUnlockOpened, isLoading, words } = useExportVault(
    account?.vaultId
  );

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

  // Check if the account was imported via private key (no seed phrase available)
  const isPrivateKeyAccount =
    words.length === 0 || words.every((word) => !word);

  return (
    <>
      <OverlayDialogTopbar onClose={close}>Seed Phrase</OverlayDialogTopbar>
      <Dialog.Description as="div" css={coreStyles.content}>
        <Box.Flex gap="$4" direction="column" align="center">
          {isPrivateKeyAccount ? (
            <Box.Stack gap="$4" align="center">
              <Alert status="info" css={styles.noSeedPhraseAlert}>
                <Alert.Description as="div">
                  <Text css={styles.noSeedPhraseTitle}>
                    No Seed Phrase Available
                  </Text>
                  <Text>
                    This account was imported using a private key and does not
                    have a seed phrase. Private key imported accounts are not
                    recoverable via a seed phrase.
                  </Text>
                </Alert.Description>
              </Alert>
              <Alert status="warning">
                <Alert.Description>
                  To backup this account, you need to export the private key
                  instead. You can do this from the account menu by selecting
                  "Export Private Key".
                </Alert.Description>
              </Alert>
            </Box.Stack>
          ) : (
            <>
              <Box css={styles.mnemonicWrapper}>
                <Mnemonic type="read" value={words} />
              </Box>
              <Alert status="warning">
                <Alert.Description as="div">
                  <Box css={styles.alertFirstLine}>
                    NEVER SHARE your Recovery Phrase. {'\n'}
                    It provides full access to all your accounts.
                  </Box>
                  Sharing or losing it may result in permanent loss of your
                  funds.
                </Alert.Description>
              </Alert>
            </>
          )}
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
  noSeedPhraseAlert: cssObj({}),
  noSeedPhraseTitle: cssObj({
    fontWeight: '$semibold',
    mb: '$2',
    display: 'block',
  }),
};
