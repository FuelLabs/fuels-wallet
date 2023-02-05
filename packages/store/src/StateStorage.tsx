/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MachinesObj, StateItem, ValueOf } from './utils/types';

export type StateObj<T extends MachinesObj> = {
  prevState?: StateItem<ValueOf<T>> | null;
  currState?: StateItem<ValueOf<T>> | null;
};

/**
 * This is the format of smoe state as object
 * @example
 * {
 *   "<machine.id>": {
 *     "prevState": "state1",
 *     "currState": "state2"
 *   }
 * }
 */
export type StatesAsObj<T extends MachinesObj> = Record<keyof T, StateObj<T>>;
export type StatesAsMap<T extends MachinesObj> = Map<keyof T, StateObj<T>>;

/**
 * This is the object that will be store all states in localStorage
 * @example
 * {
 *   "<store.id>": {
 *      "<machine.id>": {
 *        "prevState": "state1",
 *        "currState": "state2"
 *      }
 *   }
 * }
 */
export type LocalStorageObj<T extends MachinesObj> = Record<
  string,
  StatesAsObj<T>
>;

export type InMemoryMap = Map<string, StatesAsMap<any>>;

/**
 * This map will be used to store the states in memory instead of localStorage.
 * This will avoid expose state data if unecessary.
 */
const LocalStateMap: InMemoryMap = new Map<string, StatesAsMap<any>>();
const STORAGE_PREFIX = '__xstore_';

export class StateStorage<T extends MachinesObj> {
  readonly states = new Map<keyof T, StateObj<T>>();
  readonly id = `${STORAGE_PREFIX}${this.storeId}`;
  #blacklist: (keyof T)[] = [];

  /**
   * Create a new instance of the StateStorage
   * @param storeId - The id of the store
   * @returns StateStorage<T>
   */
  constructor(readonly storeId: string, blacklist?: (keyof T)[]) {
    this.states = getInitFromCache(this.id);
    this.#blacklist = blacklist || [];
  }

  /**
   * Set the state of a specific key and update the local storage with the current map
   * @param key - The key of the state
   * @param newState - The value of the state to update
   * @returns void
   */
  setStateOf(key: keyof T, newState: StateItem<ValueOf<T>> | null) {
    if (this.#blacklist.includes(key)) return;
    const currState = this.states.get(key)?.currState;
    const prevState = currState || ({} as StateItem<ValueOf<T>>);
    this.states.set(key, { prevState, currState: newState });
    updateCache(this.id, this.states);
  }

  /**
   * Get the previous and current state of a specific key
   * @param key - The key of the state
   * @returns StateObj<T> | undefined
   */
  getStateOf(key: keyof T, type: 'currState' | 'prevState' = 'currState') {
    if (this.#blacklist.includes(key)) return undefined;
    const states = this.states.get(key);
    return states?.[type];
  }

  //----------------------------------------------------------------------------
  // Private method
  //----------------------------------------------------------------------------
}

/**
 * Get the initial state from the cache
 * @param id - The id used to store the states in memory or localstorage
 * @returns Map<keyof T, StateObj<T>>
 */
function getInitFromCache<T extends MachinesObj>(id: string): StatesAsMap<T> {
  if (LocalStateMap.has(id)) return LocalStateMap.get(id) as StatesAsMap<T>;
  const localStorageObj = getFromLocalStorage<LocalStorageObj<T>>(id) || {};
  const entries = Object.entries(localStorageObj);
  return new Map<keyof T, StateObj<T>>(entries);
}

/**
 * Update the cache in memory and in the local storage
 * @param map - The states stored in the class
 * @returns void
 */
function updateCache<T extends MachinesObj>(id: string, map: StatesAsMap<T>) {
  const statesAsObj = Object.fromEntries(map);
  LocalStateMap.set(id, map);
  setLocalStorage(id, statesAsObj);
}

/**
 * Get the data from the local storage
 * @param key - The key of the data
 * @returns T | null
 */
function getFromLocalStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Set the data in the local storage
 * @param key - The key of the data
 * @param data - The data to store
 * @returns void
 * @example
 */
function setLocalStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}
