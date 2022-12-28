import { Stack } from '@fuel-ui/react';
import { Address } from 'fuels';
import { useNavigate, useParams } from 'react-router-dom';

import { ActivityList } from '../../components/ActivityList/ActivityList';
import { useTxs } from '../../hooks/useTxs';

import { useAccounts } from '~/systems/Account';
import { Layout } from '~/systems/Core';
import { NetworkScreen, useNetworks } from '~/systems/Network';

export function ViewActivity() {
  const addressQueryParam = useParams<{ address: string }>().address;
  const navigate = useNavigate();
  const networks = useNetworks({ type: NetworkScreen.list });
  const providerUrl = networks?.selectedNetwork?.url;
  const { account, isLoading } = useAccounts();
  let address = '';
  if (addressQueryParam) {
    address = Address.fromString(addressQueryParam).toB256();
  } else if (account) {
    address = Address.fromAddressOrString(account.address).toB256();
  }

  const { isLoadingTx, txs } = useTxs({ address, providerUrl });

  return (
    <Layout title="Activity" isLoading={isLoading}>
      <Layout.TopBar onBack={() => navigate(-1)} />
      <Layout.Content>
        <Stack gap="$4">
          <ActivityList
            transactions={txs ?? []}
            isLoading={isLoadingTx || isLoading || !account}
            ownerAddress={address}
          />
        </Stack>
      </Layout.Content>
    </Layout>
  );
}
