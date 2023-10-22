import { urlJoin } from './url';

describe('Url', () => {
  test('urlJoin()', () => {
    const value = urlJoin('http://localhost:3000', 'test', 'test2');
    expect(value).toBe('http://localhost:3000/test/test2');

    const value2 = urlJoin('/test/', '/test2');
    expect(value2).toBe('/test/test2');

    const value3 = urlJoin(undefined, '/test/', '/test2');
    expect(value3).toBe('test/test2');

    const value4 = urlJoin('http://localhost:3000/', '/test/', '/test2');
    expect(value4).toBe('http://localhost:3000/test/test2');

    const value5 = urlJoin(
      'http://localhost:3000/foo/bar/',
      '/test/',
      '/test2'
    );
    expect(value5).toBe('http://localhost:3000/foo/bar/test/test2');

    const value6 = urlJoin('/', '/test2');
    expect(value6).toBe('/test2');
  });
});
