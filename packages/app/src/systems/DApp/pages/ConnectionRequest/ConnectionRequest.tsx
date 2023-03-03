import { cssObj } from '@fuel-ui/css';
import { Button, Card, CardList, Flex, Link, Text } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { useConnectRequest } from '../../hooks/useConnectRequest';

import { AccountItem } from '~/systems/Account';
import {
  animations,
  Layout,
  ConnectInfo,
  PermissionCard,
} from '~/systems/Core';

export const PERMISSION_LIST = [
  'View your account address',
  'Request transactions approval',
  'Request message signature',
  'Read your transactions history',
];
export const NOT_ALLOWED_LIST = ['View your private keys'];

const MotionCardList = motion(CardList);

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
    <Layout title="Connection Request" isLoading={isLoadingAccounts}>
      <Layout.Content css={styles.content}>
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
                  <Card.Header css={styles.cardHeader}>
                    <Text css={styles.cardHeaderText}>
                      Select accounts to connect
                    </Text>
                  </Card.Header>
                  <Card.Body css={styles.accountCardBody}>
                    {accounts?.map((account) => {
                      const { address } = account;
                      const isConnected = handlers.isAccountSelected(address);
                      return (
                        <motion.div key={address} {...animations.slideInTop()}>
                          <AccountItem
                            account={account!}
                            onToggle={() => handlers.toggleAccount(address)}
                            isConnected={isConnected}
                          />
                        </motion.div>
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
                  <Card.Header css={styles.cardHeader} justify="space-between">
                    <Text css={styles.cardHeaderText}>Accounts to connect</Text>
                    <Button onPress={handlers.back} size="xs" variant="link">
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
      <Flex css={styles.disclaimer} justify="center" align={'flex-end'}>
        <Text fontSize="sm" as={'h2'} className="warning">
          Only connect with sites you trust.
          <Link href="#" color="accent11">
            Learn more
          </Link>
          .
        </Text>
      </Flex>
      <Layout.BottomBar>
        <Button
          color="gray"
          variant="ghost"
          onPress={() => handlers.rejectConnection()}
        >
          Reject
        </Button>
        <>
          {isSelectingAccounts && (
            <Button
              type="submit"
              color="accent"
              onPress={() => handlers.next()}
              isDisabled={!hasCurrentAccounts}
            >
              Next
            </Button>
          )}
          {isConnecting && (
            <Button
              type="submit"
              color="accent"
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
    paddingBottom: '$0',
    '& h2': {
      fontSize: '$sm',
    },
    '& a': {
      fontSize: '$sm',
      fontWeight: '$bold',
    },
  }),
  connectionDetails: cssObj({
    marginTop: '$0',
  }),
  disclaimer: cssObj({
    mb: '-10px',
    pt: '$1',
  }),
  accountList: cssObj({
    mt: '$4',
  }),
  sectionHeader: cssObj({
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  connectCard: cssObj({
    p: '$3',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '$2',
  }),
  cardHeader: cssObj({
    px: '$3',
    py: '$2',
  }),
  cardHeaderText: cssObj({
    fontSize: '$sm',
    fontWeight: '$bold',
    color: '$gray12',
  }),
  accountCardBody: cssObj({
    p: '$0',
  }),
};
