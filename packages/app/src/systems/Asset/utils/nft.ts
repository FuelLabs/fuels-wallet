import { Contract, type Provider } from 'fuels';

export const fetchNftData = async ({
  assetId,
  contractId,
  provider,
}: { assetId: string; contractId: string; provider: Provider }) => {
  const contract = new Contract(contractId, SRC_20_ABI, provider);

  const result = await contract
    .multiCall([
      contract.functions.total_supply({ bits: assetId }),
      contract.functions.decimals({ bits: assetId }),
      contract.functions.name({ bits: assetId }),
      contract.functions.symbol({ bits: assetId }),
    ])
    .dryRun();

  const [_total_supply, _decimals, name, symbol] = result.value;

  return {
    name: name as string,
    symbol: symbol as string,
  };
};

const SRC_20_ABI = {
  programType: 'contract',
  specVersion: '1',
  encodingVersion: '1',
  concreteTypes: [
    {
      type: '()',
      concreteTypeId:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
    },
    {
      type: 'b256',
      concreteTypeId:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
    },
    {
      type: 'enum std::identity::Identity',
      concreteTypeId:
        'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
      metadataTypeId: 0,
    },
    {
      type: 'enum std::option::Option<struct std::string::String>',
      concreteTypeId:
        '7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0',
      metadataTypeId: 1,
      typeArguments: [
        '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
      ],
    },
    {
      type: 'enum std::option::Option<u64>',
      concreteTypeId:
        'd852149004cc9ec0bbe7dc4e37bffea1d41469b759512b6136f2e865a4c06e7d',
      metadataTypeId: 1,
      typeArguments: [
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      ],
    },
    {
      type: 'enum std::option::Option<u8>',
      concreteTypeId:
        '2da102c46c7263beeed95818cd7bee801716ba8303dddafdcd0f6c9efda4a0f1',
      metadataTypeId: 1,
      typeArguments: [
        'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
      ],
    },
    {
      type: 'str',
      concreteTypeId:
        '8c25cb3686462e9a86d2883c5688a22fe738b0bbc85f458d2d2b5f3f667c6d5a',
    },
    {
      type: 'str[11]',
      concreteTypeId:
        '48e8455800b58e79d9db5ac584872b19d307a74a81dcad1d1f9ca34da17e1b31',
    },
    {
      type: 'str[6]',
      concreteTypeId:
        'ed705f920eb2c423c81df912430030def10f03218f0a064bfab81b68de71ae21',
    },
    {
      type: 'struct std::asset_id::AssetId',
      concreteTypeId:
        'c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974',
      metadataTypeId: 5,
    },
    {
      type: 'struct std::string::String',
      concreteTypeId:
        '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
      metadataTypeId: 9,
    },
    {
      type: 'u64',
      concreteTypeId:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
    },
    {
      type: 'u8',
      concreteTypeId:
        'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
    },
  ],
  metadataTypes: [
    {
      type: 'enum std::identity::Identity',
      metadataTypeId: 0,
      components: [
        {
          name: 'Address',
          typeId: 4,
        },
        {
          name: 'ContractId',
          typeId: 8,
        },
      ],
    },
    {
      type: 'enum std::option::Option',
      metadataTypeId: 1,
      components: [
        {
          name: 'None',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'Some',
          typeId: 2,
        },
      ],
      typeParameters: [2],
    },
    {
      type: 'generic T',
      metadataTypeId: 2,
    },
    {
      type: 'raw untyped ptr',
      metadataTypeId: 3,
    },
    {
      type: 'struct std::address::Address',
      metadataTypeId: 4,
      components: [
        {
          name: 'bits',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct std::asset_id::AssetId',
      metadataTypeId: 5,
      components: [
        {
          name: 'bits',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct std::bytes::Bytes',
      metadataTypeId: 6,
      components: [
        {
          name: 'buf',
          typeId: 7,
        },
        {
          name: 'len',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct std::bytes::RawBytes',
      metadataTypeId: 7,
      components: [
        {
          name: 'ptr',
          typeId: 3,
        },
        {
          name: 'cap',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct std::contract_id::ContractId',
      metadataTypeId: 8,
      components: [
        {
          name: 'bits',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct std::string::String',
      metadataTypeId: 9,
      components: [
        {
          name: 'bytes',
          typeId: 6,
        },
      ],
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: 'sub_id',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'amount',
          concreteTypeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      name: 'burn',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Unconditionally burns assets sent with the default SubId.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' # Arguments'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * `sub_id`: [SubId] - The default SubId.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * `amount`: [u64] - The quantity of coins to burn.'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' # Number of Storage Accesses'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * Reads: `1`'],
        },
        {
          name: 'doc-comment',
          arguments: [' * Writes: `1`'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' # Reverts'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * When the `sub_id` is not the default SubId.'],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * When the transaction did not include at least `amount` coins.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * When the transaction did not include the asset minted by this contract.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' # Examples'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ```sway'],
        },
        {
          name: 'doc-comment',
          arguments: [' use src3::SRC3;'],
        },
        {
          name: 'doc-comment',
          arguments: [' use std::constants::DEFAULT_SUB_ID;'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' fn foo(contract_id: ContractId, asset_id: AssetId) {'],
        },
        {
          name: 'doc-comment',
          arguments: ['     let contract_abi = abi(SRC3, contract_id);'],
        },
        {
          name: 'doc-comment',
          arguments: ['     contract_abi {'],
        },
        {
          name: 'doc-comment',
          arguments: ['         gas: 10000,'],
        },
        {
          name: 'doc-comment',
          arguments: ['         coins: 100,'],
        },
        {
          name: 'doc-comment',
          arguments: ['         asset_id: asset_id,'],
        },
        {
          name: 'doc-comment',
          arguments: ['     }.burn(DEFAULT_SUB_ID, 100);'],
        },
        {
          name: 'doc-comment',
          arguments: [' }'],
        },
        {
          name: 'doc-comment',
          arguments: [' ```'],
        },
        {
          name: 'payable',
          arguments: [],
        },
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'recipient',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
        },
        {
          name: 'sub_id',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'amount',
          concreteTypeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      name: 'mint',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Unconditionally mints new assets using the default SubId.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' # Arguments'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `recipient`: [Identity] - The user to which the newly minted asset is transferred to.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * `sub_id`: [SubId] - The default SubId.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * `amount`: [u64] - The quantity of coins to mint.'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' # Number of Storage Accesses'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * Reads: `1`'],
        },
        {
          name: 'doc-comment',
          arguments: [' * Writes: `1`'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' # Reverts'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * When the `sub_id` is not the default SubId.'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' # Examples'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ```sway'],
        },
        {
          name: 'doc-comment',
          arguments: [' use src3::SRC3;'],
        },
        {
          name: 'doc-comment',
          arguments: [' use std::constants::DEFAULT_SUB_ID;'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' fn foo(contract_id: ContractId) {'],
        },
        {
          name: 'doc-comment',
          arguments: ['     let contract_abi = abi(SRC3, contract);'],
        },
        {
          name: 'doc-comment',
          arguments: [
            '     contract_abi.mint(Identity::ContractId(contract_id), DEFAULT_SUB_ID, 100);',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' }'],
        },
        {
          name: 'doc-comment',
          arguments: [' ```'],
        },
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'asset',
          concreteTypeId:
            'c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974',
        },
      ],
      name: 'decimals',
      output:
        '2da102c46c7263beeed95818cd7bee801716ba8303dddafdcd0f6c9efda4a0f1',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'asset',
          concreteTypeId:
            'c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974',
        },
      ],
      name: 'name',
      output:
        '7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'asset',
          concreteTypeId:
            'c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974',
        },
      ],
      name: 'symbol',
      output:
        '7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'total_assets',
      output:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'asset',
          concreteTypeId:
            'c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974',
        },
      ],
      name: 'total_supply',
      output:
        'd852149004cc9ec0bbe7dc4e37bffea1d41469b759512b6136f2e865a4c06e7d',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: '10098701174489624218',
      concreteTypeId:
        '8c25cb3686462e9a86d2883c5688a22fe738b0bbc85f458d2d2b5f3f667c6d5a',
    },
  ],
  messagesTypes: [],
  configurables: [
    {
      name: 'DECIMALS',
      concreteTypeId:
        'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
      offset: 15736,
    },
    {
      name: 'NAME',
      concreteTypeId:
        '48e8455800b58e79d9db5ac584872b19d307a74a81dcad1d1f9ca34da17e1b31',
      offset: 15744,
    },
    {
      name: 'SYMBOL',
      concreteTypeId:
        'ed705f920eb2c423c81df912430030def10f03218f0a064bfab81b68de71ae21',
      offset: 15760,
    },
  ],
};
