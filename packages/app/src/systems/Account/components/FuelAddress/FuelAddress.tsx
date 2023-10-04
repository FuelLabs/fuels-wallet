import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Copyable, Text, Tooltip } from '@fuel-ui/react';
import { Address, isB256, isBech32 } from 'fuels';
import { useState } from 'react';
import { shortAddress } from '~/systems/Core';

export type AddressProps = {
  address: string;
  css?: ThemeUtilsCSS;
};

export const FuelAddress = ({ address, css }: AddressProps) => {
  const isValidAddress = isB256(address) || isBech32(address);
  const [showB256, setShowB56] = useState(false);
  const getAddress = () => {
    const addressInstance = Address.fromString(address);
    return showB256 ? addressInstance.toB256() : addressInstance.toString();
  };
  const fuelAddress = isValidAddress ? getAddress() : '';

  return (
    <Box.Flex css={styles.root}>
      <Copyable
        value={fuelAddress}
        css={styles.copyable}
        aria-label={fuelAddress}
        data-invalid-address={!isValidAddress}
      >
        <Tooltip
          content={`Click to show ${showB256 ? 'Bech32' : 'HEX'} address`}
          className="address_tooltip"
          side="top"
        >
          <Text
            className="address"
            onClick={() => setShowB56(!showB256)}
            css={css}
          >
            {shortAddress(fuelAddress)}
          </Text>
        </Tooltip>
      </Copyable>
    </Box.Flex>
  );
};

const styles = {
  root: cssObj({
    cursor: 'pointer',
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
