import { type State } from './State';

export class StateCache {
    private static instance: StateCache;
    public static getInstance(): StateCache {
        if (StateCache.instance === undefined) {
            return new StateCache();
        }
        return StateCache.instance;
    }

    private cache: Record<string, boolean> = {};

    public isInCache(state: State): boolean {
        const hash = state.getHash();
        return this.cache[hash] || false;
    }

    public addToCache(state: State): void {
        const hash = state.getHash();
        this.cache[hash] = true;
    }

    constructor() {
        StateCache.instance = this;
    }
}
