#!/bin/bash

input_file="./src/generated/graphql.ts"
sed -i '' 's|graphql-request/dist/types\.dom|graphql-request/src/types.dom|g' "$input_file"
