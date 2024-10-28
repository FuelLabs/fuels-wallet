import { cssObj } from '@fuel-ui/css';
import { Button, Card, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { animations } from '~/systems/Core';

const MotionCard = motion(Card);

export type NetworkReviewCardProps = {
  headerText: string;
  name: string;
  onChangeUrl?: () => void;
  chainId?: number | string;
  url: string;
};

export function NetworkReviewCard({
  headerText,
  name,
  onChangeUrl,
  chainId,
  url,
}: NetworkReviewCardProps) {
  return (
    <MotionCard {...animations.slideInTop()}>
      <Card.Header space="compact" css={styles.header}>
        <Text>{headerText}</Text>
        {onChangeUrl && (
          <Button size="xs" variant="outlined" onPress={onChangeUrl}>
            Change
          </Button>
        )}
      </Card.Header>
      <Card.Body css={styles.cardContentSection}>
        <Text as="h2">{name}</Text>
        <Text fontSize="sm" css={styles.url}>
          {url}
        </Text>
        {chainId && (
          <Text fontSize="sm" css={styles.url}>
            Chain ID: {chainId}
          </Text>
        )}
      </Card.Body>
    </MotionCard>
  );
}

const styles = {
  header: cssObj({
    display: 'flex',
    justifyContent: 'space-between',

    '.fuel_Button': {
      py: '$1',
      height: '$6',
    },
  }),
  url: cssObj({
    wordWrap: 'break-word',
  }),
  cardContentSection: cssObj({
    py: '$2',
  }),
};
