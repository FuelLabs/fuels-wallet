export const graphqlRequest = async <R, T = Record<string, unknown>>(
  url: string,
  operationName: string,
  query: string,
  variables: T
): Promise<R> => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operationName,
      query,
      variables,
    }),
  });

  if (res.ok) {
    const response = await res.json();
    return response.data as R;
  }

  const error = await res.json();
  return Promise.reject(error);
};
