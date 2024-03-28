---
"fuels-wallet": patch
---

Previously, `Wallet Manager` was failing to clear properly when `db.clear();` is called.

This led to wrong account addresses generation, as updates to the `IndexedDB` didn't reflect in the Wallet Manager's internal state, particularly the `#vaults` property.

To resolve this issue, I implemented a manual call to `removeVault` during logout. 

This ensures that each new wallet generated starts from scratch, free from interference by any previous mnemonic vault.