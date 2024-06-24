---
"fuels-wallet": minor
---

Support for Bech32 addresses has been removed and replaced with b256 (hex) addresses throughout the wallet screen components. All addresses, both existing and new, will now be displayed in the b256 format.

While Bech32 addresses can still be used on the send screen, they will be automatically converted and processed as b256 internally. QR codes on the receive screen will now encode addresses in the b256 format.