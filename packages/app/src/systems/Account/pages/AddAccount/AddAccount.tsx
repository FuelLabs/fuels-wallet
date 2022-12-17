import { Button, Focus, Icon } from '@fuel-ui/react';

import { AccountForm } from '../../components';
import { useAccounts } from '../../hooks';
import { useAccountForm } from '../../hooks/useAccountForm';
import type { AccountFormValues } from '../../hooks/useAccountForm';

import { Layout } from '~/systems/Core';

export const AddAccount = () => {
  const form = useAccountForm();
  const { handlers, isLoading } = useAccounts();

  function onSubmit(data: AccountFormValues) {
    // TODO fix: don't hardcode values for address and pub key
    handlers.addAccount({
      data: { name: data.name, address: '', publicKey: '' },
    });
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
              isLoading={isLoading}
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
