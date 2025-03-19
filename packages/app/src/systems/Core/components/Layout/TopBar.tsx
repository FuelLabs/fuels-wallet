import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo, Icon, IconButton, Spinner, Text } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * Because of some cycle-dependency error here, is not
 * possible to just import by using ~/systems/Network
 */
import { NetworkDropdown, NetworkStatus } from '~/systems/Network/components';
import { useNetworks } from '~/systems/Network/hooks';
import { useOverlay } from '~/systems/Overlay';

import { useReportError } from '~/systems/Error';
import { useLayoutContext } from './Layout';

type TopBarProps = {
  onBack?: () => void;
  hideMenu?: boolean;
  hideBackArrow?: boolean;
};

// ----------------------------------------------------------------------------
// Main component
// ----------------------------------------------------------------------------

export function TopBar({ onBack, hideMenu, hideBackArrow }: TopBarProps) {
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
            {!hideBackArrow && (
              <IconButton
                icon={<Icon icon="ArrowLeft" color="intentsBase8" />}
                aria-label="Back"
                variant="link"
                css={styles.backIcon}
                onPress={() => (onBack ? onBack() : navigate(-1))}
              />
            )}
            {isLoading && <Spinner />}
            {!isLoading && <Text css={styles.title}>{title}</Text>}
          </>
        ) : (
          <>
            <FuelLogo size={36} />
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

      <Box.Stack direction="row" css={styles.menuContainer}>
        {selectedNetwork && !isHome && (
          <>
            <NetworkStatus network={selectedNetwork} size="$xs" />
            <Text css={styles.networkText}>{selectedNetwork?.name}</Text>
          </>
        )}
        {!hideMenu && (
          <>
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
          </>
        )}
      </Box.Stack>
    </Box.Flex>
  );
}

// ----------------------------------------------------------------------------
// Styles
// ----------------------------------------------------------------------------

const styles = {
  root: cssObj({
    px: '$4',
    gap: '$3',
    alignItems: 'center',
    minHeight: '50px',
    transition: 'none',
    backgroundColor: '$cardBg',
    borderBottom: '1px solid $gray6',
  }),
  menuContainer: cssObj({
    position: 'relative',
    gap: '$0',
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
    fontSize: '$sm',
    color: '$textHeading',
    fontWeight: '$semibold',
  }),
  networkText: cssObj({
    fontSize: '$sm',
    color: '$textHeading',
    ml: '$1',
    mr: '$3',
  }),
  container: cssObj({
    position: 'relative',
    pl: '$6',
    gap: '$3',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',

    '&[data-home="true"]': {
      pl: '$0',
    },
  }),
  leftSection: cssObj({
    alignItems: 'center',
    gap: '$2',
  }),
  rightSection: cssObj({
    alignItems: 'center',
    gap: '$2',
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
  network: cssObj({
    fontSize: '13px',
    color: '$intentsBase11',
  }),
  menuIcon: cssObj({
    px: '$0 !important',
    color: '$intentsBase8 !important',
  }),
};
