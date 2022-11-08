# Fuel Wallet SDK

- [Fuel Wallet SDK](#fuel-wallet-sdk)
  - [How to use?](#how-to-use)
  - [Quickstart](#quickstart)
    - [Request connection](#request-connection)
    - [List user accounts](#list-user-accounts)
    - [Signing a message](#signing-a-message)
  - [SDK API](#sdk-api)
    - [Methods](#methods)
      - [Connect](#connect)
      - [Disconnect](#disconnect)
      - [List Accounts](#list-accounts)
      - [Request signature message](#request-signature-message)
    - [Events](#events)
      - [Accounts](#accounts)
      - [Connection](#connection)

## How to use?

When a user has the FuelWallet extension already installed on the browser you will be able to,
interact with the Wallet API by access our SDK on `window.FuelWeb3`.

## Quickstart

### Request connection

Before any action you need to request the user to connect and authorized your application, via the wallet.
This can be done by acessing `FuelWeb3.connect()`.

```ts
const isConnected = await window.FuelWeb3.connect();
console.log("Connection response", isConnected);
```

The `connect()` method returns a promise, if you prefer to do in a async way you can use `FuelWeb3.on('connection', () => void)` to
listen for changes on the connection.

### List user accounts

After connection is authorized you can list the user accounts using `window.FuelWeb3.accounts()`.

```ts
const accounts = await window.FuelWeb3.accounts();
console.log(accounts);
```

### Signing a message

Having acesses to the user address, and the connection authorized, you can now request the user for signatures using `FuelWeb3.signMessage`.

```ts
const account = "fuel1<address>"; // example account
const signedMessage = await window.FuelWeb3.signMessage(account, message);
```

## SDK API

| name          | signature                                                            |
| ------------- | -------------------------------------------------------------------- |
| [connect]     | async connect(): Promise<boolean>                                    |
| [disconnect]  | async disconnect(): Promise<boolean>                                 |
| [accounts]    | async accounts(): Promise<Array<string>>                             |
| [signMessage] | async signMessage(address: string, message: string): Promise<string> |

### Methods

#### Connect

`connect` - Request permission to start a connection between the project and the wallet

```ts
const isConnected = await window.FuelWeb3.connect();
console.log("connection status", isConnected);
```

#### Disconnect

`disconnect` - Disconnect your project

```ts
await window.FuelWeb3.disconnect();
```

#### List Accounts

`accounts` - List accounts in the wallet

```ts
const accounts = await window.FuelWeb3.accounts();
console.log(accounts);
```

#### Request signature message

`signMessage` - Request a message signature for one specific account

```ts
const account = "fuel1<address>";
const signedMessage = await window.FuelWeb3.signMessage(account, message);
```

### Events

Events are trigger when the state of the repective scope is updated.

#### Accounts

`accounts` - Listen to changes to the list of authorized accounts. Params `Array<string>`

```ts
window.FuelWeb3.on("accounts", (data) => {
  console.log("accounts", data);
});
```

#### Connection

`connection` - Listen to changes in connection status. Params `boolean`

```ts
window.FuelWeb3.on("connection", (isConnected) => {
  console.log("isConnected", isConnected);
});
```
