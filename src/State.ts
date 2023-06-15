import { Inventory } from './Inventory';
import { type RobotShop } from './RobotShop';
import { type ResourceTypeEnum } from './types';

export class State {
    public static maxMinutes: number = 24;

    public robots: Inventory<string>;
    public resources: Inventory<ResourceTypeEnum>;

    public currentMinute: number;

    public logs: string[] = [];
    public parent: State | null = null;

    public robotWaitingToBeBuild: string | null = null;

    private readonly shop: RobotShop;

    constructor(robotShop: RobotShop, minutes: number) {
        this.shop = robotShop;
        this.currentMinute = minutes;
        this.robots = new Inventory<string>();
        this.resources = new Inventory<ResourceTypeEnum>();
    }

    public initResources(): void {
        this.resources.add('ore', 0);
        this.resources.add('clay', 0);
        this.resources.add('obsidian', 0);
        this.resources.add('geode', 0);
    }

    public setRobots(robots: Inventory<string>): void {
        this.robots = robots;
    }

    public collect(): void {
        for (const robotName of this.robots.getKeyList()) {
            const numberOfRobots = this.robots.get(robotName);
            const loot = this.shop.getRobot(robotName).getLoot();
            const multiplyLoot = Inventory.multiply<ResourceTypeEnum>(loot, numberOfRobots);
            this.resources.addAll(multiplyLoot);
            this.logs.push(`${numberOfRobots} ${robotName} collects ${loot.toString()}, you now have XXX`);
        }
    }

    public isDone(): boolean {
        return this.currentMinute > State.maxMinutes;
    }

    public isLastMinute(): boolean {
        return this.currentMinute === State.maxMinutes;
    }

    public getNextState(): State {
        this.currentMinute += 1;
        return this;
    }

    public buildCopy(parent?: State | null): State {
        const newState = new State(this.shop, this.currentMinute);
        newState.robots = this.robots.copy();
        newState.resources = this.resources.copy();
        newState.parent = parent === undefined ? this : parent;
        return newState;
    }

    public isBetterThan(other: State): boolean {
        // todo check number of geode robots
        return this.resources.get('geode') > other.resources.get('geode');
    }

    public getHash(): string {
        const padSize = 5;
        const hashResources =
            `${this.resources.get('ore')}`.padEnd(padSize) +
            `${this.resources.get('clay')}`.padEnd(padSize) +
            `${this.resources.get('obsidian')}`.padEnd(padSize) +
            `${this.resources.get('geode')}`.padEnd(padSize);
        let hashRobots: string = '';
        for (const robotName of this.robots.getKeyList()) {
            hashRobots += `${this.robots.get(robotName)}`.padEnd(padSize);
        }
        return hashResources + hashRobots;
    }

    public buy(robotName: string): void {
        if (this.shop.canAfford(robotName, this.resources)) {
            this.robotWaitingToBeBuild = robotName;
            this.shop.deductPrice(this.robotWaitingToBeBuild, this.resources);
            const priceString = this.shop.priceToString(robotName);
            this.logs.push(`Spend ${priceString} to start building a ${robotName}.`);
        }
    }

    public gettingRobot(): void {
        if (this.robotWaitingToBeBuild !== null) {
            this.robots.add(this.robotWaitingToBeBuild, 1);
            this.logs.push(
                `The new ${this.robotWaitingToBeBuild} is ready; you now have ${this.robots.get(
                    this.robotWaitingToBeBuild,
                )} of them.`,
            );
        }
    }

    public canAfford(robotName: string): boolean {
        return this.shop.canAfford(robotName, this.resources);
    }

    /* public isBeneficialToBuy(robotName: string): boolean {
        if (robotName === 'XXXXX') {
            // TODO
            return true;
        }
        const maxPriceOfSpecificResource = this.shop.getMaxPriceOfSpecificResource(robotType);
        const amount = this.resources[robotType];
        const minutesLeft = this.maxTime - this.time; // we do not take the last minute because we can't buy anything
        const maxAmountThatCanBeUsed = maxPriceOfSpecificResource * minutesLeft;
        if (amount >= maxAmountThatCanBeUsed) {
            return false;
        }
        return true;
    } */

    public showLogs(): void {
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
