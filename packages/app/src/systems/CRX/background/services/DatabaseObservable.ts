import type {
  DatabaseEventArg,
  DatabaseObservableEvent,
} from '@fuel-wallet/types';
import EventEmitter from 'events';
import { db } from '~/systems/Core/utils/database';

export class DatabaseObservable<
  TableNames extends Array<string>,
> extends EventEmitter {
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
          case 2:
            super.emit(`${change.table}:update`, change);
            break;
          case 3:
            super.emit(`${change.table}:delete`, change);
            break;
          default:
            break;
        }
      });
    });
    db.open();
  }

  on<T extends DatabaseObservableEvent<TableNames>>(
    eventName: T,
    listener: (event: DatabaseEventArg<T>) => void
  ): this {
    return super.on(eventName, listener);
  }
}
