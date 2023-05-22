import { cssObj } from '@fuel-ui/css';
import { Text, Avatar, Card, Box } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';

import { ConnectInfoLoader } from './ConnectInfoLoader';

import { parseUrl, truncate } from '~/systems/Core';

export type ConnectInfoProps = {
  origin: string;
  title?: string;
  headerText: string;
  favIconUrl?: string;
  account?: Account;
};

export function ConnectInfo({
  origin,
  title,
  headerText,
  favIconUrl,
}: ConnectInfoProps) {
  return (
    <Card css={styles.root} gap="$0">
      <Card.Header css={styles.header}>
        <Text fontSize="sm" css={styles.headerText}>
          {headerText}
        </Text>
      </Card.Header>

      <Card.Body css={styles.contentSection}>
        <Box.Flex>
          <Avatar
            name={title || origin}
            src={favIconUrl}
            role="img"
            size="md"
            aria-label={`${origin}-favicon`}
          />
        </Box.Flex>
        <Box.Stack gap="$0">
          <Text css={styles.title}>{title}</Text>
          <Text css={styles.link}> {truncate(parseUrl(origin))} </Text>
        </Box.Stack>
      </Card.Body>
    </Card>
  );
}

ConnectInfo.Loader = ConnectInfoLoader;

const styles = {
  root: cssObj({
    boxSizing: 'border-box',
  }),
  header: cssObj({
    px: '$3',
    py: '$2',
    display: 'flex',
  }),
  contentSection: cssObj({
    padding: '$3',
    alignItems: 'center',
    display: 'flex',
    gap: '$3',
  }),
  headerText: cssObj({
    color: '$intentsBase12',
    fontWeight: '$bold',
  }),
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$extrabold',
    color: '$intentsBase12',
    textOverflow: 'ellipsis',
  }),
  link: cssObj({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: '$sm',
    color: '$accent11',
    fontWeight: '$bold',
  }),
};
