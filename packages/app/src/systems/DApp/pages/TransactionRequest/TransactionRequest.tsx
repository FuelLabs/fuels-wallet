import { cssObj } from '@fuel-ui/css';
import { Alert, Button } from '@fuel-ui/react';

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

  const Header = (
    <>
      <ConnectInfo
        account={ctx.account}
        origin={ctx.input.origin!}
        favIconUrl={ctx.input.favIconUrl}
        title={ctx.input.title}
        headerText="Requesting a transaction from:"
      />
      <Alert status="warning" css={styles.alert}>
        <Alert.Title>Confirm before approving</Alert.Title>
        <Alert.Description>
          Carefully check if all the details in your transaction are correct
        </Alert.Description>
      </Alert>
    </>
  );

  return (
    <>
      <Layout title={ctx.title} noBorder>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content css={styles.content}>
          {ctx.isLoading && !txRequest.tx && (
            <TxContent.Loader header={Header} />
          )}
          {shouldShowTx && (
            <TxContent.Info
              showDetails
              tx={txRequest.tx}
              isLoading={status('loading')}
              header={Header}
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
                    intent="error"
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
              variant="ghost"
              isDisabled={ctx.isLoading || status('sending')}
            >
              Reject
            </Button>
            <Button
              intent="primary"
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
      color: '$intentsBase12',
    },
    '& h4': {
      m: '$0',
    },
  }),
  approveUrlTag: cssObj({
    alignSelf: 'center',
    background: 'transparent',
    borderColor: '$border',
    borderStyle: 'solid',
  }),
  alert: cssObj({
    '& .fuel_Alert-content': {
      gap: '$1',
    },
    ' & .fuel_Heading': {
      fontSize: '$sm',
    },
  }),
};
