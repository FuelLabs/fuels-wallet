import { rest } from 'msw';
import { setupServer } from 'msw/node';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function mockServer(handlers: any[] = []) {
  return setupServer(
    rest.get('/assets.json', (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            name: 'Ethereum',
            symbol: 'ETH',
            icon: 'https://verified-assets.fuel.network/images/eth.svg',
            networks: [
              {
                type: 'ethereum',
                chain: 'sepolia',
                decimals: 18,
                chainId: 11155111,
              },
              {
                type: 'ethereum',
                chain: 'foundry',
                decimals: 18,
                chainId: 31337,
              },
              {
                type: 'ethereum',
                chain: 'mainnet',
                decimals: 18,
                chainId: 1,
              },
              {
                type: 'fuel',
                chain: 'devnet',
                decimals: 9,
                assetId:
                  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
                chainId: 0,
              },
              {
                type: 'fuel',
                chain: 'testnet',
                decimals: 9,
                assetId:
                  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
                chainId: 0,
              },
              {
                type: 'fuel',
                chain: 'mainnet',
                decimals: 9,
                assetId:
                  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
                chainId: 9889,
              },
            ],
          },
          {
            name: 'Fuel',
            symbol: 'FUEL',
            icon: 'https://verified-assets.fuel.network/images/fuel.svg',
            networks: [
              {
                type: 'ethereum',
                chain: 'sepolia',
                address: '0xd7fc4e8fb2c05567c313f4c9b9e07641a361a550',
                decimals: 9,
                chainId: 11155111,
              },
              {
                type: 'ethereum',
                chain: 'mainnet',
                address: '0x675b68aa4d9c2d3bb3f0397048e62e6b7192079c',
                decimals: 9,
                chainId: 1,
              },
              {
                type: 'fuel',
                chain: 'testnet',
                decimals: 9,
                chainId: 0,
                contractId:
                  '0xd02112ef9c39f1cea7c8527c26242ca1f5d26bcfe8d1564bee054d3b04175471',
                subId:
                  '0xede43647e2aad1c0f1696201d6ba913aa67c917c3ac9a4a7d95662962ab25c5b',
                assetId:
                  '0x324d0c35a4299ef88138a656d5272c5a3a9ccde2630ae055dacaf9d13443d53b',
              },
              {
                type: 'fuel',
                chain: 'mainnet',
                decimals: 9,
                chainId: 9889,
                contractId:
                  '0x4ea6ccef1215d9479f1024dff70fc055ca538215d2c8c348beddffd54583d0e8',
                subId:
                  '0xe81c89b8cf795c7c25e79f6c4f2f1cd233290b58e217ed4e9b6b18538badddaf',
                assetId:
                  '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
              },
            ],
          },
        ])
      );
    }),
    ...handlers
  );
}
