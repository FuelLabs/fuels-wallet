/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  Flex,
  Link,
  Stack,
  Text,
  InputAmount,
} from '@fuel-ui/react';
import { getBlockExplorerLink } from '@fuel-wallet/sdk';
import type { BN } from 'fuels';
import { bn, Address } from 'fuels';
import { useState } from 'react';

import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuelWeb3 } from '~/src/hooks/useFuelWeb3';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function Transfer() {
  const [FuelWeb3, notDetected] = useFuelWeb3();
  const [isConnected] = useIsConnected();
  const [txId, setTxId] = useState<string>('');
  const [providerUrl, setProviderUrl] = useState<string>('');
  const [amount, setAmount] = useState<BN>(bn.parseUnits('0.00001'));

  const [sendTransaction, sendingTransaction, errorSendingTransaction] =
    useLoading(async (amount: BN) => {
      console.debug('Request signature transaction!');
      const accounts = await FuelWeb3.accounts();
      const account = accounts[0];
      const wallet = await FuelWeb3.getWallet(account);
      const response = await wallet.transfer(
        Address.fromString(
          'fuel1r3u2qfn00cgwk3u89uxuvz5cgcjaq934cfer6cwuew0424cz5sgq4yldul'
        ),
        amount
      );
      setProviderUrl(wallet.provider.url);
      setTxId(response.id);
    });

  const errorMessage = notDetected || errorSendingTransaction;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={{ gap: '$4' }}>
        <Flex gap="$4" direction={'column'}>
          <Box css={{ width: 300 }}>
            <InputAmount
              value={amount}
              onChange={(value) => setAmount(value)}
            />
          </Box>
          <Box>
            <Button
              onPress={() => sendTransaction(amount)}
              isLoading={sendingTransaction}
              isDisabled={sendingTransaction || !isConnected}
            >
              Transfer
            </Button>
          </Box>
        </Flex>
        {txId ? (
          <Box css={styles.accounts}>
            <Text>{txId}</Text>
            <Link
              target={'_blank'}
              href={getBlockExplorerLink({
                path: `transaction/${txId}`,
                providerUrl,
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
