import { type RobotShop } from './RobotShop';
import { type HashAble } from './generics/Hashable';
import { ItemRegistry } from './generics/ItemRegistry';
import { type ResourceTypeEnum } from './types';

export class State implements HashAble {
    // * static variables
    public static loggerActivated: boolean = true;

    // * instance variables
    private readonly shop: RobotShop;

    public currentMinute: number;
    public maxMinute: number;

    public goalMineral: ResourceTypeEnum;

    public robots: ItemRegistry<string>;
    public resources: ItemRegistry<ResourceTypeEnum>;
    public robotWaitingToBeBuild: string | null = null;

    public logs: string[] = [];
    public parent: State | null = null;

    constructor(robotShop: RobotShop, minutes: number, maxMinute: number, goalMineral: ResourceTypeEnum) {
        this.shop = robotShop;

        this.currentMinute = minutes;
        this.maxMinute = maxMinute;

        this.goalMineral = goalMineral;

        this.robots = new ItemRegistry<string>();
        this.resources = new ItemRegistry<ResourceTypeEnum>();
    }

    public buildCopy(parent?: State | null): State {
        const newState = new State(this.shop, this.currentMinute, this.maxMinute, this.goalMineral);
        newState.robots = this.robots.deepCopy();
        newState.resources = this.resources.deepCopy();
        newState.parent = parent === undefined ? this : parent;
        return newState;
    }

    public isDone(): boolean {
        return this.currentMinute > this.maxMinute;
    }

    public isLastMinute(): boolean {
        return this.currentMinute === this.maxMinute;
    }

    public setRobots(robots: ItemRegistry<string>): void {
        this.robots = robots;
    }

    public collectMinerals(): void {
        for (const robotName of this.robots.itemsNames) {
            const numberOfRobots = this.robots.getAmount(robotName);
            const loot = this.shop.getRobot(robotName).getLoot();
            const multiplyLoot = ItemRegistry.multiply<ResourceTypeEnum>(loot, numberOfRobots);
            this.resources.addRegistry(multiplyLoot);

            if (State.loggerActivated && numberOfRobots > 0) {
                const lootResourceNames = loot.nonEmptyItemsNames;
                this.logs.push(
                    `${numberOfRobots} ${robotName} collects ${multiplyLoot.toString()}, you now have ${this.resources.toString(
                        lootResourceNames,
                    )}.`,
                );
            }
        }
    }

    public buyRobot(robotName: string): void {
        if (this.shop.canAfford(robotName, this.resources)) {
            this.robotWaitingToBeBuild = robotName;
            this.shop.deductPrice(this.robotWaitingToBeBuild, this.resources);
            if (State.loggerActivated) {
                const priceString = this.shop.priceToString(robotName);
                this.logs.push(`Spend ${priceString} to start building a ${robotName}.`);
            }
        }
    }

    public gettingRobot(): void {
        if (this.robotWaitingToBeBuild !== null) {
            this.robots.addAmount(this.robotWaitingToBeBuild, 1);
            if (State.loggerActivated) {
                this.logs.push(
                    `The new ${this.robotWaitingToBeBuild} is ready; you now have ${this.robots.getAmount(
                        this.robotWaitingToBeBuild,
                    )} of them.`,
                );
            }
        }
    }

    public canAffordRobot(robotName: string): boolean {
        return this.shop.canAfford(robotName, this.resources);
    }

    public incrementMinutes(): State {
        this.currentMinute += 1;
        return this;
    }

    public isBetterThan(other: State): boolean {
        return this.resources.getAmount(this.goalMineral) > other.resources.getAmount(this.goalMineral);
    }

    public getHash(): string {
        const padSize = 5;
        const hashResources =
            `${this.resources.getAmount('ore')}`.padEnd(padSize) +
            `${this.resources.getAmount('clay')}`.padEnd(padSize) +
            `${this.resources.getAmount('obsidian')}`.padEnd(padSize) +
            `${this.resources.getAmount('geode')}`.padEnd(padSize);
        let hashRobots: string = '';
        for (const robotName of this.robots.itemsNames) {
            hashRobots += `${this.robots.getAmount(robotName)}`.padEnd(padSize);
        }
        return hashResources + hashRobots;
    }

    public isBeneficialToBuyRobot(robotName: string): boolean {
        const robot = this.shop.getRobot(robotName);
        const loot = robot.getLoot();
        const resourcesKeys = loot.itemsNames;

        if (resourcesKeys.includes(this.goalMineral)) {
            return true;
        }

        for (const resource of resourcesKeys) {
            const maxPriceOfSpecificResource = this.shop.getMaxPriceOfSpecificResource(resource);
            const amount = this.resources.getAmount(resource);
            const minutesLeft = this.maxMinute - this.currentMinute; // we do not take the last minute because we can't buy anything
            const maxAmountThatCanBeUsed = maxPriceOfSpecificResource * minutesLeft;
            if (amount < maxAmountThatCanBeUsed) {
                return true;
            }
        }
        return false;
    }

    public showLogs(): void {
        if (!State.loggerActivated) {
            console.log(`No logs to show.`);
            return;
        }
        const parents: State[] = [];
        let current: State | null = this.parent;
        while (current !== null) {
            parents.unshift(current);
            current = current.parent;
        }

        for (const state of parents) {
            console.log(`== Minute ${state.currentMinute} ==`);
            for (const log of state.logs) {
                console.log(log);
            }
            console.log();
        }
    }
}
