[![discord](https://img.shields.io/badge/chat%20on-discord-orange?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/xfpK4Pe)
![twitter](https://img.shields.io/twitter/follow/SwayLang?style=social)

# ⚡️ Fuel Wallet SDK

The Fuel Wallet SDK enables developers to integrate their DApps with all available Wallets on Fuel Network.

## Installation

```bash
npm install fuels @fuel-wallet/sdk
```

Note that the fuels package is also required as a dependency for better integration with other applications built using the [Fuels TS SDK](https://github.com/FuelLabs/fuels-ts).

## Getting Started

```ts
import { Fuel, FuelWalletConnector } from '@fuel-wallet/sdk';

const fuel = new Fuel({
  connectors: [new FuelWalletConnector()],
});

// Returns true if any connector is available
// this means the user has a Wallet installed also.. if this don't return true
// User do not have a wallet.
await fuel.hasConnector();
// Request connection to the Wallet Application.
await fuel.connect();
```

## 📜 License

This repo is licensed under the `Apache-2.0` license. See [`LICENSE`](./LICENSE) for more information.
