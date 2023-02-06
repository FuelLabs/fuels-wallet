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
  Input,
} from '@fuel-ui/react';
import { getBlockExplorerLink } from '@fuel-wallet/sdk';
import type { BN } from 'fuels';
import { bn, Address } from 'fuels';
import { useState } from 'react';

import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function Transfer() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [txId, setTxId] = useState<string>('');
  const [providerUrl, setProviderUrl] = useState<string>('');
  const [amount, setAmount] = useState<BN>(bn.parseUnits('0.00001'));
  const [addr, setAddr] = useState<string>(
    'fuel1a6msn9zmjpvv84g08y3t6x6flykw622s48k2lqg257pf9924pnfq50tdmw'
  );

  const [sendTransaction, sendingTransaction, errorSendingTransaction] =
    useLoading(async (amount: BN) => {
      console.debug('Request signature transaction!');
      /* example:start */
      const accounts = await fuel.accounts();
      const account = accounts[0];
      const wallet = await fuel.getWallet(account);
      const toAddress = Address.fromString(addr);
      const response = await wallet.transfer(toAddress, amount);
      console.debug('Transaction created!', response.id);
      /* example:end */
      setProviderUrl(wallet.provider.url);
      setTxId(response.id);
    });

  const errorMessage = notDetected || errorSendingTransaction;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={{ gap: '$4' }}>
        <Flex gap="$4" direction={'column'}>
          <Box css={{ width: 300 }}>
            <Input css={{ width: '100%' }}>
              <Input.Field
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
              />
            </Input>
          </Box>

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
