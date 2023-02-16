import { cssObj } from '@fuel-ui/css';
import { Stack, Text, Flex, Avatar, Card, Icon } from '@fuel-ui/react';

import { parseUrl } from '../../utils';

const getFaviconUrl = (origin: string) =>
  `https://s2.googleusercontent.com/s2/favicons?domain=${origin}&sz=64`;

export type OriginDetailProps = {
  origin: string;
  title: string;
  headerText: string;
  faviconUrl?: string;
};

export function OriginDetails({
  origin,
  title,
  headerText,
  faviconUrl,
}: OriginDetailProps) {
  return (
    <Card css={styles.root} align="center" gap="$0">
      <Card.Header css={styles.header}>
        <Text fontSize="base" css={styles.headerText}>
          {headerText}
        </Text>
        <Icon icon="CaretDown" color="gray7" />
      </Card.Header>

      <Card.Body css={styles.contentSection}>
        <Flex>
          <Avatar
            name={title}
            src={faviconUrl || getFaviconUrl(origin)}
            role="img"
            size="md"
            aria-label={`${origin}-favicon`}
          />
        </Flex>
        <Stack gap="$0">
          <Text css={styles.title}>{title}</Text>
          <Text css={styles.link}> {parseUrl(origin)} </Text>
        </Stack>
      </Card.Body>
    </Card>
  );
}

const styles = {
  root: cssObj({
    boxSizing: 'border-box',
    px: '$3',
    color: '$gray11',
    fontSize: '$lg',
  }),
  header: cssObj({
    padding: '$3',
    borderBottom: '4px solid $gray2',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  }),
  contentSection: cssObj({
    width: '100%',
    padding: '$3',
    alignItems: 'center',
    display: 'flex',
    gap: '$3',
  }),
  headerText: cssObj({
    color: '$gray12',
    fontWeight: '$extrabold',
  }),
  title: cssObj({
    fontSize: '$base',
    fontWeight: '$extrabold',
    color: '$gray12',
  }),
  link: cssObj({
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: '$sm',
    color: '$accent11',
    fontWeight: '$bold',
  }),
};
