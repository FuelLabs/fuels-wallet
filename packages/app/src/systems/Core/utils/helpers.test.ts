import { assocPath, mergeRight, pathOr } from './helpers';

describe('helpers', () => {
  describe('pathOr()', () => {
    it('should return the value of the specified key in the object', () => {
      const obj = { foo: { bar: { baz: 'hello world' } } };
      const result = pathOr(obj, 'foo.bar.baz');
      expect(result).toBe('hello world');
    });

    it('should throw an error if the path is not a string', () => {
      const obj = { foo: { bar: { baz: 'hello world' } } };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => pathOr(obj, ['foo', 'bar', 'baz'])).toThrowError(
        'Path must be a string'
      );
    });

    it('should return a default value if path does not exist', () => {
      const obj = { foo: { bar: { baz: 'hello world' } } };
      const result = pathOr(obj, 'foo.bar.bazzz', 'default');
      expect(result).toBe('default');
    });
  });

  describe('mergeRight()', () => {
    it('should merge two objects correctly', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const expected = { a: 1, b: 3, c: 4 };
      expect(mergeRight(obj1, obj2)).toEqual(expected);
    });

    it('should overrides values in the first object with values from the second object', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const expected = { a: 1, b: 3, c: 4 };
      expect(mergeRight(obj1, obj2)).toEqual(expected);
    });

    it('should merge nested objects correctly', () => {
      const obj1 = { a: { b: 1, c: 2 } };
      const obj2 = { a: { b: 3, d: 4 } };
      const expected = { a: { b: 3, c: 2, d: 4 } };
      expect(mergeRight(obj1, obj2)).toEqual(expected);
    });

    it('should merge arrays correctly', () => {
      const a = { a: [1, 2] };
      const b = { a: [3, 4] };
      const expected = { a: [1, 2, 3, 4] };
      expect(mergeRight(a, b)).toEqual(expected);
    });
  });

  describe('assocPath()', () => {
    it('should updates the value of the specified property in the object', () => {
      const obj = { foo: { bar: { baz: 1 } } };
      const expected = { foo: { bar: { baz: 2 } } };
      const result = assocPath(obj, 'foo.bar.baz', 2);
      expect(result).toEqual(expected);
    });

    it('should creates new properties if they do not exist', () => {
      const obj = {};
      const expected = { foo: { bar: { baz: 2 } } };
      expect(assocPath(obj, 'foo.bar.baz', 2)).toEqual(expected);
    });

    it('should returns the original object if the path is empty', () => {
      const obj = { foo: { bar: { baz: 1 } } };
      expect(assocPath(obj, '', 2)).toBe(obj);
    });

    it('should not modify the original object', () => {
      const obj = { foo: { bar: { baz: 1 } } };
      const updated = assocPath(obj, 'foo.bar.baz', 2);
      expect(obj).toEqual({ foo: { bar: { baz: 1 } } });
      expect(updated).toEqual({ foo: { bar: { baz: 2 } } });
    });
  });
});
