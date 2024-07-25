import { cssObj } from '@fuel-ui/css';
import { Box, Button, Input, Tag } from '@fuel-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';
import { useState } from 'react';

import { bn } from 'fuels';
import { ExampleBox } from '../../src/components/ExampleBox';
import { useLoading } from '../../src/hooks/useLoading';

export function SendTransaction() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();

  const [address, setAddress] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');

  const [handleSendTransaction, isLoading, error] = useLoading(
    async (destination: string) => {
      if (!isConnected) await fuel.connect();
      console.log('Request signature of message!');

      /* sendTransaction:start */
      const account = await fuel.currentAccount();
      if (!account) {
        throw new Error('Current account not authorized for this connection!');
      }

      const wallet = await fuel.getWallet(account);

      // The amount of coins to transfer.
      const amount = bn(1);

      // Create a transaction request using wallet helper
      const transactionRequest = await wallet.createTransfer(
        destination,
        amount
      );

      // Broadcast the transaction to the network
      const transactionId = await fuel.sendTransaction(
        account,
        transactionRequest
      );

      console.log('Transaction ID', transactionId);
      /* sendTransaction:end */

      setTransactionId(transactionId);
    }
  );

  return (
    <ExampleBox error={error}>
      <Box.Stack css={{ gap: '$4' }}>
        <Input isDisabled={!fuel}>
          <Input.Field
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter public address"
          />
        </Input>
        <Box>
          <Button
            onPress={() => handleSendTransaction(address)}
            isLoading={isLoading}
            isDisabled={isLoading || !fuel}
          >
            Send
          </Button>
        </Box>
        {transactionId && (
          <Tag
            size="xs"
            color="intentsBase"
            variant="ghost"
            css={styles.feedbackTag}
          >
            Transaction ID: {transactionId}
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
    wordBreak: 'break-all',
  }),
};
