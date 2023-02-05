/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable consistent-return */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MaybeLazy } from '@xstate/react/lib/types';
import type { AnyStateMachine } from 'xstate';
import { interpret } from 'xstate';

import type {
  Handlers,
  AddMachineParams,
  MachinesObj,
  Service,
  InterpreterOptions,
} from './types';

/**
 * Create store handlers. Functions that will be available on the store object and
 * can be used to dispatch store events.
 * @param opts - the options passed to the `setup` function
 * @param keys - the keys of the services
 * @returns an object with the handlers
 * @throws if a handler has the same name as a service key
 */
export function createHandlers<H extends Handlers, Keys extends any[]>(
  keys: Keys,
  handlers?: H
) {
  const fns = handlers || {};
  return Object.entries(fns).reduce((obj, [key, fn]) => {
    if (keys.includes(key)) {
      throw new Error(
        `You cannot use "${key}" as event, because it's already a store property`
      );
    }
    return { ...obj, [key]: fn };
  }, {} as H);
}

/**
 * Create specific machine options from a generic Interpreter object.
 * @param opts InterpreterOptions<M>
 * @returns MachineConfig
 */
function getMachineConfig<M extends AnyStateMachine>(
  opts: InterpreterOptions<M>
) {
  const { guards, actions, services, delays, context: _context } = opts || {};
  return {
    ...(guards && { guards }),
    ...(actions && { actions }),
    ...(services && { services }),
    ...(delays && { delays }),
  };
}

/**
 * Get the interpreter options from the given options.
 * @param opts InterpreterOptions<M>
 * @returns InterpreterOptions<M>
 */
function getInterpreterOpts<M extends AnyStateMachine>(
  opts: InterpreterOptions<M>
) {
  const {
    guards: _guards,
    actions: _actions,
    services: _services,
    delays: _delays,
    context: _context,
    ...interpreterOpts
  } = opts || {};
  return interpreterOpts;
}

/**
 * Create a machine with the given options.
 * @param getMachine A machine or a function that returns a machine
 * @param opts CreateMachineOpts<M> - options to pass to the machine
 * @returns AnyStateMachine
 */
export function setMachine<M extends AnyStateMachine>(
  getMachine: MaybeLazy<M>,
  opts: InterpreterOptions<M> = {}
) {
  const { context } = opts;
  const machine = typeof getMachine === 'function' ? getMachine() : getMachine;
  const machineConfig = getMachineConfig(opts);
  const machineWithConfig = machine.withConfig(machineConfig as any, () => ({
    ...machine.context,
    ...context,
  }));
  return machineWithConfig;
}

/**
 * Create a service with the given options.
 * @param getMachine A machine or a function that returns a machine
 * @param opts CreateMachineOpts<M> - options to pass to the machine
 * @returns AnyInterpreter
 */
export function createIdleService<M extends AnyStateMachine>(
  getMachine: MaybeLazy<M>,
  opts: InterpreterOptions<M> = {}
) {
  const config = getMachineConfig(opts);
  const interpreterOptions = getInterpreterOpts(opts);
  const machine = setMachine(getMachine, opts);
  const service = interpret(machine, interpreterOptions);
  Object.assign(service.machine.options.actions ?? {}, config.actions);
  Object.assign(service.machine.options.guards ?? {}, config.guards);
  Object.assign(service.machine.options.services ?? {}, config.services);
  Object.assign(service.machine.options.delays ?? {}, config.delays);
  return service;
}

/**
 * Update the service's options using deepEquals to check if the options have changed.
 * @param service A service
 * @param opts Options
 * @returns void
 */
export function updateService<
  T extends MachinesObj,
  K extends keyof T = keyof T
>(service: Service<T> | undefined, opts: AddMachineParams<T, K>[2]) {
  if (!service) return;
  Object.assign(service.machine.options.actions ?? {}, opts.actions ?? {});
  Object.assign(service.machine.options.guards ?? {}, opts.guards ?? {});
  Object.assign(service.machine.options.services ?? {}, opts.services ?? {});
  Object.assign(service.machine.options.delays ?? {}, opts.delays ?? {});
  return service;
}
