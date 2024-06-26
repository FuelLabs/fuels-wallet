import { Dropdown, Icon, IconButton } from '@fuel-ui/react';
import { usePathname } from 'next/navigation';
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
  const currentPath = usePathname();
  const onSelect = (e: Environment) => {
    switch (e) {
      case Environment.STAGING:
        window.location.href = `${WALLET_LINK_STAGING}${currentPath}`;
        break;
      case Environment.NEXT:
        window.location.href = `${WALLET_LINK_NEXT}${currentPath}`;
        break;
      default:
        window.location.href = `${WALLET_LINK_PROD}${currentPath}`;
    }
  };

  return (
    <Dropdown
      popoverProps={{
        alignOffset: -20,
        align: 'end',
      }}
    >
      <Dropdown.Trigger asChild>
        <IconButton
          size="xs"
          variant="link"
          intent="warning"
          icon={<Icon icon="ChevronDown" />}
          aria-label="Change Environment"
        />
      </Dropdown.Trigger>
      <Dropdown.Menu
        css={{
          gap: '$4',
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
          >
            <HeaderFuelBranding title={environmentsTitles[env]} />
          </Dropdown.MenuItem>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
