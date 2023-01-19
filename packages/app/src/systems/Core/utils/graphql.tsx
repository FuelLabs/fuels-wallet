import { GraphQLClient } from 'graphql-request';

import { getSdk } from '~/generated/graphql';

export function getGraphqlClient(providerUrl: string) {
  const graphqlClient = new GraphQLClient(providerUrl);
  return getSdk(graphqlClient);
}
