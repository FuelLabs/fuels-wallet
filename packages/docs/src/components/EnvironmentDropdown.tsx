'use client';
import { cssObj } from '@fuel-ui/css';
import { Button, Dropdown } from '@fuel-ui/react';
import { useEffect, useState } from 'react';
import {
  WALLET_LINK_NEXT,
  WALLET_LINK_PROD,
  WALLET_LINK_STAGING,
} from '~/src/constants';
import { Environment, useCurrentEnv } from '../hooks/useCurrentEnv';

type DisplayedEnvs = Exclude<
  Environment,
  Environment.DEV | Environment.PREVIEW
>;
const displayedEnvironments: Array<DisplayedEnvs> = [
  Environment.PROD,
  Environment.NEXT,
  Environment.STAGING,
];

export function EnvironmentDropdown() {
  const environment = useCurrentEnv();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getPlainNameForEnv(env: Environment) {
    switch (env) {
      case Environment.DEV:
        return 'Development';
      case Environment.STAGING:
        return 'Staging';
      case Environment.NEXT:
        return 'Next';
      case Environment.PREVIEW:
        return 'Preview';
      case Environment.PROD:
        return 'Production';
      default:
        return 'Unknown';
    }
  }

  const currentEnvironmentName = getPlainNameForEnv(environment);

  const onSelect = (e: DisplayedEnvs) => {
    switch (e) {
      case Environment.STAGING:
        window.location.href = WALLET_LINK_STAGING;
        break;
      case Environment.NEXT:
        window.location.href = WALLET_LINK_NEXT;
        break;
      default:
        window.location.href = WALLET_LINK_PROD;
    }
  };

  return (
    <Dropdown
      // css={styles.dropdown}
      popoverProps={{
        alignOffset: -20,
        align: 'end',
      }}
    >
      <Dropdown.Trigger asChild>
        <Button
          size="xs"
          aria-label="Selected Network"
          rightIcon={'ChevronDown'}
          css={styles.button}
          variant="outlined"
        >
          {isClient ? currentEnvironmentName : ''}
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Menu
        onAction={(e) => {
          onSelect(e as DisplayedEnvs);
        }}
      >
        {displayedEnvironments.map((env) => (
          <Dropdown.MenuItem
            key={env}
            textValue={getPlainNameForEnv(env)}
            aria-label={`fuel_environment-dropdown-item-${env}`}
          >
            {getPlainNameForEnv(env)}
          </Dropdown.MenuItem>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

const styles = {
  button: cssObj({
    marginLeft: '$3',
  }),
};
