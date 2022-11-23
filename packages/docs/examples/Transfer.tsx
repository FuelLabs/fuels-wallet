/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Button, Flex, Input, Link, Stack, Text } from '@fuel-ui/react';
import type { BN } from 'fuels';
import { bn, Wallet, Address } from 'fuels';
import { useState } from 'react';

import { FuelWeb3Provider, getBlockExplorerLink } from '~/../sdk/src';
import { ExampleBox } from '~/components/ExampleBox';
import { useFuelWeb3 } from '~/hooks/useFuelWeb3';
import { useIsConnected } from '~/hooks/useIsConnected';
import { useLoading } from '~/hooks/useLoading';

export function Transfer() {
  const [FuelWeb3, notDetected] = useFuelWeb3();
  const [isConnected] = useIsConnected();
  const [txId, setTxId] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.00001');

  const [sendTransaction, sendingTransaction, errorSendingTransaction] =
    useLoading(async (amount: BN) => {
      console.debug('Request signature transaction!');
      const accounts = await window.FuelWeb3.accounts();
      const account = accounts[0];
      const provider = new FuelWeb3Provider(window.FuelWeb3);
      const wallet = Wallet.fromAddress(account, provider);
      const response = await wallet.transfer(
        Address.fromString(
          'fuel1r3u2qfn00cgwk3u89uxuvz5cgcjaq934cfer6cwuew0424cz5sgq4yldul'
        ),
        amount
      );
      setTxId(response.id);
    });

  const errorMessage = notDetected || errorSendingTransaction;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={{ gap: '$4' }}>
        <Flex gap="$4" align="center">
          <Input isDisabled={!isConnected}>
            <Input.Field
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              css={{ color: '$whiteA11' }}
            />
          </Input>
          <Button
            onPress={() => sendTransaction(bn.parseUnits(amount))}
            isLoading={sendingTransaction}
            isDisabled={sendingTransaction || !isConnected}
          >
            Transfer
          </Button>
        </Flex>
        {txId ? (
          <Box css={styles.accounts}>
            <Text>{txId}</Text>
            <Link
              target={'_blank'}
              href={getBlockExplorerLink({
                path: `transaction/${txId}`,
                providerUrl: FuelWeb3.providerConfig.url,
              })}
            >
              See on BlockExplorer
            </Link>
          </Box>
        ) : null}
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
