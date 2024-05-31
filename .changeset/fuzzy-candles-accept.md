---
"fuels-wallet": patch
---

- If a connection can't be made to IndexedDB (usually when "Application Data" gets cleared), instead of resetting the extension it'll attempt a reload for good measure
- IndexedDB + extension Reset only triggers if: An IndexedDB restart event is triggered, the DB can be accessed, and has no vaults or accounts data (corrupted or cleared)
- The flag used to show the Welcome Screen after a reset no longer depends on React's Scope to be set
