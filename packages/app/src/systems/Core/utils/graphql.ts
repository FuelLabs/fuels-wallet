export const graphqlRequest = async <R, T = Record<string, unknown>>(
  url: string,
  operationName: string,
  query: string,
  variables: T
): Promise<R> => {
  const parsedUrl = new URL(url);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (parsedUrl.username || parsedUrl.password) {
    const auth = btoa(`${parsedUrl.username}:${parsedUrl.password}`);
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    headers['Authorization'] = `Basic ${auth}`;
    parsedUrl.username = '';
    parsedUrl.password = '';
  }

  const res = await fetch(parsedUrl.toString(), {
    method: 'POST',
    headers,
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
