import { Button, Focus, Icon } from '@fuel-ui/react';

import { AccountForm } from '../../components';
import { useAccounts } from '../../hooks';
import { useAccountForm } from '../../hooks/useAccountForm';
import type { AccountFormValues } from '../../hooks/useAccountForm';

import { Layout } from '~/systems/Core';
import { UnlockDialog } from '~/systems/DApp';

export const AddAccount = () => {
  const form = useAccountForm();
  const { handlers, isLoading, isUnlocking, isUnlockingLoading } =
    useAccounts();

  function onSubmit(data: AccountFormValues) {
    handlers.addAccount(data.name);
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Layout title="Add Account">
          <Layout.TopBar onBack={handlers.goToList} />
          <Focus.Scope autoFocus contain>
            <Layout.Content>
              <AccountForm form={form} />
            </Layout.Content>
            <Layout.BottomBar>
              <Button color="gray" variant="ghost" onPress={handlers.goToList}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="accent"
                isDisabled={!form.formState.isValid}
                isLoading={isLoading}
                leftIcon={Icon.is('Plus')}
              >
                Create
              </Button>
            </Layout.BottomBar>
          </Focus.Scope>
        </Layout>
      </form>
      <UnlockDialog
        unlockText="Add Account"
        isOpen={isUnlocking}
        onUnlock={handlers.unlock}
        isLoading={isUnlockingLoading}
        onClose={handlers.closeUnlock}
      />
    </>
  );
};
