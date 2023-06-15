import { StateCache } from './Cache';
import { ResourceTypeEnum } from './Shop';
import { State } from './State';

export class Runner {
    public run(minutes: number): void {
        if (minutes < 1) {
            throw new Error('The number of minutes must be greater than 0');
        }
        const finalState = this._run(null);

        finalState.showLogs();
    }

    private _run(parent: State | null): State {
        let state: State = new State(1);
        if (parent !== null) {
            state = parent.buildCopy().getNextState();
        }

        if (state.isDone()) {
            return state;
        }

        const cache = StateCache.getInstance();
        if (cache.isInCache(state)) {
            return state;
        } else {
            cache.addToCache(state);
        }

        // * we will explore all the recursive states depending of the robot which have been bought
        const subStates: State[] = [];
        if (!state.isLastMinute()) {
            for (const robotType of Object.values(ResourceTypeEnum)) {
                if (state.canAfford(robotType)) {
                    const newState = state.buildCopy(parent);
                    newState.buy(robotType);
                    newState.collect();
                    newState.finishBuilding();
                    subStates.push(this._run2(newState));
                }
            }
        }

        // * we explore the case were no robot is bought
        const defaultState = state.buildCopy(parent);
        defaultState.collect();
        const ds = this._run(defaultState);

        // * return the recursive state that have mine the most geodes
        return subStates.reduce((prev, curr) => {
            return prev.isBetterThan(curr) ? prev : curr;
        }, ds);
    }

    private _run2(state: State): State {
        // ! For now we consider that we only can buy one robot per minute
        if (state.isDone()) {
            return state;
        }

        const cache = StateCache.getInstance();
        if (cache.isInCache(state)) {
            return state;
        } else {
            cache.addToCache(state);
        }

        // * we will explore all the recursive states depending of the robot which have been bought
        const subStates: State[] = [];
        if (!state.isLastMinute()) {
            for (const robotType of Object.values(ResourceTypeEnum)) {
                if (state.canAfford(robotType)) {
                    const newState = state.buildCopy();
                    newState.buy(robotType);
                    newState.collect();
                    newState.finishBuilding();
                    subStates.push(this._run(newState.getNextState()));
                }
            }
        }

        // * we explore the case were no robot is bought
        const defaultState = state.buildCopy();
        defaultState.collect();
        const ds = this._run(defaultState.getNextState());

        // * return the recursive state that have mine the most geodes
        return subStates.reduce((prev, curr) => {
            return prev.isBetterThan(curr) ? prev : curr;
        }, ds);
    }
}
