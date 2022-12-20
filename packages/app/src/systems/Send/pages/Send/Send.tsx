import { Button } from '@fuel-ui/react';

import { SendConfirm, SendSelect } from '../../components';
import { useSend } from '../../hooks/useSend';
import { SendScreens } from '../../machines/sendMachine';

import { IS_CRX_POPUP } from '~/config';
import { Layout } from '~/systems/Core';
import { UnlockDialog, useTransactionRequest } from '~/systems/DApp';

export function Send() {
  const tx = useTransactionRequest();
  const send = useSend();
  const { handlers, form, ...ctx } = send;
  const isSelectScreen = ctx.screen === SendScreens.select;
  const isConfirmScreen = ctx.screen === SendScreens.confirm;

  function onSubmit() {
    handlers.confirm();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Layout title="Send" isLoading={ctx.isLoading}>
        <Layout.TopBar onBack={handlers.cancel} />
        <Layout.Content>
          {isSelectScreen && <SendSelect tx={tx} send={send} />}
          {isConfirmScreen && <SendConfirm {...send} />}
        </Layout.Content>
        <Layout.BottomBar>
          <Button color="gray" variant="ghost" onPress={handlers.cancel}>
            {isSelectScreen ? 'Cancel' : 'Back'}
          </Button>
          <Button
            type="submit"
            color="accent"
            isDisabled={!ctx.canConfirm || !form.formState.isValid}
            isLoading={ctx.isLoading}
          >
            {isSelectScreen ? 'Confirm' : 'Approve'}
          </Button>
        </Layout.BottomBar>
        <UnlockDialog
          unlockText="Confirm Transaction"
          unlockError={ctx.errors.unlock}
          isFullscreen={IS_CRX_POPUP}
          isOpen={ctx.screen === SendScreens.unlocking}
          onUnlock={handlers.unlock}
          isLoading={ctx.isLoading}
        />
      </Layout>
    </form>
  );
}
