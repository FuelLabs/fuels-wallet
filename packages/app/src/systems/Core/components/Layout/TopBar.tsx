import { css } from '@fuel-ui/css';
import { FuelLogo, Flex, Icon, IconButton, Spinner, Text } from '@fuel-ui/react';
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

type TopBarProps = {
  onBack?: () => void;
  children?: ReactNode;
};

export function TopBar({ onBack }: TopBarProps) {
  const { isLoading, title, isHome } = useLayoutContext();
  const { networks, selectedNetwork, handlers } = useNetworks({
    type: NetworkScreen.list,
  });
  const navigate = useNavigate();
  const isInternal = !isHome;

  return (
    <Flex as="nav" className={style({ isInternal })}>
      <Flex css={{ alignItems: 'center', gap: '$5', flex: 1 }}>
        {isInternal ? (
          <>
            <IconButton
              icon={<Icon icon="CaretLeft" color="gray8" />}
              aria-label="Back"
              variant="link"
              css={{ px: '0 !important' }}
              onPress={() => (onBack ? onBack() : navigate(-1))}
            />
            <Text css={{ fontWeight: '$semibold', color: '$gray12' }}>{title}</Text>
            {isLoading && <Spinner />}
          </>
        ) : (
          <>
            <FuelLogo size={36} />
            {isLoading && <Spinner aria-label="Spinner" />}
            {networks && <NetworkDropdown selected={selectedNetwork} onPress={handlers.goToList} />}
          </>
        )}
      </Flex>
      <IconButton
        icon={<Icon icon="Bell" color="gray8" size={24} />}
        aria-label="Activities"
        variant="link"
        css={{ px: '0 !important' }}
      />
      <IconButton
        icon={<Icon icon="List" color="gray8" size={24} />}
        aria-label="Open menu"
        variant="link"
        css={{ px: '0 !important' }}
      />
    </Flex>
  );
}

const style = css({
  alignItems: 'center',
  py: '$2',
  px: '$4',
  gap: '$3',
  height: '50px',
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
  },

  defaultVariants: {
    isInternal: false,
  },
});
