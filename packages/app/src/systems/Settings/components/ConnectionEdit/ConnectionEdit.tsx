import { cssObj } from '@fuel-ui/css';
import { Box, CardList, Icon, Text } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AccountItem } from '~/systems/Account';
import {
  ConnectInfo,
  EmptyList,
  Layout,
  SearchInput,
  animations,
} from '~/systems/Core';

import type { useConnections } from '../../hooks';

export type ConnectionEditProps = ReturnType<typeof useConnections>;

const MotionBox = motion(Box);
const MotionCardList = motion(CardList);

export function ConnectionEdit({
  handlers,
  status,
  ...ctx
}: ConnectionEditProps) {
  if (!ctx.connection) return null;
  const { origin, title, favIconUrl } = ctx.connection;

  return (
    <Layout.Content>
      <Box.Stack gap="$3">
        <ConnectInfo
          headerText="Edit your connection to:"
          origin={origin}
          favIconUrl={favIconUrl}
          title={title}
        />
        <Box.Flex css={styles.searchBar}>
          <SearchInput
            value={ctx.inputs?.searchText}
            onChange={handlers.search}
          />
          <Text css={styles.label} leftIcon={Icon.is('PlugConnected')}>
            {ctx.numConnected} connected
          </Text>
        </Box.Flex>
        {status('noResults') && (
          <MotionBox {...animations.slideInTop()} css={styles.empty}>
            <EmptyList label="No account found" />
          </MotionBox>
        )}
        {status('idle') && (
          <MotionCardList {...animations.slideInTop()} gap="$3">
            <AnimatePresence initial={false}>
              {ctx.accounts?.map((account) => {
                const { address } = account;
                const isConnected = handlers.isConnected(address);
                return (
                  <motion.div key={address} {...animations.slideInTop()}>
                    <AccountItem
                      account={account!}
                      isToggleChecked={isConnected}
                      isDisabled={ctx.accountToUpdate === address}
                      onToggle={handlers.toggleAccount}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </MotionCardList>
        )}
      </Box.Stack>
    </Layout.Content>
  );
}

const styles = {
  title: cssObj({
    fontSize: '$sm',
    pb: '$3',
    borderBottom: '1px solid $border',
    wordBreak: 'break-all',

    '.fuel_Icon': {
      color: '$intentsPrimary9',
    },
  }),
  searchBar: cssObj({
    justifyContent: 'space-between',
  }),
  empty: cssObj({
    pt: '$11',
  }),
  label: cssObj({
    fontSize: '$sm',
    fontWeight: '$normal',
    color: '$intentsBase10',
    display: 'flex',
    alignItems: 'center',
    marginRight: '$1',

    '.fuel_Icon': {
      color: 'currentColor',
    },
  }),
};
