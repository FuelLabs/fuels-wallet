/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Stack, Text, Button, Input } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '~/components/ExampleBox';
import { useFuelWeb3 } from '~/hooks/useFuelWeb3';
import { useLoading } from '~/hooks/useLoading';

export function SignMessage() {
  const [FuelWeb3, notDetected] = useFuelWeb3();
  const [connected] = useState(false);
  const [signedMessage, setSignedMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('Message to sign');

  const [handleSignMessage, isSingingMessage, errorSigningMessage] = useLoading(
    async (message: string) => {
      console.debug('Request signature of message!');
      const accounts = await FuelWeb3.accounts();
      const account = accounts[0];
      const signedMessage = await FuelWeb3.signMessage(account, message);
      setSignedMessage(signedMessage);
      console.debug('Message signature', signedMessage);
    }
  );

  const errorMessage = notDetected || errorSigningMessage;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={{ gap: '$4' }}>
        <Input isDisabled={!connected} css={{ width: 300, height: 100 }}>
          <Input.Field
            as="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your title"
            css={{ color: '$whiteA11', padding: '$2' }}
          />
        </Input>
        <Box>
          <Button
            onPress={() => handleSignMessage(message)}
            isLoading={isSingingMessage}
            isDisabled={isSingingMessage || !connected}
          >
            Sign Message
          </Button>
        </Box>
        {signedMessage && (
          <Box css={styles.accounts}>
            <Text>{signedMessage}</Text>
          </Box>
        )}
      </Stack>
    </ExampleBox>
  );
}

const styles = {
  accounts: cssObj({
    marginTop: '$2',
    padding: '$2',
    borderRadius: '$lg',
    backgroundColor: '$gray4',
    maxWidth: 300,
    wordWrap: 'break-word',
  }),
};
