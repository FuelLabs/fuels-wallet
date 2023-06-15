import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, CardList, Icon, IconButton, Text } from '@fuel-ui/react';
import type { Connection } from '@fuel-wallet/types';
import { motion } from 'framer-motion';
import type { FC } from 'react';

import { ConnectionRemoveDialog } from '../ConnectionRemoveDialog';

import { ConnectionItemLoader } from './ConnectionItemLoader';

import { animations, parseUrl, truncate } from '~/systems/Core';

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
  const origin = connection.origin;
  const accounts = connection.accounts.length;
  const favIconUrl = connection.favIconUrl;

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
    >
      <Avatar size="sm" name={origin} src={favIconUrl} css={styles.avatar} />
      <Box css={styles.text}>
        <Text>{truncate(parseUrl(origin))}</Text>
        <Text>
          {accounts} {`account${accounts > 1 ? 's' : ''}`} connected
        </Text>
      </Box>
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
  avatar: cssObj({
    height: 32,
    width: 32,
  }),
  text: cssObj({
    '.fuel_Text:first-of-type': {
      width: 160,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textSize: 'sm',
      fontWeight: '$normal',
      color: '$intentsBase12',
    },
    '.fuel_Text:last-of-type': {
      textSize: 'xs',
      fontWeight: '$normal',
      color: '$intentsBase8',
    },
  }),
};
