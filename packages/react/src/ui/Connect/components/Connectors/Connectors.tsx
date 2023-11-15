import { useFuelConnect } from '../../../providers/FuelConnectProvider';
import { ConnectorIcon } from '../ConnectorIcon';

import { ConnectorsLoader } from './ConnectorsLoader';
import { ConnectorItem, ConnectorList, ConnectorName } from './styles';

export function Connectors() {
  const {
    connectors,
    isLoading,
    dialog: { connect },
  } = useFuelConnect();

  return (
    <ConnectorList>
      {connectors.map((connector, index) => (
        <ConnectorItem
          tabIndex={index + 1}
          key={connector.name}
          aria-label={`Connect to ${connector.name}`}
          data-installed={connector.installed}
          data-connected={connector.connected}
          onClick={(e) => {
            e.preventDefault();
            connect(connector);
          }}
        >
          <ConnectorIcon connectorName={connector.name} size={32} />
          <ConnectorName>{connector.name}</ConnectorName>
        </ConnectorItem>
      ))}
      {isLoading && <ConnectorsLoader items={2} />}
    </ConnectorList>
  );
}
