import { cssObj } from '@fuel-ui/css';
import { Box, Button, Input, Tag } from '@fuel-ui/react';
import { useConnect, useFuel, useIsConnected, useWallet } from '@fuels/react';
import { useState } from 'react';

import { ExampleBox } from '../../../src/components/ExampleBox';
import { useLoading } from '../../../src/hooks/useLoading';

export function SignMessageHook() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const { connect, error: errorConnect } = useConnect();
  const [signedMessage, setSignedMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('Message to sign');
  /* signMessage:start */
  const { wallet } = useWallet();

  async function handleSignMessage(message: string) {
    if (!isConnected) return connect(undefined); // ignore-line
    console.log('Request signature of message!');
    if (!wallet) {
      throw new Error('Current wallet is not authorized for this connection!');
    }
    const signedMessage = await wallet.signMessage(message);
    console.log('Message signature', signedMessage);
    return signedMessage; // ignore-line
  }
  /* signMessage:end */

  const [handleSignMessageFn, isSingingMessage, errorSigningMessage] =
    useLoading(
      async (message: string) => {
        const signedMessage = await handleSignMessage(message);
        setSignedMessage(signedMessage || '');
      },
      [wallet]
    );

  return (
    <ExampleBox error={errorConnect || errorSigningMessage}>
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
            onPress={() => handleSignMessageFn(message)}
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
