#!/bin/bash

# Start the Fuel Core node
/root/fuel-core run \
    --ip 0.0.0.0 \
    --port 4000 \
    --db-path ./mnt/db/ \
    --consensus-key ${CONSENSUS_KEY} \
    --snapshot config \
    --poa-instant true \
    --vm-backtrace \
    --min-gas-price ${MIN_GAS_PRICE} \
    --utxo-validation \
    --debug
