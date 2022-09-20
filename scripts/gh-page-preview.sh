#!/bin/sh

export BASE_URL="/fuels-wallet"
export BUILD_PATH="dist"$BASE_URL
export PROJECT_FOLDER="./packages/app"
export VITE_STORYBOOK_URL="https://fuels-wallet.vercel.app/storybook/"

# # Clean dist folder
rm -rf $PROJECT_FOLDER/dist

# Build folder with BASE_URL
cd $PROJECT_FOLDER && pnpm ts:check && pnpm exec vite build

# Copy to inside folder
cp $BUILD_PATH/index.html $BUILD_PATH/../404.html

# Run server and open on browser
pnpm exec http-server ./dist -o $BASE_URL -c-1
