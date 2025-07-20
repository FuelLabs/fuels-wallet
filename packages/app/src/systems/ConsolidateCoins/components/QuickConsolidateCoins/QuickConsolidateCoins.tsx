import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Icon, IconButton, Text, VStack } from '@fuel-ui/react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '~/systems/Account/hooks/useCurrentAccount';
import { Pages } from '~/systems/Core';
import { useConsolidateCoinsSelector } from '../../hooks/useConsolidateCoinsSelector';
import type { ConsolidateCoinsMachineState } from '../../machines/consolidateCoinsMachine';

const selectors = {
  shouldConsolidate(state: ConsolidateCoinsMachineState) {
    return state.context.shouldConsolidate;
  },
  loading(state: ConsolidateCoinsMachineState) {
    return state.hasTag('loading');
  },
};

export const QuickConsolidateCoins = () => {
  const navigate = useNavigate();
  const { account } = useCurrentAccount();
  const shouldConsolidate = useConsolidateCoinsSelector(
    selectors.shouldConsolidate
  );
  const loading = useConsolidateCoinsSelector(selectors.loading);
  const [dismissed, setDismissed] = useState(false);

  const isVisible = useMemo<boolean>(() => {
    return shouldConsolidate && !loading && !dismissed;
  }, [shouldConsolidate, loading, dismissed]);

  const onConsolidate = () => {
    navigate(Pages.consolidateCoins());
  };

  const onDismiss = () => {
    setDismissed(true);
  };

  return (
    <Box css={styles.wrapper} data-open={isVisible}>
      <Alert status="warning" css={styles.alert}>
        <Alert.Description as="div">
          <Icon icon="Coins" size={20} css={styles.icon} />

          <VStack gap="$1">
            <span>
              {account?.name || 'This account'} has many small coin UTXOs that
              can be consolidated
            </span>

            <Text color="accent11" css={styles.cta} onClick={onConsolidate}>
              Consolidate coins
            </Text>
          </VStack>

          <IconButton
            icon={Icon.is('X')}
            aria-label="Close"
            variant="link"
            onPress={onDismiss}
          />
        </Alert.Description>
      </Alert>
    </Box>
  );
};

const styles = {
  wrapper: cssObj({
    position: 'fixed',
    paddingLeft: '$4',
    paddingRight: '15px',
    paddingBottom: '$4',
    bottom: 0,
    zIndex: '$10',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
    pointerEvents: 'none',

    '&[data-open="true"]': {
      opacity: 1,
      pointerEvents: 'auto',
    },
  }),
  alert: cssObj({
    '& .fuel_Alert-icon': {
      display: 'none',
    },
    '& .fuel_Alert-description': {
      display: 'flex',
      gap: '$2',
      alignItems: 'flex-start',
    },
  }),
  icon: cssObj({
    flexShrink: 0,
    color: '$accent11',
  }),
  cta: cssObj({
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  }),
};
