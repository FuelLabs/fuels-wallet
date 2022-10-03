import { Button, Focus, Icon } from '@fuel-ui/react';

import { Layout } from '~/systems/Core';
import type { NetworkFormValues } from '~/systems/Network';
import {
  NetworkForm,
  useNetworks,
  useNetworkForm,
  NetworkScreen,
} from '~/systems/Network';

export function AddNetwork() {
  const form = useNetworkForm();
  const { handlers, isLoading } = useNetworks({
    type: NetworkScreen.add,
  });

  function onSubmit(data: NetworkFormValues) {
    handlers.addNetwork({ data });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Layout title="Add Network">
        <Layout.TopBar onBack={handlers.goToList} />
        <Focus.Scope autoFocus contain>
          <Layout.Content>
            <NetworkForm form={form} />
          </Layout.Content>
          <Layout.BottomBar>
            <Button color="gray" variant="ghost" onClick={handlers.goToList}>
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
}
