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

import { ConnectInfo, UnlockDialog } from '../../components';
import { useTransactionRequest } from '../../hooks/useTransactionRequest';

import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import { NetworkScreen, useNetworks } from '~/systems/Network';
import { TxDetails, TxOperations } from '~/systems/Transaction';

export function TransactionRequest() {
  const { selectedNetwork } = useNetworks({ type: NetworkScreen.list });
  const { handlers, tx, ethAmountSent, ...ctx } = useTransactionRequest({
    isOriginRequired: true,
  });

  if (!ctx.account) return null;

  const content = (
    <Layout.Content css={styles.content}>
      {ctx.isShowingInfo && (
        <Stack gap="$4">
          <ConnectInfo
            origin={ctx.origin!}
            account={ctx.account}
            isReadOnly={true}
          />
          <TxOperations operations={tx.operations} />
          {/* {ctx.account && (
            <TxFromTo
              from={{
                type: AddressType.account,
                address: ctx.account.publicKey,
              }}
              to={{
                type: AddressType.account,
                address: ctx.outputsToSend[0]?.to.toString(),
              }}
            />
          )} */}
          {ctx.hasGeneralErrors && (
            <Card css={styles.generalErrorCard}>
              <Copyable
                value={JSON.stringify(ctx.generalErrors)}
                tooltipMessage="Click to copy Error Logs"
                css={{ width: '100%', justifyContent: 'space-between' }}
              >
                <Icon icon={Icon.is('WarningOctagon')} color="red8" size={20} />
                <Text
                  as="h3"
                  css={{ fontSize: '$sm', fontWeight: '$semibold' }}
                >
                  Invalid Transaction
                </Text>
              </Copyable>
            </Card>
          )}
          {/* <AssetsAmount
            amounts={ctx.outputsToSend}
            balanceErrors={ctx.groupedErrors?.InsufficientInputAmount}
            title="Assets to Send"
          /> */}
          <TxDetails fee={tx.fee} amountSent={ethAmountSent} />
        </Stack>
      )}
      {ctx.approvedTx && (
        <Stack>
          <Heading as="h4">Transaction sent</Heading>
          <Text>
            Transaction sent successfully.
            <Link
              isExternal
              href={getBlockExplorerLink({
                path: `/transaction/${ctx.approvedTx.id}`,
                providerUrl: selectedNetwork?.url,
              })}
            >
              Click here to view on Fuel Explorer
            </Link>
          </Text>
        </Stack>
      )}
      {ctx.txApproveError && (
        <Stack>
          <Heading as="h4">Transaction failed</Heading>
          <Text>
            Transaction failed to run. Please try again or contact support if
            the problem persists.
          </Text>
        </Stack>
      )}
    </Layout.Content>
  );

  const footer = (
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
        {!ctx.approvedTx && !ctx.txApproveError && (
          <Button
            color="accent"
            onPress={handlers.approve}
            isLoading={ctx.isLoading || ctx.sendingTx}
            isDisabled={!ctx.waitingApproval}
            css={{ flex: 1, ml: '$2' }}
          >
            Confirm
          </Button>
        )}
      </Flex>
    </Layout.BottomBar>
  );

  return (
    <>
      <Layout title="Approve Transaction" isLoading={ctx.isLoading}>
        <Layout.TopBar type={TopBarType.external} />
        {content}
        {footer}
      </Layout>
      <UnlockDialog
        unlockText="Confirm Transaction"
        unlockError={ctx.unlockError}
        isFullscreen={true}
        isOpen={ctx.isUnlocking}
        onUnlock={handlers.unlock}
        isLoading={ctx.isUnlockingLoading}
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
