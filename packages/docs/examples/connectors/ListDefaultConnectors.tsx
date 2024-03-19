import { Tag } from '@fuel-ui/react';
/* createInstance:start */
import { defaultConnectors } from '@fuels/connectors';
import type { FuelConnector } from 'fuels'; // ignore-line
import { Fuel } from 'fuels';
import { useEffect, useState } from 'react'; // ignore-line

import { ExampleBox } from '../../src/components/ExampleBox'; // ignore-line

const fuel = new Fuel({
  connectors: defaultConnectors({ devMode: true }),
});
/* createInstance:end */

export function ListDefaultConnectors() {
  const [connectors, setConnectors] = useState<Array<FuelConnector>>([]);

  useEffect(() => {
    async function handleConnectors() {
      const connectors = await fuel.connectors();
      console.log('available connectors', connectors);

      fuel.on(fuel.events.connectors, (connectors) => {
        console.log('available connectors', connectors);
        setConnectors(connectors);
      });
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
