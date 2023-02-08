import EventEmitter from 'events';

import { LocalStorage } from '.';

describe('LocalStorage', () => {
  let storage: LocalStorage;
  const setSpy = jest.spyOn(localStorage, 'setItem');
  const getSpy = jest.spyOn(localStorage, 'getItem');
  const removeSpy = jest.spyOn(localStorage, 'removeItem');

  beforeEach(() => {
    storage = new LocalStorage('TEST_');
  });
  afterEach(() => {
    storage.clear();
  });

  it('should be able to set and get items', () => {
    storage.setItem('foo', 'bar');
    expect(storage.getItem('foo')).toBe('bar');
    expect(setSpy).toHaveBeenCalledWith('TEST_foo', '"bar"');
    expect(getSpy).toHaveBeenCalledWith('TEST_foo');
  });

  it('should be able to clear all items', () => {
    storage.setItem('foo', 'bar');
    storage.setItem('bar', 'baz');
    storage.clear();
    expect(storage.getItem('foo')).toBeNull();
    expect(storage.getItem('bar')).toBeNull();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('should be able to remove an item', () => {
    storage.setItem('foo', 'bar');
    storage.removeItem('foo');
    expect(storage.getItem('foo')).toBeNull();
    expect(removeSpy).toHaveBeenCalledWith('TEST_foo');
  });

  it('should be able to subscribe and unsubscribe to changes', () => {
    const emitter = new EventEmitter();
    const emitSpy = jest.spyOn(emitter, 'emit');
    const onSpy = jest.spyOn(emitter, 'on');
    const offSpy = jest.spyOn(emitter, 'off');
    storage = new LocalStorage('TEST_', emitter);
    const listener = jest.fn();
    const unsubscribe = storage.subscribe(listener);
    expect(onSpy).toHaveBeenCalledWith('change', listener);
    storage.setItem('foo', 'bar');
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('foo', 'bar');
    storage.setItem('foo', 'baz');
    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith('foo', 'baz');
    storage.clear();
    expect(emitSpy).toHaveBeenCalledTimes(3);
    expect(listener).toHaveBeenCalledTimes(3);
    unsubscribe();
    expect(offSpy).toHaveBeenCalledWith('change', listener);
  });
});
