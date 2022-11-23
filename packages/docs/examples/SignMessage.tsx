/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Stack, Button, Input, Tag } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '~/components/ExampleBox';
import { useFuelWeb3 } from '~/hooks/useFuelWeb3';
import { useIsConnected } from '~/hooks/useIsConnected';
import { useLoading } from '~/hooks/useLoading';

export function SignMessage() {
  const [FuelWeb3, notDetected] = useFuelWeb3();
  const [isConnected] = useIsConnected();
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
        <Input isDisabled={!isConnected} css={{ width: 300, height: 100 }}>
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
            isDisabled={isSingingMessage || !isConnected}
          >
            Sign Message
          </Button>
        </Box>
        {signedMessage && (
          <Tag size="xs" color="gray" variant="ghost" css={styles.msg}>
            {signedMessage}
          </Tag>
        )}
      </Stack>
    </ExampleBox>
  );
}

const styles = {
  msg: cssObj({
    borderRadius: '$md',
    height: 'auto',
    maxWidth: 320,
    wordBreak: 'break-all',
  }),
};
