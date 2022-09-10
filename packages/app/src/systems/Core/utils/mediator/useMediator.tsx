/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useId } from "react";
import { interpret, InterpreterStatus } from "xstate";

import type { Listener } from "./mediatorMachine";
import { mediatorMachine } from "./mediatorMachine";

/**
 * This will start the service outside React just one time
 */
const service = interpret(mediatorMachine);
if (service.status !== InterpreterStatus.Running) {
  service.start();
}

/**
 * This function will create an event that will be used to send/register
 * inside the mediator
 */
export function createEvent<T>(name: string) {
  const fn = (data?: T extends null ? null : T) => {
    service.send("send", { name, data });
  };
  fn._name = name;
  return fn;
}

type Event<T> = (data: T) => void;

export function useSubscribe<T>(
  event: Event<T>,
  listener: Listener<T>,
  deps?: any[]
) {
  const id = useId();
  const evName = (event as any)._name;
  useEffect(() => {
    service.send("register", { data: { event: evName, id, listener } });
    return () => {
      service.send("unregister", { data: { event: evName, id } });
    };
  }, deps);
}
