import { cssObj } from '@fuel-ui/css';
import {
  Button,
  Card,
  CardList,
  Flex,
  Icon,
  Link,
  List,
  Switch,
  Text,
} from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { useConnectRequest } from '../../hooks/useConnectRequest';

import { AccountItem } from '~/systems/Account';
import { animations, Layout, OriginTag } from '~/systems/Core';

const PERMISSION_LIST = [
  'View your account address',
  'Request transactions approval',
  'Request message signature',
  'Read your transactions history',
];
const NOT_ALLOWED_LIST = ['View your private keys'];

const MotionCardList = motion(CardList);

export function ConnectionRequest() {
  const {
    handlers,
    origin,
    isLoadingAccounts,
    accounts,
    isSelectingAccounts,
    isConnecting,
    hasSelectedAccounts,
    selectedAccounts,
  } = useConnectRequest();

  if (!accounts || !origin) return null;

  return (
    <Layout title="Connection Request" isLoading={isLoadingAccounts}>
      <Layout.Content css={styles.content}>
        <Card css={styles.connectCard}>
          <Text color="gray12" css={{ fontWeight: '$semibold' }}>
            Connect to Fuel Wallet
          </Text>
          <OriginTag origin={origin} />
        </Card>
        <MotionCardList
          {...animations.slideInTop()}
          gap="$3"
          css={styles.accountList}
        >
          {isSelectingAccounts && (
            <AnimatePresence>
              <motion.div {...animations.slideInTop()}>
                <Flex css={styles.sectionHeader}>
                  <Text color="gray12" css={{ fontWeight: '$semibold' }}>
                    Select accounts to connect
                  </Text>
                </Flex>
              </motion.div>
              {accounts?.map((account) => {
                const { address } = account;
                const isConnected = handlers.isAccountSelected(address);
                const rightEl = (
                  <Flex css={styles.switchWrapper}>
                    <Switch
                      size="sm"
                      checked={isConnected}
                      onCheckedChange={() => handlers.toggleAccount(address)}
                    />
                  </Flex>
                );
                return (
                  <motion.div key={address} {...animations.slideInTop()}>
                    <AccountItem account={account!} rightEl={rightEl} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          {isConnecting && (
            <AnimatePresence>
              <motion.div {...animations.slideInTop()}>
                <Flex css={styles.sectionHeader}>
                  <Text color="gray12" css={{ fontWeight: '$semibold' }}>
                    Allow this site to:
                  </Text>
                </Flex>
                <Card css={styles.connectionDetails}>
                  <List icon={Icon.is('Check')} iconColor="accent9">
                    {PERMISSION_LIST.map((permission) => (
                      <List.Item css={styles.listItemAllowed} key={permission}>
                        {permission}
                      </List.Item>
                    ))}
                  </List>
                  <List icon={Icon.is('X')} iconColor="red10">
                    {NOT_ALLOWED_LIST.map((permission) => (
                      <List.Item
                        css={styles.listItemDisallowed}
                        key={permission}
                      >
                        {permission}
                      </List.Item>
                    ))}
                  </List>
                </Card>
              </motion.div>
              <motion.div {...animations.slideInTop()}>
                <Flex css={styles.sectionHeader}>
                  <Text color="gray12" css={{ fontWeight: '$semibold' }}>
                    Accounts to connect
                  </Text>
                  <Button onPress={handlers.back} size="xs" variant="link">
                    Change
                  </Button>
                </Flex>
              </motion.div>
              {selectedAccounts?.map((account) => {
                const { address } = account;

                return (
                  <motion.div key={address} {...animations.slideInTop()}>
                    <AccountItem account={account!} compact />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </MotionCardList>
      </Layout.Content>
      <Flex css={styles.disclaimer} justify="center" align={'flex-end'}>
        <Text fontSize="sm" as={'h2'} className="warning">
          Only connect with sites you trust.{' '}
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
              isDisabled={!hasSelectedAccounts}
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
  listItemAllowed: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
  }),
  listItemDisallowed: cssObj({
    fontSize: '$sm',
  }),
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
    marginTop: '$3',
    px: '$3',
    paddingTop: '$2',
    paddingBottom: '$4',
  }),
  disclaimer: cssObj({
    mb: '-10px',
    pt: '$1',
  }),
  switchWrapper: cssObj({
    alignItems: 'center',
    justifyContent: 'center',
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
};
