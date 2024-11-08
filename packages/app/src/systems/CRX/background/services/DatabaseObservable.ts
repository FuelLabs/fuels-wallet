// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { EventEmitter } from 'events';
import {
  DatabaseChangeType,
  type ICreateChange,
  type IDeleteChange,
  type IUpdateChange,
} from '@fuel-wallet/types';
import type { Dexie, IndexableType, Transaction } from 'dexie';
import { db } from '~/systems/Core/utils/database';

export class DatabaseObservable<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  TableNames extends Array<string> = any[],
> extends EventEmitter {
  constructor() {
    super();
    // Bind methods to ensure correct `this` context
    this.onCreating = this.onCreating.bind(this);
    this.onUpdating = this.onUpdating.bind(this);
    this.onDeleting = this.onDeleting.bind(this);

    this.setupListeners();
  }

  setupListeners() {
    for (const table of Object.keys(db._allTables)) {
      db.table(table).hook(
        'creating',
        this.onCreating(table as TableNames[number])
      );
      db.table(table)
        .hook('updating')
        .subscribe(this.onUpdating(table as TableNames[number]));
      db.table(table).hook('deleting', this.onDeleting(table));
    }
  }

  onCreating(table: TableNames[number]) {
    return (primKey: unknown, obj: unknown, _transaction: Transaction) => {
      const change: ICreateChange = {
        type: DatabaseChangeType.Create,
        table,
        key: primKey,
        obj,
      };
      this.emit(`${table}:create`, change);
    };
  }

  onUpdating(table: TableNames[number]) {
    return (
      mods: unknown,
      primKey: TableNames[number],
      obj: unknown,
      _transaction: Transaction
    ) => {
      const change: IUpdateChange<TableNames[number]> = {
        type: DatabaseChangeType.Update,
        table,
        key: primKey as TableNames[number],
        mods,
        obj,
      };
      this.emit(`${table}:update`, change);
    };
  }

  onDeleting(table: TableNames[number]) {
    return (
      primKey: IndexableType,
      obj: unknown,
      _transaction: Transaction
    ) => {
      const change: IDeleteChange<TableNames[number]> = {
        type: DatabaseChangeType.Delete,
        table,
        key: primKey as TableNames[number],
        oldObj: obj,
      };
      this.emit(`${table}:delete`, change);
    };
  }

  destroy() {
    this.removeAllListeners();
  }
}
