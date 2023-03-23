import { Interface } from 'fuels';
import type { JsonFlatAbi } from 'fuels';
import { useMemo } from 'react';

import type { ParseTxParams } from '../utils';
import { parseTx } from '../utils';

export function useParseTx(props: Partial<ParseTxParams>) {
  const { transaction, receipts, gasPerByte, gasPriceFactor, gqlStatus, id } =
    props;

  const tx = useMemo(() => {
    if (!transaction || !receipts || !gasPerByte || !gasPriceFactor)
      return undefined;

    const abi = {
      '0x2777daab93219ce191f1b8d0161d6ccbe8085047db27ffc4c7931c6b6cb89701': {
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
        messagesTypes: [],
        configurables: [],
      },
    };

    const abiInterface = new Interface(abi);

    console.log(`abiInterface`, abiInterface);

    return parseTx({
      transaction,
      receipts,
      gasPerByte,
      gasPriceFactor,
      gqlStatus,
      id,
    });
  }, Object.values(props));

  return tx;
}
