#!/bin/bash

script_dir="$(dirname "$(realpath "$0")")"
input_file="$script_dir/../src/generated/graphql.ts"
sed -i '' 's|graphql-request/dist/types\.dom|graphql-request/src/types.dom|g' "$input_file"
