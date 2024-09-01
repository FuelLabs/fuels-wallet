import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo, Icon, IconButton, Spinner, Text } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * Because of some cycle-dependency error here, is not
 * possible to just import by using ~/systems/Network
 */
import { NetworkDropdown } from '~/systems/Network/components';
import { useNetworks } from '~/systems/Network/hooks';
import { useOverlay } from '~/systems/Overlay';

import { useReportError } from '~/systems/Error';
import { useLayoutContext } from './Layout';

export enum TopBarType {
  internal = 0,
  external = 1,
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
  const { hasErrorsToReport } = useReportError();

  return (
    <Box.Flex as="nav" css={styles.root}>
      <Box.Flex css={styles.container} data-home={isHome}>
        {!isHome ? (
          <>
            <IconButton
              icon={<Icon icon="ChevronLeft" color="intentsBase8" />}
              aria-label="Back"
              variant="link"
              css={styles.backIcon}
              onPress={() => (onBack ? onBack() : navigate(-1))}
            />
            {isLoading && <Spinner />}
            {!isLoading && <Text css={styles.title}>{title}</Text>}
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
      <Box.Stack direction="row" gap="$2" css={styles.menuContainer}>
        {hasErrorsToReport && <Text css={styles.badge}>●</Text>}
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
      <Box.Flex css={{ alignItems: 'center', gap: '$5', flex: 1 }}>
        {isLoading && <Spinner aria-label="Spinner" />}
        {!isLoading && <Text css={styles.title}>{title}</Text>}
      </Box.Flex>
      {selectedNetwork && (
        <NetworkDropdown
          selected={selectedNetwork}
          onPress={handlers.openNetworks}
          isDisabled
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
    px: '$5',
    gap: '$3',
    alignItems: 'center',
    minHeight: '50px',
    transition: 'none',
  }),
  menuContainer: cssObj({
    position: 'relative',
  }),
  badge: cssObj({
    position: 'absolute',
    top: -6,
    right: -2,
    fontSize: 8,
    color: '$intentsError10 !important',
    transform: 'translate(25%, -25%)',
  }),
  topbarIcon: cssObj({
    px: '$0 !important',
    color: '$intentsBase8 !important',
    transition: 'color 0.2s ease-in-out',

    '&:hover': {
      color: '$intentsBase11 !important',
    },
  }),
  title: cssObj({
    textSize: 'lg',
    fontWeight: '$normal',
    color: '$intentsBase12',
  }),
  container: cssObj({
    position: 'relative',
    pl: '$6',
    gap: '$3',
    alignItems: 'center',
    flex: 1,

    '&[data-home="true"]': {
      pl: '$0',
    },
  }),
  backIcon: cssObj({
    position: 'absolute',
    top: '50%',
    left: '$0',
    px: '$2 !important',
    width: '$4 !important',
    transform: 'translateY(-50%)',

    '&:not([aria-disabled=true]):active, &:not([aria-disabled=true])[aria-pressed=true]':
      {
        transform: 'scale(0.97) translateY(-50%)',
      },
  }),
};
