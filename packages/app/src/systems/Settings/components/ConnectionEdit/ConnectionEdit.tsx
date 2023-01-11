import { cssObj } from '@fuel-ui/css';
import { Box, CardList, Flex, Icon, Stack, Switch, Text } from '@fuel-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import type { useConnections } from '../../hooks';

import { AccountItem } from '~/systems/Account';
import { animations, EmptyList, Layout, SearchInput } from '~/systems/Core';

export type ConnectionEditProps = ReturnType<typeof useConnections>;

const MotionBox = motion(Box);
const MotionCardList = motion(CardList);

export function ConnectionEdit({
  handlers,
  status,
  ...ctx
}: ConnectionEditProps) {
  return (
    <Layout.Content>
      <Stack gap="$3">
        <Text leftIcon={Icon.is('Globe')} css={styles.title}>
          {ctx.inputs.origin}
        </Text>
        <Flex css={styles.searchBar}>
          <SearchInput
            value={ctx.inputs?.searchText}
            onChange={handlers.search}
          />
          <Text css={styles.label} leftIcon={Icon.is('PlugsConnected')}>
            {ctx.numConnected} connected
          </Text>
        </Flex>
        {status('noResults') && (
          <MotionBox {...animations.slideInTop()} css={styles.empty}>
            <EmptyList label="No account found" />
          </MotionBox>
        )}
        {status('idle') && (
          <MotionCardList {...animations.slideInTop()} gap="$3">
            <AnimatePresence initial={false}>
              {ctx.accounts.map((account) => {
                const { address } = account;
                const isConnected = handlers.isConnected(address);
                const rightEl = (
                  <Flex css={styles.switchWrapper}>
                    <Switch
                      size="sm"
                      checked={isConnected}
                      onCheckedChange={() =>
                        handlers.toggleAccount(address, isConnected)
                      }
                    />
                  </Flex>
                );
                return (
                  <motion.div key={address} {...animations.slideInTop()}>
                    <AccountItem
                      account={account!}
                      rightEl={rightEl}
                      isDisabled={ctx.accountToUpdate === address}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </MotionCardList>
        )}
      </Stack>
    </Layout.Content>
  );
}

const styles = {
  title: cssObj({
    fontSize: '$sm',
    pb: '$2',
    borderBottom: '1px dashed $gray2',
    wordBreak: 'break-all',

    '.fuel_icon': {
      color: '$accent9',
    },
  }),
  searchBar: cssObj({
    justifyContent: 'space-between',
  }),
  empty: cssObj({
    pt: '$11',
  }),
  label: cssObj({
    fontSize: '$xs',
    fontWeight: '$medium',
    color: '$gray10',

    '.fuel_icon': {
      color: '$gray8',
    },
  }),
  switchWrapper: cssObj({
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
