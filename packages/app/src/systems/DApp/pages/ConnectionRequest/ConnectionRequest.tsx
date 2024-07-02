import { cssObj } from '@fuel-ui/css';
import { Box, Button, Card, CardList, Link, Text } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AccountItem } from '~/systems/Account/components/AccountItem';
import {
  ConnectInfo,
  Layout,
  PermissionCard,
  animations,
  coreStyles,
} from '~/systems/Core';

import { useConnectRequest } from '../../hooks/useConnectRequest';

export const PERMISSION_LIST = [
  'View your account address',
  'Request transaction approval',
  'Request message signature',
  'Read your transaction history',
];
export const NOT_ALLOWED_LIST = ['View your private keys'];

const MotionCardList = motion(CardList);
const MotionAccountItem = motion(AccountItem);

export function ConnectionRequest() {
  const {
    handlers,
    origin,
    isLoadingAccounts,
    accounts,
    isSelectingAccounts,
    isConnecting,
    hasCurrentAccounts,
    currentAccounts,
    title,
    favIconUrl,
  } = useConnectRequest();

  if (!accounts || !origin) return null;

  return (
    <Layout title="Connection Request" isLoading={isLoadingAccounts} noBorder>
      <Layout.Content noBorder noScroll={false} css={styles.content}>
        <ConnectInfo
          origin={origin}
          title={title || origin}
          favIconUrl={favIconUrl}
          headerText="Connection request from:"
        />
        <MotionCardList
          {...animations.slideInTop()}
          gap="$4"
          css={styles.accountList}
        >
          {isSelectingAccounts && (
            <AnimatePresence>
              <motion.div {...animations.slideInTop()}>
                <Card>
                  <Card.Header space="compact">
                    <Text>Select accounts to connect</Text>
                  </Card.Header>
                  <Card.Body css={styles.accountCardBody}>
                    {accounts?.map((account) => {
                      const { address } = account;
                      const isConnected = handlers.isAccountSelected(address);
                      return (
                        <MotionAccountItem
                          key={address}
                          {...animations.slideInTop()}
                          css={styles.accountItem}
                          account={account!}
                          onToggle={handlers.toggleAccount}
                          isToggleChecked={isConnected}
                        />
                      );
                    })}
                  </Card.Body>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}
          {isConnecting && (
            <AnimatePresence>
              <motion.div {...animations.slideInTop()}>
                <PermissionCard
                  headerText="This site would like to:"
                  allowed={PERMISSION_LIST}
                  notAllowed={NOT_ALLOWED_LIST}
                />
              </motion.div>
              <motion.div {...animations.slideInTop()}>
                <Card>
                  <Card.Header space="compact" css={styles.header}>
                    <Text>Accounts to connect</Text>
                    <Button
                      size="xs"
                      variant="outlined"
                      onPress={handlers.back}
                    >
                      Change
                    </Button>
                  </Card.Header>
                  {currentAccounts?.map((account) => {
                    const { address } = account;
                    return (
                      <motion.div key={address} {...animations.slideInTop()}>
                        <AccountItem account={account!} compact />
                      </motion.div>
                    );
                  })}
                </Card>
              </motion.div>
            </AnimatePresence>
          )}
        </MotionCardList>
      </Layout.Content>
      <Box.Flex css={styles.disclaimer} justify="flex-start" align={'flex-end'}>
        <Text fontSize="sm" as={'h2'} className="warning">
          Only connect with sites you trust.
        </Text>
      </Box.Flex>
      <Layout.BottomBar>
        <Button variant="ghost" onPress={() => handlers.rejectConnection()}>
          Reject
        </Button>
        <>
          {isSelectingAccounts && (
            <Button
              type="submit"
              intent="primary"
              onPress={() => handlers.next()}
              isDisabled={!hasCurrentAccounts}
            >
              Next
            </Button>
          )}
          {isConnecting && (
            <Button
              type="submit"
              intent="primary"
              onPress={handlers.authorizeConnection}
            >
              Connect
            </Button>
          )}
        </>
      </Layout.BottomBar>
    </Layout>
  );
}

const styles = {
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    padding: '$4 $0 $4 $4 !important',
    ...coreStyles.scrollable(),
    overflowY: 'scroll !important',

    '& h2': {
      fontSize: '$sm',
    },
    '& a': {
      fontSize: '$sm',
      fontWeight: '$normal',
    },
  }),
  connectionDetails: cssObj({
    marginTop: '$0',
  }),
  disclaimer: cssObj({
    pt: '$1',
    ml: '$4',
  }),
  header: cssObj({
    display: 'flex',
    justifyContent: 'space-between',

    '.fuel_Button': {
      py: '$1',
      height: '$6',
    },
  }),
  accountList: cssObj({
    mt: '$4',

    '.fuel_Card .fuel_Card': {
      border: 'none',
    },
  }),
  sectionHeader: cssObj({
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  accountCardBody: cssObj({
    padding: '$0',
  }),
  accountItem: cssObj({
    '& ~ &': {
      borderTop: '1px solid $bodyBg',
    },
  }),
};
