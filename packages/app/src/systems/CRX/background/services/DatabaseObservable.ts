// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import EventEmitter from 'events';
import type {
  DatabaseEventArg,
  DatabaseObservableEvent,
} from '@fuel-wallet/types';
import type { IDatabaseChange } from 'dexie-observable/api';
import { db } from '~/systems/Core/utils/database';

export class DatabaseObservable<
  TableNames extends Array<string>,
> extends EventEmitter {
  constructor() {
    super();
    // Bind methods to ensure correct `this` context
    this.onChanges = this.onChanges.bind(this);

    this.setupListeners();
  }

  onChanges(changes: Array<IDatabaseChange>) {
    for (const change of changes) {
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
    }
  }

  setupListeners() {
    db.on('changes', this.onChanges);
    db.open();
  }

  on<T extends DatabaseObservableEvent<TableNames>>(
    eventName: T,
    listener: (event: DatabaseEventArg<T>) => void
  ): this {
    return super.on(eventName, listener);
  }

  destroy() {
    this.removeAllListeners();
    db.close();
  }
}
