import { DEVNET_NETWORK_URL, TESTNET_NETWORK_URL } from 'fuels';

export function isValidNetworkUrl(url?: string) {
  if (!url) return false;

  // ^https?:\/\/(?:[a-z\d%_.~+-]+:[a-z\d%_.~+-]+@)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.{0,1})+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.-]*)*?(\?[&a-z\d%_.~+=-]*)?([a-zA-Z\d]*)$
  const pattern = new RegExp(
    '^https?:\\/\\/' + // Matches the protocol (http or https)
      '(?:[a-z\\d%_.~+-]+:[a-z\\d%_.~+-]+@)?' + // Optional basic auth (user:password@)
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.{0,1})+[a-z]{2,}|' + // Matches domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // Or matches IP address
      '(\\:\\d+)?' + // Optional port number
      '(\\/[-a-z\\d%_.-]*)*?' + // Makes any path optional, including no path, and multiple paths
      '(\\?[&a-z\\d%_.~+=-]*)?' + // Optional query parameters
      '([a-zA-Z\\d]*)$', // mnake sure it blocks any extra special character in the URL
    'i' // Case-insensitive
  );
  return pattern.test(url);
}
export function isNetworkTestnet(url: string) {
  return url.includes(TESTNET_NETWORK_URL);
}

export function isNetworkDevnet(url: string) {
  return url.includes(DEVNET_NETWORK_URL);
}
