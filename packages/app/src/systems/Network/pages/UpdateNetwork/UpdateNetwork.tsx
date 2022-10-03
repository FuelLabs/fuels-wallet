import { Focus, Button } from '@fuel-ui/react';
import { useParams } from 'react-router-dom';

import { Layout } from '~/systems/Core';
import type { NetworkFormValues } from '~/systems/Network';
import {
  NetworkForm,
  useNetworkForm,
  useNetworks,
  NetworkScreen,
} from '~/systems/Network';

export function UpdateNetwork() {
  const params = useParams<{ id: string }>();
  const id = params.id!;
  const { network, isLoading, handlers } = useNetworks({
    type: NetworkScreen.update,
    networkId: id,
  });

  const form = useNetworkForm({
    defaultValues: network,
  });

  function onSubmit(data: NetworkFormValues) {
    handlers.updateNetwork({ id, data });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Layout title="Update Network" isLoading={isLoading || !network}>
        <Layout.TopBar onBack={handlers.goToList} />
        <Focus.Scope contain autoFocus>
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
            >
              Update
            </Button>
          </Layout.BottomBar>
        </Focus.Scope>
      </Layout>
    </form>
  );
}
