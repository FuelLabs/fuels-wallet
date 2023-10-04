import { DocSearch } from '@docsearch/react';
import docsearch from '~/docsearch.json';

export function Search() {
  return (
    <DocSearch
      indexName={docsearch.index_name}
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!}
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!}
      disableUserPersonalization={true}
    />
  );
}
