#!/bin/sh

ROOT_PATH=$(realpath ./)
ROOT_DIST_FOLDER=$ROOT_PATH"/packages/page/dist"
export BASE_URL="/preview"
export BUILD_PATH=$ROOT_DIST_FOLDER$BASE_URL
export BUILD_PATH_STORYBOOK=$ROOT_DIST_FOLDER$BASE_URL"/storybook"
export VITE_WALLET_PREVIEW_URL=$BASE_URL"/"
export VITE_WALLET_DOWNLOAD_URL=$BASE_URL"/fuel-wallet.zip"
export VITE_STORYBOOK_URL=$BASE_URL"/storybook/"

pnpm build:libs && pnpm exec turbo run build:preview

# Copy to inside folder
cp $BUILD_PATH/index.html $BUILD_PATH/../404.html