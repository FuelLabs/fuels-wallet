# Run services
pnpm node:dev start --test --debug

# Run test
if [ "$1" = "--coverage" ]; then
    pnpm test:coverage
elif [ "$1" = "--e2e" ]; then
    pnpm test:e2e
else
    pnpm test
fi

# Stop services
pnpm node:dev stop --test --debug
