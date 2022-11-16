[![build](https://github.com/FuelLabs/fuels-wallet/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/FuelLabs/fuels-wallet/actions/workflows/gh-pages.yml)
[![discord](https://img.shields.io/badge/chat%20on-discord-orange?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/xfpK4Pe)
![twitter](https://img.shields.io/twitter/follow/SwayLang?style=social)

## ⚡️ Fuel Wallet

The official wallet of the fastest modular execution layer: [Fuel](https://fuel.network).

FuelWallet is a crypto wallet used to interact with the Fuel Network. This project enables users to access their assets and interact with decentralized applications through a browser extension.

[![Install Wallet](docs/assets/install-button.png)](./docs/INSTALL.md)

Integrate your **DApp** using the [Wallet SDK](./docs/WALLET_SDK.md)

## 📗 Table of contents

- [📦 Install Wallet](./docs/INSTALL.md)
- [🧰 Fuel Wallet SDK](./docs/WALLET_SDK.md)
  - [👨‍💻 - Quickstart](./docs/WALLET_SDK.md#quickstart)
  - [🔗 - Request connection](./docs/WALLET_SDK.md#request-connection)
  - [📗 - List user accounts](./docs/WALLET_SDK.md#list-user-accounts)
  - [✍️ - Signing a message](./docs/WALLET_SDK.md#signing-a-message)
- [Contributing](./docs/GETTING_STARTED.md)
  - [Requirements](./docs/GETTING_STARTED.md#requirements)
  - [Running Project Locally](./docs/GETTING_STARTED.md#running-project-locally)
    - [Getting the repository](./docs/GETTING_STARTED.md#---getting-the-repository)
    - [Install dependencies](./docs/GETTING_STARTED.md#---install-dependencies)
    - [Run a local node](./docs/GETTING_STARTED.md#---run-local-node)
    - [Run the web app](./docs/GETTING_STARTED.md#---run-web-app)
  - [Project overview](./docs/GETTING_STARTED.md#-project-overview)
  - [Useful scripts](./docs/GETTING_STARTED.md#-useful-scripts)
  - [Running Tests](./docs/GETTING_STARTED.md#running-tests)
    - [Run Tests in Development Mode](./docs/GETTING_STARTED.md#run-tests-in-development-mode)
    - [Run Tests on a Local Test Environment](./docs/GETTING_STARTED.md#run-tests-on-a-local-test-environment)
- [Contribution Guide](./docs/CONTRIBUTING.md)
  - [Finding Something to Work On](./docs/CONTRIBUTING.md#finding-something-to-work-on)
  - [Contribution Flow](./docs/CONTRIBUTING.md#contribution-flow)

| This project is under active development. Please do not treat it as a production-ready wallet.

## Features

- [x] Create a brand new and secure account
- [x] Recover an account using a passphrase
- [x] DApps integration
  - [x] Request connection
  - [x] List accounts
  - [x] Sign messages
  - [x] Send transactions
  - [ ] Disconnect applications
- [x] Check your asset's balance
- [x] Manage networks
- [x] Faucet for testnet
- [x] Receive screen with QR Code
- [ ] Update account details
- [ ] Reveal your passphrase
- [ ] Change password
- [ ] See a list of your recent activities (Transaction History)
- [ ] View transaction details
- [ ] Send assets to another wallet

## 📜 License

The primary license for this repo is `Apache-2.0`, see [`LICENSE`](./LICENSE).
