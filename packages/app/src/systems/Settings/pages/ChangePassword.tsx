import { cssObj } from '@fuel-ui/css';
import { Alert, Button, InputPassword } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { Layout, Pages } from '~/systems/Core';

export function ChangePassword() {
  const navigate = useNavigate();

  return (
    <Layout title="Change Password">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content css={styles.wrapper}>
        <Alert direction="row" status={'warning'}>
          <Alert.Description>
            If you lose your password and your seed phrase, all you funds can be
            lost forever.
          </Alert.Description>
        </Alert>
        <InputPassword
          css={styles.input}
          name="password"
          placeholder="Type your current password"
        />
        <InputPassword
          css={styles.input}
          name="password"
          placeholder="Type your current password"
        />
        <InputPassword
          css={styles.input}
          name="password"
          placeholder="Type your current password"
        />
      </Layout.Content>
      <Layout.BottomBar>
        <Button variant="ghost">Cancel</Button>
        <Button>Save</Button>
      </Layout.BottomBar>
    </Layout>
  );
}

const styles = {
  input: cssObj({
    w: '235px',
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
