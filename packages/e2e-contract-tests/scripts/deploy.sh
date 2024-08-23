#!/bin/bash

echo "Build contracts"
pnpm fuels build

# @TODO: Remove this line when the issue is fixed
# need to discard due to "declare" issue on playwright typescript usage
git checkout -- src/contracts/contracts/CustomAsset.ts

echo "Deploy contract 1"
export CONTRACT_NAME="MainContract";
pnpm fuels deploy && \

echo "Deploy contract 2"
export CONTRACT_NAME="ExternalContract";
pnpm fuels deploy

echo "Prettify"
pnpm -w format
