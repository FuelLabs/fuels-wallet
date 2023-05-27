import type { Page } from '@playwright/test';

export async function modifyGraphqlOperationStatus(
  page: Page,
  newStatus: number,
  operationName: string
) {
  await page.route('**/graphql', (route) => {
    const body: { query: string } = route.request().postDataJSON();
    const query = body.query;
    const response = route.fetch();
    if (hasOperationName(query, operationName)) {
      route.fulfill({
        status: newStatus,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            [operationName]: response,
          },
        }),
      });
    }
  });
  return page;
}

const hasOperationName = (query: string, operationName: string) =>
  query.includes(operationName);
