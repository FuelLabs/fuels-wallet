import { cssObj } from '@fuel-ui/css';
import {
  Button,
  Card,
  Copyable,
  Flex,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
} from '@fuel-ui/react';
import { getBlockExplorerLink } from '@fuel-wallet/sdk';
import { AddressType } from '@fuel-wallet/types';
import { useMemo } from 'react';

import { ConnectInfo, UnlockDialog } from '../../components';
import { useTransactionRequest } from '../../hooks';

import { useAccount } from '~/systems/Account';
import { AssetsAmount } from '~/systems/Asset';
import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import { NetworkScreen, useNetworks } from '~/systems/Network';
import { getFilteredErrors, TxDetails, TxFromTo } from '~/systems/Transaction';

export function TransactionRequest() {
  const { isLoading } = useAccount();
  const { selectedNetwork } = useNetworks({ type: NetworkScreen.list });
  const {
    origin,
    isUnlocking,
    handlers,
    account,
    isUnlockingLoading,
    fee,
    approvedTx,
    txApproveError,
    outputAmount,
    outputsToSend,
    groupedErrors,
    waitingApproval,
    sendingTx,
    unlockError,
  } = useTransactionRequest();

  const generalErrors = useMemo(
    () => getFilteredErrors(groupedErrors, ['InsufficientInputAmount']),
    [groupedErrors]
  );

  return (
    <>
      <Layout title="Approve Transaction" isLoading={isLoading}>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content css={styles.content}>
          {!isLoading &&
            !approvedTx &&
            !txApproveError &&
            origin &&
            account && (
              <Stack gap="$4">
                <ConnectInfo
                  origin={origin}
                  account={account}
                  isReadOnly={true}
                />
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
                {!!(generalErrors && Object.keys(generalErrors).length) && (
                  <Card css={styles.generalErrorCard}>
                    <Copyable
                      value={JSON.stringify(generalErrors)}
                      tooltipMessage="Click to copy Error Logs"
                      css={{ width: '100%', justifyContent: 'space-between' }}
                    >
                      <Icon
                        icon={Icon.is('WarningOctagon')}
                        color="red8"
                        size={20}
                      />
                      <Text
                        as="h3"
                        css={{ fontSize: '$sm', fontWeight: '$semibold' }}
                      >
                        Invalid Transaction
                      </Text>
                    </Copyable>
                  </Card>
                )}
                <AssetsAmount
                  amounts={outputsToSend}
                  balanceErrors={groupedErrors?.InsufficientInputAmount}
                  title="Assets to Send"
                />
                <TxDetails fee={fee} outputAmount={outputAmount} />
              </Stack>
            )}
          {approvedTx && (
            <Stack>
              <Heading as="h4">Transaction sent</Heading>
              <Text>
                Transaction sent successfully.
                <Link
                  isExternal
                  href={getBlockExplorerLink({
                    path: `/transaction/${approvedTx.id}`,
                    providerUrl: selectedNetwork?.url,
                  })}
                >
                  Click here to view on Fuel Explorer
                </Link>
              </Text>
            </Stack>
          )}
          {txApproveError && (
            <Stack>
              <Heading as="h4">Transaction failed</Heading>
              <Text>
                Transaction failed to run. Please try again or contact support
                if the problem persists.
              </Text>
            </Stack>
          )}
        </Layout.Content>
        <Layout.BottomBar>
          <Flex>
            <Button
              onPress={handlers.reject}
              color="gray"
              variant="ghost"
              css={{ flex: 1 }}
            >
              Reject
            </Button>
            {!approvedTx && !txApproveError && (
              <Button
                color="accent"
                onPress={handlers.approve}
                isLoading={isLoading || sendingTx}
                isDisabled={!waitingApproval}
                css={{ flex: 1, ml: '$2' }}
              >
                Confirm
              </Button>
            )}
          </Flex>
        </Layout.BottomBar>
      </Layout>
      <UnlockDialog
        unlockText="Confirm Transaction"
        unlockError={unlockError}
        isFullscreen={true}
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
  generalErrorCard: cssObj({
    px: '$3',
    py: '$2',
    gap: '$2',
    backgroundColor: '$red3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
};
