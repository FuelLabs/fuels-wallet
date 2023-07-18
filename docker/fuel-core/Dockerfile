FROM ghcr.io/fuellabs/fuel-core:v0.18.3

ENV MIN_GAS_PRICE="${MIN_GAS_PRICE}"
ENV CONSENSUS_KEY="${CONSENSUS_KEY}"

# Install curl to use on
# healthcheck config
RUN apt update
RUN apt install curl -y

WORKDIR /root/

COPY chainConfig.json .

# https://stackoverflow.com/a/44671685
# https://stackoverflow.com/a/40454758
# hadolint ignore=DL3025
CMD ./fuel-core run \
    --ip 0.0.0.0 \
    --port 4000 \
    --db-path ./mnt/db/ \
    --utxo-validation \
    --min-gas-price ${MIN_GAS_PRICE} \
    --consensus-key ${CONSENSUS_KEY} \
    --chain ./chainConfig.json

EXPOSE ${PORT}
