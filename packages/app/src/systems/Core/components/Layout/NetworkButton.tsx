import { NetworkDropdown } from '~/systems/Network/components';
import { useNetworks } from '~/systems/Network/hooks';
import { NetworkScreen } from '~/systems/Network/types';

export function NetworkButton() {
  const { selectedNetwork, handlers } = useNetworks({
    type: NetworkScreen.list,
  });

  if (!selectedNetwork) {
    return null;
  }

  return (
    <NetworkDropdown selected={selectedNetwork} onPress={handlers.goToList} />
  );
}
