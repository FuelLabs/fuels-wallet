import { cssObj } from '@fuel-ui/css';
import { Box, Button } from '@fuel-ui/react';
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
        size="sm"
        css={styles.trigger}
        aria-label="Selected Network"
        isDisabled={isDisabled}
        rightIcon={isDisabled ? null : 'ChevronDown'}
      >
        <Box.Flex direction="row" align="center" gap="$2">
          {selected && <NetworkStatus network={selected} />}
          {selected?.name}
        </Box.Flex>
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
    color: '$textHeading',
    borderRadius: '$default',
    background: 'transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',

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
      backgroundColor: 'transparent',
      borderColor: '$border',
      color: '$intentsBase10',
    },
  }),
};
