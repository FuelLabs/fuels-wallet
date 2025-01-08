import { cssObj } from '@fuel-ui/css';
import { Box, Text } from '@fuel-ui/react';
import { useState } from 'react';
import { MotionStack, animations } from '~/systems/Core';

type NetworkStatusProps = {
  isVisible?: boolean;
};

type NetworkStatus = 'busy' | 'normal';

export const NetworkStatus = ({ isVisible = false }: NetworkStatusProps) => {
  const [status, _setStatus] = useState<NetworkStatus>('normal');
  return (
    <MotionStack
      {...animations.slideInRight()}
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <Box css={styles.bar}>
        <Text css={styles.title}>Status:</Text>
        <Box>
          <Box css={status === 'normal' ? styles.normal : styles.busy} />
        </Box>
      </Box>
    </MotionStack>
  );
};

const styles = {
  title: cssObj({
    pt: '$2',
    color: '$intentsBase12',
    lineHeight: '$none',
  }),
  busy: cssObj({
    width: '$3',
    height: '$3',
    backgroundColor: '$scalesRed9',
    borderRadius: '$full',
    alignItems: 'center',
  }),
  normal: cssObj({
    width: '$3',
    height: '$3',
    backgroundColor: '$scalesGreen9',
    borderRadius: '$full',
    alignItems: 'center',
  }),
  bar: cssObj({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '$2',
  }),
};
