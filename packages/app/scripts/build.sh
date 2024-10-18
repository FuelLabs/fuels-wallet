export NODE_ENV=${NODE_ENV:=production}
export STORYBOOK_DIST=${STORYBOOK_DIST:=./dist/storybook}

if [ "$1" = "--app=vite" ]; then
	pnpm vite build --mode $NODE_ENV
	pnpm validate:manifest
fi
if [ "$1" = "--app=crx" ]; then
	pnpm vite build --config vite.crx.config.ts --mode $NODE_ENV
	pnpm validate:manifest
fi
if [ "$1" = "--app=storybook" ]; then
	pnpm storybook build -o $STORYBOOK_DIST
fi
