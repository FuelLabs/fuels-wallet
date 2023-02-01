#!/bin/bash

# Define dependencies to link locally
deps="@fuel-ui/react @fuel-ui/css @fuel-ui/config @fuel-ui/test-utils"

# # Link dependencies to local pnpm store
echo "-# Linking dependencies to local pnpm store: $deps"
pnpm link --global $deps &&
pnpm -r exec pnpm link --global $deps;

# # Run dev with linked dependencies
comma_deps=$(echo "$deps" | tr " " ",")
echo "-# Running dev with linked dependencies from local pnpm store: $deps"
cd "packages/app"
export LINK_DEPS="$comma_deps" WITH_PNPM_LINKS=true
pnpm exec -- vite --force;
