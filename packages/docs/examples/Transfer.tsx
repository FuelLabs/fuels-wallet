/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Button, Link, Text, InputAmount, Input } from '@fuel-ui/react';
import { getBlockExplorerLink, getGasConfig } from '@fuel-wallet/sdk';
import type { BN } from 'fuels';
import { BaseAssetId, bn, Address, DECIMAL_UNITS } from 'fuels';
import { useMemo, useState } from 'react';
import { useAssets } from '~/src/hooks/useAssets';

import { ExampleBox } from '../src/components/ExampleBox';
import { useFuel } from '../src/hooks/useFuel';
import { useIsConnected } from '../src/hooks/useIsConnected';
import { useLoading } from '../src/hooks/useLoading';

export function Transfer() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [txId, setTxId] = useState<string>('');
  const [providerUrl, setProviderUrl] = useState<string>('');
  const [amount, setAmount] = useState<BN | null>(bn.parseUnits('0.00001'));
  const [addr, setAddr] = useState<string>(
    'fuel1a6msn9zmjpvv84g08y3t6x6flykw622s48k2lqg257pf9924pnfq50tdmw'
  );
  const [assetId, setAssetId] = useState<string>(BaseAssetId);
  const assets = useAssets();
  const decimals = useMemo(() => {
    return (
      assets.find((asset) => asset.assetId === assetId)?.decimals ||
      DECIMAL_UNITS
    );
  }, [assets, assetId]);

  const [sendTransaction, sendingTransaction, errorSendingTransaction] =
    useLoading(async (amount: BN, addr: string, assetId: string) => {
      if (!isConnected) await fuel.connect();
      console.log('Request signature transaction!');
      /* example:start */
      const accounts = await fuel.accounts();
      const account = accounts[0];
      const wallet = await fuel.getWallet(account);
      const toAddress = Address.fromString(addr);
      const gasConfig = await getGasConfig(wallet.provider);
      const response = await wallet.transfer(toAddress, amount, assetId, {
        ...gasConfig,
      });
      console.log('Transaction created!', response.id);
      /* example:end */
      setProviderUrl(wallet.provider.url);
      setTxId(response.id);
    });

  const errorMessage = notDetected || errorSendingTransaction;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Stack css={{ gap: '$4' }}>
        <Box.Flex gap="$4" direction={'column'}>
          <Box css={{ width: 300 }}>
            <Input css={{ width: '100%' }}>
              <Input.Field
                value={assetId}
                placeholder={'Asset ID to transfer'}
                onChange={(e) => {
                  setAmount(null);
                  setAssetId(e.target.value);
                }}
              />
            </Input>
          </Box>
          <Box css={{ width: 300 }}>
            <Input css={{ width: '100%' }}>
              <Input.Field
                value={addr}
                placeholder={'Address to transfer'}
                onChange={(e) => setAddr(e.target.value)}
              />
            </Input>
          </Box>
          <Box css={{ width: 300 }}>
            <InputAmount
              // Force component to re-render when decimals change
              // Remove this once fuel-ui InputAmount is fixed
              // TODO: https://github.com/FuelLabs/fuel-ui/issues/323
              key={decimals}
              value={amount}
              onChange={(value) => setAmount(value)}
              hiddenBalance
              units={decimals}
            />
          </Box>
          <Box>
            <Button
              onPress={() => amount && sendTransaction(amount, addr, assetId)}
              isLoading={sendingTransaction}
              isDisabled={sendingTransaction || !fuel}
            >
              Transfer
            </Button>
          </Box>
        </Box.Flex>
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
      </Box.Stack>
    </ExampleBox>
  );
}

const styles = {
  accounts: cssObj({
    marginTop: '$2',
    padding: '$2',
    borderRadius: '$lg',
    backgroundColor: '$intentsBase4',
    maxWidth: 300,
    wordWrap: 'break-word',
  }),
};
