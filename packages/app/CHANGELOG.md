# fuels-wallet

## 0.31.1

### Patch Changes

- Updated dependencies []:
  - @fuel-wallet/connections@0.31.1

## 0.31.0

### Minor Changes

- [#1508](https://github.com/FuelLabs/fuels-wallet/pull/1508) [`a5b8007f`](https://github.com/FuelLabs/fuels-wallet/commit/a5b8007fe80a9d1b8402e3b30d84e4268abd52d1) Thanks [@luizstacio](https://github.com/luizstacio)! - Add explorer, bridge and faucet url configuration to networks.

- [#1510](https://github.com/FuelLabs/fuels-wallet/pull/1510) [`75db1883`](https://github.com/FuelLabs/fuels-wallet/commit/75db1883b9b8d2f7151e2240d59d0a5e2b0d8a16) Thanks [@LeoCourbassier](https://github.com/LeoCourbassier)! - Added a Copy Button to ErrorHeader on TxContent, and a few stories

### Patch Changes

- [#1509](https://github.com/FuelLabs/fuels-wallet/pull/1509) [`773c5b9d`](https://github.com/FuelLabs/fuels-wallet/commit/773c5b9d6afc97bd21277e718f39a0e9bc104a17) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Fixed e2e flakiness due to the use of wrong connector/VITE_CRX_NAME pair

- [#1506](https://github.com/FuelLabs/fuels-wallet/pull/1506) [`0d135e6e`](https://github.com/FuelLabs/fuels-wallet/commit/0d135e6e116e5708270620759c52655203f7631f) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix selectNetwork issues related to chainId not been indexed on database.

- [#1504](https://github.com/FuelLabs/fuels-wallet/pull/1504) [`67a14d8e`](https://github.com/FuelLabs/fuels-wallet/commit/67a14d8e67efba8ebf2191649970e3546192b05f) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Fixed not being able to add a known token on a different network

- [#1504](https://github.com/FuelLabs/fuels-wallet/pull/1504) [`67a14d8e`](https://github.com/FuelLabs/fuels-wallet/commit/67a14d8e67efba8ebf2191649970e3546192b05f) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Fixed being able to manually create custom assets with duplicate asset ids

- Updated dependencies []:
  - @fuel-wallet/connections@0.31.0

## 0.30.0

### Minor Changes

- [#1492](https://github.com/FuelLabs/fuels-wallet/pull/1492) [`76c88c40`](https://github.com/FuelLabs/fuels-wallet/commit/76c88c40a852f7cae599e41b88709078d8fe4d00) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - refactor assets related code of application

### Patch Changes

- [#1493](https://github.com/FuelLabs/fuels-wallet/pull/1493) [`4bd3f8f7`](https://github.com/FuelLabs/fuels-wallet/commit/4bd3f8f7e1dc0ba120cf23a9fa5de907b2e0186b) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Improve design of alerts in submitted transactions

- [#1492](https://github.com/FuelLabs/fuels-wallet/pull/1492) [`76c88c40`](https://github.com/FuelLabs/fuels-wallet/commit/76c88c40a852f7cae599e41b88709078d8fe4d00) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - fix bugs when formatting / creating values with zero units (unknown tokens)

- [#1492](https://github.com/FuelLabs/fuels-wallet/pull/1492) [`76c88c40`](https://github.com/FuelLabs/fuels-wallet/commit/76c88c40a852f7cae599e41b88709078d8fe4d00) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - make all unknown tokens / assets use default as zero units

- [#1498](https://github.com/FuelLabs/fuels-wallet/pull/1498) [`698c272c`](https://github.com/FuelLabs/fuels-wallet/commit/698c272c05ffa99a3554af84db72550dfb97879d) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Avoid duplicating instances of injected Content Script

- [#1492](https://github.com/FuelLabs/fuels-wallet/pull/1492) [`76c88c40`](https://github.com/FuelLabs/fuels-wallet/commit/76c88c40a852f7cae599e41b88709078d8fe4d00) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - include hooks and helpers to deal with assets, like `useFuelAsset`, `getAssetFuelCurrentChain`, `getFuelAssetByAssetId`

- [#1492](https://github.com/FuelLabs/fuels-wallet/pull/1492) [`76c88c40`](https://github.com/FuelLabs/fuels-wallet/commit/76c88c40a852f7cae599e41b88709078d8fe4d00) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Send screen: enable sending unknown tokens as well

- [#1492](https://github.com/FuelLabs/fuels-wallet/pull/1492) [`76c88c40`](https://github.com/FuelLabs/fuels-wallet/commit/76c88c40a852f7cae599e41b88709078d8fe4d00) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - upgrade database to remove assetId from primaryKey of assets table

- Updated dependencies [[`698c272c`](https://github.com/FuelLabs/fuels-wallet/commit/698c272c05ffa99a3554af84db72550dfb97879d)]:
  - @fuel-wallet/connections@0.30.0

## 0.29.1

### Patch Changes

- [#1489](https://github.com/FuelLabs/fuels-wallet/pull/1489) [`9f4334cd`](https://github.com/FuelLabs/fuels-wallet/commit/9f4334cd2c8d7f56bc2f101ddd3c052e0d1a4303) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: add db versioning

- Updated dependencies [[`9f4334cd`](https://github.com/FuelLabs/fuels-wallet/commit/9f4334cd2c8d7f56bc2f101ddd3c052e0d1a4303)]:
  - @fuel-wallet/connections@0.29.1

## 0.29.0

### Minor Changes

- [#1479](https://github.com/FuelLabs/fuels-wallet/pull/1479) [`14e63852`](https://github.com/FuelLabs/fuels-wallet/commit/14e63852efc57f2ee02106b784ec9b500f5b9f65) Thanks [@helciofranco](https://github.com/helciofranco)! - Improve how error messages are displayed/parsed during fee estimation.

- [#1479](https://github.com/FuelLabs/fuels-wallet/pull/1479) [`14e63852`](https://github.com/FuelLabs/fuels-wallet/commit/14e63852efc57f2ee02106b784ec9b500f5b9f65) Thanks [@helciofranco](https://github.com/helciofranco)! - Display fees options even when there are tx simulation errors.

### Patch Changes

- [#1481](https://github.com/FuelLabs/fuels-wallet/pull/1481) [`926a64f4`](https://github.com/FuelLabs/fuels-wallet/commit/926a64f4fda92454bf3d772f18ade021f20e58ab) Thanks [@helciofranco](https://github.com/helciofranco)! - Blocks leading zeros in the amount field.

- [#1481](https://github.com/FuelLabs/fuels-wallet/pull/1481) [`926a64f4`](https://github.com/FuelLabs/fuels-wallet/commit/926a64f4fda92454bf3d772f18ade021f20e58ab) Thanks [@helciofranco](https://github.com/helciofranco)! - Blocks leading zeros in the Gas Limit input during the fee customization.

- [#1480](https://github.com/FuelLabs/fuels-wallet/pull/1480) [`65a987b1`](https://github.com/FuelLabs/fuels-wallet/commit/65a987b1f417d9eb0279b4ede26931716db1ec09) Thanks [@helciofranco](https://github.com/helciofranco)! - Improve gas error message by adding number formatting for better readability.

- [#1481](https://github.com/FuelLabs/fuels-wallet/pull/1481) [`926a64f4`](https://github.com/FuelLabs/fuels-wallet/commit/926a64f4fda92454bf3d772f18ade021f20e58ab) Thanks [@helciofranco](https://github.com/helciofranco)! - Blocks leading zeros in the Tip input during the fee customization.

- [#1479](https://github.com/FuelLabs/fuels-wallet/pull/1479) [`14e63852`](https://github.com/FuelLabs/fuels-wallet/commit/14e63852efc57f2ee02106b784ec9b500f5b9f65) Thanks [@helciofranco](https://github.com/helciofranco)! - Allow dApps to pass account owner with `0x` address.

- Updated dependencies []:
  - @fuel-wallet/connections@0.29.0

## 0.28.0

### Minor Changes

- [#1468](https://github.com/FuelLabs/fuels-wallet/pull/1468) [`ce5925c9`](https://github.com/FuelLabs/fuels-wallet/commit/ce5925c97acd82bb0ec11fd8d864f3efd83ab15f) Thanks [@helciofranco](https://github.com/helciofranco)! - Allow users to switch to or create a network through the `selectNetwork` flow, selecting it if it already exists or creating it if not.

### Patch Changes

- [#1469](https://github.com/FuelLabs/fuels-wallet/pull/1469) [`2a626b6b`](https://github.com/FuelLabs/fuels-wallet/commit/2a626b6b58086a18010dbca26e3be4ca781f5673) Thanks [@helciofranco](https://github.com/helciofranco)! - Fix long network URLs breaking layout by enabling word wrapping.

- [#1475](https://github.com/FuelLabs/fuels-wallet/pull/1475) [`ff39a99b`](https://github.com/FuelLabs/fuels-wallet/commit/ff39a99b57637409931adfc7c4d89cb9fa233fc5) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - fix: show feedback when try to unlock with invalid password

- [#1476](https://github.com/FuelLabs/fuels-wallet/pull/1476) [`e555035a`](https://github.com/FuelLabs/fuels-wallet/commit/e555035ab0a4222fd27d9ee4ca34d31ede9d9edf) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - chore: add success feedback when resetting the wallet

- [#1442](https://github.com/FuelLabs/fuels-wallet/pull/1442) [`32abae8c`](https://github.com/FuelLabs/fuels-wallet/commit/32abae8cc4cdd7c5e91db37dd2475c18f2bc5df0) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Refactored Service Worker and Content Scripts to close running processes and listeners correctly. Fixes memory leaks.

- Updated dependencies [[`32abae8c`](https://github.com/FuelLabs/fuels-wallet/commit/32abae8cc4cdd7c5e91db37dd2475c18f2bc5df0)]:
  - @fuel-wallet/connections@0.28.0

## 0.27.4

### Patch Changes

- [#1463](https://github.com/FuelLabs/fuels-wallet/pull/1463) [`4fbc6955`](https://github.com/FuelLabs/fuels-wallet/commit/4fbc69553c2d30a2112bdfa1a2f373c9b8655ec4) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - force providerUrl on signTransactions, instead of using directly from provider

- [#1459](https://github.com/FuelLabs/fuels-wallet/pull/1459) [`00234c0a`](https://github.com/FuelLabs/fuels-wallet/commit/00234c0aecf1255f173bbe4387dd8d08546c55b5) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Fixed extension freezing when validating a specifically malformed network URL

- Updated dependencies []:
  - @fuel-wallet/connections@0.27.4

## 0.27.3

### Patch Changes

- [#1455](https://github.com/FuelLabs/fuels-wallet/pull/1455) [`f386ff86`](https://github.com/FuelLabs/fuels-wallet/commit/f386ff8625f0592017371f88852833da6078162f) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Update to `fuels@0.94.4` and `fuel-core@0.35.0`

- Updated dependencies [[`f386ff86`](https://github.com/FuelLabs/fuels-wallet/commit/f386ff8625f0592017371f88852833da6078162f)]:
  - @fuel-wallet/connections@0.27.3

## 0.27.2

### Patch Changes

- [#1443](https://github.com/FuelLabs/fuels-wallet/pull/1443) [`69c2765b`](https://github.com/FuelLabs/fuels-wallet/commit/69c2765b8bc85faa1934832144b2d76fb067e08a) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Create fuel providers on centralized way to support middleware to insert headers with basic auth

- [#1449](https://github.com/FuelLabs/fuels-wallet/pull/1449) [`875c38b6`](https://github.com/FuelLabs/fuels-wallet/commit/875c38b65080926bed0e06a3594865aef239fd0b) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - update to `fuel-core@0.34.0` , `forc@0.63.3` , `fuels@0.94.3`

- Updated dependencies [[`69c2765b`](https://github.com/FuelLabs/fuels-wallet/commit/69c2765b8bc85faa1934832144b2d76fb067e08a), [`875c38b6`](https://github.com/FuelLabs/fuels-wallet/commit/875c38b65080926bed0e06a3594865aef239fd0b)]:
  - @fuel-wallet/connections@0.27.2

## 0.27.1

### Patch Changes

- [#1440](https://github.com/FuelLabs/fuels-wallet/pull/1440) [`dc9b4525`](https://github.com/FuelLabs/fuels-wallet/commit/dc9b4525e4401b5eba7e0b31cd96e1247747a686) Thanks [@arthurgeron](https://github.com/arthurgeron)! - - New "Review Errors" option in Hamburger Menu when new errors are detected.

- [#1440](https://github.com/FuelLabs/fuels-wallet/pull/1440) [`dc9b4525`](https://github.com/FuelLabs/fuels-wallet/commit/dc9b4525e4401b5eba7e0b31cd96e1247747a686) Thanks [@arthurgeron](https://github.com/arthurgeron)! - - Removed Error Floating Button

- [#1437](https://github.com/FuelLabs/fuels-wallet/pull/1437) [`32a2d53a`](https://github.com/FuelLabs/fuels-wallet/commit/32a2d53ab10707e6bcc5943e2c21046ddbab4494) Thanks [@helciofranco](https://github.com/helciofranco)! - Fixes the signup flow by ensuring the default networks being offline no longer prevent users from completing wallet setup.

- [#1438](https://github.com/FuelLabs/fuels-wallet/pull/1438) [`d5c61dea`](https://github.com/FuelLabs/fuels-wallet/commit/d5c61dea3228ad8d2d0109b3a059abacc4e50bfa) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Fix text of error not breaking line on transaction screen

- Updated dependencies []:
  - @fuel-wallet/connections@0.27.1

## 0.27.0

### Minor Changes

- [#1420](https://github.com/FuelLabs/fuels-wallet/pull/1420) [`737652ba`](https://github.com/FuelLabs/fuels-wallet/commit/737652badce501292fad509ebadda751ea8792df) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Refactored Sentry implementation, error handling, and report logic

### Patch Changes

- [#1429](https://github.com/FuelLabs/fuels-wallet/pull/1429) [`3486bee0`](https://github.com/FuelLabs/fuels-wallet/commit/3486bee0cd249939833f00809dc27fe7260e3a1f) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Upgrade DB version to include testnet and devnet as initial networks in database

- [#1431](https://github.com/FuelLabs/fuels-wallet/pull/1431) [`c1d3dd6b`](https://github.com/FuelLabs/fuels-wallet/commit/c1d3dd6be885cc3b30a704150c89adc8a1c7e22a) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: run e2e test of Lock CRX isolated and remove from regular flow to increase its speed

- [#1429](https://github.com/FuelLabs/fuels-wallet/pull/1429) [`3486bee0`](https://github.com/FuelLabs/fuels-wallet/commit/3486bee0cd249939833f00809dc27fe7260e3a1f) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Include networks Testnet and Devnet by default in network list

- [#1420](https://github.com/FuelLabs/fuels-wallet/pull/1420) [`737652ba`](https://github.com/FuelLabs/fuels-wallet/commit/737652badce501292fad509ebadda751ea8792df) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Include "Error Review" screen allowing the user to review and report screens

- [#1429](https://github.com/FuelLabs/fuels-wallet/pull/1429) [`3486bee0`](https://github.com/FuelLabs/fuels-wallet/commit/3486bee0cd249939833f00809dc27fe7260e3a1f) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Improve flow of network URL to wait for click to "Test connection", instead of load automatically

- Updated dependencies [[`737652ba`](https://github.com/FuelLabs/fuels-wallet/commit/737652badce501292fad509ebadda751ea8792df)]:
  - @fuel-wallet/connections@0.27.0

## 0.26.0

### Minor Changes

- [#1427](https://github.com/FuelLabs/fuels-wallet/pull/1427) [`7ba78a86`](https://github.com/FuelLabs/fuels-wallet/commit/7ba78a867f9202c10faac204a00a8efd3360aaf0) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Update to fuel-core@0.33.0 and forc@0.63.1 and fuels@0.94.0

### Patch Changes

- [#1427](https://github.com/FuelLabs/fuels-wallet/pull/1427) [`7ba78a86`](https://github.com/FuelLabs/fuels-wallet/commit/7ba78a867f9202c10faac204a00a8efd3360aaf0) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Add 10% buffer on maxFee to sendTransaction, to avoid crashing on `getTxSummaryFromRequest` missing few units

- [#1427](https://github.com/FuelLabs/fuels-wallet/pull/1427) [`7ba78a86`](https://github.com/FuelLabs/fuels-wallet/commit/7ba78a867f9202c10faac204a00a8efd3360aaf0) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Added `web_accessible_resources` to manifest due to error in extension setup for playwright test

- Updated dependencies [[`7ba78a86`](https://github.com/FuelLabs/fuels-wallet/commit/7ba78a867f9202c10faac204a00a8efd3360aaf0)]:
  - @fuel-wallet/connections@0.26.0

## 0.25.0

### Minor Changes

- [#1277](https://github.com/FuelLabs/fuels-wallet/pull/1277) [`87cc8099`](https://github.com/FuelLabs/fuels-wallet/commit/87cc8099fcbd5d1f470c27848ecd1027d6e155dc) Thanks [@helciofranco](https://github.com/helciofranco)! - feat: add custom network fees, offering options like regular, fast and custom tip when approving a transaction through Dapps.

### Patch Changes

- [#1424](https://github.com/FuelLabs/fuels-wallet/pull/1424) [`abfad2e6`](https://github.com/FuelLabs/fuels-wallet/commit/abfad2e6f134795a62ffb68ef2f7ca7e1ca42ccb) Thanks [@arthurgeron](https://github.com/arthurgeron)! - - Audit check now ignores vulnerabilities with no known patched version
  - Test utils using act methods deprecated in React 18.3
- Updated dependencies []:
  - @fuel-wallet/connections@0.25.0

## 0.24.0

### Minor Changes

- [#1318](https://github.com/FuelLabs/fuels-wallet/pull/1318) [`a715ad6a`](https://github.com/FuelLabs/fuels-wallet/commit/a715ad6a9652e477cd7143493bd5ab3af63dbcfd) Thanks [@helciofranco](https://github.com/helciofranco)! - Add `Gas Limit` input to customize transaction fees when sending a transfer

- [#1405](https://github.com/FuelLabs/fuels-wallet/pull/1405) [`de7771b6`](https://github.com/FuelLabs/fuels-wallet/commit/de7771b6a3520f075bc87d5683e42a0502923400) Thanks [@rodrigobranas](https://github.com/rodrigobranas)! - Add new e2e tests for custom fees in "Send Screen"

### Patch Changes

- Updated dependencies [[`a715ad6a`](https://github.com/FuelLabs/fuels-wallet/commit/a715ad6a9652e477cd7143493bd5ab3af63dbcfd)]:
  - @fuel-wallet/connections@0.24.0

## 0.23.0

### Minor Changes

- [#1403](https://github.com/FuelLabs/fuels-wallet/pull/1403) [`d4f89b17`](https://github.com/FuelLabs/fuels-wallet/commit/d4f89b17b84dcf9f02251787c17048829b74ccdb) Thanks [@rodrigobranas](https://github.com/rodrigobranas)! - re-enabling faucet e2e tests

- [#1402](https://github.com/FuelLabs/fuels-wallet/pull/1402) [`b8b03704`](https://github.com/FuelLabs/fuels-wallet/commit/b8b03704e6ca093ab98831160ff195e50187f6b5) Thanks [@rodrigobranas](https://github.com/rodrigobranas)! - Converted the address from bech32 to b256 on faucet link

### Patch Changes

- [#1319](https://github.com/FuelLabs/fuels-wallet/pull/1319) [`e3bf65aa`](https://github.com/FuelLabs/fuels-wallet/commit/e3bf65aa5a070a0c2b5490d422b70e462090b25b) Thanks [@arthurgeron](https://github.com/arthurgeron)! - - Added aria labels to Recipient Sender and Asset Name on transaction approval screen;

  - Validate all asset names during e2e contract tests on the transaction approval screen

- [#1408](https://github.com/FuelLabs/fuels-wallet/pull/1408) [`24840bfe`](https://github.com/FuelLabs/fuels-wallet/commit/24840bfe38cda3a45b1dc43b4e4f8c8890b3ebaf) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - TransactionList breaking when have a failed transaction

- Updated dependencies []:
  - @fuel-wallet/connections@0.23.0

## 0.22.0

### Minor Changes

- [#1397](https://github.com/FuelLabs/fuels-wallet/pull/1397) [`3966aa92`](https://github.com/FuelLabs/fuels-wallet/commit/3966aa929608520869486043e633a32156d93c19) Thanks [@rodrigobranas](https://github.com/rodrigobranas)! - Improved error handling and including location informations to support better understanding about the causes of erros

- [#1385](https://github.com/FuelLabs/fuels-wallet/pull/1385) [`d49b9efe`](https://github.com/FuelLabs/fuels-wallet/commit/d49b9efe8b3133b67d748cc7a7dc3b0f506555f1) Thanks [@rodrigobranas](https://github.com/rodrigobranas)! - Support for Bech32 addresses has been removed and replaced with b256 (hex) addresses throughout the wallet screen components. All addresses, both existing and new, will now be displayed in the b256 format.

  While Bech32 addresses can still be used on the send screen, they will be automatically converted and processed as b256 internally. QR codes on the receive screen will now encode addresses in the b256 format.

### Patch Changes

- Updated dependencies []:
  - @fuel-wallet/connections@0.22.0

## 0.21.3

### Patch Changes

- [#1361](https://github.com/FuelLabs/fuels-wallet/pull/1361) [`d4e39790`](https://github.com/FuelLabs/fuels-wallet/commit/d4e397902e7bcc09e2b1c7a8f20087a538efbedf) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - update fuel-connectors to 0.5.0

- [#1361](https://github.com/FuelLabs/fuels-wallet/pull/1361) [`d4e39790`](https://github.com/FuelLabs/fuels-wallet/commit/d4e397902e7bcc09e2b1c7a8f20087a538efbedf) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - update fuels to get fix from contract operation

- Updated dependencies [[`d4e39790`](https://github.com/FuelLabs/fuels-wallet/commit/d4e397902e7bcc09e2b1c7a8f20087a538efbedf), [`d4e39790`](https://github.com/FuelLabs/fuels-wallet/commit/d4e397902e7bcc09e2b1c7a8f20087a538efbedf)]:
  - @fuel-wallet/connections@0.21.3

## 0.21.2

### Patch Changes

- [#1349](https://github.com/FuelLabs/fuels-wallet/pull/1349) [`adfd3523`](https://github.com/FuelLabs/fuels-wallet/commit/adfd3523a6415ce9bc1825308e584fe54ad0c333) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Update tests to use new @fuels/react 0.21.0

- Updated dependencies []:
  - @fuel-wallet/connections@0.21.2

## 0.21.1

### Patch Changes

- [#1340](https://github.com/FuelLabs/fuels-wallet/pull/1340) [`7c2ad248`](https://github.com/FuelLabs/fuels-wallet/commit/7c2ad248cf65060710e1b540b73f5f6c1cdb5c05) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Fix balances not showing for some accounts that have many assets in balance

- Updated dependencies []:
  - @fuel-wallet/connections@0.21.1

## 0.21.0

### Minor Changes

- [#1328](https://github.com/FuelLabs/fuels-wallet/pull/1328) [`6e5330e2`](https://github.com/FuelLabs/fuels-wallet/commit/6e5330e2067cb5f8831d7c6c04fac1421f61d717) Thanks [@helciofranco](https://github.com/helciofranco)! - Rename network to `Fuel Sepolia Testnet`

### Patch Changes

- [#1332](https://github.com/FuelLabs/fuels-wallet/pull/1332) [`39cf9dfe`](https://github.com/FuelLabs/fuels-wallet/commit/39cf9dfe5369da37178d935830c600638e130e0e) Thanks [@arthurgeron](https://github.com/arthurgeron)! - - If a connection can't be made to IndexedDB (usually when "Application Data" gets cleared), instead of resetting the extension it'll attempt a reload for good measure
  - IndexedDB + extension Reset only triggers if: An IndexedDB restart event is triggered, the DB can be accessed, and has no vaults or accounts data (corrupted or cleared)
  - The flag used to show the Welcome Screen after a reset no longer depends on React's Scope to be set
- Updated dependencies [[`6e5330e2`](https://github.com/FuelLabs/fuels-wallet/commit/6e5330e2067cb5f8831d7c6c04fac1421f61d717)]:
  - @fuel-wallet/connections@0.21.0

## 0.20.0

### Minor Changes

- [#1317](https://github.com/FuelLabs/fuels-wallet/pull/1317) [`f1dab207`](https://github.com/FuelLabs/fuels-wallet/commit/f1dab20703785086e81d39c3cef140c54956b29f) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Fixes bug where wrong Asset Id is shown for other tokens (e.g. ETH)
  Updated Fuels package to tag pr-2395
  Updated NPM Packs dependencies packages (e.g. @fuels/react, @fuels/ts-config) to new minor 0.20.0

### Patch Changes

- [#1313](https://github.com/FuelLabs/fuels-wallet/pull/1313) [`b5766321`](https://github.com/FuelLabs/fuels-wallet/commit/b5766321dbc2a5e5f17f05e0cb9a9f697f137a23) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Fix error not showing on Dapp Approve transaction

- [#1313](https://github.com/FuelLabs/fuels-wallet/pull/1313) [`b5766321`](https://github.com/FuelLabs/fuels-wallet/commit/b5766321dbc2a5e5f17f05e0cb9a9f697f137a23) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Re-add block explorer link to transaction header

- [#1279](https://github.com/FuelLabs/fuels-wallet/pull/1279) [`9ffddf70`](https://github.com/FuelLabs/fuels-wallet/commit/9ffddf70ad4a1ac51f97e03dabc0d96dc97721e0) Thanks [@arthurgeron](https://github.com/arthurgeron)! - vault crash on export seed auth fail

- [#1280](https://github.com/FuelLabs/fuels-wallet/pull/1280) [`6e94172c`](https://github.com/FuelLabs/fuels-wallet/commit/6e94172cb75ff1c4e0055047996ce8f8d36fa894) Thanks [@arthurgeron](https://github.com/arthurgeron)! - vault client not propagating lock unlock events from server

- [#1290](https://github.com/FuelLabs/fuels-wallet/pull/1290) [`57f87f84`](https://github.com/FuelLabs/fuels-wallet/commit/57f87f848d7893464f1af68043ff2391c43f5d70) Thanks [@arthurgeron](https://github.com/arthurgeron)! - - Re-enabled E2E contract tests
  - Fixed biome trying to validate files generated by playwright test runs
  - Fixed Playwright tests starting up before CRX files are available, now runs `build` beforehand.
  - Fixed CRX dev server reloading during playwright tests, causing instabilities
  - Fixed NODE_ENV being set to default (production) on local E2E tests, leading to the wrong version (i.e. production) being installed
  - Fixed bug where only the first test file in a suite run would use the local CRX build, it'd then download and use a production build of the Wallet for the rest
- Updated dependencies [[`f1dab207`](https://github.com/FuelLabs/fuels-wallet/commit/f1dab20703785086e81d39c3cef140c54956b29f)]:
  - @fuel-wallet/connections@0.20.0

## 0.19.0

### Minor Changes

- [#1310](https://github.com/FuelLabs/fuels-wallet/pull/1310) [`00df2708`](https://github.com/FuelLabs/fuels-wallet/commit/00df27083e42fc6633311faff1f665ccbab26747) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Auto-update network to testnet (Ignition)

### Patch Changes

- Updated dependencies []:
  - @fuel-wallet/connections@0.19.0

## 0.18.1

### Patch Changes

- [#1286](https://github.com/FuelLabs/fuels-wallet/pull/1286) [`a6e3d75a`](https://github.com/FuelLabs/fuels-wallet/commit/a6e3d75af2ab2ade059e99f65cef5317378019fa) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - chore: Auto-upgrade to devnet network

- Updated dependencies []:
  - @fuel-wallet/connections@0.18.1

## 0.18.0

### Minor Changes

- [#1240](https://github.com/FuelLabs/fuels-wallet/pull/1240) [`b4f52e09`](https://github.com/FuelLabs/fuels-wallet/commit/b4f52e09af0952600ddcdf818632d8328d8fac8f) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: update wallet to the latest fuel core (0.26.0)

- [#1240](https://github.com/FuelLabs/fuels-wallet/pull/1240) [`b4f52e09`](https://github.com/FuelLabs/fuels-wallet/commit/b4f52e09af0952600ddcdf818632d8328d8fac8f) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: add custom network fees, offering options like regular, fast and custom tip.

### Patch Changes

- Updated dependencies [[`b4f52e09`](https://github.com/FuelLabs/fuels-wallet/commit/b4f52e09af0952600ddcdf818632d8328d8fac8f)]:
  - @fuel-wallet/connections@0.18.0

## 0.17.0

### Minor Changes

- [#1273](https://github.com/FuelLabs/fuels-wallet/pull/1273) [`706aeb34`](https://github.com/FuelLabs/fuels-wallet/commit/706aeb3465572613893a444b6cc9db3e82440471) Thanks [@helciofranco](https://github.com/helciofranco)! - feat: remove reCAPTCHA dependencies

### Patch Changes

- [#1276](https://github.com/FuelLabs/fuels-wallet/pull/1276) [`a796df4f`](https://github.com/FuelLabs/fuels-wallet/commit/a796df4f5c76f69ebd5c22173d4b3513a44d7734) Thanks [@arthurgeron](https://github.com/arthurgeron)! - restore DB connection on close, removed interval

- Updated dependencies []:
  - @fuel-wallet/connections@0.17.0

## 0.16.6

### Patch Changes

- [#1270](https://github.com/FuelLabs/fuels-wallet/pull/1270) [`27520126`](https://github.com/FuelLabs/fuels-wallet/commit/27520126e252a28272d80b51f6eff879049149ae) Thanks [@arthurgeron](https://github.com/arthurgeron)! - fix: database not recovering from error/closed state

- Updated dependencies []:
  - @fuel-wallet/connections@0.16.6

## 0.16.5

### Patch Changes

- [#1255](https://github.com/FuelLabs/fuels-wallet/pull/1255) [`4b7d4bd3`](https://github.com/FuelLabs/fuels-wallet/commit/4b7d4bd398448259a8eeb21bf7268df92891ad39) Thanks [@luizstacio](https://github.com/luizstacio)! - fix: auto-update in background to wait for update to be downloaded

- Updated dependencies []:
  - @fuel-wallet/connections@0.16.5

## 0.16.4

### Patch Changes

- Updated dependencies [[`32ee2272`](https://github.com/FuelLabs/fuels-wallet/commit/32ee227254b1491a7ec8fc532f10517367f78013)]:
  - @fuel-wallet/connections@0.16.4

## 0.16.3

### Patch Changes

- [#1230](https://github.com/FuelLabs/fuels-wallet/pull/1230) [`21a7d80f`](https://github.com/FuelLabs/fuels-wallet/commit/21a7d80f5fdf13fdbced8931f9a74d1596572b57) Thanks [@arthurgeron](https://github.com/arthurgeron)! - fixes service worker services not restarting communication protocol when DB closes or blocks

- [#1195](https://github.com/FuelLabs/fuels-wallet/pull/1195) [`4fbc8e78`](https://github.com/FuelLabs/fuels-wallet/commit/4fbc8e78ad7609ca0cf5902e8ac05b858a430042) Thanks [@helciofranco](https://github.com/helciofranco)! - fix: disables auto-complete for more input fields (sending transactions, adding asset and changing password).

- [#1231](https://github.com/FuelLabs/fuels-wallet/pull/1231) [`0ff8cff1`](https://github.com/FuelLabs/fuels-wallet/commit/0ff8cff1bdf084e286a2c1516577663d725eaab8) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Fixed flaky playwright e2e tests

- [#1223](https://github.com/FuelLabs/fuels-wallet/pull/1223) [`5c0cdbf0`](https://github.com/FuelLabs/fuels-wallet/commit/5c0cdbf0df2d293e248107b9d9d0404b412db73f) Thanks [@arthurgeron](https://github.com/arthurgeron)! - fix: names labels not center justified

- [#1243](https://github.com/FuelLabs/fuels-wallet/pull/1243) [`06e2bf1a`](https://github.com/FuelLabs/fuels-wallet/commit/06e2bf1a3ca6f5b5780794dd4b6ce71a9648c186) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: add auto-update wallet in the background

- Updated dependencies [[`4fbc8e78`](https://github.com/FuelLabs/fuels-wallet/commit/4fbc8e78ad7609ca0cf5902e8ac05b858a430042)]:
  - @fuel-wallet/connections@0.16.3

## 0.16.2

### Patch Changes

- [#1113](https://github.com/FuelLabs/fuels-wallet/pull/1113) [`3c5d91d`](https://github.com/FuelLabs/fuels-wallet/commit/3c5d91d04262c492253fc3c06388a0d155e54861) Thanks [@helciofranco](https://github.com/helciofranco)! - chore: update ts-sdk and fuel-ui packages

- [#1198](https://github.com/FuelLabs/fuels-wallet/pull/1198) [`7fac95e`](https://github.com/FuelLabs/fuels-wallet/commit/7fac95e0417bfa675d62538e010541878ea55120) Thanks [@fuel-service-user](https://github.com/fuel-service-user)! - ci: update to tag latest

- [#1218](https://github.com/FuelLabs/fuels-wallet/pull/1218) [`616f091`](https://github.com/FuelLabs/fuels-wallet/commit/616f091c225420e04a3d96a1a80312e5578e48d7) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Fixes Approve Transaction screen staying in a partially loading state after approving a transaction

- [#1196](https://github.com/FuelLabs/fuels-wallet/pull/1196) [`1427f2b`](https://github.com/FuelLabs/fuels-wallet/commit/1427f2b615c25cc5b50182ee261ea1bef6b96702) Thanks [@helciofranco](https://github.com/helciofranco)! - fix: transaction id available on transaction approved page, it was taking the user to a broken page (undefined id).

- [#1170](https://github.com/FuelLabs/fuels-wallet/pull/1170) [`aa684b3`](https://github.com/FuelLabs/fuels-wallet/commit/aa684b3d965400f4c0c769840bb70559c9751ee6) Thanks [@fuel-service-user](https://github.com/fuel-service-user)! - ci: update to tag latest

- [#1217](https://github.com/FuelLabs/fuels-wallet/pull/1217) [`8f94aee`](https://github.com/FuelLabs/fuels-wallet/commit/8f94aee7b105fa426655689cb6c8761a09ac23ed) Thanks [@arthurgeron](https://github.com/arthurgeron)! - Prevent the Change Password dialog from allowing the new password to be the same as the current password #1203

- [#1137](https://github.com/FuelLabs/fuels-wallet/pull/1137) [`a0e5cbf`](https://github.com/FuelLabs/fuels-wallet/commit/a0e5cbfbcf5eed61f7a2e2c9871b7e02f0c281b2) Thanks [@helciofranco](https://github.com/helciofranco)! - ci: replace prettier and eslint with biomejs (dev)

- [#1197](https://github.com/FuelLabs/fuels-wallet/pull/1197) [`97a8a3c`](https://github.com/FuelLabs/fuels-wallet/commit/97a8a3c039f105ec41c8d53185e6729eecb38371) Thanks [@helciofranco](https://github.com/helciofranco)! - - Display the full app URL when it's big (instead of truncating it).

  - Sync the information displayed in the connected app `list` and `edit` screens.
  - Improve how the URL are displayed, focusing on the `hostname` mostly.
  - Display only the first two initials on the Avatar when the page has a long title (2+ words).

- [#1186](https://github.com/FuelLabs/fuels-wallet/pull/1186) [`45f6571`](https://github.com/FuelLabs/fuels-wallet/commit/45f6571760476f516061f03621a48c39516143d0) Thanks [@helciofranco](https://github.com/helciofranco)! - chore: replaces a warning icon (orange) with a info icon (gray) from the connection list screen.

- [#1210](https://github.com/FuelLabs/fuels-wallet/pull/1210) [`0fa1abc`](https://github.com/FuelLabs/fuels-wallet/commit/0fa1abc02712109879cdc27e2eca6fb877393399) Thanks [@fuel-service-user](https://github.com/fuel-service-user)! - ci: update to tag latest

- [#1141](https://github.com/FuelLabs/fuels-wallet/pull/1141) [`96faa7f`](https://github.com/FuelLabs/fuels-wallet/commit/96faa7f0f6d6d7fea6ab0b26495dc32f5a86b4b8) Thanks [@helciofranco](https://github.com/helciofranco)! - feat: bump SDK to latest version

- [#1188](https://github.com/FuelLabs/fuels-wallet/pull/1188) [`d51591e`](https://github.com/FuelLabs/fuels-wallet/commit/d51591e13a7b84703e7ba124c6ba9e01194f3755) Thanks [@helciofranco](https://github.com/helciofranco)! - Previously, `Wallet Manager` was failing to clear properly when `db.clear();` is called.

  This led to wrong account addresses generation, as updates to the `IndexedDB` didn't reflect in the Wallet Manager's internal state, particularly the `#vaults` property.

  To resolve this issue, I implemented a manual call to `removeVault` during logout.

  This ensures that each new wallet generated starts from scratch, free from interference by any previous mnemonic vault.

- [#1150](https://github.com/FuelLabs/fuels-wallet/pull/1150) [`c0d8def`](https://github.com/FuelLabs/fuels-wallet/commit/c0d8deff8a3241444baef5e6b3a01e02073fe7ae) Thanks [@helciofranco](https://github.com/helciofranco)! - ci: enable biomejs rules (as it was with eslint and prettier)

- [#1182](https://github.com/FuelLabs/fuels-wallet/pull/1182) [`ddb2440`](https://github.com/FuelLabs/fuels-wallet/commit/ddb2440258fb7ba115e139ee61ead9f3e5284352) Thanks [@helciofranco](https://github.com/helciofranco)! - fix: disable autocomplete from the private key input.

- Updated dependencies [[`3c5d91d`](https://github.com/FuelLabs/fuels-wallet/commit/3c5d91d04262c492253fc3c06388a0d155e54861), [`aa684b3`](https://github.com/FuelLabs/fuels-wallet/commit/aa684b3d965400f4c0c769840bb70559c9751ee6), [`a0e5cbf`](https://github.com/FuelLabs/fuels-wallet/commit/a0e5cbfbcf5eed61f7a2e2c9871b7e02f0c281b2), [`ec58815`](https://github.com/FuelLabs/fuels-wallet/commit/ec588156afaad39f41886d96ebfbb17653216482), [`0fa1abc`](https://github.com/FuelLabs/fuels-wallet/commit/0fa1abc02712109879cdc27e2eca6fb877393399), [`96faa7f`](https://github.com/FuelLabs/fuels-wallet/commit/96faa7f0f6d6d7fea6ab0b26495dc32f5a86b4b8), [`c0d8def`](https://github.com/FuelLabs/fuels-wallet/commit/c0d8deff8a3241444baef5e6b3a01e02073fe7ae)]:
  - @fuel-wallet/connections@0.16.2

## 0.16.1

### Patch Changes

- [#1123](https://github.com/FuelLabs/fuels-wallet/pull/1123) [`e18231a`](https://github.com/FuelLabs/fuels-wallet/commit/e18231abf779d11e468ecf57b5805bc646609bfe) Thanks [@bethatguyad](https://github.com/bethatguyad)! - perf: eliminating asset avatar flashing

- Updated dependencies []:
  - @fuel-wallet/connections@0.16.1
  - @fuel-wallet/sdk@0.16.1
  - @fuel-wallet/types@0.16.1

## 0.16.0

### Minor Changes

- [#1099](https://github.com/FuelLabs/fuels-wallet/pull/1099) [`82fba09`](https://github.com/FuelLabs/fuels-wallet/commit/82fba093fc298eebcbddb4b17703d3fa488279a5) Thanks [@helciofranco](https://github.com/helciofranco)! - Automatically identify seed phrase length and update the selected format to fit.

### Patch Changes

- [#1081](https://github.com/FuelLabs/fuels-wallet/pull/1081) [`15358f5`](https://github.com/FuelLabs/fuels-wallet/commit/15358f509596d823f201a2bfd3721d4e26fc52cc) Thanks [@matt-user](https://github.com/matt-user)! - Use the packages migrated to fuels npm packs

- [#1118](https://github.com/FuelLabs/fuels-wallet/pull/1118) [`6585923`](https://github.com/FuelLabs/fuels-wallet/commit/65859237475addf90cc60b1b75567a3692271c7e) Thanks [@helciofranco](https://github.com/helciofranco)! - truncates long account name correctly

- Updated dependencies []:
  - @fuel-wallet/connections@0.16.0
  - @fuel-wallet/sdk@0.16.0
  - @fuel-wallet/types@0.16.0

## 0.15.2

### Patch Changes

- [#1077](https://github.com/FuelLabs/fuels-wallet/pull/1077) [`0531ab8`](https://github.com/FuelLabs/fuels-wallet/commit/0531ab82009715db695628522958e9751bf3b134) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: add new explorer link for default network

- [#1074](https://github.com/FuelLabs/fuels-wallet/pull/1074) [`cbd64ae`](https://github.com/FuelLabs/fuels-wallet/commit/cbd64ae5b433ee7964e934a016765db5d7756196) Thanks [@matt-user](https://github.com/matt-user)! - Update the fuels dependency to 0.73.0

- Updated dependencies [[`cbd64ae`](https://github.com/FuelLabs/fuels-wallet/commit/cbd64ae5b433ee7964e934a016765db5d7756196)]:
  - @fuel-wallet/connections@0.15.2
  - @fuel-wallet/types@0.15.2
  - @fuel-wallet/sdk@0.15.2

## 0.15.1

### Patch Changes

- [#1062](https://github.com/FuelLabs/fuels-wallet/pull/1062) [`b81704c`](https://github.com/FuelLabs/fuels-wallet/commit/b81704c6b2175444c4b4a815a6b5cd7618fcb139) Thanks [@arboleya](https://github.com/arboleya)! - chore: update fuels-ts to rc/salamander

- [#1063](https://github.com/FuelLabs/fuels-wallet/pull/1063) [`bdfb2fa`](https://github.com/FuelLabs/fuels-wallet/commit/bdfb2fa6094e49372109170ea8c60cef2ad2b2fa) Thanks [@matt-user](https://github.com/matt-user)! - Add an error message for a failed simulated tx

- Updated dependencies [[`b81704c`](https://github.com/FuelLabs/fuels-wallet/commit/b81704c6b2175444c4b4a815a6b5cd7618fcb139)]:
  - @fuel-wallet/types@0.15.1
  - @fuel-wallet/sdk@0.15.1
  - @fuel-wallet/connections@0.15.1

## 0.15.0

### Minor Changes

- [#1032](https://github.com/FuelLabs/fuels-wallet/pull/1032) [`fdfa7d7`](https://github.com/FuelLabs/fuels-wallet/commit/fdfa7d7c74608071c41b1a36a44d42a49c13ee97) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: update sdk for the new connectors standard.

- [#1032](https://github.com/FuelLabs/fuels-wallet/pull/1032) [`fdfa7d7`](https://github.com/FuelLabs/fuels-wallet/commit/fdfa7d7c74608071c41b1a36a44d42a49c13ee97) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: remove fuel-ui from connectors ui and update to the new connectors api.

### Patch Changes

- Updated dependencies [[`fdfa7d7`](https://github.com/FuelLabs/fuels-wallet/commit/fdfa7d7c74608071c41b1a36a44d42a49c13ee97), [`fdfa7d7`](https://github.com/FuelLabs/fuels-wallet/commit/fdfa7d7c74608071c41b1a36a44d42a49c13ee97), [`fdfa7d7`](https://github.com/FuelLabs/fuels-wallet/commit/fdfa7d7c74608071c41b1a36a44d42a49c13ee97)]:
  - @fuel-wallet/sdk@0.15.0
  - @fuel-wallet/connections@0.15.0
  - @fuel-wallet/types@0.15.0

## 0.14.3

### Patch Changes

- [#1051](https://github.com/FuelLabs/fuels-wallet/pull/1051) [`f8b1af1`](https://github.com/FuelLabs/fuels-wallet/commit/f8b1af1ee15380e181fd052b7b0f685503ca7143) Thanks [@luizstacio](https://github.com/luizstacio)! - fix: avoid dynamic dom manipulation by translators

- [#1054](https://github.com/FuelLabs/fuels-wallet/pull/1054) [`3cc184d`](https://github.com/FuelLabs/fuels-wallet/commit/3cc184d338f91af3ea2e9b99365b453010886e5e) Thanks [@matt-user](https://github.com/matt-user)! - refactor fuel assets to use npm assets package

- [#1056](https://github.com/FuelLabs/fuels-wallet/pull/1056) [`5ddd586`](https://github.com/FuelLabs/fuels-wallet/commit/5ddd5863403c4169221dd6fa942b89f29f29c81d) Thanks [@luizstacio](https://github.com/luizstacio)! - fix: auto upgrade database

- Updated dependencies []:
  - @fuel-wallet/sdk@0.14.3
  - @fuel-wallet/types@0.14.3

## 0.14.2

### Patch Changes

- [#1045](https://github.com/FuelLabs/fuels-wallet/pull/1045) [`f5d512e`](https://github.com/FuelLabs/fuels-wallet/commit/f5d512ee50fa774465ffe335b074b9c556ee1121) Thanks [@matt-user](https://github.com/matt-user)! - Check supported network version when adding network

- [#1043](https://github.com/FuelLabs/fuels-wallet/pull/1043) [`1bf46d6`](https://github.com/FuelLabs/fuels-wallet/commit/1bf46d63ec2ffa3d571a1bc0350955ca2b54f645) Thanks [@matt-user](https://github.com/matt-user)! - Throw an error when asset name is undefined

- [#1048](https://github.com/FuelLabs/fuels-wallet/pull/1048) [`f010e4e`](https://github.com/FuelLabs/fuels-wallet/commit/f010e4ec21c32120cc464d27b31d3eb6b044754e) Thanks [@luizstacio](https://github.com/luizstacio)! - Update fuel-ui pacakge

- Updated dependencies []:
  - @fuel-wallet/sdk@0.14.2
  - @fuel-wallet/types@0.14.2

## 0.14.1

### Patch Changes

- [#1041](https://github.com/FuelLabs/fuels-wallet/pull/1041) [`4c222bf`](https://github.com/FuelLabs/fuels-wallet/commit/4c222bf16b4626a8ec11cc14bce6a19d8649cbd4) Thanks [@luizstacio](https://github.com/luizstacio)! - Update fuels to version 0.71.1

- Updated dependencies [[`4c222bf`](https://github.com/FuelLabs/fuels-wallet/commit/4c222bf16b4626a8ec11cc14bce6a19d8649cbd4)]:
  - @fuel-wallet/types@0.14.1
  - @fuel-wallet/sdk@0.14.1

## 0.14.0

### Minor Changes

- [#990](https://github.com/FuelLabs/fuels-wallet/pull/990) [`9458253`](https://github.com/FuelLabs/fuels-wallet/commit/94582534fb7303d88ef2523c54ae3d336ab693a8) Thanks [@luizstacio](https://github.com/luizstacio)! - Update wallet to beta-5

- [#996](https://github.com/FuelLabs/fuels-wallet/pull/996) [`91dc3b9`](https://github.com/FuelLabs/fuels-wallet/commit/91dc3b96b4dac04a832e1ae8fb55fda641fb6803) Thanks [@richardgreg](https://github.com/richardgreg)! - Changed the text for "Add from private key" to "Import from private key."

### Patch Changes

- [#1034](https://github.com/FuelLabs/fuels-wallet/pull/1034) [`020dc09`](https://github.com/FuelLabs/fuels-wallet/commit/020dc09150dbc67b3b8274365162edf29542082d) Thanks [@luizstacio](https://github.com/luizstacio)! - Clean assets from database when reseting wallet

- Updated dependencies [[`9458253`](https://github.com/FuelLabs/fuels-wallet/commit/94582534fb7303d88ef2523c54ae3d336ab693a8)]:
  - @fuel-wallet/types@0.14.0
  - @fuel-wallet/sdk@0.14.0

## 0.13.11

### Patch Changes

- [#997](https://github.com/FuelLabs/fuels-wallet/pull/997) [`85dab93`](https://github.com/FuelLabs/fuels-wallet/commit/85dab9376698bf65ab466647f7d933be64629427) Thanks [@matt-user](https://github.com/matt-user)! - Show all message info on sign message scree

- Updated dependencies []:
  - @fuel-wallet/sdk@0.13.11
  - @fuel-wallet/types@0.13.11

## 0.13.10

### Patch Changes

- [#978](https://github.com/FuelLabs/fuels-wallet/pull/978) [`1f34e67`](https://github.com/FuelLabs/fuels-wallet/commit/1f34e67b36ef94a8164f6cabfea143ac4d92f197) Thanks [@luizstacio](https://github.com/luizstacio)! - chore: fix icons on fuel wallet development attachment

- Updated dependencies [[`1f34e67`](https://github.com/FuelLabs/fuels-wallet/commit/1f34e67b36ef94a8164f6cabfea143ac4d92f197)]:
  - @fuel-wallet/sdk@0.13.10
  - @fuel-wallet/types@0.13.10

## 0.13.9

### Patch Changes

- [#976](https://github.com/FuelLabs/fuels-wallet/pull/976) [`217f04d`](https://github.com/FuelLabs/fuels-wallet/commit/217f04dc918c547b9922a7403a12f5fb4b59f74f) Thanks [@luizstacio](https://github.com/luizstacio)! - fix: attach development wallet on release tags

- Updated dependencies [[`217f04d`](https://github.com/FuelLabs/fuels-wallet/commit/217f04dc918c547b9922a7403a12f5fb4b59f74f)]:
  - @fuel-wallet/sdk@0.13.9
  - @fuel-wallet/types@0.13.9

## 0.13.8

### Patch Changes

- [#974](https://github.com/FuelLabs/fuels-wallet/pull/974) [`f24632a`](https://github.com/FuelLabs/fuels-wallet/commit/f24632aefe4496beb3da69df2d769b4fbdfe7c6f) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: update xstate-react to improve wallet render performance

- [#973](https://github.com/FuelLabs/fuels-wallet/pull/973) [`208b955`](https://github.com/FuelLabs/fuels-wallet/commit/208b95563a9bfb4cd6700ee6abc315d82f5fc3e5) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: update fuels sdk to version 0.67.0

- Updated dependencies [[`208b955`](https://github.com/FuelLabs/fuels-wallet/commit/208b95563a9bfb4cd6700ee6abc315d82f5fc3e5)]:
  - @fuel-wallet/types@0.13.8
  - @fuel-wallet/sdk@0.13.8

## 0.13.7

### Patch Changes

- Updated dependencies []:
  - @fuel-wallet/sdk@0.13.7
  - @fuel-wallet/types@0.13.7

## 0.13.6

### Patch Changes

- [#940](https://github.com/FuelLabs/fuels-wallet/pull/940) [`bb05d1d`](https://github.com/FuelLabs/fuels-wallet/commit/bb05d1daefbb50d371bc56b7c7fedc458169ae5a) Thanks [@matt-user](https://github.com/matt-user)! - fix: showing assets with amount 0

- Updated dependencies [[`c2baa3c`](https://github.com/FuelLabs/fuels-wallet/commit/c2baa3c5a4bc5212bce5275390dd71c111aa83c5)]:
  - @fuel-wallet/types@0.13.6
  - @fuel-wallet/sdk@0.13.6

## 0.13.5

### Patch Changes

- Updated dependencies []:
  - @fuel-wallet/sdk@0.13.5
  - @fuel-wallet/types@0.13.5

## 0.13.4

### Patch Changes

- [#939](https://github.com/FuelLabs/fuels-wallet/pull/939) [`9939298`](https://github.com/FuelLabs/fuels-wallet/commit/9939298ba935ef30f79e1f47405451cfa34ff4b6) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - fix: password input showing incorrect error feedback

- [#923](https://github.com/FuelLabs/fuels-wallet/pull/923) [`f683bae`](https://github.com/FuelLabs/fuels-wallet/commit/f683baeb6efbcc75561ac53c9c0d9d05f3bbae29) Thanks [@matt-user](https://github.com/matt-user)! - chore: bump fuels version

- [#939](https://github.com/FuelLabs/fuels-wallet/pull/939) [`9939298`](https://github.com/FuelLabs/fuels-wallet/commit/9939298ba935ef30f79e1f47405451cfa34ff4b6) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: upgrade fuel-core

- Updated dependencies [[`f683bae`](https://github.com/FuelLabs/fuels-wallet/commit/f683baeb6efbcc75561ac53c9c0d9d05f3bbae29)]:
  - @fuel-wallet/types@0.13.4
  - @fuel-wallet/sdk@0.13.4

## 0.13.3

### Patch Changes

- [#920](https://github.com/FuelLabs/fuels-wallet/pull/920) [`7286df2`](https://github.com/FuelLabs/fuels-wallet/commit/7286df278f27c9bcbddd5c91d39c9e8ed1c272c6) Thanks [@luizstacio](https://github.com/luizstacio)! - fix: add object-src for win7 compatibility.

- Updated dependencies [[`7ef4fac`](https://github.com/FuelLabs/fuels-wallet/commit/7ef4facf3e61c409ad5e7b794700f90c62cbf865)]:
  - @fuel-wallet/sdk@0.13.3
  - @fuel-wallet/types@0.13.3

## 0.13.2

### Patch Changes

- Updated dependencies []:
  - @fuel-wallet/sdk@0.13.2
  - @fuel-wallet/types@0.13.2

## 0.13.1

### Patch Changes

- [#889](https://github.com/FuelLabs/fuels-wallet/pull/889) [`1932a10`](https://github.com/FuelLabs/fuels-wallet/commit/1932a10daca83c7cbdec2d7d66bd398c63732a18) Thanks [@luizstacio](https://github.com/luizstacio)! - fix: transaction fee calculation

- [#900](https://github.com/FuelLabs/fuels-wallet/pull/900) [`f0e8060`](https://github.com/FuelLabs/fuels-wallet/commit/f0e806096da4aa9a7fff36accfb017e825634e60) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: remove asset select amount

- [#894](https://github.com/FuelLabs/fuels-wallet/pull/894) [`91d71f5`](https://github.com/FuelLabs/fuels-wallet/commit/91d71f581514f93bc5c5dc19425e5654f1dc7450) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: add decimal size for custom assets

- [#886](https://github.com/FuelLabs/fuels-wallet/pull/886) [`9e3c5f2`](https://github.com/FuelLabs/fuels-wallet/commit/9e3c5f2998a715de17d6c2e7e22cba52b8c2da1a) Thanks [@matt-user](https://github.com/matt-user)! - fix: mint transaction screen

- [#895](https://github.com/FuelLabs/fuels-wallet/pull/895) [`f4b07b7`](https://github.com/FuelLabs/fuels-wallet/commit/f4b07b7f67f162d283ac5d782680e4afa90f9bd5) Thanks [@luizstacio](https://github.com/luizstacio)! - fix: permissions popup background color

- Updated dependencies [[`09fa482`](https://github.com/FuelLabs/fuels-wallet/commit/09fa4824384d5fdd33df3a762462bab228fa13b5), [`91d71f5`](https://github.com/FuelLabs/fuels-wallet/commit/91d71f581514f93bc5c5dc19425e5654f1dc7450)]:
  - @fuel-wallet/types@0.13.1
  - @fuel-wallet/sdk@0.13.1

## 0.13.0

### Minor Changes

- [#866](https://github.com/FuelLabs/fuels-wallet/pull/866) [`86b72b9`](https://github.com/FuelLabs/fuels-wallet/commit/86b72b98fbe8441d6327f7283bf27b6603664821) Thanks [@luizstacio](https://github.com/luizstacio)! - Improve Fuel SDK detecction handler and add version method

- [#875](https://github.com/FuelLabs/fuels-wallet/pull/875) [`e446225`](https://github.com/FuelLabs/fuels-wallet/commit/e446225d39772b3615a923d01539559940f085f0) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: dispatch current account null when current account is not connected

- [#864](https://github.com/FuelLabs/fuels-wallet/pull/864) [`c6e3069`](https://github.com/FuelLabs/fuels-wallet/commit/c6e3069d633e25bbf52dc9ee9257c36d0bf6a9bb) Thanks [@luizstacio](https://github.com/luizstacio)! - Update fuels package to latest version

### Patch Changes

- [#877](https://github.com/FuelLabs/fuels-wallet/pull/877) [`b13f13a`](https://github.com/FuelLabs/fuels-wallet/commit/b13f13a4ee1db41610fcca1f4deed7a9e509ca54) Thanks [@luizstacio](https://github.com/luizstacio)! - Update to use @fuels/assets package for assets metadata.

- [#876](https://github.com/FuelLabs/fuels-wallet/pull/876) [`7696757`](https://github.com/FuelLabs/fuels-wallet/commit/76967574d628bc0f96fb8df56afd920440f24815) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: update fuels-ts sdk and move from provider sync to async.

- [#874](https://github.com/FuelLabs/fuels-wallet/pull/874) [`ca7d599`](https://github.com/FuelLabs/fuels-wallet/commit/ca7d599e89aed4f7522dd1322810598f38357e12) Thanks [@luizstacio](https://github.com/luizstacio)! - feat: add bech32 to hex feature on addresses

- Updated dependencies [[`2a0282e`](https://github.com/FuelLabs/fuels-wallet/commit/2a0282eff86def9a45a394320f15c5eeecc140f9), [`86b72b9`](https://github.com/FuelLabs/fuels-wallet/commit/86b72b98fbe8441d6327f7283bf27b6603664821), [`b13f13a`](https://github.com/FuelLabs/fuels-wallet/commit/b13f13a4ee1db41610fcca1f4deed7a9e509ca54), [`7696757`](https://github.com/FuelLabs/fuels-wallet/commit/76967574d628bc0f96fb8df56afd920440f24815), [`e446225`](https://github.com/FuelLabs/fuels-wallet/commit/e446225d39772b3615a923d01539559940f085f0), [`c6e3069`](https://github.com/FuelLabs/fuels-wallet/commit/c6e3069d633e25bbf52dc9ee9257c36d0bf6a9bb)]:
  - @fuel-wallet/sdk@0.13.0
  - @fuel-wallet/types@0.13.0

## 0.12.3

### Patch Changes

- [#853](https://github.com/FuelLabs/fuels-wallet/pull/853) [`1382e00`](https://github.com/FuelLabs/fuels-wallet/commit/1382e00a849ee1b8d013c16e6cd6db82b33b343e) Thanks [@luizstacio](https://github.com/luizstacio)! - Update CRX deps and permissions

- Updated dependencies [[`1382e00`](https://github.com/FuelLabs/fuels-wallet/commit/1382e00a849ee1b8d013c16e6cd6db82b33b343e)]:
  - @fuel-wallet/types@0.12.3
  - @fuel-wallet/sdk@0.12.3

## 0.12.2

### Patch Changes

- [#850](https://github.com/FuelLabs/fuels-wallet/pull/850) [`fd36e30`](https://github.com/FuelLabs/fuels-wallet/commit/fd36e30dc3ae410d5aebe3472ac20e6372582ac1) Thanks [@luizstacio](https://github.com/luizstacio)! - Update ToS location

- Updated dependencies []:
  - @fuel-wallet/sdk@0.12.2
  - @fuel-wallet/types@0.12.2

## 0.12.1

### Patch Changes

- [#842](https://github.com/FuelLabs/fuels-wallet/pull/842) [`9491f56`](https://github.com/FuelLabs/fuels-wallet/commit/9491f56dfb73c9e7941b4f5a0ea2aeb8016fe894) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - fix: improve alerts of "export seed" and "export private key" screens

- [#841](https://github.com/FuelLabs/fuels-wallet/pull/841) [`09258e1`](https://github.com/FuelLabs/fuels-wallet/commit/09258e19898865071f43eebcc07251c40f2a4d0e) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - fix: tx fee loader

- [#838](https://github.com/FuelLabs/fuels-wallet/pull/838) [`9c40a6e`](https://github.com/FuelLabs/fuels-wallet/commit/9c40a6e6d4e96ad81b0da8f72196baec980b346c) Thanks [@luizstacio](https://github.com/luizstacio)! - Add upgrade database to beta-4

- [#837](https://github.com/FuelLabs/fuels-wallet/pull/837) [`badd641`](https://github.com/FuelLabs/fuels-wallet/commit/badd6419880b0cf9b53afb36bca1b27c111b5614) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: update to fuels 0.53.0

- [#831](https://github.com/FuelLabs/fuels-wallet/pull/831) [`2b5c363`](https://github.com/FuelLabs/fuels-wallet/commit/2b5c36351a27c3d69e0babb8214104102848bb2e) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix sentry report errors

- [#827](https://github.com/FuelLabs/fuels-wallet/pull/827) [`7851c3e`](https://github.com/FuelLabs/fuels-wallet/commit/7851c3e42d1ba289d0854c8cbfce74b400a8d8b6) Thanks [@pedronauck](https://github.com/pedronauck)! - Add light and dark theme support

- [#844](https://github.com/FuelLabs/fuels-wallet/pull/844) [`6835a9d`](https://github.com/FuelLabs/fuels-wallet/commit/6835a9dddaef1f8be0450a69cb5966c8f0620564) Thanks [@luizstacio](https://github.com/luizstacio)! - Add open explorer on transaction screen

- [#845](https://github.com/FuelLabs/fuels-wallet/pull/845) [`c76cc43`](https://github.com/FuelLabs/fuels-wallet/commit/c76cc4318aa720fdcb22e93371f19d174cc602e6) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix buttons colors on receive page

- Updated dependencies [[`09258e1`](https://github.com/FuelLabs/fuels-wallet/commit/09258e19898865071f43eebcc07251c40f2a4d0e), [`badd641`](https://github.com/FuelLabs/fuels-wallet/commit/badd6419880b0cf9b53afb36bca1b27c111b5614), [`7851c3e`](https://github.com/FuelLabs/fuels-wallet/commit/7851c3e42d1ba289d0854c8cbfce74b400a8d8b6)]:
  - @fuel-wallet/sdk@0.12.1
  - @fuel-wallet/types@0.12.1

## 0.12.0

### Minor Changes

- [#833](https://github.com/FuelLabs/fuels-wallet/pull/833) [`41d306e`](https://github.com/FuelLabs/fuels-wallet/commit/41d306eb5fe33e60b9a69601fb166bb9b40a3358) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - fix: get maxGasPerTx from chainInfo

- [#834](https://github.com/FuelLabs/fuels-wallet/pull/834) [`2ded832`](https://github.com/FuelLabs/fuels-wallet/commit/2ded832b4930b1be847e56a1f2da1c085606da1b) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: upgrade to beta-4 (fuel-core 0.20.4)

### Patch Changes

- [#830](https://github.com/FuelLabs/fuels-wallet/pull/830) [`e206fc8`](https://github.com/FuelLabs/fuels-wallet/commit/e206fc8ec5c64e41284319d3fc343f54f194cb8a) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix scroll on assets page

- Updated dependencies [[`2ded832`](https://github.com/FuelLabs/fuels-wallet/commit/2ded832b4930b1be847e56a1f2da1c085606da1b)]:
  - @fuel-wallet/types@0.12.0
  - @fuel-wallet/sdk@0.12.0

## 0.11.2

### Patch Changes

- [#821](https://github.com/FuelLabs/fuels-wallet/pull/821) [`4e08bc0`](https://github.com/FuelLabs/fuels-wallet/commit/4e08bc0edd74210de03d9e5481180641bbcc8803) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Upgrade to fuel-core 0.19.1

- Updated dependencies [[`4e08bc0`](https://github.com/FuelLabs/fuels-wallet/commit/4e08bc0edd74210de03d9e5481180641bbcc8803)]:
  - @fuel-wallet/types@0.11.2
  - @fuel-wallet/sdk@0.11.2

## 0.11.1

### Patch Changes

- [#811](https://github.com/FuelLabs/fuels-wallet/pull/811) [`a674406`](https://github.com/FuelLabs/fuels-wallet/commit/a67440640db8840f4c199a0bba47f6e82d46829a) Thanks [@matt-user](https://github.com/matt-user)! - Add support for fuel-core 0.19.0

- Updated dependencies [[`a674406`](https://github.com/FuelLabs/fuels-wallet/commit/a67440640db8840f4c199a0bba47f6e82d46829a)]:
  - @fuel-wallet/types@0.11.1
  - @fuel-wallet/sdk@0.11.1

## 0.11.0

### Minor Changes

- [#801](https://github.com/FuelLabs/fuels-wallet/pull/801) [`992d5e7`](https://github.com/FuelLabs/fuels-wallet/commit/992d5e7591206c544c072c9ef72d045e2fc56915) Thanks [@eswarasai](https://github.com/eswarasai)! - Added support for user to connect multiple accounts, even if current account is connected

- [#793](https://github.com/FuelLabs/fuels-wallet/pull/793) [`7e7300f`](https://github.com/FuelLabs/fuels-wallet/commit/7e7300fb3a3e2b3170e100a12845e1e0856aaa56) Thanks [@eswarasai](https://github.com/eswarasai)! - Implemented `addNetwork()` method on Fuel SDK enabling developers to add network

### Patch Changes

- [#813](https://github.com/FuelLabs/fuels-wallet/pull/813) [`3910e87`](https://github.com/FuelLabs/fuels-wallet/commit/3910e878aecde237e2dfad8716b36a4c0ce8fc48) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix validation on Asset Screen to allow empty image url field

- [#802](https://github.com/FuelLabs/fuels-wallet/pull/802) [`3b42a3d`](https://github.com/FuelLabs/fuels-wallet/commit/3b42a3d80a4327618b85629d6da2d998748dcbfd) Thanks [@eswarasai](https://github.com/eswarasai)! - Fixed the broken copy transaction link in send transaction screen

- [#794](https://github.com/FuelLabs/fuels-wallet/pull/794) [`3122ccd`](https://github.com/FuelLabs/fuels-wallet/commit/3122ccd08fe5eb9411bc82c182ce7fda2d274fa7) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Don't allow connecting hidden accounts

- [#792](https://github.com/FuelLabs/fuels-wallet/pull/792) [`5b6b062`](https://github.com/FuelLabs/fuels-wallet/commit/5b6b062dd608900d9e089f40c15b70cd959b8901) Thanks [@luizstacio](https://github.com/luizstacio)! - Change dependencies from @fuel-ts/\* to fuels

- [#686](https://github.com/FuelLabs/fuels-wallet/pull/686) [`98c8184`](https://github.com/FuelLabs/fuels-wallet/commit/98c818480789ead39b498a9768f989a64ff8c583) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: add support to show called methods/params passed to contract calls inside Transaction Screen

- Updated dependencies [[`98c8184`](https://github.com/FuelLabs/fuels-wallet/commit/98c818480789ead39b498a9768f989a64ff8c583), [`e94d273`](https://github.com/FuelLabs/fuels-wallet/commit/e94d27341158991679108a1d53cdb7d4864e3dec), [`7e7300f`](https://github.com/FuelLabs/fuels-wallet/commit/7e7300fb3a3e2b3170e100a12845e1e0856aaa56), [`1cdb147`](https://github.com/FuelLabs/fuels-wallet/commit/1cdb1478b34ad331daf5d9a34f5904d1083c3531), [`144d722`](https://github.com/FuelLabs/fuels-wallet/commit/144d722fb70d13aaf8cfb17fe97aa0e1719fe65e), [`f79897d`](https://github.com/FuelLabs/fuels-wallet/commit/f79897df28b0d6e63aeedc3af45ea7ad838f1803), [`98c8184`](https://github.com/FuelLabs/fuels-wallet/commit/98c818480789ead39b498a9768f989a64ff8c583)]:
  - @fuel-wallet/sdk@0.11.0
  - @fuel-wallet/types@0.11.0

## 0.10.0

### Minor Changes

- [#625](https://github.com/FuelLabs/fuels-wallet/pull/625) [`993a197`](https://github.com/FuelLabs/fuels-wallet/commit/993a197fcbb0e198df2e54810c451f4b3bb4d7fe) Thanks [@pedronauck](https://github.com/pedronauck)! - Update Fuel branding on Wallet and address minor issues on UI and UX.

- [#784](https://github.com/FuelLabs/fuels-wallet/pull/784) [`3a3fdcc`](https://github.com/FuelLabs/fuels-wallet/commit/3a3fdcc263e0fee850bae29114d80241c4b5c3ac) Thanks [@eswarasai](https://github.com/eswarasai)! - Reset auto-lock timer on user interaction

### Patch Changes

- [#786](https://github.com/FuelLabs/fuels-wallet/pull/786) [`3b82e52`](https://github.com/FuelLabs/fuels-wallet/commit/3b82e526b7b732ef5dd07791ef59246f9725cf05) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix wallet home scroll

- Updated dependencies [[`c9cd111`](https://github.com/FuelLabs/fuels-wallet/commit/c9cd1110a26e56f9f7e1fbf3a0db0873cdd043d0)]:
  - @fuel-wallet/types@0.10.0
  - @fuel-wallet/sdk@0.10.0

## 0.9.5

### Patch Changes

- [#779](https://github.com/FuelLabs/fuels-wallet/pull/779) [`7a168af`](https://github.com/FuelLabs/fuels-wallet/commit/7a168af86ef8b60b398179f8498c1106535a2988) Thanks [@luizstacio](https://github.com/luizstacio)! - Upgrade vite version

- [#771](https://github.com/FuelLabs/fuels-wallet/pull/771) [`cc341cb`](https://github.com/FuelLabs/fuels-wallet/commit/cc341cbe3ef443cb161f01eceaff1c1f3aa184cd) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Add support to operation "Withdraw from Fuel", using MessageOut receipt

- Updated dependencies []:
  - @fuel-wallet/sdk@0.9.5
  - @fuel-wallet/types@0.9.5

## 0.9.4

### Patch Changes

- [#768](https://github.com/FuelLabs/fuels-wallet/pull/768) [`a8fecfa`](https://github.com/FuelLabs/fuels-wallet/commit/a8fecfa33435cac300791879538c7265b3c7c2e2) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - fix: add support to transfer from message input

- Updated dependencies [[`c475816`](https://github.com/FuelLabs/fuels-wallet/commit/c475816fc5feca629e2a0cdab668a397c833ce23)]:
  - @fuel-wallet/sdk@0.9.4
  - @fuel-wallet/types@0.9.4

## 0.9.3

### Patch Changes

- [#766](https://github.com/FuelLabs/fuels-wallet/pull/766) [`6e2accf`](https://github.com/FuelLabs/fuels-wallet/commit/6e2accfa97d84239161040d37fcfc4d5aaedaabc) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - chore: upgrade sdk to 0.43.0

- Updated dependencies [[`6e2accf`](https://github.com/FuelLabs/fuels-wallet/commit/6e2accfa97d84239161040d37fcfc4d5aaedaabc)]:
  - @fuel-wallet/types@0.9.3
  - @fuel-wallet/sdk@0.9.3

## 0.9.2

### Patch Changes

- Updated dependencies [[`bad48d1`](https://github.com/FuelLabs/fuels-wallet/commit/bad48d1b3036bca6ae28ddcc0f97cf921c6c0ab7)]:
  - @fuel-wallet/sdk@0.9.2
  - @fuel-wallet/types@0.9.2

## 0.9.1

### Patch Changes

- [#754](https://github.com/FuelLabs/fuels-wallet/pull/754) [`2431f14`](https://github.com/FuelLabs/fuels-wallet/commit/2431f14bde68510dd626206a34c542f1762e3ff4) Thanks [@sarahschwartz](https://github.com/sarahschwartz)! - Text on screens updated to be more concise and readable

- Updated dependencies []:
  - @fuel-wallet/sdk@0.9.1
  - @fuel-wallet/types@0.9.1

## 0.9.0

### Minor Changes

- [#749](https://github.com/FuelLabs/fuels-wallet/pull/749) [`bc0eb33`](https://github.com/FuelLabs/fuels-wallet/commit/bc0eb33046555e5d75eb4fbe08ef8bea9d0d28de) Thanks [@eswarasai](https://github.com/eswarasai)! - Fixed edit account not updating the account list

- [#741](https://github.com/FuelLabs/fuels-wallet/pull/741) [`3aa6d4c`](https://github.com/FuelLabs/fuels-wallet/commit/3aa6d4cbc3d61dc172db523a0cf988c1242de963) Thanks [@tomiiide](https://github.com/tomiiide)! - Auto generate names for new accounts

- [#740](https://github.com/FuelLabs/fuels-wallet/pull/740) [`a58a807`](https://github.com/FuelLabs/fuels-wallet/commit/a58a8072f61175f3f2b82188da7145f2988d644d) Thanks [@eswarasai](https://github.com/eswarasai)! - Updated the texts on the screens

- [#723](https://github.com/FuelLabs/fuels-wallet/pull/723) [`0f5fc2e`](https://github.com/FuelLabs/fuels-wallet/commit/0f5fc2efe1316743f1ab938200b02f7c7b05dd53) Thanks [@eswarasai](https://github.com/eswarasai)! - Modified network add user experience

- [#691](https://github.com/FuelLabs/fuels-wallet/pull/691) [`df19c24`](https://github.com/FuelLabs/fuels-wallet/commit/df19c24391c5e5fdedf90fdbb8786ebff96996f6) Thanks [@eswarasai](https://github.com/eswarasai)! - Improved change password UX and information structure.

### Patch Changes

- [#748](https://github.com/FuelLabs/fuels-wallet/pull/748) [`372dc88`](https://github.com/FuelLabs/fuels-wallet/commit/372dc8828ab0777cc5bed139cebe5ba39c5d3817) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: upgrade fuels

- Updated dependencies [[`372dc88`](https://github.com/FuelLabs/fuels-wallet/commit/372dc8828ab0777cc5bed139cebe5ba39c5d3817)]:
  - @fuel-wallet/types@0.9.0
  - @fuel-wallet/sdk@0.9.0

## 0.8.0

### Minor Changes

- [#733](https://github.com/FuelLabs/fuels-wallet/pull/733) [`147d01b`](https://github.com/FuelLabs/fuels-wallet/commit/147d01b1ff3b74bae9a9a7224c124d37baa1d64b) Thanks [@luizstacio](https://github.com/luizstacio)! - Update view recovery phrase flow.

- [#641](https://github.com/FuelLabs/fuels-wallet/pull/641) [`0c65d22`](https://github.com/FuelLabs/fuels-wallet/commit/0c65d22bab404a5bffb399b5ea4dabe6b1f91022) Thanks [@eswarasai](https://github.com/eswarasai)! - Add account name on home and tx preview

- [#734](https://github.com/FuelLabs/fuels-wallet/pull/734) [`6ba23b4`](https://github.com/FuelLabs/fuels-wallet/commit/6ba23b4261f949e326f3874acb1e68cb0571a145) Thanks [@luizstacio](https://github.com/luizstacio)! - Hide faucet button for other networks

- [#722](https://github.com/FuelLabs/fuels-wallet/pull/722) [`5eab64a`](https://github.com/FuelLabs/fuels-wallet/commit/5eab64af791dd6da237da7c97c4a35a13a4be6b4) Thanks [@eswarasai](https://github.com/eswarasai)! - Modified network url validation rules

- [#596](https://github.com/FuelLabs/fuels-wallet/pull/596) [`cccda5f`](https://github.com/FuelLabs/fuels-wallet/commit/cccda5f74fd3f9c8672ccbc3a1659fa69a66d48e) Thanks [@tomiiide](https://github.com/tomiiide)! - Create terms of use page

- [#674](https://github.com/FuelLabs/fuels-wallet/pull/674) [`8b60303`](https://github.com/FuelLabs/fuels-wallet/commit/8b60303cf5a730af4ed93e29126465028afae123) Thanks [@eswarasai](https://github.com/eswarasai)! - Add hide account feature

### Patch Changes

- [#738](https://github.com/FuelLabs/fuels-wallet/pull/738) [`87fa40d`](https://github.com/FuelLabs/fuels-wallet/commit/87fa40d7b1a8e88815fc7bb9e5df501595e5f6cf) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix transaction preview for transactions to the same address.

- [#739](https://github.com/FuelLabs/fuels-wallet/pull/739) [`6fba5f9`](https://github.com/FuelLabs/fuels-wallet/commit/6fba5f9e93653f2b7244f1ef6428f612fd1a91fa) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix Wallet auto locker.

- [#735](https://github.com/FuelLabs/fuels-wallet/pull/735) [`b0f980e`](https://github.com/FuelLabs/fuels-wallet/commit/b0f980e07181acc45d9834d11f6e1cddd0d9978b) Thanks [@luizstacio](https://github.com/luizstacio)! - Improve error handling when importing a privateKey that already exists

- [#692](https://github.com/FuelLabs/fuels-wallet/pull/692) [`cb9340c`](https://github.com/FuelLabs/fuels-wallet/commit/cb9340cfa919647d47362aa6eda69764db7b65bd) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat(infra): improve dev linking with local deps (fuel-ui and fuel-ts)

- [#678](https://github.com/FuelLabs/fuels-wallet/pull/678) [`dbda3f6`](https://github.com/FuelLabs/fuels-wallet/commit/dbda3f64295f70fdedd3ad4a6a1f53076d3205e0) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix typo

- [#697](https://github.com/FuelLabs/fuels-wallet/pull/697) [`6953201`](https://github.com/FuelLabs/fuels-wallet/commit/6953201d0ae1fb2f506ea33707641ee6950d8097) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - fix: vite config

- [#726](https://github.com/FuelLabs/fuels-wallet/pull/726) [`c8b2163`](https://github.com/FuelLabs/fuels-wallet/commit/c8b2163371b2b7f53fb2046d74f2ab4005335750) Thanks [@matt-user](https://github.com/matt-user)! - fix: broadcast connection deletions

- [#737](https://github.com/FuelLabs/fuels-wallet/pull/737) [`d9b8c61`](https://github.com/FuelLabs/fuels-wallet/commit/d9b8c61bcab10cd51cd80c0c02e5a048ba8026a6) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix transfer of other tokens

- Updated dependencies []:
  - @fuel-wallet/sdk@0.8.0
  - @fuel-wallet/types@0.8.0

## 0.7.2

### Patch Changes

- [#666](https://github.com/FuelLabs/fuels-wallet/pull/666) [`a48fb2b`](https://github.com/FuelLabs/fuels-wallet/commit/a48fb2b86e97e4b2176e5adfee2fa9ff8e629eeb) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix preview tx view

- Updated dependencies [[`a48fb2b`](https://github.com/FuelLabs/fuels-wallet/commit/a48fb2b86e97e4b2176e5adfee2fa9ff8e629eeb)]:
  - @fuel-wallet/sdk@0.7.2
  - @fuel-wallet/types@0.7.2

## 0.7.1

### Patch Changes

- [#616](https://github.com/FuelLabs/fuels-wallet/pull/616) [`8419f7d`](https://github.com/FuelLabs/fuels-wallet/commit/8419f7ddd8faf8a793012cbe93b88ff4b3c1d554) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - import account from mnemonic with 12, 15, 18, 21, 24 words

- [#600](https://github.com/FuelLabs/fuels-wallet/pull/600) [`eb41aed`](https://github.com/FuelLabs/fuels-wallet/commit/eb41aed79bb0e3636d1b23e85c3269763dcc09d7) Thanks [@matt-user](https://github.com/matt-user)! - Update network compatibility to fuel-core v0.17.3

- Updated dependencies [[`8419f7d`](https://github.com/FuelLabs/fuels-wallet/commit/8419f7ddd8faf8a793012cbe93b88ff4b3c1d554), [`eb41aed`](https://github.com/FuelLabs/fuels-wallet/commit/eb41aed79bb0e3636d1b23e85c3269763dcc09d7)]:
  - @fuel-wallet/types@0.7.1
  - @fuel-wallet/sdk@0.7.1

## 0.7.0

### Patch Changes

- [#593](https://github.com/FuelLabs/fuels-wallet/pull/593) [`f4bd2d5`](https://github.com/FuelLabs/fuels-wallet/commit/f4bd2d563b457de221de46b14cb0cae2ccbe9feb) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: AddAssetRequest screen now support adding multiple assets

- [#602](https://github.com/FuelLabs/fuels-wallet/pull/602) [`4b6952c`](https://github.com/FuelLabs/fuels-wallet/commit/4b6952c1906076226346009b868386ee68b854c4) Thanks [@luizstacio](https://github.com/luizstacio)! - Update Wallet Created screen to show pin your Wallet instructions.

- [#592](https://github.com/FuelLabs/fuels-wallet/pull/592) [`035088c`](https://github.com/FuelLabs/fuels-wallet/commit/035088c6275da7a35481c06042f55f995d6ce902) Thanks [@luizstacio](https://github.com/luizstacio)! - Start versioning Wallet

- Updated dependencies [[`f4bd2d5`](https://github.com/FuelLabs/fuels-wallet/commit/f4bd2d563b457de221de46b14cb0cae2ccbe9feb), [`ac3e822`](https://github.com/FuelLabs/fuels-wallet/commit/ac3e822ec0900e73602b760656f097cdd46e90df), [`83ccac3`](https://github.com/FuelLabs/fuels-wallet/commit/83ccac333d36b8a286832cdc0f6576b8f088965d)]:
  - @fuel-wallet/sdk@0.7.0
  - @fuel-wallet/types@0.7.0

## 0.7.0

### Patch Changes

- [#593](https://github.com/FuelLabs/fuels-wallet/pull/593) [`f4bd2d5`](https://github.com/FuelLabs/fuels-wallet/commit/f4bd2d563b457de221de46b14cb0cae2ccbe9feb) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - feat: AddAssetRequest screen now support adding multiple assets

- [#602](https://github.com/FuelLabs/fuels-wallet/pull/602) [`4b6952c`](https://github.com/FuelLabs/fuels-wallet/commit/4b6952c1906076226346009b868386ee68b854c4) Thanks [@luizstacio](https://github.com/luizstacio)! - Update Wallet Created screen to show pin your Wallet instructions.

- [#592](https://github.com/FuelLabs/fuels-wallet/pull/592) [`035088c`](https://github.com/FuelLabs/fuels-wallet/commit/035088c6275da7a35481c06042f55f995d6ce902) Thanks [@luizstacio](https://github.com/luizstacio)! - Start versioning Wallet

- Updated dependencies [[`f4bd2d5`](https://github.com/FuelLabs/fuels-wallet/commit/f4bd2d563b457de221de46b14cb0cae2ccbe9feb), [`ac3e822`](https://github.com/FuelLabs/fuels-wallet/commit/ac3e822ec0900e73602b760656f097cdd46e90df), [`83ccac3`](https://github.com/FuelLabs/fuels-wallet/commit/83ccac333d36b8a286832cdc0f6576b8f088965d)]:
  - @fuel-wallet/sdk@0.7.0
  - @fuel-wallet/types@0.7.0
