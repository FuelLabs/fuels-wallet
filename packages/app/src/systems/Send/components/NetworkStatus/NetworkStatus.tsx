import { cssObj } from '@fuel-ui/css';
import { HStack, Text, VStack } from '@fuel-ui/react';
import { MotionStack, animations } from '~/systems/Core';

type NetworkStatusProps = {
  isVisible?: boolean;
};

export const NetworkStatus = ({ isVisible = false }: NetworkStatusProps) => {
  return (
    <MotionStack
      {...animations.slideInRight()}
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <Text css={styles.title}>Network Status</Text>
      <HStack gap="$3">
        <VStack gap="$1">
          <Text>Base fee</Text>
          <Text fontSize="sm">0.01</Text>
        </VStack>
        <VStack gap="$1">
          <Text>Condition</Text>
          <Text fontSize="sm">Not Busy</Text>
        </VStack>
      </HStack>
    </MotionStack>
  );
};

const styles = {
  title: cssObj({
    pt: '$2',
    color: '$intentsBase12',
    fontSize: '$md',
    fontWeight: '$normal',
  }),
};
