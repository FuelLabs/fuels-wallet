import { DEVNET_NETWORK_URL, TESTNET_NETWORK_URL } from 'fuels';

const URL_PATTERN = new RegExp(
  '^(?<protocol>https?:\\/\\/)' +
    '(?:(?<auth>[\\w%.~+-]+:[\\w%.~+-]+)@)?' +
    '(?<host>' +
    '(?:' +
    '(?:[\\w-]+\\.)*[a-z]{2,}|' + // Domain name
    '(?:\\d{1,3}\\.){3}\\d{1,3}' + // IP address
    ')' +
    ')' +
    '(?::(?<port>\\d+))?' +
    '(?<path>\\/[\\w%.~+-]*)*?' +
    '(?<query>\\?[\\w%.~+=&-]*)?' +
    '(?<fragment>#[\\w%.-]*)?' +
    '$',
  'gi'
);

export function isValidNetworkUrl(url?: string) {
  if (!url) return false;

  // Reset lastIndex to 0 before each test
  URL_PATTERN.lastIndex = 0;
  return URL_PATTERN.test(url);
}

export function isNetworkTestnet(url: string) {
  return url.includes(TESTNET_NETWORK_URL);
}

export function isNetworkDevnet(url: string) {
  return url.includes(DEVNET_NETWORK_URL);
}
