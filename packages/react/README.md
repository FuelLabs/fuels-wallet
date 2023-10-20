[![discord](https://img.shields.io/badge/chat%20on-discord-orange?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/xfpK4Pe)

# ⚡️ Fuel Wallet React Hooks

The Fuel Wallet React Hooks provide a set of hooks to seamless integrate the [Fuel Wallet browser extension](https://wallet.fuel.network) with any React JS or Next JS project.

## Installation

```bash
npm install fuels @fuel-wallet/react
```

Note that the fuels package is also required as a dependency for better integration with other applications built using the [Fuels TS SDK](https://github.com/FuelLabs/fuels-ts).

## Usage

### Setup the provider

Adding the providers on the upper level of the application that will use the hooks.

```tsx
import { FuelProvider } from '@fuel-wallet/react';

import { App } from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FuelProvider>
      <App />
    </FuelProvider>
  </React.StrictMode>,
);
```

### Connecting to Wallet

```tsx
import { useState } from 'react';
import {
  useConnect,
  useConnectors,
  useDisconnect,
  useIsConnected,
} from '@fuel-wallet/react';

export default function App() {
  const [connector, setConnector] = useState('');
  const { connectors } = useConnectors();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 10,
        maxWidth: 300,
      }}
    >
      <select
        onChange={(e) => {
          console.log(e.target.value);
          setConnector(e.target.value);
        }}
      >
        <option value="">Select a connector</option>
        {connectors.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <button disabled={!connector} onClick={() => connect(connector)}>
        Connect to {connector}
      </button>
      <button disabled={!connector} onClick={() => disconnect()}>
        Disconnect from {connector}
      </button>
      <p>{isConnected ? 'Connected' : ''}</p>
    </div>
  );
}
```

Please visit our [docs](https://docs.fuel.network/docs/wallet/dev/getting-started/) to get started using the Fuel Wallet React Hooks.

Additionally, you can check up the Fuel Wallet React Hooks [reference](https://docs.fuel.network/docs/wallet/dev/hooks-reference/) for more details.

## 📜 License

This repo is licensed under the `Apache-2.0` license. See [`LICENSE`](./LICENSE) for more information.
