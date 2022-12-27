import { Button } from '@fuel-ui/react';
import { AnimatePresence } from 'framer-motion';

import { Send } from '../../components';
import { useSend } from '../../hooks';

import { IS_CRX_POPUP } from '~/config';
import { Layout, UnlockDialog } from '~/systems/Core';

export function SendPage() {
  const send = useSend();
  const { handlers, txRequest, form, ...ctx } = send;
  const { status } = txRequest;
  const isIdle = status('idle');
  const isUnlocking = status('unlocking');

  return (
    <form
      onSubmit={form.handleSubmit(handlers.submit)}
      data-testid={txRequest.txStatus}
    >
      <Layout title="Send" isLoading={ctx.isLoading}>
        <Layout.TopBar onBack={handlers.cancel} />
        <AnimatePresence initial={false} mode="sync">
          {isIdle && <Send.Select {...send} />}
          {status('waitingApproval') && <Send.Confirm txRequest={txRequest} />}
          {status('success') && <Send.Success txRequest={txRequest} />}
          {status('failed') && <Send.Failed txRequest={txRequest} />}
        </AnimatePresence>
        {txRequest.showActions && (
          <Layout.BottomBar>
            <Button color="gray" variant="ghost" onPress={handlers.cancel}>
              {isIdle ? 'Cancel' : 'Back'}
            </Button>
            <Button
              type="submit"
              color="accent"
              isDisabled={ctx.isInvalid || !form.formState.isValid}
              isLoading={ctx.isLoading || status('loading')}
            >
              {isIdle ? 'Confirm' : 'Approve'}
            </Button>
          </Layout.BottomBar>
        )}
        <UnlockDialog
          isFullscreen={IS_CRX_POPUP}
          isOpen={isUnlocking || status('waitingUnlock')}
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
