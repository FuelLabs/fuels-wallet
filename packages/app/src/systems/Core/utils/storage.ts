import { EventEmitter } from 'node:events';
import { LocalStorage } from '@fuels/local-storage';

const emitter = new EventEmitter();
export const Storage = new LocalStorage('fuel_', emitter);
