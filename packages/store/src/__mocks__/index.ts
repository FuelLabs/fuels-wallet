import { createStore } from '../StoreClass';

import type { CounterMachine } from './counterMachine';
import { counterHandlers, counterMachine } from './counterMachine';
import type { TodosMachine } from './todosMachine';
import { todosHandlers, todosMachine } from './todosMachine';

export * from './counterMachine';
export * from './todosMachine';

export type StoreMachines = {
  counter: CounterMachine;
  todos: TodosMachine;
};

export const store$ = createStore<StoreMachines>({
  id: 'testStore',
  persistedStates: ['todos'],
});

export const mockStore = store$
  .addMachine('todos', () =>
    todosMachine.withContext({
      todos: [],
    })
  )
  .addMachine('counter', () =>
    counterMachine.withContext({
      count: 0,
      incValue: 2,
      type: 'manual',
    })
  )
  .addHandlers(counterHandlers)
  .addHandlers(todosHandlers)
  .setup();
