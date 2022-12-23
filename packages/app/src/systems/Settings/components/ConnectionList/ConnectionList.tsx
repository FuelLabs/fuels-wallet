import { cssObj } from '@fuel-ui/css';
import { Icon, CardList, Flex, Tooltip, Box, Stack } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import type { useConnections } from '../../hooks';
import { ConnectionItem } from '../ConnectionItem';

import { animations, EmptyList, Layout, SearchInput } from '~/systems/Core';

export type ConnectionListProps = ReturnType<typeof useConnections>;

const MotionBox = motion(Box);
const MotionCardList = motion(CardList);

export function ConnectionList({ handlers, ...ctx }: ConnectionListProps) {
  const tooltipContent = (
    <Box css={styles.tooltipContent}>
      FuelWallet is connected to these sites. They can view your account
      address.
    </Box>
  );

  return (
    <Layout.Content css={styles.root}>
      <Stack gap="$3">
        <Flex css={styles.topbar}>
          <SearchInput
            value={ctx.inputs?.searchText}
            onChange={handlers.search}
            isDisabled={ctx.isLoading}
          />
          <Tooltip content={tooltipContent}>
            <Icon icon={Icon.is('Warning')} aria-label="Connection Alert" />
          </Tooltip>
        </Flex>
        {ctx.isLoading && (
          <CardList>
            {[1, 2, 3].map((i) => (
              <ConnectionItem.Loader key={i} />
            ))}
          </CardList>
        )}
        {ctx.noConnections && (
          <MotionBox {...animations.slideInTop()} css={styles.empty}>
            <EmptyList label="No account found" />
          </MotionBox>
        )}
        {ctx.showConnections && (
          <MotionCardList {...animations.slideInTop()} gap="$3">
            <AnimatePresence initial={false} mode="sync">
              {ctx.connections.map((connection) => (
                <ConnectionItem
                  key={connection.origin}
                  connection={connection}
                  isDeleting={ctx.isRemoving}
                  onEdit={() => {
                    handlers.editConnection(connection);
                  }}
                  onDelete={() => {
                    handlers.removeConnection(connection);
                  }}
                />
              ))}
            </AnimatePresence>
          </MotionCardList>
        )}
      </Stack>
    </Layout.Content>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
  }),
  empty: cssObj({
    pt: '$11',
  }),
  topbar: cssObj({
    zIndex: '$10',
    alignItems: 'center',

    '.fuel_input': {
      flex: 1,
    },

    '& > .fuel_icon': {
      color: '$amber9',
    },
  }),
  tooltipContent: cssObj({
    maxWidth: 250,
    textSize: 'sm',
    textAlign: 'right',
  }),
};
