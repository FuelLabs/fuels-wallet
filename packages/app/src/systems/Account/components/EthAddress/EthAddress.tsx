import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Copyable, Text, Tooltip } from '@fuel-ui/react';
import { bn } from 'fuels';
import { isValidEthAddress, shortAddress } from '~/systems/Core';

export type EthAddressProps = {
  address: string;
  css?: ThemeUtilsCSS;
};

export const EthAddress = ({ address, css }: EthAddressProps) => {
  const isValidAddress = isValidEthAddress(address);
  const ethAddress = isValidAddress ? bn(address).toHex(20) : '';

  return (
    <Box.Flex css={styles.root}>
      <Copyable value={address} aria-label={address}>
        <Tooltip content={address} className="address_tooltip" side="top">
          <Text css={css}>{shortAddress(ethAddress)}</Text>
        </Tooltip>
      </Copyable>
    </Box.Flex>
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
};
