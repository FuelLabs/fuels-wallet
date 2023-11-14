#!/bin/bash

# Change the network name
sed -i "s/local_testnet/$NETWORK_NAME/g" ./chainConfig.json

# Start the Fuel Core node
/root/fuel-core run \
    --ip 0.0.0.0 \
    --port 4000 \
    --db-path ./mnt/db/ \
    --utxo-validation \
    --min-gas-price ${MIN_GAS_PRICE} \
    --consensus-key ${CONSENSUS_KEY} \
    --chain ./chainConfig.json
