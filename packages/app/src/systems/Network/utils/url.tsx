function isValidUrl(url: string) {
  let validUrl;
  try {
    validUrl = new URL(url);
  } catch (e) {
    return false;
  }
  return validUrl.protocol === 'http:' || validUrl.protocol === 'https:';
}

export function isValidNetworkUrl(url?: string) {
  if (!url) return false;

  // Validate `localhost` urls only
  if (url.includes('localhost')) {
    return isValidUrl(url) && url.endsWith('/graphql');
  }

  // Note: new URL('https://graphql') returns `true`
  const pattern = new RegExp(
    '^https?:\\/\\/' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return pattern.test(url) && url.endsWith('/graphql');
}
