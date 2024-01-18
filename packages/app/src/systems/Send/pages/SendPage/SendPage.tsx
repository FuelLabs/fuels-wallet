import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { animations, Layout, MotionStack } from '~/systems/Core';

import { Send } from '../../components';
import { useSend } from '../../hooks';

export function SendPage() {
  const send = useSend();
  const { handlers, txRequest, status, form, readyToSend, ...ctx } = send;

  return (
    <form
      onSubmit={form.handleSubmit(handlers.submit)}
      data-testid={txRequest.txStatus}
    >
      <Layout title={ctx.title} isLoading={status('loading')}>
        <Layout.TopBar onBack={handlers.cancel} />
        <MotionStack {...animations.slideInTop()} gap="$4" css={styles.content}>
          <Send.Select {...send} />
        </MotionStack>
        {txRequest.showActions && (
          <Layout.BottomBar>
            <Button variant="ghost" onPress={handlers.cancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              intent="primary"
              isDisabled={!readyToSend || !form.formState.isValid}
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

const styles = {
  content: cssObj({
    flex: 1,
  }),
};
