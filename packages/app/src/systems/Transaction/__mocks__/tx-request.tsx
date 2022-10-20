import type { TxRequest } from '../types';

export const MOCK_TX_REQUEST = {
  type: 0,
  gasPrice: '0x00',
  gasLimit: '0x0F4240',
  script: '0x24400000',
  scriptData: '0x',
  inputs: [
    {
      type: 0,
      id: '0x000000000000000000000000000000000000000000000000000000000000000000',
      assetId:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      amount: '0x989680',
      owner:
        '0xf1e92c42b90934aa6372e30bc568a326f6e66a1a0288595e6e3fbd392a4f3e6e',
      maturity: 0,
      txPointer: '0x00000000000000000000000000000000',
      witnessIndex: 0,
      predicate: '0x',
      predicateData: '0x',
    },
  ],
  outputs: [
    {
      type: 3,
      to: '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077',
      assetId:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      amount: 1,
    },
  ],
  witnesses: ['0x'],
} as TxRequest;
