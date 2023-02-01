#!/bin/bash

pnpm link --global @fuel-ui/react @fuel-ui/css @fuel-ui/config @fuel-ui/test-utils
pnpm -r exec pnpm link --global @fuel-ui/react @fuel-ui/css @fuel-ui/config @fuel-ui/test-utils
