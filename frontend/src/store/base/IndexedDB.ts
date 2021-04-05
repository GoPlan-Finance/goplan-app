/**
 * @flow
 */

import {clear, createStore, del, get, keys, set} from 'idb-keyval';

export class IndexedDB {
    private store

    constructor(name: string) {
        this.store = createStore('goPlan', `${name}Store`);
    }

    get(path: string) {
        return get(path, this.store);
    }

    set(path: string, value: string) {
        return set(path, value, this.store);
    }

    remove(path: string) {
        return del(path, this.store);
    }

    getAllKeys() {
        return keys(this.store);
    }

    clear() {
        return clear(this.store);
    }

}
