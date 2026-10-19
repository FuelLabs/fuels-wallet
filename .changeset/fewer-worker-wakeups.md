---
"fuels-wallet": patch
---

perf: Wake the background service worker less often by checking updates hourly, scheduling auto-lock at its deadline, and restoring the session only when the wallet is opened
