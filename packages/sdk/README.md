[![build](https://github.com/FuelLabs/fuels-wallet/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/FuelLabs/fuels-wallet/actions/workflows/gh-pages.yml)
[![discord](https://img.shields.io/badge/chat%20on-discord-orange?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/xfpK4Pe)
![twitter](https://img.shields.io/twitter/follow/SwayLang?style=social)

# ⚡️ Fuel Wallet SDK

The Fuel Wallet SDK enables developers to integrate their DApps with the Fuel Wallet using the injected `window.fuel` object. It also provides TypeScript types for better type checking and code completion.

## Installation

```bash
npm install fuels @fuel-wallet/sdk
```

Note that the fuels package is also required as a dependency for better integration with other applications built using the [Fuels TS SDK](https://github.com/FuelLabs/fuels-ts).

## TypeScript Setup

To use the SDK in your TypeScript project, add the following line to your tsconfig.json file:

```json
{
  "compilerOptions": {
    "types": ["@fuel-wallet/sdk"]
  }
}
```

Alternatively, you can use a [TypeScript reference](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) directive in any TypeScript file:

```ts
/// <reference types="@fuel-wallet/sdk" />
```

## 📜 License

This repo is licensed under the `Apache-2.0` license. See [`LICENSE`](./LICENSE) for more information.
