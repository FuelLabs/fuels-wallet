import { Box, Button, Icon } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Address } from 'fuels';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '~/systems/Account';
import { Layout, Pages, animations } from '~/systems/Core';
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
    isFetchingNextPage,
    transactionHistory,
    hasNextPage,
    fetchNextPage,
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

          <AnimatePresence initial={false} mode="popLayout">
            {hasNextPage || isFetchingNextPage ? (
              <motion.div key="more" {...animations.fadeIn()}>
                <Button
                  css={{
                    display: 'flex',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    height: 26,
                  }}
                  size="xs"
                  variant="link"
                  color="blue"
                  rightIcon={
                    isFetchingNextPage ? undefined : Icon.is('ChevronDown')
                  }
                  onPress={fetchNextPage}
                  disabled={isFetchingNextPage || !hasNextPage}
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load more'}
                </Button>
              </motion.div>
            ) : (
              <Box
                key="spacer"
                {...animations.fadeIn()}
                css={{ height: 26, width: '100%' }}
              />
            )}
          </AnimatePresence>
        </Box.Stack>
      </Layout.Content>
    </Layout>
  );
}
