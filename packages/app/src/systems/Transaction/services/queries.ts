import type { getTransactionStatusName, processGqlReceipt } from 'fuels';

type GqlReceiptFragment = Parameters<typeof processGqlReceipt>[0];
type GqlTransactionStatusesNames = Parameters<
  typeof getTransactionStatusName
>[0];

export type GetPageInfoQuery = {
  transactionsByOwner: {
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
};

export type GetTransactionsByOwnerQuery = {
  transactionsByOwner: {
    pageInfo: GetPageInfoQuery['transactionsByOwner']['pageInfo'];
    edges: {
      node: {
        id: string;
        rawPayload: string;
        status: {
          type: GqlTransactionStatusesNames;
          time: string;
          receipts: GqlReceiptFragment[];
        };
      };
    }[];
  };
};

export const getPageInfoQuery = `
  query getTransactionsByOwner($owner: Address!, $after: String, $before: String, $first: Int, $last: Int) {
    transactionsByOwner(
      owner: $owner
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      pageInfo {
        ...pageInfoFragment
      }
    }
  }

  fragment pageInfoFragment on PageInfo {
    hasPreviousPage
    hasNextPage
    startCursor
    endCursor
  }
`;

export const getTransactionsByOwnerQuery = `
  query getTransactionsByOwner($owner: Address!, $after: String, $before: String, $first: Int, $last: Int) {
    transactionsByOwner(
      owner: $owner
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      pageInfo {
        ...pageInfoFragment
      }
      edges {
        node {
          ...transactionFragment
        }
      }
    }
  }

  fragment pageInfoFragment on PageInfo {
    hasPreviousPage
    hasNextPage
    startCursor
    endCursor
  }

  fragment transactionFragment on Transaction {
    id
    rawPayload
    status {
      ...transactionStatusFragment
    }
  }

  fragment transactionStatusFragment on TransactionStatus {
    ... on SubmittedStatus {
      ...SubmittedStatusFragment
    }
    ... on SuccessStatus {
      ...SuccessStatusFragment
    }
    ... on FailureStatus {
      ...FailureStatusFragment
    }
  }

  fragment receiptFragment on Receipt {
    id
    pc
    is
    to
    toAddress
    amount
    assetId
    gas
    param1
    param2
    val
    ptr
    digest
    reason
    ra
    rb
    rc
    rd
    len
    receiptType
    result
    gasUsed
    data
    sender
    recipient
    nonce
    contractId
    subId
  }

  fragment SubmittedStatusFragment on SubmittedStatus {
    type: __typename
    time
  }

  fragment SuccessStatusFragment on SuccessStatus {
    type: __typename
    time
    receipts {
      ...receiptFragment
    }
  }

  fragment FailureStatusFragment on FailureStatus {
    type: __typename
    time
    receipts {
      ...receiptFragment
    }
  }
`;
