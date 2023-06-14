import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { createMockStore } from './__mocks__';

const STORE_ID = 'ReactFactory_store';
const { mockStore: store } = createMockStore(STORE_ID);

const opts = {
  wrapper: ({ children }: { children: ReactNode }) => (
    <store.StoreProvider>{children}</store.StoreProvider>
  ),
};

describe('ReactFactory', () => {
  beforeEach(() => {
    store.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should persist todos state on local storage', async () => {
    expect(store.persistedStates).toEqual(['todos']);
    const spy = jest.spyOn(localStorage, 'setItem');
    const payload = { id: 1, text: 'test' };
    store.addTodo(payload);

    const { result } = renderHook(() => {
      return store.useSelector('todos', (state) => state.context.todos);
    }, opts);
    expect(result.current).toEqual([payload]);
    expect(spy).toBeCalledTimes(1);

    let storageState: ReturnType<typeof store.services.todos.getSnapshot>;
    expect(() => {
      storageState = JSON.parse(localStorage.getItem('@xstate/store_todos')!);
      expect(storageState.context.todos).toEqual([payload]);
    }).not.toThrow();
  });

  describe('useSelector()', () => {
    it('should return the correct value', async () => {
      const selector = jest.fn((state) => state.context.todos);
      const { result, rerender } = renderHook(() => {
        return store.useSelector('todos', selector);
      }, opts);

      expect(result.current).toEqual([]);
      expect(selector).toHaveBeenCalledTimes(1);
      store.addTodo({ id: 1, text: 'test' });
      expect(selector).toHaveBeenCalledTimes(2);
      rerender();
      expect(result.current).toEqual([{ id: 1, text: 'test' }]);
      store.addTodo({ id: 2, text: 'test' });
      store.addTodo({ id: 3, text: 'test' });
      expect(selector).toHaveBeenCalledTimes(4);
      rerender();
      expect(result.current).toEqual([
        { id: 1, text: 'test' },
        { id: 2, text: 'test' },
        { id: 3, text: 'test' },
      ]);
      store.removeTodo(2);
      store.completeTodo(1);
      expect(selector).toHaveBeenCalledTimes(6);
      rerender();
      expect(result.current).toEqual([
        { id: 1, text: 'test', completed: true },
        { id: 3, text: 'test' },
      ]);
      store.clearCompleted();
      expect(selector).toHaveBeenCalledTimes(7);
      rerender();
      expect(result.current).toEqual([{ id: 3, text: 'test' }]);
    });
  });

  describe('useService()', () => {
    it('should return an initialized service from store', async () => {
      const spy = jest.spyOn(store, 'useService');
      const { result } = renderHook(() => store.useService('counter'), opts);
      expect(spy).toBeCalledTimes(2);
      expect(spy).toBeCalledWith('counter');
      store.increment();
      store.increment();
      store.decrement();
      expect(result.current).toBe(store.services.counter);
      expect(result.current.initialized).toBe(true);
      expect(spy).toBeCalledTimes(2);
    });
  });

  describe('useState()', () => {
    it('should return a state from a service', async () => {
      const { result } = renderHook(() => store.useState('counter'), opts);
      const currState = result.current[0];
      const serviceState = store.services.counter.getSnapshot();
      expect(currState.context.count).toBe(serviceState.context.count);
    });
  });

  describe('useUpdateMachineConfig()', () => {
    it('should update the machine config', async () => {
      let logger = 0;
      const { result } = renderHook(() => {
        return store.useUpdateMachineConfig('counter', {
          actions: {
            log(ctx) {
              logger = ctx.count;
            },
          },
        });
      }, opts);

      expect(result.current).toBe(store.services.counter);
      store.increment();
      expect(logger).toBe(2);
      store.increment();
      expect(logger).toBe(4);
      store.decrement();
      expect(logger).toBe(2);
    });
  });
});
