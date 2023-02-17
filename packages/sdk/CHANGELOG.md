# @fuel-wallet/sdk

## 0.6.0

### Minor Changes

- [#558](https://github.com/FuelLabs/fuels-wallet/pull/558) [`6dc4878`](https://github.com/FuelLabs/fuels-wallet/commit/6dc4878381c8790924c082bccecd3eccf5f2b0fc) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Added asset List Screen
  Added shortcut in Home Balances to add unknows assets
  Added DAPP page to "Add Custom Asset"
  Added fuel.assets()
  Added fuel.on('assets')

### Patch Changes

- [#545](https://github.com/FuelLabs/fuels-wallet/pull/545) [`dd6dbf3`](https://github.com/FuelLabs/fuels-wallet/commit/dd6dbf3b6b1ccb3f166af4125f077c8b8dacb04b) Thanks [@luizstacio](https://github.com/luizstacio)! - Keep Wallet service worker available, and reconnect once is available back.

- [#538](https://github.com/FuelLabs/fuels-wallet/pull/538) [`0034754`](https://github.com/FuelLabs/fuels-wallet/commit/0034754162b72ad4db0f6273a97af8ead7932707) Thanks [@luizstacio](https://github.com/luizstacio)! - Update ready event to use session id

- [#555](https://github.com/FuelLabs/fuels-wallet/pull/555) [`28e9745`](https://github.com/FuelLabs/fuels-wallet/commit/28e9745f37a9cacec7c1e2c5be7314145a49b700) Thanks [@luizstacio](https://github.com/luizstacio)! - Update fules-ts dependencies

- [#564](https://github.com/FuelLabs/fuels-wallet/pull/564) [`06b572b`](https://github.com/FuelLabs/fuels-wallet/commit/06b572b8458ab31615971c7a34fe6b5221ce1bec) Thanks [@luizstacio](https://github.com/luizstacio)! - Increase max listeners

- [#526](https://github.com/FuelLabs/fuels-wallet/pull/526) [`fb79886`](https://github.com/FuelLabs/fuels-wallet/commit/fb7988682d190a6578377e7f67baa2ff5994e2fb) Thanks [@tomiiide](https://github.com/tomiiide)! - Add enum to sdk event types

- [#528](https://github.com/FuelLabs/fuels-wallet/pull/528) [`7fb7396`](https://github.com/FuelLabs/fuels-wallet/commit/7fb739659ef829145063cb111da9abcd5ef00ff6) Thanks [@luizstacio](https://github.com/luizstacio)! - Stop reconnecting if context is invalid

- [#551](https://github.com/FuelLabs/fuels-wallet/pull/551) [`153f1db`](https://github.com/FuelLabs/fuels-wallet/commit/153f1dbf91b84e7932b31e5ec75ab48d890ca393) Thanks [@luizstacio](https://github.com/luizstacio)! - Move events enum to fuel object

- [#541](https://github.com/FuelLabs/fuels-wallet/pull/541) [`e587387`](https://github.com/FuelLabs/fuels-wallet/commit/e5873875db94e34d7fe36ea60eac0ea33f8346d0) Thanks [@luizstacio](https://github.com/luizstacio)! - Improve fuel detection by adding a new event on document `FuelLoaded` once the fuel is injected

## 0.5.1

### Patch Changes

- [#536](https://github.com/FuelLabs/fuels-wallet/pull/536) [`1530c42`](https://github.com/FuelLabs/fuels-wallet/commit/1530c42db7ef9f76a7449b73ed01363722c0e579) Thanks [@luizstacio](https://github.com/luizstacio)! - Export FuelWalletLocked on package sdk

## 0.5.0

### Minor Changes

- [#517](https://github.com/FuelLabs/fuels-wallet/pull/517) [`eac034e`](https://github.com/FuelLabs/fuels-wallet/commit/eac034e53a9107e798de0006f77245413c87dce8) Thanks [@luizstacio](https://github.com/luizstacio)! - Add signer address on window.fuel.sendTransaction

- [#473](https://github.com/FuelLabs/fuels-wallet/pull/473) [`503430b`](https://github.com/FuelLabs/fuels-wallet/commit/503430b8b1512b970efa8d39762118f6ece4ab40) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - introduce `currentAccount` function/event
  rename `selectedAccount` to `currentAccount` across app

- [#525](https://github.com/FuelLabs/fuels-wallet/pull/525) [`c2a82f8`](https://github.com/FuelLabs/fuels-wallet/commit/c2a82f898dea5b0ea5674a7a6a1474573cedb62d) Thanks [@luizstacio](https://github.com/luizstacio)! - Add FuelWalletLocked on the fuel instance and fix issue with detect siner

## 0.4.0

### Minor Changes

- [#446](https://github.com/FuelLabs/fuels-wallet/pull/446) [`de4ee29`](https://github.com/FuelLabs/fuels-wallet/commit/de4ee29b0a19e0cd6b45e0445801043cc6e38a8f) Thanks [@luizstacio](https://github.com/luizstacio)! - Update docs and description

### Patch Changes

- [#440](https://github.com/FuelLabs/fuels-wallet/pull/440) [`d626c72`](https://github.com/FuelLabs/fuels-wallet/commit/d626c723af7449e4298cacc66b71b095cce24f82) Thanks [@luizstacio](https://github.com/luizstacio)! - Add utils to create address on fuel sdk

- [#449](https://github.com/FuelLabs/fuels-wallet/pull/449) [`c59d9d7`](https://github.com/FuelLabs/fuels-wallet/commit/c59d9d700e45f6c27eed3842c6968bd87210e39e) Thanks [@luizstacio](https://github.com/luizstacio)! - Fix InsufficientInputAmount error due to lake of utxos

- [#399](https://github.com/FuelLabs/fuels-wallet/pull/399) [`f7c690f`](https://github.com/FuelLabs/fuels-wallet/commit/f7c690f299e9c6c6bbcac448760996ba6b116c96) Thanks [@pedronauck](https://github.com/pedronauck)! - Chore(sdk): small adjustments to adapt to connection service

## 0.3.0

### Minor Changes

- [#413](https://github.com/FuelLabs/fuels-wallet/pull/413) [`0631e75`](https://github.com/FuelLabs/fuels-wallet/commit/0631e751d3324cfa76a564b628e300b39d4cfe4c) Thanks [@luizstacio](https://github.com/luizstacio)! - Add method isConnected to SDK

- [#390](https://github.com/FuelLabs/fuels-wallet/pull/390) [`d791507`](https://github.com/FuelLabs/fuels-wallet/commit/d79150729829f6083f3143bdc035ee95596d3440) Thanks [@luizstacio](https://github.com/luizstacio)! - Rename FuelWeb3 object window to fuel

- [#424](https://github.com/FuelLabs/fuels-wallet/pull/424) [`4adcfe9`](https://github.com/FuelLabs/fuels-wallet/commit/4adcfe9f6024eba8f47068a0484aad22b7998008) Thanks [@luizstacio](https://github.com/luizstacio)! - Sync provider url with wallet provider url

### Patch Changes

- [#376](https://github.com/FuelLabs/fuels-wallet/pull/376) [`75b8951`](https://github.com/FuelLabs/fuels-wallet/commit/75b8951b01e45e8d61d307c5432f03e2e91906e4) Thanks [@pedronauck](https://github.com/pedronauck)! - Fix(sdk): ts and eslint warnings after update deps

- [#373](https://github.com/FuelLabs/fuels-wallet/pull/373) [`f9b56e6`](https://github.com/FuelLabs/fuels-wallet/commit/f9b56e6d8479454cc64820524659d439a147f4b6) Thanks [@matt-user](https://github.com/matt-user)! - Update fuels to version 0.27.0

## 0.2.0

### Minor Changes

- [#368](https://github.com/FuelLabs/fuels-wallet/pull/368) [`c58e230`](https://github.com/FuelLabs/fuels-wallet/commit/c58e2300bea26d4668a08dc066d7e0426d2a8d39) Thanks [@luizstacio](https://github.com/luizstacio)! - Add support for using Fuel Wallet SDK to import types

### Patch Changes

- [#354](https://github.com/FuelLabs/fuels-wallet/pull/354) [`1c71f72`](https://github.com/FuelLabs/fuels-wallet/commit/1c71f7292e352c415d4ccf79875c47fd0ababa7b) Thanks [@luizstacio](https://github.com/luizstacio)! - Update fuels version

- [#309](https://github.com/FuelLabs/fuels-wallet/pull/309) [`d981aae`](https://github.com/FuelLabs/fuels-wallet/commit/d981aae794e8a4ae18bac2fe66a3ba44293f10af) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - chore: allow option providerUrl in getBlockExplorer function

- [#360](https://github.com/FuelLabs/fuels-wallet/pull/360) [`cff9191`](https://github.com/FuelLabs/fuels-wallet/commit/cff9191acc912ec28b138ccb5aecf110f4f5e386) Thanks [@luizstacio](https://github.com/luizstacio)! - Update fuels deps

- [#274](https://github.com/FuelLabs/fuels-wallet/pull/274) [`2ef58d9`](https://github.com/FuelLabs/fuels-wallet/commit/2ef58d9ca3d9a32258343f186b3b59c8403d6190) Thanks [@LuizAsFight](https://github.com/LuizAsFight)! - Upgrade to TS SDK 0.22.2

- [#338](https://github.com/FuelLabs/fuels-wallet/pull/338) [`34700d6`](https://github.com/FuelLabs/fuels-wallet/commit/34700d666fcb95f6bcb4ccc499401cc9d0a27b44) Thanks [@luizstacio](https://github.com/luizstacio)! - Update fuels version

## 0.1.0

### Minor Changes

- [#185](https://github.com/FuelLabs/fuels-wallet/pull/185) [`987bbb0`](https://github.com/FuelLabs/fuels-wallet/commit/987bbb0ff12e6e4aad14d943d8120aa2c98332ca) Thanks [@pedronauck](https://github.com/pedronauck)! - Feat: initial package release for all packages

- [#195](https://github.com/FuelLabs/fuels-wallet/pull/195) [`3bba661`](https://github.com/FuelLabs/fuels-wallet/commit/3bba661ba5dc97933bb1a2e7605e30bd280ec780) Thanks [@luizstacio](https://github.com/luizstacio)! - Include Request Transaction in SDK methods

- [#195](https://github.com/FuelLabs/fuels-wallet/pull/195) [`3bba661`](https://github.com/FuelLabs/fuels-wallet/commit/3bba661ba5dc97933bb1a2e7605e30bd280ec780) Thanks [@luizstacio](https://github.com/luizstacio)! - Add FuelWeb3Provider, for using it in combination with fuels-ts SDK

## 0.1.0

### Minor Changes

- [#185](https://github.com/FuelLabs/fuels-wallet/pull/185) [`987bbb0`](https://github.com/FuelLabs/fuels-wallet/commit/987bbb0ff12e6e4aad14d943d8120aa2c98332ca) Thanks [@pedronauck](https://github.com/pedronauck)! - Feat: initial package release for all packages

- [#195](https://github.com/FuelLabs/fuels-wallet/pull/195) [`3bba661`](https://github.com/FuelLabs/fuels-wallet/commit/3bba661ba5dc97933bb1a2e7605e30bd280ec780) Thanks [@luizstacio](https://github.com/luizstacio)! - Include Request Transaction in SDK methods

- [#195](https://github.com/FuelLabs/fuels-wallet/pull/195) [`3bba661`](https://github.com/FuelLabs/fuels-wallet/commit/3bba661ba5dc97933bb1a2e7605e30bd280ec780) Thanks [@luizstacio](https://github.com/luizstacio)! - Add FuelWeb3Provider, for using it in combination with fuels-ts SDK
