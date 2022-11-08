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
      - [List accounts](#list-accounts)
      - [Request signature message](#request-signature-message)
    - [Events](#events)
      - [Accounts](#accounts)
      - [Connection](#connection)

## How to use

If you've correctly installed the Fuel wallet extension, the wallet SDK will be injected automatically on the `window` object on property `FuelWeb3`. To access it, you can use `window.FuelWeb3`

```ts
window.FuelWeb3.connect();
```

You can try this code directly on the developer console.

## Quickstart

### Request connection

First of all, you need to connect and authorize your application; this will authorize your application to execute other actions. You can do this by accessing `FuelWeb3.connect()`.

```ts
const isConnected = await window.FuelWeb3.connect();
console.log("Connection response", isConnected);
```

The `connect()` method returns a promise; if you prefer to do it in an async way, you can use `FuelWeb3.on('connection', () => void)` to
listen for changes in the connection.

### List user accounts

Once the connection is authorized, you can list the user accounts using `window.FuelWeb3.accounts()`.

```ts
const accounts = await window.FuelWeb3.accounts();
console.log(accounts);
```

### Signing a message

Having access to the user address and the connection authorized, you can now request the user for signatures using `FuelWeb3.signMessage`.

```ts
const account = "fuel1<address>"; // example account
const signedMessage = await window.FuelWeb3.signMessage(account, message);
```

## SDK API

| name                                      | signature                                                            |
| ----------------------------------------- | -------------------------------------------------------------------- |
| [connect](#connect)                       | async connect(): Promise<boolean>                                    |
| [disconnect](#disconnect)                 | async disconnect(): Promise<boolean>                                 |
| [accounts](#list-user-accounts)           | async accounts(): Promise<Array<string>>                             |
| [signMessage](#request-signature-message) | async signMessage(address: string, message: string): Promise<string> |

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

Events are triggered when the state of the respective scope is updated.

#### Accounts

`accounts` - Listen to changes to the list of authorized accounts. Params `Array<string>`

```ts
window.FuelWeb3.on("accounts", (data) => {
  console.log("accounts", data);
});
```

#### Connection

`connection` - Listen to changes in the connection status. Params `boolean`

```ts
window.FuelWeb3.on("connection", (isConnected) => {
  console.log("isConnected", isConnected);
});
```
