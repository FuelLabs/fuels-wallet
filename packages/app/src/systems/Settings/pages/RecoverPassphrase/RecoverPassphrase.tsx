import { cssObj } from '@fuel-ui/css';
import {
  Form,
  InputPassword,
  Box,
  Button,
  Flex,
  Heading,
  // Icon,
} from '@fuel-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSettings } from '../../hooks/useSettings';

import { Layout, Mnemonic, Pages } from '~/systems/Core';

export function RecoverPassphrase() {
  const navigate = useNavigate();
  const { isUnlocking, unlockAndGetMnemonic, words, isGettingMnemonic } =
    useSettings();
  const [password, setPassword] = useState('');

  return (
    <Layout title="Recover Passphrase">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        {isUnlocking ? (
          <Flex gap="$4" direction="column">
            <Form.Control>
              <Form.Label>Enter your password to reveal</Form.Label>
              <InputPassword
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </Form.Control>

            <Button
              leftIcon="Eye"
              isLoading={isGettingMnemonic}
              onPress={() => unlockAndGetMnemonic(password)}
            >
              Reveal secret phrase
            </Button>
          </Flex>
        ) : (
          <Flex gap="$4" direction="column" align="center">
            <Heading css={styles.heading} fontSize="lg" as="h4">
              Your private Secret Recovery Phrase
            </Heading>
            <Box css={styles.mnemonicWrapper}>
              <Mnemonic type="read" value={words} />
            </Box>
          </Flex>
        )}
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  mnemonicWrapper: cssObj({
    width: '330px',
  }),
  heading: cssObj({
    margin: '0',
  }),
};
