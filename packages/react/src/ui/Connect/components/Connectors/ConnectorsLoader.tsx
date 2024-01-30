import { PlaceholderLoader } from '../../styles';

import { ConnectorItem, ConnectorName } from './styles';

type ConnectorsLoaderProps = {
  items: number;
};

export function ConnectorsLoader({ items }: ConnectorsLoaderProps) {
  const itemsArray = Array.from({ length: items });
  return itemsArray.map((_, index) => (
    <ConnectorItem key={index}>
      <PlaceholderLoader>
        <div style={{ height: 32, width: 32 }} />
      </PlaceholderLoader>
      <PlaceholderLoader>
        <ConnectorName>Fuel Wallet</ConnectorName>
      </PlaceholderLoader>
    </ConnectorItem>
  ));
}
