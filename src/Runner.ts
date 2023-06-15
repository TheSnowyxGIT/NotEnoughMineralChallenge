import { StateCache } from './Cache';
import { type RobotShop } from './RobotShop';
import { State } from './State';

export class Runner {
    private readonly shop: RobotShop;
    private initialState: State;

    constructor(robotShop: RobotShop) {
        this.shop = robotShop;
        this.setInitialRobots();
    }

    public setInitialRobots(): void {
        this.initialState = new State(this.shop, 1);
        for (const robotName of this.shop.getRobotNames()) {
            if (this.shop.getInitialRobotName() === robotName) {
                this.initialState.robots.add(robotName, 1);
            } else {
                this.initialState.robots.add(robotName, 0);
            }
        }
    }

    public run(minutes: number): void {
        if (minutes < 1) {
            throw new Error('The number of minutes must be greater than 0');
        }
        State.maxMinutes = minutes;
        const finalState = this._run(null);

        finalState.showLogs();
    }

    private _run(parent: State | null): State {
        let state: State = this.initialState;
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
            for (const robotName of this.shop.getRobotNames()) {
                if (state.canAfford(robotName)) {
                    /* if (!state.isBeneficialToBuy(robotType)) {
                            continue;
                        } */
                    const newState = state.buildCopy(parent);
                    newState.buy(robotName);
                    newState.collect();
                    newState.gettingRobot();
                    subStates.push(this._run(newState));
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
}
