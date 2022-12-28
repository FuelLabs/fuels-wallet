/* eslint-disable no-console */
import { Box, Button, Flex, Stack, InputAmount, Input } from '@fuel-ui/react';
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
  const [amount, setAmount] = useState<BN>(bn.parseUnits('0.00001'));
  const [addr, setAddr] = useState<string>(
    'fuel1a6msn9zmjpvv84g08y3t6x6flykw622s48k2lqg257pf9924pnfq50tdmw'
  );

  const errorMessage = notDetected;
  const [sendTransaction, sendingTransaction, errorSending] = useLoading(
    async (amount: BN) => {
      console.debug('Request signature transaction!');
      const accounts = await fuel.accounts();
      const account = accounts[0];
      const wallet = fuel.getWallet(account);
      const toAddress = Address.fromString(addr);

      await wallet.transfer(toAddress, amount);
    }
  );

  return (
    <ExampleBox error={errorMessage || errorSending}>
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
      </Stack>
    </ExampleBox>
  );
}
