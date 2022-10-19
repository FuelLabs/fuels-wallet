#!/bin/sh

ROOT_PATH=$(realpath ./)
ROOT_DIST_FOLDER=$ROOT_PATH"/packages/page/dist"
export BASE_URL="/wallet"
export BUILD_PATH=$ROOT_DIST_FOLDER$BASE_URL
export BUILD_PATH_STORYBOOK=$ROOT_DIST_FOLDER$BASE_URL"/storybook"
export VITE_WALLET_PREVIEW_URL="/wallet/"
export VITE_WALLET_DOWNLOAD_URL="/wallet/fuel-wallet.zip"
export VITE_STORYBOOK_URL="/wallet/storybook/"

pnpm build:libs && pnpm exec turbo run build:preview

# Copy to inside folder
cp $BUILD_PATH/index.html $BUILD_PATH/../404.html