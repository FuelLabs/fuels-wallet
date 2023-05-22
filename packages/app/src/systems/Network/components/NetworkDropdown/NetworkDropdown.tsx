import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import type { Network } from '@fuel-wallet/types';
import { forwardRef } from 'react';

export type NetworkDropdownProps = {
  selected?: Network;
  isDisabled?: boolean;
  onPress?: (network: Network) => void;
};

export const NetworkDropdown = forwardRef<HTMLDivElement, NetworkDropdownProps>(
  ({ selected, isDisabled, onPress }, ref) => {
    return (
      <Button
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        size="xs"
        css={styles.trigger}
        onPress={() => onPress?.(selected!)}
        aria-label="Selected Network"
        isDisabled={isDisabled}
      >
        {/* {selected && <NetworkStatus network={selected} />} */}
        {selected?.name}
      </Button>
    );
  }
);

const styles = {
  trigger: cssObj({
    cursor: 'pointer',
    fontSize: '$sm',
    px: '$4 !important',
    border: '1px solid $border',
    color: '$intentsBase10 !important',
    borderRadius: '$full !important',
    background: 'transparent',

    '&:not([aria-disabled="true"]):hover': {
      bg: '$inverseA3',
      boxShadow: 'none',
      border: '1px solid $border',
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
