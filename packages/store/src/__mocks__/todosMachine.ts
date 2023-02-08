import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { StoreClass } from '../StoreClass';

import type { StoreMachines } from '.';

type Todo = {
  id: number;
  text: string;
  completed?: boolean;
};

type MachineContext = {
  todos: Todo[];
};

type MachineEvents =
  | {
      type: 'ADD_TODO';
      input: Todo;
    }
  | {
      type: 'REMOVE_TODO';
      input: { id: number };
    }
  | {
      type: 'COMPLETE_TODO';
      input: { id: number };
    }
  | {
      type: 'CLEAR_COMPLETED';
      input?: null;
    }
  | {
      type: 'RESET';
      input?: null;
    };

export const todosMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./todosMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          ADD_TODO: {
            target: 'idle',
            actions: ['addTodo'],
          },
          REMOVE_TODO: {
            target: 'idle',
            actions: ['removeTodo'],
          },
          COMPLETE_TODO: {
            target: 'idle',
            actions: ['completeTodo'],
          },
          CLEAR_COMPLETED: {
            target: 'idle',
            actions: ['clearCompleted'],
          },
          RESET: {
            target: 'idle',
            actions: ['reset'],
          },
        },
      },
    },
  },
  {
    actions: {
      addTodo: assign({
        todos: (context, event) => {
          const todo = event.input;
          return [...context.todos, todo];
        },
      }),
      removeTodo: assign({
        todos: (context, event) => {
          const id = event.input.id;
          return context.todos.filter((todo) => todo.id !== id);
        },
      }),
      completeTodo: assign({
        todos: (context, event) => {
          const id = event.input.id;
          return context.todos.map((todo) => {
            if (todo.id === id) {
              return {
                ...todo,
                completed: true,
              };
            }
            return todo;
          });
        },
      }),
      clearCompleted: assign({
        todos: (context) => {
          return context.todos.filter((todo) => !todo.completed);
        },
      }),
      reset: assign({
        todos: (_) => {
          return [];
        },
      }),
    },
  }
);

export type TodosMachine = typeof todosMachine;
export type TodosMachineState = StateFrom<TodosMachine>;
export type TodosMachineService = InterpreterFrom<TodosMachine>;

export function todosHandlers(store: StoreClass<StoreMachines>) {
  return {
    addTodo: (todo: Todo) => {
      store.send('todos', { type: 'ADD_TODO', input: todo });
    },
    removeTodo: (id: number) => {
      store.send('todos', { type: 'REMOVE_TODO', input: { id } });
    },
    completeTodo: (id: number) => {
      store.send('todos', { type: 'COMPLETE_TODO', input: { id } });
    },
    clearCompleted: () => {
      store.send('todos', { type: 'CLEAR_COMPLETED' });
    },
    resetTodos: () => {
      store.send('todos', { type: 'RESET' });
    },
  };
}
