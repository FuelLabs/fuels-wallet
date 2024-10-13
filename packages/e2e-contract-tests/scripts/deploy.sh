#!/bin/bash

echo "Build contracts"
pnpm fuels build

echo "Deploy contract 1"
export CONTRACT_NAME="MainContract"
pnpm fuels deploy

echo "Deploy contract 2"
export CONTRACT_NAME="ExternalContract"
pnpm fuels deploy

echo "Remove 'declare' blocks from CustomAsset.ts"
perl -i.bak -ne 'print unless /^\s*declare .*;$/ || /^\s*declare .*{/ .. /^\s*};/' src/contracts/contracts/CustomAsset.ts

echo "Prettify"
pnpm -w format