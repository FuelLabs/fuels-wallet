import { cssObj } from '@fuel-ui/css';
import { Box, Button, Input, Tag } from '@fuel-ui/react';
import {
  useConnect,
  useFuel,
  useIsConnected,
  useSendTransaction,
  useWallet,
} from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { ExampleBox } from '../../../src/components/ExampleBox';

export function SendTransactionHook() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const { connect, error: errorConnect } = useConnect();

  const [address, setAddress] = useState<string>('');
  const [creatingTransfer, setCreatingTransfer] = useState<boolean>(false);

  /* sendTransaction:start */
  const { wallet } = useWallet();
  const { sendTransaction, data, isPending, error } = useSendTransaction();

  async function handleSendTransaction(destination: string) {
    if (!isConnected) return connect(undefined); // ignore-line
    if (!wallet) {
      throw new Error('Current wallet is not authorized for this connection!');
    }

    setCreatingTransfer(true); // ignore-line

    // The amount of coins to transfer.
    const amount = bn(1);

    // Create a transaction request using wallet helper
    const transactionRequest = await wallet.createTransfer(destination, amount);

    // Broadcast the transaction to the network
    sendTransaction({
      address: wallet.address, // The address to sign the transaction (a connected wallet)
      transaction: transactionRequest, // The transaction to send
    });

    setCreatingTransfer(false); // ignore-line
    setAddress(''); // ignore-line
  }
  /* sendTransaction:end */

  return (
    <ExampleBox error={errorConnect || error}>
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
            isLoading={isPending || creatingTransfer}
            isDisabled={isPending || !fuel}
          >
            Send
          </Button>
        </Box>
        {data && (
          <Tag
            size="xs"
            color="intentsBase"
            variant="ghost"
            css={styles.feedbackTag}
          >
            Transaction ID: {data}
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
