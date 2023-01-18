import type { CodegenConfig } from '@graphql-codegen/cli';

import { getPublicEnvs } from './load.envs.js';

const env = getPublicEnvs();
// eslint-disable-next-line no-console
console.log(env);

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
        },
      },
    },
  },
  hooks: {
    afterOneFileWrite: ['pnpm eslint --fix', 'pnpm prettier --write'],
  },
};

export default config;
