import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Button, Icon, Link, Text } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Address } from 'fuels';
import { useNavigate } from 'react-router-dom';
import { IS_CRX } from '~/config';
import { useAccounts } from '~/systems/Account';
import { Layout, Pages, animations } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';
import { ActivityList } from '../../components/ActivityList/ActivityList';
import { useTransactionHistory } from '../../hooks';
import { useBridgeLink } from '../../hooks/useBridgeLink';

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
  const { selectedNetwork } = useNetworks();
  const { openBridge, href } = useBridgeLink();

  return (
    <Layout title="History" isLoading={isFetching || isLoadingAccounts}>
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        <Box.Stack gap="$4">
          {selectedNetwork?.bridgeUrl && (
            <Alert status="info" hideIcon>
              <Text css={styles.bridgeAlertText}>
                Bridge transactions are not shown in Fuel Wallet.{' '}
                <Link
                  href={(IS_CRX && href) || undefined}
                  onClick={openBridge}
                  isExternal
                >
                  Go to the bridge
                </Link>
              </Text>
            </Alert>
          )}
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

const styles = {
  bridgeAlertText: cssObj({
    color: '$intentsBase12',
    fontSize: '$sm',
    lineHeight: '$normal',
  }),
};
