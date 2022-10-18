import { css } from '@fuel-ui/css';
import {
  FuelLogo,
  Flex,
  Icon,
  IconButton,
  Spinner,
  Text,
  Drawer,
} from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLayoutContext } from './Layout';

/**
 * Because of some cycle-dependency error here, is not
 * possible to just import by using ~/systems/Network
 */
import { NetworkDropdown } from '~/systems/Network/components/NetworkDropdown';
import { useNetworks } from '~/systems/Network/hooks';
import { NetworkScreen } from '~/systems/Network/machines';
import { Sidebar } from '~/systems/Sidebar';

type TopBarProps = {
  onBack?: () => void;
  children?: ReactNode;
  showBack?: boolean;
  showMenu?: boolean;
};

export function TopBar({
  onBack,
  showBack: showBackProp,
  showMenu: showMenuProp,
}: TopBarProps) {
  const navigate = useNavigate();
  const { isLoading, title, isHome, ref, isSinglePage } = useLayoutContext();
  const isInternal = !isHome;

  const { networks, selectedNetwork, handlers } = useNetworks({
    type: NetworkScreen.list,
  });

  const showBack =
    showBackProp != null ? showBackProp : !isHome && !isSinglePage;
  const showMenu = showMenuProp != null ? showMenuProp : isHome;

  return (
    <Flex as="nav" className={style({ isInternal, isSinglePage })}>
      <Flex css={{ alignItems: 'center', gap: '$5', flex: 1 }}>
        {showBack && (
          <IconButton
            icon={<Icon icon="CaretLeft" color="gray8" />}
            aria-label="Back"
            variant="link"
            css={{ px: '0 !important' }}
            onPress={() => (onBack ? onBack() : navigate(-1))}
          />
        )}
        {isHome ? (
          <>
            <FuelLogo size={36} />
            {networks && (
              <NetworkDropdown
                selected={selectedNetwork}
                onPress={handlers.goToList}
              />
            )}
          </>
        ) : (
          <Text css={{ fontWeight: '$semibold', color: '$gray12' }}>
            {title}
          </Text>
        )}
        {isLoading && <Spinner aria-label="Spinner" />}
      </Flex>
      {isSinglePage && networks && (
        <NetworkDropdown
          selected={selectedNetwork}
          onPress={handlers.goToList}
        />
      )}
      {/* <IconButton
        icon={<Icon icon="Bell" color="gray8" size={24} />}
        aria-label="Activities"
        variant="link"
        css={{ px: '0 !important' }}
      /> */}
      {showMenu && (
        <Drawer type="menu" size={220} containerRef={ref}>
          <Drawer.Trigger aria-label="drawer_trigger">
            <IconButton
              icon={<Icon icon="List" color="gray8" size={24} />}
              aria-label="Menu"
              variant="link"
              css={{ px: '0 !important' }}
            />
          </Drawer.Trigger>
          <Drawer.Content>
            <Sidebar />
          </Drawer.Content>
        </Drawer>
      )}
    </Flex>
  );
}

const style = css({
  alignItems: 'center',
  py: '$2',
  px: '$4',
  gap: '$3',
  minHeight: '50px',
  borderTopLeftRadius: '$md',
  borderTopRightRadius: '$md',
  background: 'transparent',

  variants: {
    isInternal: {
      true: {
        boxShadow: '$sm',
        background:
          'linear-gradient(268.61deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.02) 87.23%)',
      },
    },
    isSinglePage: {
      true: {
        boxShadow: '$sm',
        filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))',
        background:
          'linear-gradient(268.61deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.01) 87.23%)',
      },
    },
  },

  defaultVariants: {
    isInternal: false,
  },
});
