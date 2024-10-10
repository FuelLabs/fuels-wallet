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
