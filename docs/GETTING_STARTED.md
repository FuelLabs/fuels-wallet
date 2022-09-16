# Getting Started

## Requirements

This project includes frontend. To begin, install dependencies:

- [Node.js v16.15.0 or latest stable](https://nodejs.org/en/). We recommend using [nvm](https://github.com/nvm-sh/nvm) to install.
- [PNPM v7.1.7 or latest stable](https://pnpm.io/installation/)
- [Docker v0.8.2 or latest stable](https://docs.docker.com/get-docker/)
- [Docker Compose v2.6.0 or latest stable](https://docs.docker.com/get-docker/)

## Running Project Locally

### 📚 - Getting the Repository

1. Visit the [Fuel Wallet](https://github.com/FuelLabs/fuels-wallet) repo and fork the project.
2. Then clone your forked copy to your local machine and get to work.

```sh
git clone https://github.com/FuelLabs/fuels-wallet
cd fuels-wallet
```

### 📦 - Install Dependencies

```sh
pnpm install
```

### 📒 - Run Local Node

In this step, we are going to;

- launch a local `fuel-core` node;
- launch a local `faucet` API;

```sh
pnpm node:dev start
```

### 💻 - Run Web App

Start a local development frontend. After running the below command you can open [http://localhost:3000](http://localhost:3000) in your browser to view the frontend.

```sh
pnpm dev
```

## 📗 Project Overview

This section has a brief description of each directory. More details can be found inside each package, by clicking on the links.

- [packages/app](../packages/app/) Frontend Fuel Wallet application
- [packages/config](../packages/config/) Build configurations
- [packages/fuelhat](../packages/fuelhat/) Fuel Wallet scripts CLI
- [packages/mediator](../packages/mediator/) Mediator is a PubSub library we use to better integrate XState machines and also other relevant event-driven issues.

## 🧰 Useful Scripts

To make life easier we added as many useful scripts as possible to our [package.json](../package.json). These are some of the most used during development:

```sh
pnpm <command name>
```

| Script      | Description                                                             |
| ----------- | ----------------------------------------------------------------------- |
| `dev`       | Run development server for the WebApp [packages/app](../packages/app/). |
| `storybook` | Run storybook, which is the place we use to develop our components.     |
| `test`      | Run all units tests that are based on Jest.                             |
| `test:e2e`  | Run all E2E tests that are based on Cypress.                            |

> Other scripts can be found in [package.json](../package.json).

## Running Tests

Please make sure you have done these steps first:

- [📚 - Getting the Repository](#---getting-the-repository)
- [📦 - Install Dependencies](#---install-dependencies)
- [📒 - Run Local Node](#---run-local-node)

## Run Tests in Development Mode

All tests are run against the local node configured in the files `packages/app/.env` (or `packages/app/.env.test` if the file exists).

To run tests use:

```sh
pnpm test
```
