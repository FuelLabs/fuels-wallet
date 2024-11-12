// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import EventEmitter from 'events';
import type {
  DatabaseChangeType,
  ICreateChange,
  IDeleteChange,
  IUpdateChange,
} from '@fuel-wallet/types';
import type { IDatabaseChange } from 'dexie-observable/api';
import { db } from '~/systems/Core/utils/database';

type Action = 'create' | 'update' | 'delete';

type EventName<Tables extends readonly string[]> =
  `${Tables[number]}:${Action}`;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Listener<T extends EventName<any>, D> = T extends `${string}:create`
  ? (event: ICreateChange<T, D>) => void
  : T extends `${string}:update`
    ? (event: IUpdateChange<T, D>) => void
    : T extends `${string}:delete`
      ? (event: IDeleteChange<T, D>) => void
      : never;

export class DatabaseObservable<
  Tables extends readonly string[],
> extends EventEmitter {
  private tables: Tables;

  constructor(tables: Tables) {
    super();
    this.tables = tables;
    this.onChanges = this.onChanges.bind(this);
    this.setupListeners();
  }

  onChanges(changes: Array<IDatabaseChange>) {
    for (const change of changes) {
      if (!this.tables.includes(change.table)) continue;
      switch (change.type) {
        case 1:
          super.emit(`${change.table}:create` as EventName<Tables>, change);
          break;
        case 2:
          super.emit(`${change.table}:update` as EventName<Tables>, change);
          break;
        case 3:
          super.emit(`${change.table}:delete` as EventName<Tables>, change);
          break;
        default:
          break;
      }
    }
  }

  on<T extends EventName<Tables>, D>(
    eventName: T,
    listener: Listener<T, D>
  ): this {
    return super.on(eventName, listener);
  }

  setupListeners() {
    db.on('changes', this.onChanges);
    db.open();
  }

  destroy() {
    this.removeAllListeners();
  }
}
