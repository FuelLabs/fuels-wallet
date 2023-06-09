import { cssObj } from '@fuel-ui/css';
import { Icon, CardList, Tooltip, Box } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import type { useConnections } from '../../hooks';
import { ConnectionItem } from '../ConnectionItem';

import {
  animations,
  EmptyList,
  Layout,
  SearchInput,
  PermissionCard,
  MotionBox,
} from '~/systems/Core';
import { NOT_ALLOWED_LIST, PERMISSION_LIST } from '~/systems/DApp';

export type ConnectionListProps = ReturnType<typeof useConnections>;

const MotionCardList = motion(CardList);

export function ConnectionList({
  handlers,
  status,
  ...ctx
}: ConnectionListProps) {
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
            <Tooltip content={tooltipContent} as="div" alignOffset={12}>
              <Icon
                icon={Icon.is('AlertTriangle')}
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
          <MotionBox {...animations.slideInTop()} css={styles.empty}>
            <EmptyList
              label={
                status('isEmpty') ? 'No apps connected' : 'No connection found'
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
      color: '$intentsWarning9',
    },
  }),
  tooltipContent: cssObj({
    maxWidth: 250,
    textSize: 'sm',
    textAlign: 'right',
    padding: '$0',
  }),
};
