/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import ShortUniqueId from 'short-unique-id';
import { interpret, InterpreterStatus } from 'xstate';

import type { Listener } from './mediatorMachine';
import { mediatorMachine } from './mediatorMachine';

/**
 * This will start the service outside React scope
 */
const service = interpret(mediatorMachine);
if (service.status !== InterpreterStatus.Running) {
  service.start();
}

type ArrayType<T> = T extends (infer Item)[] ? Item[] : T;

/**
 * This function will create an event that will be used to send/register
 * inside the mediator
 */
export function createEvent(name: string) {
  function fn<T extends ArrayType<any>>(...args: T extends any[] ? T : never) {
    service.send('send', { name, data: args[0] });
  }
  fn._name = name;
  return fn;
}

type Event<T> = (data: T) => void;

export function subscribe<T>(event: Event<T>, listener: Listener<T>) {
  const id = new ShortUniqueId({ length: 10 });
  const evName = (event as any)._name;
  service.send('register', { data: { event: evName, id, listener } });
  return {
    unsubscribe: () => {
      service.send('unregister', { data: { event: evName, id } });
    },
  };
}

export function useSubscribe<T>(event: Event<T>, listener: Listener<T>, deps?: any[]) {
  useEffect(() => {
    const sub = subscribe(event, listener);
    return sub.unsubscribe;
  }, deps);
}
