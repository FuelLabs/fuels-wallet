export function isValidNetworkUrl(url?: string) {
  if (!url) return false;
  // Note: new URL('https://graphql') returns `true`
  const pattern = new RegExp(
    '^(https?:\\/\\/)' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))|' +
      'localhost' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return pattern.test(url) && url.endsWith('/graphql');
}
