import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Box,
  CardList,
  Flex,
  Icon,
  IconButton,
  Text,
} from '@fuel-ui/react';
import type { Connection } from '@fuel-wallet/types';
import { motion } from 'framer-motion';
import type { FC } from 'react';

import { ConnectionRemoveDialog } from '../ConnectionRemoveDialog';

import { ConnectionItemLoader } from './ConnectionItemLoader';

import { animations } from '~/systems/Core';

function getFaviconUrl(url: string, size = 32) {
  return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${url}&size=${size}`;
}

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

  function handleConfirm() {
    onDelete(connection.origin);
  }

  return (
    <MotionCardItem
      {...animations.slideInTop()}
      rightEl={
        <Flex css={styles.root}>
          <IconButton
            icon={<Icon icon={Icon.is('NotePencil')} color="gray8" />}
            size="xs"
            variant="link"
            color="gray"
            aria-label="Edit"
            onPress={() => onEdit(origin)}
          />
          <ConnectionRemoveDialog
            isConfirming={Boolean(isDeleting)}
            connection={connection}
            onConfirm={handleConfirm}
          >
            <IconButton
              icon={<Icon icon={Icon.is('Trash')} color="gray8" />}
              size="xs"
              variant="link"
              color="gray"
              aria-label="Delete"
            />
          </ConnectionRemoveDialog>
        </Flex>
      }
    >
      <Avatar name={origin} src={getFaviconUrl(origin)} css={styles.avatar} />
      <Box css={styles.text}>
        <Text>{origin}</Text>
        <Text>{accounts} account(s) connected</Text>
      </Box>
    </MotionCardItem>
  );
};

ConnectionItem.Loader = ConnectionItemLoader;

const styles = {
  root: cssObj({
    alignItems: 'center',

    /**
     * TODO: change on fuel-ui to .fuel-icon-button instead
     */
    '.fuel_icon-buton': {
      padding: '$1 !important',
      height: 'auto',
    },
  }),
  avatar: cssObj({
    height: 32,
    width: 32,
  }),
  text: cssObj({
    '.fuel_text:first-of-type': {
      width: 160,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textSize: 'sm',
      fontWeight: '$medium',
      color: '$gray12',
    },
    '.fuel_text:last-of-type': {
      textSize: 'xs',
      fontWeight: '$medium',
      color: '$gray8',
    },
  }),
};
