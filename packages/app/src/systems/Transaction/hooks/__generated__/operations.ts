import type * as Types from '../../../../api/__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AddressTransactionsQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  owner: Types.Scalars['Address'];
}>;

export type AddressTransactionsQuery = {
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
        rawPayload: string;
        gasPrice?: string | null;
        receipts?: Array<{
          __typename: 'Receipt';
          data?: string | null;
          rawPayload: string;
        }> | null;
        status?:
          | {
              __typename: 'FailureStatus';
              time: string;
              reason: string;
              type: 'FailureStatus';
              block: { __typename: 'Block'; id: string };
            }
          | { __typename: 'SqueezedOutStatus'; type: 'SqueezedOutStatus' }
          | {
              __typename: 'SubmittedStatus';
              time: string;
              type: 'SubmittedStatus';
            }
          | {
              __typename: 'SuccessStatus';
              time: string;
              type: 'SuccessStatus';
              block: { __typename: 'Block'; id: string };
              programState?: {
                __typename: 'ProgramState';
                returnType: Types.ReturnType;
                data: string;
              } | null;
            }
          | null;
      };
    }>;
  };
};

export type AddressCoin = {
  __typename: 'Coin';
  utxoId: string;
  owner: string;
  amount: string;
  assetId: string;
  maturity: string;
  status: Types.CoinStatus;
  blockCreated: string;
};

export type AddressTransaction = {
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

export type TransactionFragment = {
  __typename: 'Transaction';
  id: string;
  rawPayload: string;
  gasPrice?: string | null;
  status?:
    | {
        __typename: 'FailureStatus';
        time: string;
        reason: string;
        type: 'FailureStatus';
        block: { __typename: 'Block'; id: string };
      }
    | { __typename: 'SqueezedOutStatus'; type: 'SqueezedOutStatus' }
    | { __typename: 'SubmittedStatus'; time: string; type: 'SubmittedStatus' }
    | {
        __typename: 'SuccessStatus';
        time: string;
        type: 'SuccessStatus';
        block: { __typename: 'Block'; id: string };
        programState?: {
          __typename: 'ProgramState';
          returnType: Types.ReturnType;
          data: string;
        } | null;
      }
    | null;
};

export type ReceiptFragment = {
  __typename: 'Receipt';
  data?: string | null;
  rawPayload: string;
};

export const AddressCoinFragmentDoc = gql`
  fragment AddressCoin on Coin {
    utxoId
    owner
    amount
    assetId
    maturity
    status
    blockCreated
  }
`;
export const AddressTransactionFragmentDoc = gql`
  fragment AddressTransaction on Transaction {
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
export const TransactionFragmentDoc = gql`
  fragment transactionFragment on Transaction {
    id
    rawPayload
    gasPrice
    status {
      type: __typename
      ... on SubmittedStatus {
        time
      }
      ... on SuccessStatus {
        block {
          id
        }
        time
        programState {
          returnType
          data
        }
      }
      ... on FailureStatus {
        block {
          id
        }
        time
        reason
      }
    }
  }
`;
export const ReceiptFragmentDoc = gql`
  fragment receiptFragment on Receipt {
    data
    rawPayload
  }
`;
export const AddressTransactionsQueryDocument = gql`
  query AddressTransactionsQuery($first: Int, $owner: Address!) {
    coins(filter: { owner: $owner }, first: 9999) {
      edges {
        node {
          ...AddressCoin
        }
      }
    }
    transactionsByOwner(first: $first, owner: $owner) {
      edges {
        node {
          ...transactionFragment
          receipts {
            ...receiptFragment
          }
        }
      }
    }
  }
  ${AddressCoinFragmentDoc}
  ${TransactionFragmentDoc}
  ${ReceiptFragmentDoc}
`;

/**
 * __useAddressTransactionsQuery__
 *
 * To run a query within a React component, call `useAddressTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddressTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddressTransactionsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      owner: // value for 'owner'
 *   },
 * });
 */
export function useAddressTransactionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    AddressTransactionsQuery,
    AddressTransactionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    AddressTransactionsQuery,
    AddressTransactionsQueryVariables
  >(AddressTransactionsQueryDocument, options);
}
export function useAddressTransactionsQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AddressTransactionsQuery,
    AddressTransactionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    AddressTransactionsQuery,
    AddressTransactionsQueryVariables
  >(AddressTransactionsQueryDocument, options);
}
export type AddressTransactionsQueryHookResult = ReturnType<
  typeof useAddressTransactionsQuery
>;
export type AddressTransactionsQueryLazyQueryHookResult = ReturnType<
  typeof useAddressTransactionsQueryLazyQuery
>;
export type AddressTransactionsQueryQueryResult = Apollo.QueryResult<
  AddressTransactionsQuery,
  AddressTransactionsQueryVariables
>;
