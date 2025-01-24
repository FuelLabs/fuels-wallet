---
"@fuel-wallet/connections": patch
"fuels-wallet": patch
---

Sped up gas calculation in SendMachine and TxRequestMachine by using already present information on account/balance from AccountMachine instead of re-fetching
