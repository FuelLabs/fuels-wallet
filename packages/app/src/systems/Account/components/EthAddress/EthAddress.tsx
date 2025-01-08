import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Copyable, Text, Tooltip } from '@fuel-ui/react';
import { bn } from 'fuels';
import { isValidEthAddress, shortAddress } from '~/systems/Core';
import { useEns } from '../../hooks/useEns';

export type EthAddressProps = {
  address: string;
  css?: ThemeUtilsCSS;
};

export const EthAddress = ({ address, css }: EthAddressProps) => {
  const isValidAddress = isValidEthAddress(address);
  const ethAddress = isValidAddress ? bn(address).toHex(20) : '';
  const { name: ensName, avatar: ensAvatar, loading } = useEns(ethAddress);

  return (
    <Box.Flex css={{ ...styles.root, ...css }} gap="$2" align="center">
      {ensAvatar ? (
        <Box css={styles.avatar}>
          <img
            src={ensAvatar}
            alt={ensName || address}
            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          />
        </Box>
      ) : (
        <Avatar.Generated
          size="sm"
          hash={ethAddress}
          aria-label={ensName || address}
        />
      )}
      <Copyable value={address} aria-label={address}>
        <Tooltip content={address} className="address_tooltip" side="top">
          <Text>
            {loading ? 'Loading...' : ensName || shortAddress(ethAddress)}
          </Text>
        </Tooltip>
      </Copyable>
    </Box.Flex>
  );
};

const styles = {
  root: cssObj({
    '.address_tooltip': {
      fontSize: '$xs',
      lineHeight: '$4',
      maxWidth: 125,
      textAlign: 'center',
      wordWrap: 'break-word',
    },
  }),
  avatar: cssObj({
    width: '24px',
    height: '24px',
    borderRadius: '$full',
    overflow: 'hidden',
  }),
};
