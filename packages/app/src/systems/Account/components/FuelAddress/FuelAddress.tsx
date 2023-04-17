import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Copyable, Flex, Text, Tooltip } from '@fuel-ui/react';
import { Address, isB256, isBech32 } from 'fuels';

import { shortAddress } from '~/systems/Core';

export type AddressProps = {
  address: string;
  css?: ThemeUtilsCSS;
};

export const FuelAddress = ({ address, css }: AddressProps) => {
  const isValidAddress = isB256(address) || isBech32(address);
  const fuelAddress = isValidAddress
    ? Address.fromString(address).toString()
    : '';

  return (
    <Flex css={styles.root}>
      <Copyable
        value={fuelAddress}
        css={styles.copyable}
        aria-label={fuelAddress}
        data-invalid-address={!isValidAddress}
      >
        <Tooltip content={fuelAddress} className="address_tooltip" side="top">
          <Text css={css}>{shortAddress(fuelAddress)}</Text>
        </Tooltip>
      </Copyable>
    </Flex>
  );
};

const styles = {
  root: {
    '.address_tooltip': cssObj({
      fontSize: '$xs',
      lineHeight: '$4',
      maxWidth: 125,
      textAlign: 'center',
      wordWrap: 'break-word',
    }),
  },
  copyable: cssObj({
    // to make sure we're using same text format, we just hide the copy icon but still use Copyable.
    '&[data-invalid-address="true"]': {
      '.fuel_copyable-icon': {
        display: 'none',
      },
    },
  }),
};
