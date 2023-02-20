import { cssObj } from '@fuel-ui/css';
import { Stack, Text, Flex, Avatar, Card } from '@fuel-ui/react';

import { parseUrl } from '../../utils';

export type OriginDetailProps = {
  origin: string;
  title: string;
  headerText: string;
  favIconUrl?: string;
};

export function OriginDetails({
  origin,
  title,
  headerText,
  favIconUrl,
}: OriginDetailProps) {
  return (
    <Card css={styles.root} align="center" gap="$0">
      <Card.Header css={styles.header}>
        <Text fontSize="base" css={styles.headerText}>
          {headerText}
        </Text>
      </Card.Header>

      <Card.Body css={styles.contentSection}>
        <Flex>
          <Avatar
            name={title}
            src={favIconUrl}
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
    fontWeight: '$semibold',
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
