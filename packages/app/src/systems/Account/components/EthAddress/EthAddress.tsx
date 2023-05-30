import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Copyable, Flex, Text, Tooltip } from '@fuel-ui/react';
import { bn } from 'fuels';

import { shortAddress } from '~/systems/Core';

export type EthAddressProps = {
  address: string;
  css?: ThemeUtilsCSS;
};

export const EthAddress = ({ address, css }: EthAddressProps) => {
  const ethAddress = bn(address).toHex(20);

  return (
    <Flex css={styles.root}>
      <Copyable value={address} aria-label={address}>
        <Tooltip content={address} className="address_tooltip" side="top">
          <Text css={css}>{shortAddress(ethAddress)}</Text>
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
};
