import { Box } from '@fuel-ui/react';
import { Address } from 'fuels';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '~/systems/Account';
import { Layout, Pages } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';

import { ActivityList } from '../../components/ActivityList/ActivityList';
import { useTransactionHistory } from '../../hooks';

export function ViewActivity() {
  const navigate = useNavigate();
  const networks = useNetworks();
  const providerUrl = networks?.selectedNetwork?.url;
  const { account, isLoading: isLoadingAccounts } = useAccounts();

  const address = account
    ? Address.fromAddressOrString(account?.address).toB256()
    : '';
  const { isLoading: isLoadingTx, transactionHistory } = useTransactionHistory({
    address,
    providerUrl,
  });

  return (
    <Layout title="History" isLoading={isLoadingTx || isLoadingAccounts}>
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        <Box.Stack gap="$4">
          <ActivityList
            txs={transactionHistory ?? []}
            isLoading={isLoadingTx || isLoadingAccounts || !account}
            ownerAddress={address}
          />
        </Box.Stack>
      </Layout.Content>
    </Layout>
  );
}
