import { cssObj } from '@fuel-ui/css';
import { Card, Text, Button } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { animations } from '~/systems/Core';

const MotionCard = motion(Card);

export type NetworkReviewCardProps = {
  headerText: string;
  name: string;
  onChangeUrl?: () => void;
  url: string;
};

export function NetworkReviewCard({
  headerText,
  name,
  onChangeUrl,
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
        <Text fontSize="sm">{url}</Text>
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
  cardContentSection: cssObj({
    py: '$2',
  }),
};
