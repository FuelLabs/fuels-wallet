import { useConnectUI } from '../../../../providers/FuelUIProvider';
import { ConnectorIcon } from '../ConnectorIcon';

import { ConnectorsLoader } from './ConnectorsLoader';
import { ConnectorItem, ConnectorList, ConnectorName } from './styles';

export function Connectors() {
  const {
    connectors,
    isLoading,
    theme,
    dialog: { connect },
  } = useConnectUI();

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
          <ConnectorIcon
            connectorMetadata={connector.metadata}
            connectorName={connector.name}
            size={32}
            theme={theme}
          />
          <ConnectorName>{connector.name}</ConnectorName>
        </ConnectorItem>
      ))}
      {isLoading && <ConnectorsLoader items={2} />}
    </ConnectorList>
  );
}
