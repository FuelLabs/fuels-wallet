import { cssObj } from '@fuel-ui/css';
import { Alert, Button, Text } from '@fuel-ui/react';

import { useTransactionRequest } from '../../hooks/useTransactionRequest';

import { useAssets } from '~/systems/Asset';
import { Layout, ConnectInfo } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import { TxContent, TxHeader } from '~/systems/Transaction';

export function TransactionRequest() {
  const txRequest = useTransactionRequest({ isOriginRequired: true });
  const { handlers, status, isSendingTx, ...ctx } = txRequest;
  const { assets } = useAssets();

  if (!ctx.account) return null;

  const shouldShowTx = status('waitingApproval') || isSendingTx;

  return (
    <>
      <Layout title={ctx.title}>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content css={styles.content}>
          {ctx.isLoading && !txRequest.tx && (
            <TxContent.Loader header={<ConnectInfo.Loader />} />
          )}
          {shouldShowTx && (
            <TxContent.Info
              showDetails
              tx={txRequest.tx}
              isLoading={status('loading')}
              header={
                <>
                  <ConnectInfo
                    account={ctx.account}
                    origin={ctx.input.origin!}
                    favIconUrl={ctx.input.favIconUrl}
                    title={ctx.input.title}
                    headerText="Requesting a transaction from:"
                  />

                  <Alert status="warning" css={styles.alert}>
                    <Alert.Title>Confirm before approve</Alert.Title>
                    <Alert.Description>
                      <Text fontSize="xs" css={styles.alertDescription}>
                        Carefully check if all details in your transaction are
                        correct
                      </Text>
                    </Alert.Description>
                  </Alert>
                </>
              }
              assets={assets}
            />
          )}
          {(status('success') || status('failed')) && (
            <TxContent.Info
              showDetails
              tx={txRequest.tx}
              txStatus={txRequest.approveStatus()}
              header={
                <TxHeader
                  id={txRequest.tx?.id}
                  type={txRequest.tx?.type}
                  status={txRequest.tx?.status}
                  providerUrl={txRequest.providerUrl}
                />
              }
              footer={
                status('failed') && (
                  <Button
                    size="sm"
                    variant="ghost"
                    color="red"
                    onPress={txRequest.handlers.tryAgain}
                  >
                    Try again
                  </Button>
                )
              }
            />
          )}
        </Layout.Content>
        {ctx.showActions && (
          <Layout.BottomBar>
            <Button
              onPress={handlers.reject}
              color="gray"
              variant="ghost"
              isDisabled={ctx.isLoading || status('sending')}
            >
              Reject
            </Button>
            <Button
              color="accent"
              onPress={handlers.approve}
              isLoading={ctx.isLoading || status('sending')}
            >
              Approve
            </Button>
          </Layout.BottomBar>
        )}
      </Layout>
    </>
  );
}

const styles = {
  actionBtn: cssObj({
    mt: '$4',
  }),
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
  alert: cssObj({
    '& .fuel_alert--content': {
      gap: '$1',
    },
    ' & .fuel_heading': {
      fontSize: '$sm',
    },
  }),
  alertDescription: cssObj({
    fontWeight: '$bold',
  }),
};
