import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import type { BoxProps } from '@fuel-ui/react';
import { Box, CardList, Icon, Text } from '@fuel-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import type { useConnections } from '../../hooks';

import { AccountItem } from '~/systems/Account';
import {
  animations,
  ConnectInfo,
  EmptyList,
  Layout,
  SearchInput,
} from '~/systems/Core';

export type ConnectionEditProps = ReturnType<typeof useConnections>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion<BoxProps & { css?: ThemeUtilsCSS }>(Box as any);
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
          origin={origin}
          favIconUrl={favIconUrl}
          title={title}
          headerText="Edit your connection to:"
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
      color: '$intentsBase8',
    },
  }),
};
