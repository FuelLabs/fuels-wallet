import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import type { Network } from '@fuel-wallet/types';

export type NetworkDropdownProps = {
  selected?: Network;
  isDisabled?: boolean;
  onPress?: (network: Network) => void;
};

export function NetworkDropdown({
  selected,
  isDisabled,
  onPress,
}: NetworkDropdownProps) {
  return (
    <Button
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

const styles = {
  trigger: cssObj({
    cursor: 'pointer',
    fontSize: '$xs',
    px: '$4 !important',
    border: '1px dashed $gray4 !important',
    color: '$gray10 !important',
    borderRadius: '$full !important',
    '&, &:hover': {
      background: '$transparent !important',
      boxShadow: 'none !important',
    },
    '&:focus': {
      outlineColor: '$gray2 !important',
    },
    '&[aria-disabled="true"]': {
      opacity: 1,
      cursor: 'default',
    },
  }),
};
