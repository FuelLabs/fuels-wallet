export NODE_ENV=${NODE_ENV:=production}

if [ "$1" = "--app=vite" ]; then
	pnpm vite build --mode $NODE_ENV
fi
if [ "$1" = "--app=crx" ]; then
	pnpm vite build --config vite.crx.config.ts --mode $NODE_ENV
fi
