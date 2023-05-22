import { Button } from '@fuel-ui/react';
import { AnimatePresence } from 'framer-motion';

import { Send } from '../../components';
import { useSend } from '../../hooks';

import { Layout } from '~/systems/Core';

export function SendPage() {
  const send = useSend();
  const { handlers, txRequest, status, form, ...ctx } = send;
  const isSelecting = status('selecting');

  return (
    <form
      onSubmit={form.handleSubmit(handlers.submit)}
      data-testid={txRequest.txStatus}
    >
      <Layout title={ctx.title} isLoading={status('loading')}>
        <Layout.TopBar onBack={handlers.cancel} />
        <AnimatePresence initial={false} mode="sync">
          {(isSelecting || status('loading')) && <Send.Select {...send} />}
          {status('loadingTx') && <Send.Loading />}
        </AnimatePresence>
        {txRequest.showActions && (
          <Layout.BottomBar>
            <Button variant="ghost" onPress={handlers.cancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              intent="primary"
              isDisabled={ctx.isInvalid || !form.formState.isValid}
              isLoading={status('loading') || status('loadingTx')}
            >
              Confirm
            </Button>
          </Layout.BottomBar>
        )}
      </Layout>
    </form>
  );
}
