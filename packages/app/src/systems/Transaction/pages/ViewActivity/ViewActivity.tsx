import { Box, Button, Icon } from '@fuel-ui/react';
import { Address } from 'fuels';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '~/systems/Account';
import { Layout, Pages } from '~/systems/Core';

import { ActivityList } from '../../components/ActivityList/ActivityList';
import { useTransactionHistory } from '../../hooks';

export function ViewActivity() {
  const navigate = useNavigate();
  const { account, isLoading: isLoadingAccounts } = useAccounts();

  const address = account
    ? Address.fromAddressOrString(account?.address).toB256()
    : '';
  const {
    isFetching,
    isFetchingPreviousPage,
    transactionHistory,
    hasPreviousPage,
    fetchPreviousPage,
  } = useTransactionHistory({
    address,
  });

  return (
    <Layout title="History" isLoading={isFetching || isLoadingAccounts}>
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        <Box.Stack gap="$4">
          <ActivityList
            txs={transactionHistory ?? []}
            isLoading={isFetching || isLoadingAccounts || !account}
            ownerAddress={address}
          />
          {hasPreviousPage && (
            <Button
              size="xs"
              variant="link"
              color="blue"
              rightIcon={
                isFetchingPreviousPage ? undefined : Icon.is('ChevronDown')
              }
              onPress={fetchPreviousPage}
              disabled={isFetchingPreviousPage}
            >
              {isFetchingPreviousPage ? 'Loading...' : 'Load more'}
            </Button>
          )}
        </Box.Stack>
      </Layout.Content>
    </Layout>
  );
}
