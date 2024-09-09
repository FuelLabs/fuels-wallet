import { isNetworkDevnet, isNetworkTestnet, isValidNetworkUrl } from './url';

describe('Network URL Utilities', () => {
  describe('isValidNetworkUrl()', () => {
    // Test for valid URLs
    it('should return true for valid network urls', () => {
      // Basic URLs with and without paths
      expect(isValidNetworkUrl('http://localhost:4000')).toBe(true);
      expect(isValidNetworkUrl('http://localhost:4000/graphql')).toBe(true);
      expect(isValidNetworkUrl('https://testnet.fuel.network')).toBe(true);
      expect(isValidNetworkUrl('https://testnet.fuel.network/v1/graphql')).toBe(
        true
      );
      expect(
        isValidNetworkUrl(
          'https://testnet.fuel.network/v1/graphql?filter=active&sort=desc'
        )
      ).toBe(true);
      expect(isValidNetworkUrl('https://beta-5.fuel.network')).toBe(true);
      expect(isValidNetworkUrl('https://beta-5.fuel.network/graphql')).toBe(
        true
      );
      expect(
        isValidNetworkUrl(
          'https://beta-5.fuel.network/graphql?filter=active&sort=desc'
        )
      ).toBe(true);

      // URLs with basic auth, with and without paths
      expect(isValidNetworkUrl('https://user:password123@example.com')).toBe(
        true
      );
      expect(
        isValidNetworkUrl('https://user:password123@example.com/api/data')
      ).toBe(true);
      expect(
        isValidNetworkUrl(
          'https://user:password123@example.com/api/data?filter=active&sort=desc'
        )
      ).toBe(true);
      expect(isValidNetworkUrl('http://admin:1234@localhost:8080')).toBe(true);
      expect(
        isValidNetworkUrl('http://admin:1234@localhost:8080/settings')
      ).toBe(true);

      // URLs with query parameters, with and without paths
      expect(isValidNetworkUrl('https://example.com?query=test&limit=10')).toBe(
        true
      );
      expect(
        isValidNetworkUrl('https://example.com/api?query=test&limit=10')
      ).toBe(true);

      // URLs with IP addresses and ports, with and without paths
      expect(isValidNetworkUrl('http://192.168.1.1:8080')).toBe(true);
      expect(isValidNetworkUrl('http://192.168.1.1:8080/config')).toBe(true);

      // Complex URLs
      expect(
        isValidNetworkUrl(
          'https://user:pass@domain.com:8080/api/data?name=John&age=30'
        )
      ).toBe(true);
    });

    // Test for invalid URLs
    it('should return false for invalid network urls', () => {
      // Missing protocols
      expect(isValidNetworkUrl('localhost:4000')).toBe(false);

      // Invalid basic auth format
      expect(isValidNetworkUrl('https://user:@example.com')).toBe(false);
      expect(isValidNetworkUrl('https://:password@localhost:8080')).toBe(false);

      // Incomplete URLs
      expect(isValidNetworkUrl('http://')).toBe(false);

      // Incorrect domain format
      expect(isValidNetworkUrl('beta3-5-devv.swayswap.io')).toBe(false);

      // URLs with spaces
      expect(isValidNetworkUrl('http://example .com')).toBe(false);

      // URLs with illegal characters in the domain
      expect(isValidNetworkUrl('http://exa$mple.com')).toBe(false);

      //Tests if authentication URL without ":" should fail without hanging the V8 Thread
      // https://issues.chromium.org/issues/365066528
      expect(
        isValidNetworkUrl(
          'https://fffffff10abbxyFfffFFOfFffF0Fff@supernet.ffff.network/v1/graphql'
        )
      ).toBe(false);
    });
  });

  describe('isNetworkTestnet', () => {
    it('should return true for valid testnet URL without query params', () => {
      const url = 'https://testnet.fuel.network/v1/graphql';
      expect(isNetworkTestnet(url)).toBe(true);
    });

    it('should return true for valid testnet URL with query params', () => {
      const url =
        'https://testnet.fuel.network/v1/graphql?filter=active&sort=desc';
      expect(isNetworkTestnet(url)).toBe(true);
    });

    it('should return false for non-testnet URL', () => {
      const url = 'https://mainnet.fuel.network/v1/graphql';
      expect(isNetworkTestnet(url)).toBe(false);
    });
  });

  describe('isNetworkDevnet', () => {
    it('should return true for valid devnet URL without query params', () => {
      const url = 'https://devnet.fuel.network/v1/graphql';
      expect(isNetworkDevnet(url)).toBe(true);
    });

    it('should return true for valid devnet URL with query params', () => {
      const url =
        'https://devnet.fuel.network/v1/graphql?filter=active&sort=desc';
      expect(isNetworkDevnet(url)).toBe(true);
    });

    it('should return false for non-devnet URL', () => {
      const url = 'https://mainnet.fuel.network/v1/graphql';
      expect(isNetworkDevnet(url)).toBe(false);
    });
  });
});
