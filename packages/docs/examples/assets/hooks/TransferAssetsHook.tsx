/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Button, Link, Text, InputAmount, Input } from '@fuel-ui/react';
import { getAssetByChain } from '@fuel-wallet/sdk';
import { useFuel, useAssets, useWallet } from '@fuels/react';
import type { BN } from 'fuels';
import { buildBlockExplorerUrl, BaseAssetId, bn, Address } from 'fuels';
import { useMemo, useState } from 'react';

import { ExampleBox } from '../../../src/components/ExampleBox';
import { useLoading } from '../../../src/hooks/useLoading';

export function TransferAssetsHook() {
  const { fuel } = useFuel();
  const { assets } = useAssets();
  const [txId, setTxId] = useState<string>('');
  const [providerUrl, setProviderUrl] = useState<string>('');
  const [amount, setAmount] = useState<BN | null>(bn.parseUnits('0.00001'));
  const [receiverAddress, setAddr] = useState<string>(
    'fuel1a6msn9zmjpvv84g08y3t6x6flykw622s48k2lqg257pf9924pnfq50tdmw'
  );
  const [assetId, setAssetId] = useState<string>(BaseAssetId);
  const decimals = useMemo(() => {
    const asset = assets
      .map((asset) => getAssetByChain(asset, 0))
      .find((asset) => asset.assetId === assetId);
    return asset?.decimals || 0;
  }, [assetId, assets]);
  /* transferHook:start */
  const { wallet } = useWallet(); // or useAccount(address);

  async function transfer(
    amount: BN,
    receiverAddress: string,
    assetId: string
  ) {
    if (!wallet) {
      throw new Error('Wallet not found!');
    }
    // Create a Address instance to the receiver address
    const toAddress = Address.fromString(receiverAddress);
    // Get the minGasPrice and maxGasPerTx for the network
    const { minGasPrice } = await wallet.provider.getGasConfig();
    // Send a transaction to transfer the asset to the receiver address
    const response = await wallet.transfer(toAddress, bn(amount), assetId, {
      gasPrice: minGasPrice,
      gasLimit: 5_000,
    });
    console.log('Transaction created!', response.id);
    setProviderUrl(wallet.provider.url); // ignore-line
    setTxId(response.id); // ignore-line
  }
  /* transferHook:end */

  const [sendTransaction, sendingTransaction, errorSendingTransaction] =
    useLoading(transfer, [wallet]);

  return (
    <ExampleBox error={errorSendingTransaction}>
      <Box.Stack css={{ gap: '$4' }}>
        <Box.Flex gap="$4" direction={'column'}>
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
          <Input css={{ width: '100%' }}>
            <Input.Field
              value={receiverAddress}
              placeholder={'Address to transfer'}
              onChange={(e) => setAddr(e.target.value)}
            />
          </Input>
          {decimals ? (
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
          ) : (
            <Input css={{ width: '100%' }}>
              <Input.Field
                type="number"
                value={amount?.toString()}
                min={0}
                onChange={(e) => {
                  const ignore = /[.,\-+]/g;
                  const val = (e.target.value || '').replaceAll(ignore, '');
                  setAmount(val ? bn(val) : null);
                }}
                placeholder={'Asset amount'}
              />
            </Input>
          )}
          <Box>
            <Button
              onPress={() =>
                amount && sendTransaction(amount, receiverAddress, assetId)
              }
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
              href={buildBlockExplorerUrl({
                txId,
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
