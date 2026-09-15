# Builds the wallet website (docs + /app + /storybook) exactly like Vercel did
# (`pnpm install` + `pnpm build:website`, output ./dist) and serves it with nginx.
FROM node:20-bookworm-slim AS build

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ git \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@9.15.9

WORKDIR /app

ENV HUSKY=0 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    NODE_OPTIONS=--max-old-space-size=6144

COPY . .

# devDependencies hold the build toolchain (turbo, next, vite, storybook), so
# NODE_ENV=production is only set after the install.
RUN pnpm install --frozen-lockfile

ENV NODE_ENV=production

# Build-time public vars (same set as the Vercel production environment).
ARG NEXT_PUBLIC_ALGOLIA_APP_ID
ARG NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
ARG NEXT_PUBLIC_CURRENT_ENV=PRODUCTION
ARG NEXT_PUBLIC_PREVIEW=false
ARG NEXT_PUBLIC_URL=https://wallet.fuel.network
ARG NEXT_PUBLIC_WALLET_DOWNLOAD_URL=/app/fuel-wallet.zip?v=1
ARG NEXT_PUBLIC_WALLET_INSTALL
ARG STORYBOOK_BASE_URL=/storybook/
ARG VITE_CRX_NAME="Fuel Wallet"
ARG VITE_CRX_RELEASE=false
ENV NEXT_PUBLIC_ALGOLIA_APP_ID=$NEXT_PUBLIC_ALGOLIA_APP_ID \
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=$NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY \
    NEXT_PUBLIC_CURRENT_ENV=$NEXT_PUBLIC_CURRENT_ENV \
    NEXT_PUBLIC_PREVIEW=$NEXT_PUBLIC_PREVIEW \
    NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL \
    NEXT_PUBLIC_WALLET_DOWNLOAD_URL=$NEXT_PUBLIC_WALLET_DOWNLOAD_URL \
    NEXT_PUBLIC_WALLET_INSTALL=$NEXT_PUBLIC_WALLET_INSTALL \
    STORYBOOK_BASE_URL=$STORYBOOK_BASE_URL \
    VITE_CRX_NAME=$VITE_CRX_NAME \
    VITE_CRX_RELEASE=$VITE_CRX_RELEASE

RUN pnpm build:website

FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
