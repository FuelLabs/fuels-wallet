import type { AbiMap } from '@fuel-wallet/types';

import { AbiService } from '../services';

export const MOCK_ABI_MAP: AbiMap = {
  '0x17a88dcb90a4b5df7433200c7eb7bd47015079b90043f197d64977443396f1c2': {
    types: [
      {
        typeId: 0,
        type: '()',
        components: [],
        typeParameters: null,
      },
      {
        typeId: 1,
        type: 'b256',
        components: null,
        typeParameters: null,
      },
      {
        typeId: 2,
        type: 'struct Address',
        components: [
          {
            name: 'value',
            type: 1,
            typeArguments: null,
          },
        ],
        typeParameters: null,
      },
      {
        typeId: 3,
        type: 'u64',
        components: null,
        typeParameters: null,
      },
    ],
    functions: [
      {
        inputs: [
          {
            name: 'amount',
            type: 3,
            typeArguments: null,
          },
          {
            name: 'address',
            type: 2,
            typeArguments: null,
          },
          {
            name: 'amount2',
            type: 3,
            typeArguments: null,
          },
        ],
        name: 'mint_to_address',
        output: {
          name: '',
          type: 0,
          typeArguments: null,
        },
        attributes: [
          {
            name: 'storage',
            arguments: ['read', 'write'],
          },
        ],
      },
    ],
    loggedTypes: [],
    configurables: [],
  },
};

export async function mockAbi() {
  await AbiService.clearAbis();
  await AbiService.addAbi({
    data: MOCK_ABI_MAP,
  });
}
