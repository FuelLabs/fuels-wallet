[![build](https://github.com/FuelLabs/fuels-wallet/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/FuelLabs/fuels-wallet/actions/workflows/gh-pages.yml)
[![discord](https://img.shields.io/badge/chat%20on-discord-orange?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/xfpK4Pe)
![twitter](https://img.shields.io/twitter/follow/SwayLang?style=social)

# ⚡️ Fuel Wallet SDK

The Fuel Wallet SDK enables developers to integrate DApps with the Fuel Wallet and/or adding **types** to use the injected `window.fuel`.

## Installion

```
npm install @fuel-wallet/sdk fuels
```

We **require** installation of [`fuels`](https://www.npmjs.com/package/fuels) package as a dependency to enable better integration with other applications built using [Fuels SDK](https://github.com/FuelLabs/fuels-ts).

## TypeScript Setup

Import the Fuel Wallet SDK in your project by adding the following line to your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "types": ["@fuel-wallet/sdk"]
  }
}
```

Or using [TypeScript reference](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) on any typescript file.

```ts
/// <reference types="@fuel-wallet/sdk" />
```

## 📜 License

The primary license for this repo is `Apache-2.0`, see [`LICENSE`](./LICENSE).
