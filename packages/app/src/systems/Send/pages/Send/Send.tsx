import { Button } from '@fuel-ui/react';
import type { FormEvent } from 'react';

import { SendConfirm, SendSelect } from '../../components';
import { useSend } from '../../hooks/useSend';
import { SendScreens } from '../../machines/sendMachine';

import { IS_CRX_POPUP } from '~/config';
import { Layout } from '~/systems/Core';
import { UnlockDialog, useTransactionRequest } from '~/systems/DApp';

export function Send() {
  const tx = useTransactionRequest();
  const send = useSend();
  const { handlers, ...ctx } = send;
  const isSelectScreen = ctx.screen === SendScreens.select;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handlers.confirm();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Layout title="Send" isLoading={ctx.isLoading}>
        <Layout.TopBar onBack={handlers.cancel} />
        <Layout.Content>
          {isSelectScreen ? (
            <SendSelect tx={tx} send={send} />
          ) : (
            <SendConfirm {...send} />
          )}
        </Layout.Content>
        <Layout.BottomBar>
          <Button color="gray" variant="ghost" onPress={handlers.cancel}>
            {isSelectScreen ? 'Cancel' : 'Back'}
          </Button>
          <Button
            type="submit"
            color="accent"
            isDisabled={!ctx.canConfirm}
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
