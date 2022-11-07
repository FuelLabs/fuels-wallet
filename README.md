[![build](https://github.com/FuelLabs/fuels-wallet/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/FuelLabs/fuels-wallet/actions/workflows/gh-pages.yml)
[![discord](https://img.shields.io/badge/chat%20on-discord-orange?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/xfpK4Pe)
![twitter](https://img.shields.io/twitter/follow/SwayLang?style=social)

# ⚡️ Fuel Wallet

The official wallet of the fastest modular execution layer: [Fuel](https://fuel.network/)

## 💻 Installing

First of all: [Download Fuel Wallet](https://fuels-wallet.vercel.app/preview/fuel-wallet.zip)

Then follow next steps.

#### Steps in video:

https://user-images.githubusercontent.com/8636507/200193094-4b6a6c80-5063-4a92-94fe-1b80c8274778.mov

#### Steps in a written way:

In your web browser (Brave, Chrome)

- Open Menu -> Click in "Extensions"
- Enable switch "Developer mode"
- Drag your downloaded Fuel Wallet file, and Drop it in the Extensions page
- If all went right, an onboarding page will instantly open

In the opened page, follow the instructions to create/import your wallet

⚡️ Fuel Wallet extension is now ready for your best use. ✅

## 🎸 Integrating

Integrate Fuel Wallet with your dapp is easy.

Install the wallet SDK in your project.

```
TOOD: REPLACE
npm install --save @fuel-wallet/sdk
```

### Action Promise Methods

To communicate with Fuel Wallet extension, the SDK provides action promise methods.

`connect` - Request permission to start a connection between the project and the wallet

```
const connect = async () => {
  const isConnected = await window.FuelWeb3.connect();
  console.log('Connection response', isConnected);
}
```

`disconnect` - Disconnect your project

```
const disconnect = async () => {
  const accounts = await window.FuelWeb3.accounts();
  console.log('Accounts response', accounts);
}
```

`accounts` - List accounts in the wallet

```
const accounts = async () => {
  await window.FuelWeb3.accounts();
  console.log('Disconnected');
}
```

`signMessage` - Request permission to sign a message for a specific account

```
const signMessage = async () => {
  const account = '0x00001000000'; // example address
  const signedMessage = await window.FuelWeb3.signMessage(account, message);
}
```

### Listeners

There's also a way to listen to events that will be triggering when extension data changes

`accounts` - Listen to changes to accounts. Returns `Array<string>`

```
window.FuelWeb3.on('accounts', (data) => {
  console.log('accounts', data);
});
```

`connection` - Listen to changes in connection status. Returns `boolean`

```
window.FuelWeb3.on('connection', (isConnected) => {
  console.log('isConnected', isConnected);
});
```

## 🧰 Features

- [x] Create a brand new and secure account
- [x] Recover an account using a passphrase
- [ ] Update account details
- [x] Check your asset's balance
- [ ] Manage networks
- [ ] Reveal your passphrase
- [ ] Change password
- [ ] Faucet for testnet
- [ ] See a list of your recent activities
- [ ] View transaction details
- [ ] Send assets to another wallet
- [ ] Receive screen with QR Code
- [ ] DApps integration popups

## 🦸‍♀️ Contributing 🦸‍♂️

- [Getting Started](./docs/GETTING_STARTED.md)
  - [Requirements](./docs/GETTING_STARTED.md#requirements)
  - [Running Project Locally](./docs/GETTING_STARTED.md#running-project-locally)
    - [📚 - Getting the Repository](./docs/GETTING_STARTED.md#---getting-the-repository)
    - [📦 - Install Dependencies](./docs/GETTING_STARTED.md#---install-dependencies)
    - [📒 - Run Local Node](./docs/GETTING_STARTED.md#---run-local-node)
    - [💻 - Run Web App](./docs/GETTING_STARTED.md#---run-web-app)
  - [📗 Project Overview](./docs/GETTING_STARTED.md#-project-overview)
  - [🧰 Useful Scripts](./docs/GETTING_STARTED.md#-useful-scripts)
  - [Running Tests](./docs/GETTING_STARTED.md#running-tests)
    - [Run Tests in Development Mode](./docs/GETTING_STARTED.md#run-tests-in-development-mode)
    - [Run Tests on a Local Test Environment](./docs/GETTING_STARTED.md#run-tests-on-a-local-test-environment)
- [Contribution Guide](./docs/CONTRIBUTING.md)
  - [Finding Something to Work On](./docs/CONTRIBUTING.md#finding-something-to-work-on)
  - [Contribution Flow](./docs/CONTRIBUTING.md#contribution-flow)

## 📜 License

The primary license for this repo is `Apache-2.0`, see [`LICENSE`](./LICENSE).
