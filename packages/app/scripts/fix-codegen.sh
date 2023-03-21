#!/bin/bash

input_file="./src/generated/graphql.ts"

if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's|graphql-request/dist/types\.dom|graphql-request/src/types.dom|g' "$input_file"
else
    sed -i 's|graphql-request/dist/types\.dom|graphql-request/src/types.dom|g' "$input_file"
fi
