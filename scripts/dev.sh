#!/bin/bash

deps=$(./scripts/deps.sh)

if [ -n "$deps" ]; then
  echo "-#### Running dev with linked dependencies from local pnpm store:"
  echo "$deps"
fi
  
export LINK_DEPS="$deps"

# Run the dev env requested
if [ -z "$1" ]; then
  turbo run dev --filter=fuels-wallet;
elif [ "$1" == "--crx" ]; then
  turbo run dev:crx --parallel;
elif [ "$1" == "--docs" ]; then
  NODE_ENV=development turbo run dev --filter=docs;
fi
