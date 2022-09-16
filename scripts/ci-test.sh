# Run services
pnpm node:dev start --test --debug

# Run test
if [ "$1" = "--e2e" ]; then
    pnpm test:e2e
else
    pnpm test:ci
fi

# Stop services
pnpm node:dev stop --test --debug
