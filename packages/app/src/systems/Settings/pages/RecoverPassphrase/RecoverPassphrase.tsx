import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { useSettings } from '../../hooks/useSettings';

import { Layout, Mnemonic, Pages } from '~/systems/Core';
import { UnlockDialog } from '~/systems/DApp';
import { Header } from '~/systems/SignUp/components';

export function RecoverPassphrase() {
  const navigate = useNavigate();
  const { isUnlocking, unlockAndGetMnemonic, words } = useSettings();

  return (
    <Layout title="Recover Passphrase">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content css={styles.wrapper}>
        <Header
          title="This is your recover phrase"
          subtitle="Store it in a safe place"
        />
        <Box css={styles.mnemonicWrapper}>
          <Mnemonic type="read" value={words} />
        </Box>
        <UnlockDialog
          onClose={() => navigate(-1)}
          isOpen={isUnlocking}
          onUnlock={unlockAndGetMnemonic}
        />
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  mnemonicWrapper: cssObj({
    width: '330px',
  }),
  wrapper: cssObj({
    display: 'flex',
    gap: '$6',
    flex: 1,
    overflowY: 'scroll',
    alignItems: 'center',
    flexDirection: 'column',
  }),
};
