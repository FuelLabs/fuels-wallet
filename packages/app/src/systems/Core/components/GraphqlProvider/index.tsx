import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import fetch from 'cross-fetch';
import type { ReactNode } from 'react';

const VITE_FUEL_PROVIDER_URL = import.meta.env.VITE_FUEL_PROVIDER_URL;

const client = new ApolloClient({
  link: ApolloLink.from([
    new HttpLink({
      uri: VITE_FUEL_PROVIDER_URL,
      fetch,
    }),
  ]),
  uri: VITE_FUEL_PROVIDER_URL,
  cache: new InMemoryCache(),
  // We can configure for each schema the keys to cache, without
  // this config for each one objects without id, will not work
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

export function GraphqlProvider({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
