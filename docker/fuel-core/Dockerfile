# IMPORTANT!
# Make sure to check:
# https://github.com/FuelLabs/chain-configuration/tree/master/upgradelog/ignition-devnet
# and apply the latest state_transition_function and consensus_parameter
# when upgrading fuel-core

# We should be supporting always the same fuel-core version as the fuels (ts-sdk)
# https://github.com/FuelLabs/fuels-ts/blob/master/internal/fuel-core/VERSION
FROM ghcr.io/fuellabs/fuel-core:v0.40.2

# dependencies
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y git curl jq && rm -rf /var/lib/apt/lists/*

# copy chain config
WORKDIR /fuel

COPY ./genesis_coins.json .

#  Fuel Core 0.40.2, needs to be changed when core version is updated
RUN git clone \
    https://github.com/FuelLabs/chain-configuration.git \
    /chain-configuration && \
    cd /chain-configuration && \
    git checkout b2a9fd7ae37a33b45b2407eadf9c870ef2027c07

# Copy the base local configuration
RUN cp -R /chain-configuration/local/* ./

# Copy the testnet consensus parameters and state transition bytecode
RUN cp /chain-configuration/upgradelog/ignition-devnet/consensus_parameters/14.json \
    ./latest_consensus_parameters.json
RUN cp /chain-configuration/upgradelog/ignition-devnet/state_transition_function/17.wasm \
    ./state_transition_bytecode.wasm

# update local state_config with custom genesis coins config
RUN jq '.coins = input' \
    state_config.json genesis_coins.json > tmp.json \
    && mv tmp.json state_config.json

# update local state_config with testnet consensus parameters
RUN jq '.consensus_parameters = input' \
    state_config.json latest_consensus_parameters.json > tmp.json \
    && mv tmp.json state_config.json

# expose fuel node port
EXPOSE ${FUEL_CORE_PORT}

# copy over script and run
COPY ./fuel_core.sh .
CMD ["sh", "./fuel_core.sh"]
