import type * as Types from '../../../../../api/__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AddressPageQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  owner: Types.Scalars['Address'];
}>;

export type AddressPageQuery = {
  __typename: 'Query';
  coins: {
    __typename: 'CoinConnection';
    edges: Array<{
      __typename: 'CoinEdge';
      node: {
        __typename: 'Coin';
        utxoId: string;
        owner: string;
        amount: string;
        assetId: string;
        maturity: string;
        status: Types.CoinStatus;
        blockCreated: string;
      };
    }>;
  };
  transactionsByOwner: {
    __typename: 'TransactionConnection';
    edges: Array<{
      __typename: 'TransactionEdge';
      node: {
        __typename: 'Transaction';
        id: string;
        inputAssetIds?: Array<string> | null;
        gasPrice?: string | null;
        gasLimit?: string | null;
        maturity?: string | null;
        isScript: boolean;
        receiptsRoot?: string | null;
        witnesses?: Array<string> | null;
        inputContracts?: Array<{ __typename: 'Contract'; id: string }> | null;
        outputs: Array<
          | {
              __typename: 'ChangeOutput';
              to: string;
              amount: string;
              assetId: string;
            }
          | {
              __typename: 'CoinOutput';
              to: string;
              amount: string;
              assetId: string;
            }
          | {
              __typename: 'ContractCreated';
              contract: { __typename: 'Contract'; id: string };
            }
          | {
              __typename: 'ContractOutput';
              inputIndex: number;
              balanceRoot: string;
              stateRoot: string;
            }
          | { __typename: 'MessageOutput' }
          | {
              __typename: 'VariableOutput';
              to: string;
              amount: string;
              assetId: string;
            }
        >;
        inputs?: Array<
          | {
              __typename: 'InputCoin';
              utxoId: string;
              owner: string;
              amount: string;
              assetId: string;
              witnessIndex: number;
              maturity: string;
              predicate: string;
              predicateData: string;
            }
          | {
              __typename: 'InputContract';
              utxoId: string;
              balanceRoot: string;
              stateRoot: string;
              contract: { __typename: 'Contract'; id: string };
            }
          | { __typename: 'InputMessage' }
        > | null;
        status?:
          | { __typename: 'FailureStatus'; time: string }
          | { __typename: 'SqueezedOutStatus' }
          | { __typename: 'SubmittedStatus'; time: string }
          | { __typename: 'SuccessStatus'; time: string }
          | null;
      };
    }>;
  };
};

export type AddressPageCoin = {
  __typename: 'Coin';
  utxoId: string;
  owner: string;
  amount: string;
  assetId: string;
  maturity: string;
  status: Types.CoinStatus;
  blockCreated: string;
};

export type AddressPageTransaction = {
  __typename: 'Transaction';
  id: string;
  inputAssetIds?: Array<string> | null;
  gasPrice?: string | null;
  gasLimit?: string | null;
  maturity?: string | null;
  isScript: boolean;
  receiptsRoot?: string | null;
  witnesses?: Array<string> | null;
  inputContracts?: Array<{ __typename: 'Contract'; id: string }> | null;
  outputs: Array<
    | {
        __typename: 'ChangeOutput';
        to: string;
        amount: string;
        assetId: string;
      }
    | { __typename: 'CoinOutput'; to: string; amount: string; assetId: string }
    | {
        __typename: 'ContractCreated';
        contract: { __typename: 'Contract'; id: string };
      }
    | {
        __typename: 'ContractOutput';
        inputIndex: number;
        balanceRoot: string;
        stateRoot: string;
      }
    | { __typename: 'MessageOutput' }
    | {
        __typename: 'VariableOutput';
        to: string;
        amount: string;
        assetId: string;
      }
  >;
  inputs?: Array<
    | {
        __typename: 'InputCoin';
        utxoId: string;
        owner: string;
        amount: string;
        assetId: string;
        witnessIndex: number;
        maturity: string;
        predicate: string;
        predicateData: string;
      }
    | {
        __typename: 'InputContract';
        utxoId: string;
        balanceRoot: string;
        stateRoot: string;
        contract: { __typename: 'Contract'; id: string };
      }
    | { __typename: 'InputMessage' }
  > | null;
  status?:
    | { __typename: 'FailureStatus'; time: string }
    | { __typename: 'SqueezedOutStatus' }
    | { __typename: 'SubmittedStatus'; time: string }
    | { __typename: 'SuccessStatus'; time: string }
    | null;
};

export const AddressPageCoinFragmentDoc = gql`
  fragment AddressPageCoin on Coin {
    utxoId
    owner
    amount
    assetId
    maturity
    status
    blockCreated
  }
`;
export const AddressPageTransactionFragmentDoc = gql`
  fragment AddressPageTransaction on Transaction {
    id
    inputContracts {
      id
    }
    inputAssetIds
    gasPrice
    gasLimit
    maturity
    isScript
    receiptsRoot
    witnesses
    outputs {
      __typename
      ... on CoinOutput {
        to
        amount
        assetId
      }
      ... on ContractOutput {
        inputIndex
        balanceRoot
        stateRoot
      }
      ... on ChangeOutput {
        to
        amount
        assetId
      }
      ... on VariableOutput {
        to
        amount
        assetId
      }
      ... on ContractCreated {
        contract {
          id
        }
      }
    }
    inputs {
      __typename
      ... on InputCoin {
        utxoId
        owner
        amount
        assetId
        witnessIndex
        maturity
        predicate
        predicateData
      }
      ... on InputContract {
        utxoId
        balanceRoot
        stateRoot
        contract {
          id
        }
      }
    }
    status {
      ... on SubmittedStatus {
        time
      }
      ... on SuccessStatus {
        time
      }
      ... on FailureStatus {
        time
      }
    }
  }
`;
export const AddressPageQueryDocument = gql`
  query AddressPageQuery($first: Int, $owner: Address!) {
    coins(filter: { owner: $owner }, first: 9999) {
      edges {
        node {
          ...AddressPageCoin
        }
      }
    }
    transactionsByOwner(first: $first, owner: $owner) {
      edges {
        node {
          ...AddressPageTransaction
        }
      }
    }
  }
  ${AddressPageCoinFragmentDoc}
  ${AddressPageTransactionFragmentDoc}
`;

/**
 * __useAddressPageQuery__
 *
 * To run a query within a React component, call `useAddressPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddressPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddressPageQuery({
 *   variables: {
 *      first: // value for 'first'
 *      owner: // value for 'owner'
 *   },
 * });
 */
export function useAddressPageQuery(
  baseOptions: Apollo.QueryHookOptions<
    AddressPageQuery,
    AddressPageQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AddressPageQuery, AddressPageQueryVariables>(
    AddressPageQueryDocument,
    options
  );
}
export function useAddressPageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AddressPageQuery,
    AddressPageQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AddressPageQuery, AddressPageQueryVariables>(
    AddressPageQueryDocument,
    options
  );
}
export type AddressPageQueryHookResult = ReturnType<typeof useAddressPageQuery>;
export type AddressPageQueryLazyQueryHookResult = ReturnType<
  typeof useAddressPageQueryLazyQuery
>;
export type AddressPageQueryQueryResult = Apollo.QueryResult<
  AddressPageQuery,
  AddressPageQueryVariables
>;
