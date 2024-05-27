import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { Layout, MotionStack, animations } from '~/systems/Core';

import { FormProvider } from 'react-hook-form';
import { Send } from '../../components';
import { useSend } from '../../hooks';

export function SendPage() {
  const send = useSend();
  const { handlers, txRequest, status, form, readyToSend } = send;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handlers.submit)}
        data-testid={txRequest.txStatus}
        autoComplete="off"
      >
        <Layout title="Send" isLoading={status('loading')}>
          <Layout.TopBar onBack={handlers.cancel} />
          <MotionStack
            {...animations.slideInTop()}
            gap="$4"
            css={styles.content}
          >
            <Send.Select {...send} />
          </MotionStack>
          {txRequest.shouldShowActions && (
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
                Review
              </Button>
            </Layout.BottomBar>
          )}
        </Layout>
      </form>
    </FormProvider>
  );
}

const styles = {
  content: cssObj({
    flex: 1,
  }),
};
