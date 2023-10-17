/* eslint-disable no-console */
import { Box, Button, Input, Tag } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '../src/components/ExampleBox';
import { useFuel } from '../src/hooks/useFuel';
import { useIsConnected } from '../src/hooks/useIsConnected';
import { useLoading } from '../src/hooks/useLoading';

import { docStyles } from './styles';

export function SignMessage() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [signedMessage, setSignedMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('Message to sign');

  const [handleSignMessage, isSingingMessage, errorSigningMessage] = useLoading(
    async (message: string) => {
      if (!isConnected) await fuel.connect();
      console.log('Request signature of message!');
      /* example:start */
      const accounts = await fuel.accounts();
      const account = accounts[0];
      const wallet = await fuel.getWallet(account);
      const signedMessage = await wallet.signMessage(message);
      console.log('Message signature', signedMessage);
      /* example:end */
      setSignedMessage(signedMessage);
    }
  );

  const errorMessage = notDetected || errorSigningMessage;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Stack css={{ gap: '$4' }}>
        <Input isDisabled={!fuel} css={{ width: 300, height: 100 }}>
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
            isDisabled={isSingingMessage || !fuel}
          >
            Sign Message
          </Button>
        </Box>
        {signedMessage && (
          <Tag
            size="xs"
            color="intentsBase"
            variant="ghost"
            css={docStyles.feedbackTag}
          >
            {signedMessage}
          </Tag>
        )}
      </Box.Stack>
    </ExampleBox>
  );
}
