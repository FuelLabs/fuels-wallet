#!/bin/bash

# Run services
pnpm node:dev start --test --debug

# Run test
if [ "$1" = "--coverage" ]; then
    pnpm test:coverage
    TEST_RESULT=$?
elif [ "$1" = "--e2e" ]; then
    pnpm test:e2e
    TEST_RESULT=$?
else
    pnpm test
    TEST_RESULT=$?
fi

# Stop services
pnpm node:dev stop --test --debug

exit $TEST_RESULT
