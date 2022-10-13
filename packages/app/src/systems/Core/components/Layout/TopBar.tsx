import { css } from '@fuel-ui/css';
import {
  FuelLogo,
  Flex,
  Icon,
  IconButton,
  Spinner,
  Text,
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
  const { isLoading, title, isHome } = useLayoutContext();
  const { networks, selectedNetwork, handlers } = useNetworks({
    type: NetworkScreen.list,
  });

  return (
    <Flex as="nav" className={style({ isHome })}>
      <Flex css={{ alignItems: 'center', gap: '$5', flex: 1 }}>
        {!isHome ? (
          <>
            <IconButton
              icon={<Icon icon="CaretLeft" color="gray8" />}
              aria-label="Back"
              variant="link"
              css={{ px: '0 !important' }}
              onPress={() => (onBack ? onBack() : navigate(-1))}
            />
            {isLoading && <Spinner />}
            {!isLoading && (
              <Text css={{ fontWeight: '$semibold', color: '$gray12' }}>
                {title}
              </Text>
            )}
          </>
        ) : (
          <>
            <FuelLogo size={36} />
            {isLoading && <Spinner aria-label="Spinner" />}
            {networks && !isLoading && (
              <NetworkDropdown
                selected={selectedNetwork}
                onPress={handlers.goToList}
              />
            )}
          </>
        )}
      </Flex>
      <IconButton
        icon={<Icon icon="List" color="gray8" size={24} />}
        aria-label="Open menu"
        variant="link"
        css={{ px: '0 !important' }}
      />
    </Flex>
  );
}

// ----------------------------------------------------------------------------
// TopBar used outside Application
// ----------------------------------------------------------------------------

function ExternalTopBar() {
  const { isLoading, title } = useLayoutContext();
  const { networks, selectedNetwork, handlers } = useNetworks({
    type: NetworkScreen.list,
  });

  return (
    <Flex as="nav" className={style()}>
      <Flex css={{ alignItems: 'center', gap: '$5', flex: 1, pl: '$2' }}>
        {isLoading && <Spinner aria-label="Spinner" />}
        {!isLoading && (
          <Text css={{ fontWeight: '$semibold', color: '$gray12' }}>
            {title}
          </Text>
        )}
      </Flex>
      {networks && (
        <NetworkDropdown
          selected={selectedNetwork}
          onPress={handlers.goToList}
        />
      )}
    </Flex>
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

const style = css({
  alignItems: 'center',
  py: '$2',
  px: '$4',
  gap: '$3',
  minHeight: '50px',
  borderTopLeftRadius: '$md',
  borderTopRightRadius: '$md',
  boxShadow: '$sm',
  background:
    'linear-gradient(268.61deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.02) 87.23%)',

  variants: {
    isHome: {
      true: {
        boxShadow: '$none',
        background: 'transparent',
      },
    },
  },

  defaultVariants: {
    isHome: false,
  },
});
