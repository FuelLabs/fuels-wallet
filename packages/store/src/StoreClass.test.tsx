/* eslint-disable no-restricted-syntax */
import { counterHandlers, createMockStore, todosHandlers } from './__mocks__';

const STORE_ID = 'StoreClass_store';
const { mockStore: store, store$ } = createMockStore(STORE_ID);

describe('StoreClass', () => {
  beforeEach(() => {
    store.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have an id', async () => {
    expect(store.id).toBe(STORE_ID);
  });

  it('should have todos configured on state storage', async () => {
    expect(store.persistedStates).toEqual(['todos']);
  });

  describe('addMachine()', () => {
    it('should create all services inside store', async () => {
      const { services } = store;
      expect(Object.keys(services).length).toBe(2);
      expect(Object.keys(services)).toContain('counter');
      expect(Object.keys(services)).toContain('todos');
      expect(services.counter).toBeDefined();
      expect(services.todos).toBeDefined();
    });

    it('should all services be initialized', async () => {
      const { services } = store;
      expect(services.counter.initialized).toBe(true);
      expect(services.todos.initialized).toBe(true);
    });
  });

  describe('addHandlers()', () => {
    it('should had added custom handlers on store', async () => {
      const counterHandlersKeys = Object.keys(counterHandlers(store$));
      const todosHandlersKeys = Object.keys(todosHandlers(store$));
      const allCustomHandler = [...counterHandlersKeys, ...todosHandlersKeys];

      for (const key of allCustomHandler) {
        expect(store[key]).toBeDefined();
        expect(store[key]).toBeInstanceOf(Function);
      }
    });
  });

  describe('setup()', () => {
    it('should have a StoreProvider attached on store', async () => {
      expect(store.StoreProvider).toBeDefined();
    });

    it('should have all hooks attached on store', async () => {
      expect(store.useService).toBeDefined();
      expect(store.useSelector).toBeDefined();
      expect(store.useState).toBeDefined();
      expect(store.useUpdateMachineConfig).toBeDefined();
      expect(store.useService).toBeInstanceOf(Function);
      expect(store.useSelector).toBeInstanceOf(Function);
      expect(store.useState).toBeInstanceOf(Function);
      expect(store.useUpdateMachineConfig).toBeInstanceOf(Function);
    });
  });

  describe('send()', () => {
    it('should be able to send an event to a specific service', async () => {
      const spy1 = jest.spyOn(store, 'send');
      const spy3 = jest.spyOn(store, 'addTodo');
      const spy2 = jest.spyOn(store.services.todos, 'send');
      const { getStateFrom } = store;
      expect(getStateFrom('todos').context.todos.length).toBe(0);
      store.addTodo({ id: 1, text: 'test' });
      expect(getStateFrom('todos').context.todos.length).toBe(1);
      expect(spy1).toBeCalledTimes(1);
      expect(spy2).toBeCalledTimes(1);
      expect(spy3).toBeCalledWith({ id: 1, text: 'test' });
    });
  });

  describe('reset()', () => {
    it('should be able to reset store', async () => {
      store.increment();
      store.addTodo({ id: 1, text: 'test' });
      expect(store.getStateFrom('counter').context.count).toBe(2);
      expect(store.getStateFrom('todos').context.todos.length).toBe(1);
      store.reset();
      expect(store.getStateFrom('counter').context.count).toBe(0);
      expect(store.getStateFrom('todos').context.todos.length).toBe(0);
    });
  });

  describe('broadcast()', () => {
    it('should be able to broadcast an event to all services', async () => {
      const { getStateFrom } = store;
      const spy1 = jest.spyOn(store, 'broadcast');
      const spy2 = jest.spyOn(store.services.todos, 'send');
      const spy3 = jest.spyOn(store.services.counter, 'send');

      store.increment();
      store.addTodo({ id: 1, text: 'test' });
      expect(spy2).toBeCalledTimes(1);
      expect(spy3).toBeCalledTimes(1);
      expect(getStateFrom('counter').context.count).toBe(2);
      expect(getStateFrom('todos').context.todos.length).toBe(1);
      store.broadcast({ type: 'RESET' });
      expect(getStateFrom('counter').context.count).toBe(0);
      expect(getStateFrom('todos').context.todos.length).toBe(0);
      expect(spy2).toBeCalledTimes(2);
      expect(spy3).toBeCalledTimes(2);
      expect(spy1).toBeCalledTimes(1);
    });
  });

  describe('onStoreStart()', () => {
    it('should be able to add a listener to store start', async () => {
      const spy = jest.fn();
      store.onStoreStart(spy);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('onStateChange()', () => {
    it('should be able to add a listener to store stage change', async () => {
      const spy = jest.fn();
      store.onStateChange('counter', spy);
      store.increment();
      expect(spy).toBeCalledTimes(2);
    });
  });

  describe('getStateFrom()', () => {
    it('should be able to get state from a specific service', async () => {
      const { getStateFrom } = store;
      expect(getStateFrom('counter').context.count).toBe(0);
      expect(getStateFrom('todos').context.todos.length).toBe(0);
    });
  });

  describe('waitFor()', () => {
    it('should be able to wait for a specific service', async () => {
      const spy = jest.fn((state) => state.context.type === 'automatic');
      store.setCounterType('automatic');
      const state = await store.waitFor('counter', spy);

      expect(state).toBeDefined();
      expect(state.context.type).toBe('automatic');
      expect(spy).toBeCalledTimes(1);
      jest.clearAllTimers();
    });
  });
});
