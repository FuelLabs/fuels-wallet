import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Icon } from '@fuel-ui/react';

export function MaintenanceBanner() {
  return (
    <Alert status="warning" css={styles.root} direction="row">
      <Alert.Description css={styles.description}>
        <Box css={styles.content}>
          <Icon icon="AlertTriangle" size={16} />
          The network is undergoing a scheduled migration today starting 17:30
          UTC. We expect to be back up shortly.
        </Box>
      </Alert.Description>
    </Alert>
  );
}

const styles = {
  root: cssObj({
    borderRadius: '0',
    py: '$1',
    px: '$1',
    background: '$intentsWarning3',
    '&:after': {
      display: 'none',
    },
    '.fuel_Alert-icon': {
      display: 'none',
    },
  }),
  description: cssObj({
    width: '100%',
    textAlign: 'center',
    fontSize: '$xs',
    color: '$intentsWarning11',
  }),
  content: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '$2',
  }),
};
