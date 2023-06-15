import { ResourceTypeEnum, Shop, type ResourceType } from './Shop';

export class State {
    public robots: Record<ResourceType, number> = {
        ore: 1,
        clay: 0,
        obsidian: 0,
        geode: 0,
    };

    public resources: Record<ResourceType, number> = {
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0,
    };

    public time: number;
    public maxTime: number = 24;

    public logs: string[] = [];
    public parent: State | null = null;

    public robotWaitingToBeBuild: ResourceType | null = null;

    constructor(time: number) {
        this.time = time;
    }

    public collect(): void {
        for (const resourceType of Object.values(ResourceTypeEnum)) {
            const currentRobots = this.robots[resourceType as ResourceType];
            this.resources[resourceType as ResourceType] += currentRobots;
            const currentResource = this.resources[resourceType as ResourceType];
            if (currentResource > 0) {
                this.logs.push(
                    `${currentRobots} ${resourceType}-collecting robots collect ${currentRobots} ${resourceType}; you now have ${currentResource} ${resourceType}.`,
                );
            }
        }
    }

    public isDone(): boolean {
        return this.time > this.maxTime;
    }

    public isLastMinute(): boolean {
        return this.time === this.maxTime;
    }

    public getNextState(): State {
        this.time += 1;
        return this;
    }

    public buildCopy(parent?: State | null): State {
        const newState = new State(this.time);
        newState.robots = Object.assign({}, this.robots);
        newState.resources = Object.assign({}, this.resources);
        newState.maxTime = this.maxTime;
        newState.parent = parent === undefined ? this : parent;
        return newState;
    }

    public isBetterThan(other: State): boolean {
        // todo check number of geode robots
        return this.resources.geode > other.resources.geode;
    }

    public getHash(): string {
        const padSize = 5;
        const hashResources =
            `${this.resources.ore}`.padEnd(padSize) +
            `${this.resources.clay}`.padEnd(padSize) +
            `${this.resources.obsidian}`.padEnd(padSize) +
            `${this.resources.geode}`.padEnd(padSize);
        const hashRobots =
            `${this.robots.ore}`.padEnd(padSize) +
            `${this.robots.clay}`.padEnd(padSize) +
            `${this.robots.obsidian}`.padEnd(padSize) +
            `${this.robots.geode}`.padEnd(padSize);
        return hashResources + hashRobots;
    }

    public prettyPrint(): void {
        console.log(`State at ${this.time} minutes :`);
        console.log(
            `Robots : ${Object.values(ResourceTypeEnum)
                .map((rt) => `${rt}: ${this.robots[rt]}`)
                .join(', ')}`,
        );
        console.log(
            `Resources : ${Object.values(ResourceTypeEnum)
                .map((rt) => `${rt}: ${this.resources[rt]}`)
                .join(', ')}`,
        );
    }

    public buy(robotType: ResourceType): void {
        if (this.canAfford(robotType)) {
            this.robotWaitingToBeBuild = robotType;
            const shop = Shop.getInstance();
            shop.buy(this.robotWaitingToBeBuild, this);
            this.logs.push(`Spend XXX ${robotType} to start building a ${robotType}-collecting robot.`);
        }
    }

    public finishBuilding(): void {
        if (this.robotWaitingToBeBuild !== null) {
            this.robots[this.robotWaitingToBeBuild] += 1;
            this.logs.push(
                `The new ${this.robotWaitingToBeBuild}-collecting robot is ready; you now have ${
                    this.robots[this.robotWaitingToBeBuild]
                } of them.`,
            );
        }
    }

    public canAfford(robotType: ResourceType): boolean {
        const shop = Shop.getInstance();
        return shop.canAfford(robotType, this);
    }

    public isBeneficialToBuy(robotType: ResourceType): boolean {
        if (robotType === ResourceTypeEnum.GEODE) {
            return true;
        }
        const shop = Shop.getInstance();
        const maxPriceOfSpecificResource = shop.getMaxPriceOfSpecificResource(robotType);
        const amount = this.resources[robotType];
        const minutesLeft = this.maxTime - this.time; // we do not take the last minute because we can't buy anything
        const maxAmountThatCanBeUsed = maxPriceOfSpecificResource * minutesLeft;
        if (amount >= maxAmountThatCanBeUsed) {
            return false;
        }
        return true;
    }

    public showLogs(): void {
        const parents: State[] = [];
        let current: State | null = this.parent;
        while (current !== null) {
            parents.unshift(current);
            current = current.parent;
        }

        for (const state of parents) {
            console.log(`== Minute ${state.time} ==`);
            for (const log of state.logs) {
                console.log(log);
            }
            console.log();
        }
    }
}
