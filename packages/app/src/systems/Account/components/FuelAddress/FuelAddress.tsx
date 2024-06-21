import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Copyable, Text } from '@fuel-ui/react';
import { Address } from 'fuels';
import { shortAddress } from '~/systems/Core';

export type AddressProps = {
  address: string;
  css?: ThemeUtilsCSS;
};

export const FuelAddress = ({ address, css }: AddressProps) => {
  const addressInstance = Address.fromDynamicInput(address);
  const fuelAddress = addressInstance.toB256();

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
