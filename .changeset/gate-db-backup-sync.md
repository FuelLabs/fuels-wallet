---
"fuels-wallet": patch
---

perf: Write wallet backups to chrome.storage and OPFS only when their content changed, with one chrome.storage write per table.
