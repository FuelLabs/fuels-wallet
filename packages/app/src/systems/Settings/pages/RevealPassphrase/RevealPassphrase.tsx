import { cssObj } from '@fuel-ui/css';
import {
  Form,
  InputPassword,
  Box,
  Button,
  Flex,
  Heading,
} from '@fuel-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSettings } from '../../hooks/useSettings';

import { Layout, Mnemonic, Pages } from '~/systems/Core';

export function RevealPassphrase() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const { handlers, ...ctx } = useSettings();

  return (
    <Layout title="Reveal Passphrase">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        {ctx.waitingPass || ctx.isLoading ? (
          <Flex gap="$4" direction="column">
            <Form.Control>
              <Form.Label>Enter your password to reveal</Form.Label>
              <InputPassword
                aria-label="Current Password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </Form.Control>
            <Button
              leftIcon="Eye"
              isLoading={ctx.isLoading}
              onPress={() => handlers.revealPassphrase(password)}
            >
              Reveal secret phrase
            </Button>
          </Flex>
        ) : (
          <Flex gap="$4" direction="column" align="center">
            <Heading css={styles.heading} as="h4">
              Your private Secret Recovery Phrase
            </Heading>
            <Box css={styles.mnemonicWrapper}>
              <Mnemonic type="read" value={ctx.words} />
            </Box>
          </Flex>
        )}
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  mnemonicWrapper: cssObj({
    mx: '$0',
  }),
  heading: cssObj({
    margin: '0',
    fontSize: '$lg',
    textAlign: 'center',
  }),
};
