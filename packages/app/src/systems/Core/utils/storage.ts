 
import { LocalStorage } from '@fuels/local-storage';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();
export const Storage = new LocalStorage('fuel_', emitter);
