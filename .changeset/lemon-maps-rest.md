---
"@fuel-wallet/connections": patch
"fuels-wallet": patch
---

Sped up gas calculation in SendMachine and TxRequestMachine by merging calculations of default tip and gas limit into a single parallelized promise.
