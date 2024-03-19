import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Card, Text } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';

import { parseUrl, truncate } from '../../utils';

import { ConnectInfoLoader } from './ConnectInfoLoader';

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
    <Card css={styles.root}>
      {Boolean(headerText?.length) && (
        <Card.Header space="compact">{headerText}</Card.Header>
      )}

      <Card.Body css={styles.contentSection}>
        <Box.Flex>
          <Avatar
            name={title || origin}
            src={favIconUrl}
            role="img"
            size="sm"
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
    gap: '$0',
  }),
  contentSection: cssObj({
    alignItems: 'center',
    display: 'flex',
    gap: '$4',
    py: '$2',
  }),
  title: cssObj({
    fontSize: '$sm',
    color: '$intentsBase12',
    textOverflow: 'ellipsis',
  }),
  link: cssObj({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: '$sm',
    color: '$intentsPrimary11',
    fontWeight: '$normal',
  }),
};
