PNPM_STORE=$(pnpm root)

cp "${PNPM_STORE}/@fuel-ui/icons/dist/icons/sprite.svg" './packages/app/public/icons'
cp "${PNPM_STORE}/@fuel-ui/icons/dist/icons/sprite.svg" './packages/docs/public/icons'
