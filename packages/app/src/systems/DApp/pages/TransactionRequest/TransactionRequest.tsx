import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';

import { TxContent } from '../../components';
import { useTransactionRequest } from '../../hooks/useTransactionRequest';

import { IS_CRX_POPUP } from '~/config';
import { Layout, UnlockDialog } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import { NetworkScreen, useNetworks } from '~/systems/Network';

export function TransactionRequest() {
  const { selectedNetwork } = useNetworks({ type: NetworkScreen.list });
  const txRequest = useTransactionRequest({ isOriginRequired: true });
  const { handlers, status, ...ctx } = txRequest;
  if (!ctx.account) return null;

  return (
    <>
      <Layout title="Approve Transaction" isLoading={ctx.isLoading}>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content css={styles.content}>
          {ctx.isLoading && <TxContent.Loader />}
          {status('success') && <TxContent.Failed />}
          {status('failed') && (
            <TxContent.Success
              txHash={txRequest.response?.approvedTx?.id}
              providerUrl={selectedNetwork?.url}
            />
          )}
          {status('idle') && (
            <TxContent.Info
              tx={txRequest.tx}
              origin={txRequest.input.origin}
              account={txRequest.account}
              amountSent={txRequest.ethAmountSent}
            />
          )}
        </Layout.Content>
        {ctx.showActions && (
          <Layout.BottomBar>
            <Button onPress={handlers.reject} color="gray" variant="ghost">
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
