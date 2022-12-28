import { Button } from '@fuel-ui/react';
import { AnimatePresence } from 'framer-motion';

import { Send } from '../../components';
import { useSend } from '../../hooks';

import { IS_CRX_POPUP } from '~/config';
import { Layout, UnlockDialog } from '~/systems/Core';

export function SendPage() {
  const send = useSend();
  const { handlers, txRequest, status, form, ...ctx } = send;
  const isUnlocking = txRequest.status('unlocking');
  const isSelecting = status('selecting');

  return (
    <form
      onSubmit={form.handleSubmit(handlers.submit)}
      data-testid={txRequest.txStatus}
    >
      <Layout title={ctx.title} isLoading={status('loading')}>
        <Layout.TopBar onBack={handlers.cancel} />
        <AnimatePresence initial={false} mode="sync">
          {isSelecting && <Send.Select {...send} />}
          {status('loadingTx') && <Send.Loading />}
          {status('confirming') && <Send.Confirm txRequest={txRequest} />}
        </AnimatePresence>
        {txRequest.showActions && (
          <Layout.BottomBar>
            <Button color="gray" variant="ghost" onPress={handlers.cancel}>
              {isSelecting ? 'Cancel' : 'Back'}
            </Button>
            <Button
              type="submit"
              color="accent"
              isDisabled={ctx.isInvalid || !form.formState.isValid}
              isLoading={status('loading') || status('loadingTx')}
            >
              {isSelecting ? 'Confirm' : 'Approve'}
            </Button>
          </Layout.BottomBar>
        )}
        <UnlockDialog
          isFullscreen={IS_CRX_POPUP}
          isOpen={isUnlocking || txRequest.status('waitingUnlock')}
          isLoading={isUnlocking}
          unlockText="Confirm Transaction"
          unlockError={txRequest.errors.unlockError}
          onUnlock={txRequest.handlers.unlock}
          onClose={txRequest.handlers.closeUnlock}
        />
      </Layout>
    </form>
  );
}
