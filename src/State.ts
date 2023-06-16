import { type RobotShop } from './RobotShop';
import { type HashAble } from './generics/Hashable';
import { ItemRegistry } from './generics/ItemRegistry';
import { type ResourceTypeEnum } from './types';

export class State implements HashAble {
    // * instance variables
    private readonly shop: RobotShop;

    public currentMinute: number;
    public maxMinute: number;

    public goalMineral: ResourceTypeEnum;

    public robots: ItemRegistry<string>;
    public resources: ItemRegistry<ResourceTypeEnum>;
    public robotWaitingToBeBuild: string | null = null;

    public logs: string[] = [];
    public loggerActivated: boolean;
    public parent: State | null = null;

    constructor(
        robotShop: RobotShop,
        minutes: number,
        maxMinute: number,
        goalMineral: ResourceTypeEnum,
        loggerActivated = false,
    ) {
        this.shop = robotShop;

        this.currentMinute = minutes;
        this.maxMinute = maxMinute;

        this.goalMineral = goalMineral;

        this.robots = new ItemRegistry<string>();
        this.resources = new ItemRegistry<ResourceTypeEnum>();

        this.loggerActivated = loggerActivated;
    }

    public buildCopy(parent?: State | null): State {
        const newState = new State(
            this.shop,
            this.currentMinute,
            this.maxMinute,
            this.goalMineral,
            this.loggerActivated,
        );
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

            if (this.loggerActivated && numberOfRobots > 0) {
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
            if (this.loggerActivated) {
                const priceString = this.shop.priceToString(robotName);
                this.logs.push(`Spend ${priceString} to start building a ${robotName}.`);
            }
        }
    }

    public gettingRobot(): void {
        if (this.robotWaitingToBeBuild !== null) {
            this.robots.addAmount(this.robotWaitingToBeBuild, 1);
            if (this.loggerActivated) {
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
            `${this.resources.getAmount('geode')}`.padEnd(padSize) +
            `${this.resources.getAmount('diamond')}`.padEnd(padSize);
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

    public getEstimatedResourceProduction(resourceType: ResourceTypeEnum): number {
        const robotsThatProduceSpecificResource = this.shop.getRobotsThatProducesSpecificResource(resourceType);
        let estimatedProduction = 0;
        for (const robotName of robotsThatProduceSpecificResource) {
            const robot = this.shop.getRobot(robotName);
            const loot = robot.getLoot();
            const amountOfRobot = this.robots.getAmount(robotName);
            estimatedProduction += loot.getAmount(resourceType) * amountOfRobot;
        }
        return estimatedProduction;
    }

    /*
    public doStateHaveHopeToWin(robotName: string): boolean {
        const minutesLeft = this.maxMinute - this.currentMinute + 1;
        const currentGoalMineralCount = this.resources.getAmount(this.goalMineral);
        const currentGoalMineralProduction = this.getEstimatedResourceProduction(this.goalMineral);
        const maxGoalMinealCollectableByOneRobot = this.shop.getMaxLootOfSpecificResource(this.goalMineral);
    } */

    public showLogs(): void {
        if (!this.loggerActivated) {
            console.log(`No logs to show.`);
            return;
        }
        const parents: State[] = [];
        let current: State | null = this.parent;
        parents.unshift(this);
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
