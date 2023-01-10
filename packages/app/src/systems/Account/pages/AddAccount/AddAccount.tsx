import { Button, Focus, Icon } from '@fuel-ui/react';

import { AccountForm } from '../../components';
import { useAccounts } from '../../hooks';
import { useAccountForm } from '../../hooks/useAccountForm';
import type { AccountFormValues } from '../../hooks/useAccountForm';

import { Layout } from '~/systems/Core';

export const AddAccount = () => {
  const { handlers, accounts, isAddingAccount } = useAccounts();
  const form = useAccountForm({ accounts });

  function onSubmit(data: AccountFormValues) {
    handlers.addAccount(data.name);
  }

  return (
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
              isLoading={isAddingAccount}
              leftIcon={Icon.is('Plus')}
            >
              Create
            </Button>
          </Layout.BottomBar>
        </Focus.Scope>
      </Layout>
    </form>
  );
};
