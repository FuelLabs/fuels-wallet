[![discord](https://img.shields.io/badge/chat%20on-discord-orange?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/xfpK4Pe)
![twitter](https://img.shields.io/twitter/follow/SwayLang?style=social)

## ⚡️ Fuel Wallet

> **Warning**
> This project is under active development, some features are not implemented or can present bugs/issues. Do not treat it as a production-ready wallet.

The official wallet of the fastest modular execution layer: [Fuel](https://fuel.network).

Fuel Wallet is a crypto wallet used to interact with the Fuel Network. This project enables users to access their assets and interact with decentralized applications through a browser extension.

[![Install Wallet](packages/docs/public/install-button.png)](https://wallet.fuel.network/docs/install/)

For latest updates, download the [Fuel Wallet Development](https://next-wallet.fuel.network/docs/install/). This version is made for developers, so note that it can be unstable or buggy.

Integrate your **DApp** using the [Wallet SDK](https://wallet.fuel.network/docs/dev/getting-started/)

## 📗 Table of contents

- [📗 Documentation](https://wallet.fuel.network/)
- [📦 Install Wallet](https://wallet.fuel.network/docs/install/)
- [🧰 Fuel Wallet SDK](https://wallet.fuel.network/docs/dev/getting-started/)
  - [👨‍💻 - Quickstart](https://wallet.fuel.network/docs/dev/getting-started/)
  - [🔗 - Request connection](https://wallet.fuel.network/docs/dev/connecting/)
  - [📒 - List user accounts](https://wallet.fuel.network/docs/dev/accounts/)
  - [✍️ - Signing a message](https://wallet.fuel.network/docs/dev/signMessage/)
  - [✍️ - Transfering assets](https://wallet.fuel.network/docs/dev/assets/)
  - [📗 SDK API](https://wallet.fuel.network/docs/dev/reference/)
- [Contributing](https://wallet.fuel.network/docs/contributing/guide/)
  - [Contribution Guide](https://wallet.fuel.network/docs/contributing/guide/)
  - [Running Locally](https://wallet.fuel.network/docs/contributing/running-locally)

## Features

- [x] Create a new mnemonic phrase account
- [x] Recover an account using mnemonic phrase
- [x] DApps integration
  - [x] Request connection
  - [x] List accounts
  - [x] Sign messages
  - [x] Send transactions
  - [x] Disconnect applications
- [x] Check your asset's balance
- [x] Manage networks
- [x] Faucet for testnet
- [x] Account
  - [x] List all account
  - [x] Add new account
  - [x] Update account name
  - [x] Create account from PrivateKey
- [x] Applications
  - [x] List connections
  - [x] Remove connections
- [x] Settings
  - [x] Reveal your passphrase
  - [x] Change password
  - [x] Export account privateKey
- [x] Transactions
  - [x] Receive Assets via address or QR Code
  - [x] Send Assets to another wallet
  - [x] Transaction History
  - [x] View transaction details

## Website deployment

[wallet.fuel.network](https://wallet.fuel.network/) (docs, the web app at `/app`, and Storybook at `/storybook`) is built from the root `Dockerfile` and served by nginx on Railway. Railway deploys the `release` branch. To ship website changes, merge `master` into `release`.

## 📜 License

This repo is licensed under the `Apache-2.0` license. See [`LICENSE`](./LICENSE) for more information.


