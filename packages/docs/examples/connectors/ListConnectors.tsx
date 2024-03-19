import { Tag } from '@fuel-ui/react';
/* createInstance:start */
import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
  FueletWalletConnector,
} from '@fuels/connectors';
import type { FuelConnector } from 'fuels'; // ignore-line
import { Fuel } from 'fuels';
import { useEffect, useState } from 'react'; // ignore-line

import { ExampleBox } from '../../src/components/ExampleBox'; // ignore-line

const fuel = new Fuel({
  connectors: [
    new FuelWalletDevelopmentConnector(),
    new FueletWalletConnector(),
    new FuelWalletConnector(),
  ],
});
/* createInstance:end */

export function ListConnectors() {
  const [connectors, setConnectors] = useState<Array<FuelConnector>>([]);

  useEffect(() => {
    async function handleConnectors() {
      /* listConnectors:start */
      const connectors = await fuel.connectors();
      console.log('available connectors', connectors);

      fuel.on(fuel.events.connectors, (connectors) => {
        console.log('available connectors', connectors);
        setConnectors(connectors); // ignore-line
      });
      /* listConnectors:end */
      setConnectors(connectors);
    }
    handleConnectors();
  }, []);

  return (
    <ExampleBox>
      {connectors.map((connector) => {
        const label = `Installed: ${connector.installed} - Connected: ${connector.connected}`;
        return (
          <Tag variant="ghost" key={connector.name} intent="base">
            {connector.name} - {label}
          </Tag>
        );
      })}
    </ExampleBox>
  );
}
