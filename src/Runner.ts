import { type RobotShop } from './RobotShop';
import { State } from './State';
import { MemoryCache } from './generics/MemoryCache';
import { Queue } from './generics/Queue';
import { type ResourceTypeEnum } from './types';

export class Runner {
    // * the shop is a class representing a blueprint
    private readonly shop: RobotShop;

    private firstState: State;

    private readonly goalMineral: ResourceTypeEnum;

    private cache: MemoryCache<boolean>;

    constructor(robotShop: RobotShop, goalMineral: ResourceTypeEnum) {
        this.shop = robotShop;
        this.goalMineral = goalMineral;
    }

    public initFirstState(maxMinutes: number): void {
        this.firstState = new State(this.shop, 1, maxMinutes, this.goalMineral);

        for (const robotName of this.shop.getRobotNames()) {
            if (this.shop.getStartRobotName() === robotName) {
                this.firstState.robots.addAmount(robotName, 1);
            } else {
                this.firstState.robots.addAmount(robotName, 0);
            }
        }
    }

    public run(minutes: number): number {
        if (minutes < 1) {
            throw new Error('The number of minutes must be greater than 0');
        }
        this.initFirstState(minutes);

        this.cache = new MemoryCache();

        const finalState = this._run(null);

        finalState.showLogs();

        return this.calculateQualityLevel(finalState);
    }

    private calculateQualityLevel(state: State): number {
        const qualityLevel = state.resources.getAmount(this.goalMineral);
        return qualityLevel * this.shop.blueprintId;
    }

    private _run(parent: State | null): State {
        let state: State = this.firstState;
        if (parent !== null) {
            state = parent.buildCopy().incrementMinutes();
        }

        if (state.isDone()) {
            return state;
        }

        if (this.cache.isIn(state)) {
            return state;
        } else {
            this.cache.set(state, true);
        }

        // * we will explore all the recursive states depending of the robot which have been bought
        const subStates: State[] = [];
        if (!state.isLastMinute()) {
            for (const robotName of this.shop.getRobotNames()) {
                if (state.canAffordRobot(robotName)) {
                    if (!state.isBeneficialToBuyRobot(robotName)) {
                        continue;
                    }
                    const newState = state.buildCopy(parent);
                    newState.buyRobot(robotName);
                    newState.collectMinerals();
                    newState.gettingRobot();
                    subStates.push(this._run(newState));
                }
            }
        }

        // * we explore the case were no robot is bought
        const defaultState = state.buildCopy(parent);
        defaultState.collectMinerals();
        const ds = this._run(defaultState);

        // * return the recursive state that have mine the most geodes
        return subStates.reduce((prev, curr) => {
            return prev.isBetterThan(curr) ? prev : curr;
        }, ds);
    }

    public run_bfs(minutes: number): number {
        if (minutes < 1) {
            throw new Error('The number of minutes must be greater than 0');
        }
        this.initFirstState(minutes);
        this.cache = new MemoryCache();

        const lastMinuteStates: State[] = [];

        const queue = new Queue<State>();
        queue.enqueue(this.firstState);
        let isSentinel = true;

        while (!queue.is_empty()) {
            let state = queue.dequeue();
            let parent: State | null = null;

            if (isSentinel) {
                isSentinel = false;
            } else {
                parent = state;
                state = state.buildCopy().incrementMinutes();
            }

            if (this.cache.isIn(state)) {
                continue;
            } else {
                this.cache.set(state, true);
            }

            const isLastMinute = state.isLastMinute();

            // * we will explore all the recursive states depending of the robot which have been bought
            if (!isLastMinute) {
                for (const robotName of this.shop.getRobotNames()) {
                    if (state.canAffordRobot(robotName)) {
                        if (!state.isBeneficialToBuyRobot(robotName)) {
                            continue;
                        }
                        const newState = state.buildCopy(parent);
                        newState.buyRobot(robotName);
                        newState.collectMinerals();
                        newState.gettingRobot();
                        queue.enqueue(newState);
                    }
                }
            }

            // * we explore the case were no robot is bought
            const defaultState = state.buildCopy(parent);
            defaultState.collectMinerals();
            if (!isLastMinute) {
                queue.enqueue(defaultState);
            } else {
                lastMinuteStates.push(defaultState);
            }
        }

        if (lastMinuteStates.length === 0) {
            throw new Error('No last minute state found');
        }

        const finalState = lastMinuteStates.reduce((prev, curr) => {
            return prev.isBetterThan(curr) ? prev : curr;
        }, lastMinuteStates[0]);

        finalState.showLogs();

        return this.calculateQualityLevel(finalState);
    }

    public run_dfs(minutes: number): number {
        if (minutes < 1) {
            throw new Error('The number of minutes must be greater than 0');
        }
        this.initFirstState(minutes);
        this.cache = new MemoryCache();

        const lastMinuteStates: State[] = [];
        const stack: State[] = [];
        stack.push(this.firstState);
        let isSentinel = true;

        while (stack.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            let state = stack.pop()!;
            let parent: State | null = null;

            if (!isSentinel) {
                parent = state;
                state = state.buildCopy().incrementMinutes();
            } else {
                isSentinel = false;
            }

            if (this.cache.isIn(state)) {
                continue;
            } else {
                this.cache.set(state, true);
            }

            const isLastMinute = state.isLastMinute();
            if (!isLastMinute) {
                for (const robotName of this.shop.getRobotNames()) {
                    if (state.canAffordRobot(robotName) && state.isBeneficialToBuyRobot(robotName)) {
                        const newState = state.buildCopy(parent);
                        newState.buyRobot(robotName);
                        newState.collectMinerals();
                        newState.gettingRobot();
                        stack.push(newState);
                    }
                }
            }

            const defaultState = state.buildCopy(parent);
            defaultState.collectMinerals();
            if (!isLastMinute) {
                stack.push(defaultState);
            } else {
                lastMinuteStates.push(defaultState);
            }
        }

        if (lastMinuteStates.length === 0) {
            throw new Error('No last minute state found');
        }

        const finalState = lastMinuteStates.reduce((prev, curr) => {
            return prev.isBetterThan(curr) ? prev : curr;
        });

        finalState.showLogs();

        return this.calculateQualityLevel(finalState);
    }
}
