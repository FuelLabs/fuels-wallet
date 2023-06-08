import { cssObj } from '@fuel-ui/css';
import { Button, Box } from '@fuel-ui/react';
import { motion } from 'framer-motion';

import { Send } from '../../components';
import { useSend } from '../../hooks';

import { animations, Layout } from '~/systems/Core';

const MotionStack = motion(Box.Stack);

export function SendPage() {
  const send = useSend();
  const { handlers, txRequest, status, form, ...ctx } = send;

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

const styles = {
  content: cssObj({
    flex: 1,
  }),
};
