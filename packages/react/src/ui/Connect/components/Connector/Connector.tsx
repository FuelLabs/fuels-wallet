import type { FuelConnector } from 'fuels';

import { ConnectorIcon } from '../ConnectorIcon';

import {
  ConnectorButton,
  ConnectorContent,
  ConnectorDescription,
  ConnectorImage,
  ConnectorTitle,
} from './styles';

type ConnectorProps = {
  theme?: string;
  className?: string;
  connector: FuelConnector;
};

export function Connector({ className, connector, theme }: ConnectorProps) {
  const {
    install: { action, link, description },
  } = connector.metadata;

  return (
    <div className={className}>
      <ConnectorImage>
        <ConnectorIcon
          connectorMetadata={connector.metadata}
          connectorName={connector.name}
          size={100}
          theme={theme}
        />
      </ConnectorImage>
      <ConnectorContent>
        <ConnectorTitle>{connector.name}</ConnectorTitle>
        <ConnectorDescription>{description}</ConnectorDescription>
      </ConnectorContent>
      <ConnectorButton href={link} target="_blank">
        {action || 'Install'}
      </ConnectorButton>
    </div>
  );
}
