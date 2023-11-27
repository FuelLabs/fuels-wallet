import { createConfig, ZeroBytes32 } from 'fuels';

export default createConfig({
  output: './src/contracts',
  contracts: ['./contracts/custom_asset'],
  useBuiltinForc: false,
  useBuiltinFuelCore: false,
  privateKey:
    '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298',
  providerUrl: 'http://localhost:4001/graphql',
  deployConfig: {
    salt: process.env.SALT || ZeroBytes32,
  },
});

// ?  ZeroBytes32 ? '0x0000000000000000000000000000000000000000000000000000000000000001'
