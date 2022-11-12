import { DocSearch } from '@docsearch/react';

export function Search() {
  return (
    <DocSearch
      indexName="wallet_docs"
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!}
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!}
      disableUserPersonalization={true}
    />
  );
}
