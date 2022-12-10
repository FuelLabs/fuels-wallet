export const MOCK_CHAIN_INFO = {
  chain: {
    name: 'Testnet Beta 2',
    baseChainHeight: '0',
    peerCount: 0,
    consensusParameters: {
      contractMaxSize: '16777216',
      maxInputs: '255',
      maxOutputs: '255',
      maxWitnesses: '255',
      maxGasPerTx: '500000000',
      maxScriptLength: '1048576',
      maxScriptDataLength: '1048576',
      maxStorageSlots: '255',
      maxPredicateLength: '1048576',
      maxPredicateDataLength: '1048576',
      gasPriceFactor: '1000000000',
      gasPerByte: '4',
      maxMessageDataLength: '1048576',
    },
    latestBlock: {
      id: '0x48c619be565fa33931e67f33e532ec6eca56c2c2cbb2b1439cc9de5f0ee99053',
      header: { height: '440216', time: '4611686020098034848' },
      transactions: [
        {
          id: '0x464e0b7b9f6248047e55a776e3a1f60abc3f7e312b54289ccec042e5ba38f00a',
        },
        {
          id: '0x7bcf5a935b23a9e8cde700a0082b47cd004cce6ae67de1e2d44bf2997907e8ce',
        },
      ],
    },
  },
};
