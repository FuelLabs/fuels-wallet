/* eslint-disable no-restricted-syntax */
import { counterHandlers, mockStore, store$, todosHandlers } from './__mocks__';

describe('StoreClass', () => {
  beforeEach(() => {
    mockStore.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have an id', async () => {
    expect(mockStore.id).toBe('testStore');
  });

  it('should have todos configured on state storage', async () => {
    expect(mockStore.persistedStates).toEqual(['todos']);
  });
  describe('addMachine()', () => {
    it('should create all services inside store', async () => {
      const { services } = mockStore;
      expect(Object.keys(services).length).toBe(2);
      expect(Object.keys(services)).toContain('counter');
      expect(Object.keys(services)).toContain('todos');
      expect(services.counter).toBeDefined();
      expect(services.todos).toBeDefined();
    });

    it('should all services be initialized', async () => {
      const { services } = mockStore;
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
        expect(mockStore[key]).toBeDefined();
        expect(mockStore[key]).toBeInstanceOf(Function);
      }
    });
  });

  describe('setup()', () => {
    it('should have a StoreProvider attached on store', async () => {
      expect(mockStore.StoreProvider).toBeDefined();
    });

    it('should have all hooks attached on store', async () => {
      expect(mockStore.useService).toBeDefined();
      expect(mockStore.useSelector).toBeDefined();
      expect(mockStore.useState).toBeDefined();
      expect(mockStore.useUpdateMachineConfig).toBeDefined();
      expect(mockStore.useWaitFor).toBeDefined();
      expect(mockStore.useService).toBeInstanceOf(Function);
      expect(mockStore.useSelector).toBeInstanceOf(Function);
      expect(mockStore.useState).toBeInstanceOf(Function);
      expect(mockStore.useUpdateMachineConfig).toBeInstanceOf(Function);
      expect(mockStore.useWaitFor).toBeInstanceOf(Function);
    });
  });

  describe('send()', () => {
    it('should be able to send an event to a specific service', async () => {
      const spy1 = jest.spyOn(mockStore, 'send');
      const spy3 = jest.spyOn(mockStore, 'addTodo');
      const spy2 = jest.spyOn(mockStore.services.todos, 'send');
      const { getStateFrom } = mockStore;
      expect(getStateFrom('todos').context.todos.length).toBe(0);
      mockStore.addTodo({ id: '1', text: 'test' });
      expect(getStateFrom('todos').context.todos.length).toBe(1);
      expect(spy1).toBeCalledTimes(1);
      expect(spy2).toBeCalledTimes(1);
      expect(spy3).toBeCalledWith({ id: '1', text: 'test' });
    });
  });

  describe('reset()', () => {
    it('should be able to reset store', async () => {
      mockStore.increment();
      mockStore.addTodo({ id: '1', text: 'test' });
      expect(mockStore.getStateFrom('counter').context.count).toBe(2);
      expect(mockStore.getStateFrom('todos').context.todos.length).toBe(1);
      mockStore.reset();
      expect(mockStore.getStateFrom('counter').context.count).toBe(0);
      expect(mockStore.getStateFrom('todos').context.todos.length).toBe(0);
    });
  });

  describe('broadcast()', () => {
    it('should be able to broadcast an event to all services', async () => {
      const { getStateFrom } = mockStore;
      const spy1 = jest.spyOn(mockStore, 'broadcast');
      const spy2 = jest.spyOn(mockStore.services.todos, 'send');
      const spy3 = jest.spyOn(mockStore.services.counter, 'send');

      mockStore.increment();
      mockStore.addTodo({ id: '1', text: 'test' });
      expect(spy2).toBeCalledTimes(1);
      expect(spy3).toBeCalledTimes(1);
      expect(getStateFrom('counter').context.count).toBe(2);
      expect(getStateFrom('todos').context.todos.length).toBe(1);
      mockStore.broadcast({ type: 'RESET' });
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
      mockStore.onStoreStart(spy);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('onStateChange()', () => {
    it('should be able to add a listener to store stage change', async () => {
      const spy = jest.fn();
      mockStore.onStateChange('counter', spy);
      mockStore.increment();
      expect(spy).toBeCalledTimes(2);
    });
  });

  describe('getStateFrom()', () => {
    it('should be able to get state from a specific service', async () => {
      const { getStateFrom } = mockStore;
      expect(getStateFrom('counter').context.count).toBe(0);
      expect(getStateFrom('todos').context.todos.length).toBe(0);
    });
  });

  describe('waitFor()', () => {
    it('should be able to wait for a specific service', async () => {
      const spy = jest.fn((state) => state.context.type === 'automatic');
      mockStore.setCounterType('automatic');
      const state = await mockStore.waitFor('counter', spy);

      expect(state).toBeDefined();
      expect(state.context.type).toBe('automatic');
      expect(spy).toBeCalledTimes(1);
      jest.clearAllTimers();
    });
  });
});
