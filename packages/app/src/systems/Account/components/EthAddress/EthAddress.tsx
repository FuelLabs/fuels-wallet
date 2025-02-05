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
    <Box.Flex>
      <Copyable value={ethAddress} aria-label={address}>
        <Text css={css}>{shortAddress(ethAddress)}</Text>
      </Copyable>
    </Box.Flex>
  );
};
