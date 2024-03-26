import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Card, Text } from '@fuel-ui/react';

import { parseUrl, truncateByWordsNum } from '../../utils';

import { ConnectInfoLoader } from './ConnectInfoLoader';

export type ConnectInfoProps = {
  origin: string;
  title?: string;
  headerText: string;
  favIconUrl?: string;
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
        <Avatar
          name={truncateByWordsNum(title || origin, 2)}
          src={favIconUrl}
          role="img"
          size="sm"
          aria-label={`${origin}-favicon`}
          css={styles.avatar}
        />
        <Box.Stack gap="$2" css={styles.stack}>
          <Text css={styles.title}>{title}</Text>
          <Text css={styles.link}>{parseUrl(origin)}</Text>
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
    gap: '$3',
    py: '$4',
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
};
