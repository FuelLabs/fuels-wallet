import type { CodegenConfig } from '@graphql-codegen/cli';

import { getPublicEnvs } from './load.envs.js';

const env = getPublicEnvs();

const config: CodegenConfig = {
  overwrite: true,
  schema: env.VITE_FUEL_PROVIDER_URL,
  documents: './src/**/*.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'named-operations-object',
        'typescript-graphql-request',
      ],
      config: {
        fetcher: 'fetch',
        reactApolloVersion: 3,
        withHooks: false,
        withHOC: false,
        withComponent: false,
        exportFragmentSpreadSubTypes: true,
        documentMode: 'graphQLTag',
        avoidOptionals: true,
        useImplementingTypes: true,
        useTypeImports: true,
        identifierName: 'gqlOperations',
        typesPrefix: 'I',
        scalars: {
          DateTime: 'string',
          HexString: 'string',
          Bytes32: 'string',
          UtxoId: 'string',
          U64: 'string',
          Address: 'string',
          BlockId: 'string',
          TransactionId: 'string',
          AssetId: 'string',
          ContractId: 'string',
          Salt: 'string',
          MessageId: 'string',
          Signature: 'string',
          Tai64Timestamp: 'string',
          TxPointer: 'string',
          Nonce: 'string',
          U32: 'string',
        },
      },
    },
  },
  hooks: {
    afterOneFileWrite: [
      'pnpm eslint --fix --no-ignore',
      'pnpm prettier --write',
    ],
  },
};

export default config;
