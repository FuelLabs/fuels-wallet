import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import type { NetworkData } from '@fuel-wallet/types';
import { forwardRef } from 'react';

import { NetworkStatus } from '../NetworkItem';

export type NetworkDropdownProps = {
  selected?: NetworkData;
  isDisabled?: boolean;
  onPress?: (network: NetworkData) => void;
};

export const NetworkDropdown = forwardRef<HTMLDivElement, NetworkDropdownProps>(
  ({ selected, isDisabled, ...props }, ref) => {
    return (
      <Button
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        {...(props as any)}
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        ref={ref as any}
        size="xs"
        css={styles.trigger}
        aria-label="Selected Network"
        isDisabled={isDisabled}
        rightIcon={isDisabled ? null : 'ChevronDown'}
      >
        {selected && <NetworkStatus network={selected} />}
        {selected?.name}
      </Button>
    );
  }
);

const styles = {
  trigger: cssObj({
    cursor: 'pointer',
    fontSize: '$sm',
    px: '$3',
    pr: '$2',
    border: '1px solid $border',
    color: '$intentsBase10',
    borderRadius: '$default',
    background: 'transparent',
    display: 'inline-flex',
    alignItems: 'center',

    '&:not([aria-disabled="true"])': {
      '&:hover': {
        bg: '$inverseA3',
        boxShadow: 'none',
        border: '1px solid $border',
        color: '$intentsBase11',
      },

      '&:hover .fuel_Icon,& .fuel_Icon': {
        color: 'currentColor',
      },
    },

    '&:focus': {
      outlineColor: '$intentsBase2 !important',
    },

    '&[aria-disabled="true"]': {
      opacity: 1,
      cursor: 'default',
    },
  }),
};
