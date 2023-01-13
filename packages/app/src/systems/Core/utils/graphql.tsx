import { GraphQLClient } from 'graphql-request';

import { getSdk } from '~/generated/graphql';

const client = new GraphQLClient('http://localhost:4000/graphql');
export const graphqlSDK = getSdk(client);
