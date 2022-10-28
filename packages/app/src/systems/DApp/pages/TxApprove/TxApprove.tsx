import { cssObj } from '@fuel-ui/css';
import { Button, Card, Flex, Heading, Stack, Tag, Text } from '@fuel-ui/react';
import { bn } from 'fuels';
import { useEffect } from 'react';

import { getMockedTransaction } from '../../__mocks__/transaction';
import { UnlockDialog } from '../../components';
import { useTxApprove } from '../../hooks/useTxApprove';

import { AddressType, useAccount } from '~/systems/Account';
import { AssetsAmount } from '~/systems/Asset';
import { Layout, provider } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import {
  getCoinOutputsFromTx,
  TxDetails,
  TxFromTo,
} from '~/systems/Transaction';
import { getGroupedErrors } from '~/systems/Transaction/utils/error';

export type TxApproveProps = {
  id: string;
};

export function TxApprove() {
  const { isLoading } = useAccount();
  const {
    isUnlocking,
    handlers,
    account,
    isUnlockingLoading,
    tx,
    receipts,
    approvedTx,
    txDryRunError,
  } = useTxApprove();

  useEffect(() => {
    (async () => {
      if (account) {
        const txRequest = await getMockedTransaction(
          account?.publicKey || '',
          '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077',
          provider
        );

        handlers.calculateGas(txRequest);
      }
    })();
  }, [account]);

  if (!tx) return null;

  const coinOutputs = getCoinOutputsFromTx(tx);
  const outputsToSend = coinOutputs.filter(
    (value) => value.to !== account?.publicKey
  );
  const outputAmount = outputsToSend.reduce(
    (acc, value) => acc.add(value.amount),
    bn(0)
  );
  const groupedErrors = getGroupedErrors(
    (txDryRunError as any)?.response?.errors
  );

  return (
    <>
      <Layout title="Approve Transaction" isLoading={isLoading}>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content css={styles.content}>
          {!isLoading && !approvedTx && (
            <Stack gap="$4">
              <Card>
                <Card.Body
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <Tag css={styles.approveUrlTag} variant="outlined">
                    <Text as="span" fontSize="sm" color="gray12">
                      swayswap.io
                    </Text>
                  </Tag>
                  <Text
                    as="span"
                    fontSize="sm"
                    color="gray12"
                    css={{ fontWeight: '$semibold' }}
                  >
                    wants to approve
                  </Text>
                </Card.Body>
              </Card>
              {account && (
                <TxFromTo
                  from={{
                    type: AddressType.account,
                    address: account.publicKey,
                  }}
                  to={{
                    type: AddressType.account,
                    address: outputsToSend[0]?.to.toString(),
                  }}
                />
              )}
              <AssetsAmount
                amounts={outputsToSend}
                balanceErrors={groupedErrors?.InsufficientInputAmount}
                title="Assets to Send"
              />
              <TxDetails receipts={receipts} outputAmount={outputAmount} />
            </Stack>
          )}
          {approvedTx && (
            <Stack>
              <Heading as="h4">Transaction sent</Heading>
              <Text>
                Transaction sent successfully, you can open your wallet and
                check its status right now!
              </Text>
            </Stack>
          )}
        </Layout.Content>
        <Layout.BottomBar>
          <Flex>
            <Button color="gray" variant="ghost" css={{ flex: 1 }}>
              Close
            </Button>
            {!approvedTx && (
              <Button
                color="accent"
                onPress={handlers.startApprove}
                isLoading={isLoading}
                isDisabled={!!(approvedTx || txDryRunError)}
                css={{ flex: 1, ml: '$2' }}
              >
                Confirm
              </Button>
            )}
          </Flex>
        </Layout.BottomBar>
      </Layout>
      <UnlockDialog
        isOpen={isUnlocking}
        onUnlock={handlers.unlock}
        isLoading={isUnlockingLoading}
        onClose={handlers.closeUnlock}
      />
    </>
  );
}

const styles = {
  content: cssObj({
    '& h2': {
      m: '$0',
      fontSize: '$sm',
      color: '$gray12',
    },
    '& h4': {
      m: '$0',
    },
  }),
  approveUrlTag: cssObj({
    alignSelf: 'center',
    background: 'transparent',
    borderColor: '$gray8',
    borderStyle: 'dashed',
  }),
};
