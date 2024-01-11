#!/bin/bash

echo "Build contracts"
pnpm fuels build

echo "Deploy contract 1"
export CONTRACT_NAME="MainContract";
pnpm fuels deploy && \

echo "Deploy contract 2"
export CONTRACT_NAME="ExternalContract";
pnpm fuels deploy

echo "Prettify"
pnpm -w prettier:format
