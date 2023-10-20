[![discord](https://img.shields.io/badge/chat%20on-discord-orange?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/xfpK4Pe)
![twitter](https://img.shields.io/twitter/follow/SwayLang?style=social)

# ⚡️ Fuel Wallet React Hooks

The Fuel Wallet React Hooks provide a set of tools to seamless integrate the [Fuel Wallet browser extension](https://wallet.fuel.network) with any React JS or Next JS project.

## Installation

```bash
npm install fuels @fuel-wallet/react
```

Note that the fuels package is also required as a dependency for better integration with other applications built using the [Fuels TS SDK](https://github.com/FuelLabs/fuels-ts).

## TypeScript Setup

To use the SDK in your TypeScript project, add the following line to your tsconfig.json file:

```json
{
  "compilerOptions": {
    "types": ["@fuel-wallet/react"]
  }
}
```

Alternatively, you can use a [TypeScript reference](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) directive in any TypeScript file:

```ts
/// <reference types="@fuel-wallet/react" />
```

Please visit our [docs](https://docs.fuel.network/docs/wallet/dev/getting-started/) to get started using the Fuel Wallet React Hooks.

Additionally, you can check up the Fuel Wallet React Hooks [reference](https://docs.fuel.network/docs/wallet/dev/hooks-reference/) for more details.

## 📜 License

This repo is licensed under the `Apache-2.0` license. See [`LICENSE`](./LICENSE) for more information.
