/**
 * @flow
 */

import { clear, createStore, del, get, keys, set } from 'idb-keyval';

export class IndexedDB {
  private store;

  constructor(name: string) {
    this.store = createStore('goPlan', `${name}Store`);
  }

  async get<T>(path: string): Promise<T> {
    return get(path, this.store);
  }

  async set<T>(path: string, value: T): Promise<void> {
    return set(path, value, this.store);
  }

  async remove(path: string): Promise<void> {
    return del(path, this.store);
  }

  async getAllKeys(): Promise<IDBValidKey[]> {
    return keys(this.store);
  }

  async clear(): Promise<void> {
    return clear(this.store);
  }
}
