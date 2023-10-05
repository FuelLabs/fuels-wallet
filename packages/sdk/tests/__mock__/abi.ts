export const AbiContractId =
  '0xd58568036bb3c01142d3149f238bcf2d75478c01fa97dfc1b8caee0f808651ff';
export const FlatAbi = {
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
};
