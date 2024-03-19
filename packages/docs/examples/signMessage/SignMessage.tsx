import { cssObj } from '@fuel-ui/css';
import { Box, Button, Input, Tag } from '@fuel-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';
import { useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useLoading } from '../../src/hooks/useLoading';

export function SignMessage() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const [signedMessage, setSignedMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('Message to sign');

  const [handleSignMessage, isSingingMessage, errorSigningMessage] = useLoading(
    async (message: string) => {
      if (!isConnected) await fuel.connect();
      console.log('Request signature of message!');
      /* signMessage:start */
      const account = await fuel.currentAccount();
      if (!account) {
        throw new Error('Current account not authorized for this connection!');
      }
      const wallet = await fuel.getWallet(account);
      const signedMessage = await wallet.signMessage(message);
      console.log('Message signature', signedMessage);
      /* signMessage:end */
      setSignedMessage(signedMessage);
    }
  );

  return (
    <ExampleBox error={errorSigningMessage}>
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
            css={styles.feedbackTag}
          >
            {signedMessage}
          </Tag>
        )}
      </Box.Stack>
    </ExampleBox>
  );
}

const styles = {
  feedbackTag: cssObj({
    borderRadius: '$md',
    height: 'auto',
    maxWidth: 320,
    wordBreak: 'break-all',
  }),
};
