#!/bin/bash

# Change the network name
# sed -i "s/local_testnet/$NETWORK_NAME/g" ./chainConfig.json

ls -la
cd config
ls -la
cd ..

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
