---
"fuels-wallet": patch
---

Add 10% buffer on maxFee to sendTransaction, to avoid crashing on `getTxSummaryFromRequest` missing few units
