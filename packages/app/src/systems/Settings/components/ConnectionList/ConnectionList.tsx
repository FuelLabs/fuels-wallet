import { cssObj, Box, CardList, Icon, Tooltip } from '@fuel-wallet/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  EmptyList,
  Layout,
  MotionBox,
  PermissionCard,
  SearchInput,
  animations,
} from '~/systems/Core';
import { NOT_ALLOWED_LIST, PERMISSION_LIST } from '~/systems/DApp';

import type { useConnections } from '../../hooks';
import { ConnectionItem } from '../ConnectionItem';

export type ConnectionListProps = ReturnType<typeof useConnections>;

const MotionCardList = motion(CardList);

export function ConnectionList({
  handlers,
  status,
  ...ctx
}: ConnectionListProps) {
  const isEmpty = status('isEmpty');
  const hasConnections = Boolean(ctx.connections?.length);
  const [hadConnections, setHadConnections] = useState(false);
  /* Removing the last app on this screen is a finished review, not a blank list. */
  const isCleared = isEmpty && hadConnections;

  useEffect(() => {
    if (hasConnections) setHadConnections(true);
  }, [hasConnections]);

  const tooltipContent = (
    <Box css={styles.tooltipContent}>
      <PermissionCard
        headerText="These sites are allowed to:"
        allowed={PERMISSION_LIST}
        notAllowed={NOT_ALLOWED_LIST}
      />
    </Box>
  );

  return (
    <Layout.Content css={styles.root}>
      <Box.Stack gap="$3">
        {!status('isEmpty') && (
          <Box.Flex css={styles.topbar}>
            <SearchInput
              value={ctx.inputs?.searchText}
              onChange={handlers.search}
              isDisabled={status('loading')}
            />
            <Tooltip
              content={tooltipContent}
              as="div"
              className="fuel_tooltip--container"
            >
              <Icon
                icon={Icon.is('InfoCircle')}
                aria-label="Connection Alert"
              />
            </Tooltip>
          </Box.Flex>
        )}
        {status('loading') && (
          <CardList gap="$3">
            {[1, 2, 3].map((i) => (
              <ConnectionItem.Loader key={i} />
            ))}
          </CardList>
        )}
        {(status('noResults') || status('isEmpty')) && (
          <MotionBox
            {...animations.slideInTop()}
            css={styles.empty}
            className={isCleared ? 'fuel-ticks' : undefined}
          >
            <EmptyList
              label={
                isCleared
                  ? 'All apps disconnected'
                  : isEmpty
                    ? 'No apps connected'
                    : 'No connection found'
              }
              description={
                isCleared
                  ? 'No app can see your accounts now'
                  : isEmpty
                    ? 'Apps you connect will show up here'
                    : 'Try searching for a different app'
              }
            />
          </MotionBox>
        )}
        {(status('idle') || status('removing')) && (
          <MotionCardList {...animations.slideInTop()} gap="$3">
            <AnimatePresence initial={false} mode="sync">
              {ctx.connections?.map((connection) => (
                <ConnectionItem
                  key={connection.origin}
                  connection={connection}
                  isDeleting={status('removing')}
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
      </Box.Stack>
    </Layout.Content>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',

    '.fuel_tooltip--content': {
      background: '$intentsBase1',
    },
  }),
  empty: cssObj({
    pt: '$11',
  }),
  topbar: cssObj({
    zIndex: '$10',
    alignItems: 'center',

    '.fuel_Input': {
      flex: 1,
    },

    '& > .fuel_Icon': {
      color: '$intentsBase9',
    },

    '.fuel_tooltip--container': {
      paddingTop: 0,
      background: '$transparent',
    },
  }),
  tooltipContent: cssObj({
    maxWidth: 250,
    textSize: 'sm',
    padding: '$0',
  }),
};
