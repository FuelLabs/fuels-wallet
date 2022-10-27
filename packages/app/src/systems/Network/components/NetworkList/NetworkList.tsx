import { CardList } from '@fuel-ui/react';
import type { Network } from '@fuels-wallet/types';

import type { NetworkItemProps } from '../NetworkItem';
import { NetworkItem } from '../NetworkItem';

export type NetworkListProps = Omit<NetworkItemProps, 'network'> & {
  networks: Network[];
};

export function NetworkList({ networks = [], ...props }: NetworkListProps) {
  return (
    <CardList gap="$4" isClickable>
      {networks.map((network) => (
        <NetworkItem {...props} key={network.id} network={network} />
      ))}
    </CardList>
  );
}
