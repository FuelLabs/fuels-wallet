import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, CardList, Icon, IconButton, Text } from '@fuel-ui/react';
import type { Connection } from '@fuel-wallet/types';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { animations, parseUrl, truncateByWordsNum } from '~/systems/Core';

import { ConnectionRemoveDialog } from '../ConnectionRemoveDialog';

import { ConnectionItemLoader } from './ConnectionItemLoader';

const MotionCardItem = motion(CardList.Item);

export type ConnectionItemProps = {
  connection: Connection;
  isDeleting?: boolean;
  onEdit: (origin: string) => void;
  onDelete: (origin: string) => void;
};

type ConnectionItemComponent = FC<ConnectionItemProps> & {
  Loader: typeof ConnectionItemLoader;
};

export const ConnectionItem: ConnectionItemComponent = ({
  connection,
  isDeleting,
  onEdit,
  onDelete,
}) => {
  const { origin, title, favIconUrl, accounts } = connection;
  const connectedAccounts = accounts.length;

  function handleConfirm() {
    onDelete(connection.origin);
  }

  return (
    <MotionCardItem
      {...animations.slideInTop()}
      rightEl={
        <Box.Flex css={styles.root}>
          <IconButton
            icon={<Icon icon={Icon.is('Edit')} color="intentsBase8" />}
            size="xs"
            variant="link"
            aria-label="Edit"
            onPress={() => onEdit(origin)}
          />
          <ConnectionRemoveDialog
            isConfirming={Boolean(isDeleting)}
            connection={connection}
            onConfirm={handleConfirm}
          >
            <IconButton
              icon={<Icon icon={Icon.is('Trash')} color="intentsBase8" />}
              size="xs"
              variant="link"
              aria-label="Delete"
            />
          </ConnectionRemoveDialog>
        </Box.Flex>
      }
      css={styles.container}
    >
      <Avatar
        size="sm"
        role="img"
        name={truncateByWordsNum(title || origin, 2)}
        src={favIconUrl}
        css={styles.avatar}
      />
      <Box.Stack gap="$2" css={styles.stack}>
        <Text css={styles.title}>{title}</Text>
        <Text css={styles.link}>{parseUrl(origin)}</Text>
        <Text css={styles.accounts}>
          {connectedAccounts} {`account${connectedAccounts > 1 ? 's' : ''}`}{' '}
          connected
        </Text>
      </Box.Stack>
    </MotionCardItem>
  );
};

ConnectionItem.Loader = ConnectionItemLoader;

const styles = {
  root: cssObj({
    alignItems: 'center',

    /**
     * TODO: change on fuel-ui to .fuel-IconButton instead
     */
    '.fuel_IconButon': {
      padding: '$1 !important',
      height: 'auto',
    },
  }),
  container: cssObj({
    '& .fuel_Box-flex': {
      minWidth: 0,
    },
  }),
  stack: cssObj({
    minWidth: 0,
  }),
  avatar: cssObj({
    flexShrink: 0,
  }),
  title: cssObj({
    fontSize: '$sm',
    lineHeight: '$none',
    color: '$intentsBase12',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
  link: cssObj({
    fontSize: '$sm',
    lineHeight: '$none',
    color: '$intentsPrimary11',
    fontWeight: '$normal',
  }),
  accounts: cssObj({
    fontSize: '$xs',
    lineHeight: '$none',
    fontWeight: '$normal',
    color: '$intentsBase8',
  }),
};
