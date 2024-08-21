#!/bin/bash

# TODO change to --poa-interval-period 1sec \

# Start the Fuel Core node
/root/fuel-core run \
    --ip $FUEL_IP \
    --port $FUEL_CORE_PORT \
    --db-path ./mnt/db/ \
    --utxo-validation \
    --vm-backtrace \
    --poa-interval-period 1sec \
    --debug \
    --min-gas-price ${MIN_GAS_PRICE} \
    --snapshot ./ \
    --consensus-key ${CONSENSUS_KEY_SECRET}

