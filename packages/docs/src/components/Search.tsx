import { DocSearch } from '@docsearch/react';

import { index_name } from '~/docsearch.json';

export function Search() {
  return (
    <DocSearch
      indexName={index_name}
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!}
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!}
      disableUserPersonalization={true}
    />
  );
}
