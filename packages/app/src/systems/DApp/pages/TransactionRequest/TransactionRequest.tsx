import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';

import { ConnectInfo } from '../../components';
import { useTransactionRequest } from '../../hooks/useTransactionRequest';

import { IS_CRX_POPUP } from '~/config';
import { Layout, UnlockDialog } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import { TxContent, TxHeader } from '~/systems/Transaction';

export function TransactionRequest() {
  const txRequest = useTransactionRequest({ isOriginRequired: true });
  const { handlers, status, ...ctx } = txRequest;
  if (!ctx.account) return null;

  return (
    <>
      <Layout title={ctx.title} isLoading={ctx.isLoading}>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content css={styles.content}>
          {ctx.isLoading && (
            <TxContent.Loader header={<ConnectInfo.Loader />} />
          )}
          {status('waitingApproval') && (
            <TxContent.Info
              showDetails
              tx={txRequest.tx}
              amount={txRequest.ethAmountSent}
              header={
                <ConnectInfo account={ctx.account} origin={ctx.input.origin!} />
              }
            />
          )}
          {(status('success') || status('failed')) && (
            <TxContent.Info
              showDetails
              tx={txRequest.tx}
              txStatus={txRequest.approveStatus()}
              amount={txRequest.ethAmountSent}
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
              Confirm
            </Button>
          </Layout.BottomBar>
        )}
      </Layout>
      <UnlockDialog
        isFullscreen={IS_CRX_POPUP}
        isOpen={status('unlocking') || status('waitingUnlock')}
        isLoading={status('unlocking')}
        unlockText="Confirm Transaction"
        unlockError={txRequest.errors.unlockError}
        onUnlock={txRequest.handlers.unlock}
        onClose={txRequest.handlers.closeUnlock}
      />
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
};
