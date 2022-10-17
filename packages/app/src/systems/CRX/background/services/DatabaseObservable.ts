import type { IDatabaseChange } from 'dexie-observable/api';
import EventEmitter from 'events';

import { db } from '~/systems/Core/utils/database';

type DatabaseObservableEvent<
  T extends Array<string>,
  O extends Array<string>
> = `${T[number]}:${O[number]}`;

export class DatabaseObservable extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  setupListeners() {
    db.on('changes', (changes) => {
      changes.forEach((change) => {
        switch (change.type) {
          case 1:
            super.emit(`${change.table}:create`, change);
            break;
          case 3:
            super.emit(`${change.table}:delete`, change);
            break;
          default:
            break;
        }
      });
    });
  }

  on<T = IDatabaseChange>(
    eventName: DatabaseObservableEvent<
      ['applications'],
      ['delete', 'create', 'update']
    >,
    listener: (event: T) => void
  ): this {
    return super.on(eventName, listener);
  }
}
