#!/bin/bash

# User should define here the Dependencies to link locally
# we support linking "@fuel-ui" and "@fuels-ts". 
LINK_FUEL_UI=true
LINK_FUEL_TS=true


# Figure out dependencies to link
deps=""
if [ "$LINK_FUEL_TS" = true ] ; then
    # fuel_ts_deps="fuels @fuel-ts/mnemonic @fuel-ts/providers @fuel-ts/wallet @fuel-ts/wallet-manager"
    fuel_ts_deps="fuels @fuel-ts/abi-coder @fuel-ts/abi-typegen @fuel-ts/address @fuel-ts/constants @fuel-ts/contract @fuel-ts/hasher @fuel-ts/hdwallet @fuel-ts/interfaces @fuel-ts/keystore @fuel-ts/math @fuel-ts/merkle-shared @fuel-ts/merklesum @fuel-ts/mnemonic @fuel-ts/predicate @fuel-ts/providers @fuel-ts/script @fuel-ts/signer @fuel-ts/sparsemerkle @fuel-ts/transactions @fuel-ts/versions @fuel-ts/wallet @fuel-ts/wallet-manager @fuel-ts/wordlists"
    deps="$deps $fuel_ts_deps"
fi

if [ "$LINK_FUEL_UI" = true ] ; then
    fuel_ui_deps="@fuel-ui/react @fuel-ui/css @fuel-ui/config @fuel-ui/test-utils"
    deps="$deps $fuel_ui_deps"
fi

# Link dependencies to local pnpm store
echo "-# Linking dependencies to local pnpm store: $deps"
pnpm link --global $deps &&
pnpm -r exec pnpm link --global $deps;

# Run dev with linked dependencies
echo "-# Running dev with linked dependencies from local pnpm store: $deps"
cd "packages/app"
export LINK_DEPS="$deps" WITH_PNPM_LINKS=true
pnpm exec -- vite --force;
