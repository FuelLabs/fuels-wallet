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
import { NetworkButton } from './NetworkButton';
import { SideBar } from './SideBar';

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
            {!isLoading && <NetworkButton />}
          </>
        )}
      </Flex>
      {isHome && <SideBar />}
    </Flex>
  );
}

// ----------------------------------------------------------------------------
// TopBar used outside Application
// ----------------------------------------------------------------------------

function ExternalTopBar() {
  const { isLoading, title } = useLayoutContext();

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
      {!isLoading && <NetworkButton />}
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
