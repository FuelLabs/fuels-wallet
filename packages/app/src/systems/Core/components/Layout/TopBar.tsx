import { cssObj } from '@fuel-ui/css';
import { FuelLogo, Icon, IconButton, Spinner, Text, Box } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLayoutContext } from './Layout';

/**
 * Because of some cycle-dependency error here, is not
 * possible to just import by using ~/systems/Network
 */
import { NetworkDropdown } from '~/systems/Network/components';
import { useNetworks } from '~/systems/Network/hooks';
import { useOverlay } from '~/systems/Overlay';

export enum TopBarType {
  internal,
  external,
}

type TopBarProps = {
  type?: TopBarType;
  onBack?: () => void;
  children?: ReactNode;
};

// ----------------------------------------------------------------------------
// TopBar used inside Application
// ----------------------------------------------------------------------------

function InternalTopBar({ onBack }: TopBarProps) {
  const navigate = useNavigate();
  const overlay = useOverlay();
  const { isLoading, title, isHome } = useLayoutContext();
  const { selectedNetwork, handlers } = useNetworks();

  const goToActivityPage = () => {
    navigate('/transactions');
  };

  return (
    <Box.Flex as="nav" css={styles.root}>
      <Box.Flex css={{ gap: '$3', alignItems: 'center', flex: 1 }}>
        {!isHome ? (
          <>
            <IconButton
              icon={<Icon icon="ChevronLeft" color="intentsBase8" />}
              aria-label="Back"
              variant="link"
              css={{ px: '0 !important' }}
              onPress={() => (onBack ? onBack() : navigate(-1))}
            />
            {isLoading && <Spinner />}
            {!isLoading && (
              <Text css={{ fontWeight: '$semibold', color: '$intentsBase12' }}>
                {title}
              </Text>
            )}
          </>
        ) : (
          <>
            <FuelLogo size={30} />
            {isLoading && <Spinner aria-label="Spinner" />}
            {selectedNetwork && !isLoading && (
              <NetworkDropdown
                selected={selectedNetwork}
                onPress={handlers.openNetworks}
              />
            )}
          </>
        )}
      </Box.Flex>
      <Box.Stack direction="row" gap="$2">
        <IconButton
          iconSize={20}
          icon={<Icon icon="Bell" />}
          variant="link"
          aria-label="activity"
          css={styles.topbarIcon}
          onPress={goToActivityPage}
        />
        <IconButton
          iconSize={20}
          icon={<Icon icon="Menu2" />}
          aria-label="Menu"
          variant="link"
          css={styles.topbarIcon}
          onPress={() => {
            overlay.open({ modal: 'sidebar' });
          }}
        />
      </Box.Stack>
    </Box.Flex>
  );
}

// ----------------------------------------------------------------------------
// TopBar used outside Application
// ----------------------------------------------------------------------------

function ExternalTopBar() {
  const { isLoading, title, isHome } = useLayoutContext();
  const { selectedNetwork, handlers } = useNetworks();

  return (
    <Box.Flex as="nav" css={styles.root} data-home={isHome}>
      <Box.Flex css={{ alignItems: 'center', gap: '$5', flex: 1, pl: '$2' }}>
        {isLoading && <Spinner aria-label="Spinner" />}
        {!isLoading && (
          <Text css={{ fontWeight: '$semibold', color: '$intentsBase12' }}>
            {title}
          </Text>
        )}
      </Box.Flex>
      {selectedNetwork && (
        <NetworkDropdown
          selected={selectedNetwork}
          onPress={handlers.openNetworks}
          isDisabled={true}
        />
      )}
    </Box.Flex>
  );
}

// ----------------------------------------------------------------------------
// Main component
// ----------------------------------------------------------------------------

export function TopBar({ type = TopBarType.internal, ...props }: TopBarProps) {
  return type === TopBarType.external ? (
    <ExternalTopBar />
  ) : (
    <InternalTopBar {...props} />
  );
}

// ----------------------------------------------------------------------------
// Styles
// ----------------------------------------------------------------------------

const styles = {
  root: cssObj({
    py: '$2',
    px: '$4',
    gap: '$3',
    alignItems: 'center',
    minHeight: '50px',
    transition: 'none',
  }),
  topbarIcon: cssObj({
    px: '0 !important',
    color: '$intentsBase8 !important',
    transition: 'color 0.2s ease-in-out',

    '&:hover': {
      color: '$intentsBase11 !important',
    },
  }),
};
