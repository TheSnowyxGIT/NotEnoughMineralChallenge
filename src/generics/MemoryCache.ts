/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { type HashAble } from './Hashable';

export class MemoryCache<T> {
    private cache: Record<string, T> = {};

    public isIn(key: HashAble): boolean {
        const hash = key.getHash();
        return this.cache[hash] !== undefined;
    }

    public set(key: HashAble, value: T): void {
        const hash = key.getHash();
        this.cache[hash] = value;
    }

    public get(key: HashAble): T | null {
        if (!this.isIn(key)) {
            return null;
        }
        const hash = key.getHash();
        return this.cache[hash];
    }

    public remove(key: HashAble): void {
        const hash = key.getHash();
        if (this.isIn(key)) {
            delete this.cache[hash];
        }
    }
}
