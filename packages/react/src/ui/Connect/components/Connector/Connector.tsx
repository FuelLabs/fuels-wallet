import type { FuelConnector } from '@fuel-wallet/sdk';

import { ConnectorIcon } from '../ConnectorIcon';

import {
  ConnectorButton,
  ConnectorContent,
  ConnectorDescription,
  ConnectorImage,
  ConnectorTitle,
} from './styles';

type ConnectorProps = {
  className?: string;
  connector: FuelConnector;
};

export function Connector({ className, connector }: ConnectorProps) {
  const {
    install: { action, link, description },
  } = connector.metadata;

  return (
    <div className={className}>
      <ConnectorImage>
        <ConnectorIcon connectorName={connector.name} size={100} />
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
