import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Copyable, Text } from '@fuel-ui/react';
import { Address, type B256Address, isB256, isBech32 } from 'fuels';
import { useMemo } from 'react';
import { shortAddress } from '~/systems/Core';

export type AddressProps = {
  address: B256Address;
  css?: ThemeUtilsCSS;
};

export const FuelAddress = ({ address, css }: AddressProps) => {
  const fuelAddress = useMemo<B256Address>(() => {
    if (isB256(address)) {
      return address;
    }

    return Address.fromDynamicInput(address).toB256();
  }, [address]);

  return (
    <Box.Flex css={styles.root}>
      <Copyable
        value={fuelAddress}
        css={styles.copyable}
        aria-label={fuelAddress}
      >
        <Text className="address" css={css}>
          {shortAddress(fuelAddress)}
        </Text>
      </Copyable>
    </Box.Flex>
  );
};

const styles = {
  root: cssObj({
    '.address_tooltip': cssObj({
      fontSize: '$sm',
      lineHeight: '$4',
      maxWidth: 125,
      textAlign: 'center',
      wordWrap: 'break-word',
    }),
    '.address': {
      userSelect: 'none',
    },
  }),
  copyable: cssObj({
    // to make sure we're using same text format, we just hide the copy icon but still use Copyable.
    '&[data-invalid-address="true"]': {
      '.fuel_copyable-icon': {
        display: 'none',
      },
    },
  }),
};
