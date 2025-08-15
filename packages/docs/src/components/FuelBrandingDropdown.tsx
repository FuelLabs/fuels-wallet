import { Button, Dropdown, Icon, IconButton } from '@fuel-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentEnv } from '~/src/hooks/useCurrentEnv';
import {
  Environment,
  WALLET_LINK_NEXT,
  WALLET_LINK_PROD,
  WALLET_LINK_STAGING,
} from '../constants';
import { HeaderFuelBranding } from './HeaderFuelBranding';

const environmentsTitles: Record<Environment, string> = {
  [Environment.PRODUCTION]: 'Fuel Wallet',
  [Environment.NEXT]: 'Fuel Wallet Next',
  [Environment.STAGING]: 'Fuel Wallet Development',
};

const environments: Array<Environment> = Object.values(Environment);

export function FuelBrandingDropdown() {
  const currentEnv = useCurrentEnv();
  const currentPath = usePathname();
  const _router = useRouter();

  const onSelect = (e: Environment) => {
    // Only redirect on the client side
    if (typeof window === 'undefined') return;

    let targetUrl: string;
    switch (e) {
      case Environment.STAGING:
        targetUrl = `${WALLET_LINK_STAGING}${currentPath}`;
        break;
      case Environment.NEXT:
        targetUrl = `${WALLET_LINK_NEXT}${currentPath}`;
        break;
      default:
        targetUrl = `${WALLET_LINK_PROD}${currentPath}`;
    }

    window.location.href = targetUrl;
  };

  return (
    <Dropdown
      popoverProps={{
        alignOffset: -10,
        align: 'start',
        sideOffset: -10,
      }}
    >
      <Dropdown.Trigger asChild>
        <Button
          variant="link"
          aria-label="Change Environment"
          css={{
            borderWidth: '0px',
            backgorundColor: 'transparent',
            alignItems: 'center',
            gap: '$2',
            flexDirection: 'row',
            color: 'transparent',
            border: 'none',
            '&:hover': {
              color: 'transparent !important',
              border: 'none !important',
            },
            '&:focus-visible': {
              outline: 'none',
            },
          }}
        >
          <HeaderFuelBranding title={environmentsTitles[currentEnv]} />
          <Icon icon="ChevronDown" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Menu
        css={{
          gap: '$2',
          display: 'flex',
          flexDirection: 'column',
        }}
        onAction={(e) => {
          onSelect(e as Environment);
        }}
      >
        {environments.map((env) => (
          <Dropdown.MenuItem
            key={env}
            textValue={environmentsTitles[env]}
            aria-label={`fuel_environment-dropdown-item-${env}`}
            css={{
              paddingTop: '$3',
              paddingBottom: '$3',
            }}
          >
            <HeaderFuelBranding title={environmentsTitles[env]} />
          </Dropdown.MenuItem>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
